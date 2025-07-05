import os
import logging
import tempfile
import json
import base64
import requests
import cv2
import numpy as np
from datetime import datetime
from typing import Optional

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, ContextTypes, filters
from deepface import DeepFace

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Configuration
BOT_TOKEN = os.getenv("TOKEN")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
QWEN_MODEL = "qwen2.5vl:3b"

# User states
USER_STATES = {}
USER_DATA = {}

def encode_image_to_base64(image_path: str) -> str:
    """Convert image to base64 string for Ollama"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def query_qwen_vision(image_path: str, prompt: str) -> str:
    """Query Qwen2.5 VLM via Ollama"""
    try:
        image_base64 = encode_image_to_base64(image_path)
        
        payload = {
            "model": QWEN_MODEL,
            "prompt": prompt,
            "images": [image_base64],
            "stream": False
        }
        
        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "")
        else:
            raise Exception(f"Ollama request failed: {response.status_code}")
            
    except Exception as e:
        logger.error(f"Error querying Qwen: {str(e)}")
        raise Exception(f"AI service error: {str(e)}")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /start is issued."""
    user = update.effective_user
    
    keyboard = [
        [InlineKeyboardButton("🔍 Extract Text from ID", callback_data='extract_text')],
        [InlineKeyboardButton("👤 Face Recognition", callback_data='face_recognition')],
        [InlineKeyboardButton("🏛️ Full KYC Verification", callback_data='full_kyc')],
        [InlineKeyboardButton("ℹ️ Help", callback_data='help')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    welcome_text = f"""
🤖 <b>Welcome to ZKYC Bot, {user.first_name}!</b>

I'm your AI-powered KYC verification assistant. I can help you with:

🔍 <b>Text Extraction</b> - Extract text from ID documents using AI
👤 <b>Face Recognition</b> - Compare faces between two photos  
🏛️ <b>KYC Verification</b> - Complete identity verification process

🧠 <b>Powered by Qwen 2.5 Vision Model</b> for intelligent document understanding

Choose an option below to get started! 👇
    """
    
    await update.message.reply_text(welcome_text, reply_markup=reply_markup, parse_mode='HTML')

async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle button callbacks."""
    query = update.callback_query
    user_id = query.from_user.id
    
    await query.answer()
    
    if query.data == 'extract_text':
        USER_STATES[user_id] = 'waiting_for_document'
        await query.edit_message_text(
            "📸 <b>Text Extraction Mode</b>\n\n"
            "Please send me a photo of your ID document or any document with text.\n"
            "I'll use AI to extract and analyze the text for you!\n\n"
            "📤 Just upload the image now...",
            parse_mode='HTML'
        )
    
    elif query.data == 'face_recognition':
        USER_STATES[user_id] = 'waiting_for_first_face'
        await query.edit_message_text(
            "👤 <b>Face Recognition Mode</b>\n\n"
            "I'll help you compare faces between two photos.\n\n"
            "📸 <b>Step 1:</b> Send me the first photo (e.g., ID card photo)",
            parse_mode='HTML'
        )
    
    elif query.data == 'full_kyc':
        USER_STATES[user_id] = 'waiting_for_id_card'
        await query.edit_message_text(
            "🏛️ <b>Full KYC Verification</b>\n\n"
            "I'll perform complete identity verification by:\n"
            "• Extracting information from your ID card\n"
            "• Comparing your face with the ID photo\n\n"
            "📸 <b>Step 1:</b> Send me your ID card photo",
            parse_mode='HTML'
        )
    
    elif query.data == 'help':
        help_text = """
ℹ️ <b>ZKYC Bot Help</b>

<b>Available Features:</b>

🔍 <b>Text Extraction</b>
- Upload any document image
- AI extracts and analyzes text
- Perfect for ID cards, passports, certificates

👤 <b>Face Recognition</b> 
- Compare two face photos
- Advanced biometric verification
- Returns similarity score

🏛️ <b>KYC Verification</b>
- Complete identity verification
- ID text extraction + face matching
- Professional verification report

<b>Commands:</b>
/start - Show main menu
/help - Show this help message
/cancel - Cancel current operation

<b>Tips:</b>
• Use clear, well-lit photos
• Ensure text is readable
• Photos should be in good quality

<b>Powered by:</b> Qwen 2.5 Vision Model + DeepFace
        """
        
        keyboard = [[InlineKeyboardButton("🔙 Back to Menu", callback_data='back_to_menu')]]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(help_text, reply_markup=reply_markup, parse_mode='HTML')
    
    elif query.data == 'back_to_menu':
        await start_from_callback(query)

async def start_from_callback(query) -> None:
    """Recreate start menu from callback."""
    keyboard = [
        [InlineKeyboardButton("🔍 Extract Text from ID", callback_data='extract_text')],
        [InlineKeyboardButton("👤 Face Recognition", callback_data='face_recognition')],
        [InlineKeyboardButton("🏛️ Full KYC Verification", callback_data='full_kyc')],
        [InlineKeyboardButton("ℹ️ Help", callback_data='help')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    welcome_text = """
🤖 <b>ZKYC Bot - AI-Powered Identity Verification</b>

Choose what you'd like to do:
    """
    
    await query.edit_message_text(welcome_text, reply_markup=reply_markup, parse_mode='HTML')

async def handle_photo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle photo uploads based on user state."""
    user_id = update.effective_user.id
    state = USER_STATES.get(user_id, None)
    
    if not state:
        await update.message.reply_text(
            "❓ I'm not sure what to do with this image.\n"
            "Please use /start to choose an action first!"
        )
        return
    
    # Download the photo
    photo = update.message.photo[-1]  # Get highest resolution
    photo_file = await photo.get_file()
    
    # Create temporary file
    temp_dir = tempfile.mkdtemp()
    photo_path = os.path.join(temp_dir, f"photo_{user_id}_{datetime.now().timestamp()}.jpg")
    await photo_file.download_to_drive(photo_path)
    
    try:
        if state == 'waiting_for_document':
            await process_document_extraction(update, photo_path)
            
        elif state == 'waiting_for_first_face':
            USER_DATA[user_id] = {'first_photo': photo_path}
            USER_STATES[user_id] = 'waiting_for_second_face'
            await update.message.reply_text(
                "✅ <b>First photo received!</b>\n\n"
                "📸 <b>Step 2:</b> Now send me the second photo to compare",
                parse_mode='HTML'
            )
            return  # Don't clean up yet, we need the file
            
        elif state == 'waiting_for_second_face':
            first_photo = USER_DATA[user_id]['first_photo']
            await process_face_comparison(update, first_photo, photo_path)
            
        elif state == 'waiting_for_id_card':
            USER_DATA[user_id] = {'id_card': photo_path}
            USER_STATES[user_id] = 'waiting_for_selfie'
            await update.message.reply_text(
                "✅ <b>ID card received!</b>\n\n"
                "📸 <b>Step 2:</b> Now send me a selfie photo for face verification",
                parse_mode='HTML'
            )
            return  # Don't clean up yet, we need the file
            
        elif state == 'waiting_for_selfie':
            id_card_path = USER_DATA[user_id]['id_card']
            # Store selfie path for cleanup after verification
            USER_DATA[user_id]['selfie_path'] = photo_path
            USER_DATA[user_id]['selfie_temp_dir'] = temp_dir
            await process_kyc_verification(update, id_card_path, photo_path)
            return  # Don't clean up yet, process_kyc_verification will handle it
    
    except Exception as e:
        logger.error(f"Error processing photo: {str(e)}")
        await update.message.reply_text(
            f"❌ **Error processing image:**\n{str(e)}\n\n"
            "Please try again with a different image or use /start to restart."
        )
    
    finally:
        # Clean up (only for states that don't need deferred cleanup)
        if state not in ['waiting_for_first_face', 'waiting_for_id_card', 'waiting_for_selfie']:
            if os.path.exists(photo_path):
                os.remove(photo_path)
            if os.path.exists(temp_dir):
                os.rmdir(temp_dir)
        
        # Reset user state if needed
        if state in ['waiting_for_document', 'waiting_for_second_face']:
            USER_STATES.pop(user_id, None)
            USER_DATA.pop(user_id, None)

async def process_document_extraction(update: Update, image_path: str) -> None:
    """Process document text extraction."""
    await update.message.reply_text("🤖 <b>Analyzing document with AI...</b>\nThis may take a few seconds...", parse_mode='HTML')
    
    prompt = """Extract all visible text from this document and organize it clearly. 
    If this is an ID document, identify:
    - Name
    - ID number
    - Date of birth
    - Document type
    - Any other important information
    
    Format the response in a clear, structured way."""
    
    extracted_text = query_qwen_vision(image_path, prompt)
    
    response = f"""
✅ <b>Document Analysis Complete!</b>

🔍 <b>Extracted Information:</b>
<pre>{extracted_text}</pre>

🤖 <b>Powered by Qwen 2.5 Vision Model</b>

Use /start to perform another operation.
    """
    
    await update.message.reply_text(response, parse_mode='HTML')

async def process_face_comparison(update: Update, first_photo: str, second_photo: str) -> None:
    """Process face recognition between two photos."""
    user_id = update.effective_user.id
    await update.message.reply_text("👤 <b>Comparing faces with AI...</b>\nThis may take a moment...", parse_mode='HTML')
    
    try:
        result = DeepFace.verify(
            img1_path=first_photo, 
            img2_path=second_photo,
            enforce_detection=False
        )
        
        verified = result["verified"]
        confidence = 1.0 - result["distance"]
        
        status_emoji = "✅" if verified else "❌"
        status_text = "MATCH" if verified else "NO MATCH"
        
        response = f"""
{status_emoji} <b>Face Recognition Result</b>

<b>Status:</b> {status_text}
<b>Confidence:</b> {confidence:.2%}
<b>Distance:</b> {result["distance"]:.4f}
<b>Threshold:</b> {result["threshold"]:.4f}

<b>Technical Details:</b>
• Model: {result["model"]}
• Detector: {result["detector_backend"]}

Use /start to perform another operation.
        """
        
        await update.message.reply_text(response, parse_mode='HTML')
        
    except Exception as e:
        await update.message.reply_text(
            f"❌ **Face recognition failed:**\n{str(e)}\n\n"
            "Make sure both images contain clear, visible faces."
        )
    
    finally:
        # Clean up first photo
        if os.path.exists(first_photo):
            os.remove(first_photo)
        first_photo_dir = os.path.dirname(first_photo)
        if os.path.exists(first_photo_dir):
            try:
                os.rmdir(first_photo_dir)
            except OSError:
                pass  # Directory not empty
        
        # Reset user state and data
        USER_STATES.pop(user_id, None)
        USER_DATA.pop(user_id, None)

async def process_kyc_verification(update: Update, id_card_path: str, selfie_path: str) -> None:
    """Process full KYC verification."""
    user_id = update.effective_user.id
    await update.message.reply_text("🏛️ <b>Performing KYC verification...</b>\nThis may take up to 30 seconds...", parse_mode='HTML')
    
    try:
        # 1. Extract ID information
        id_prompt = """Extract key information from this ID document:
        - Full name
        - ID number  
        - Date of birth
        - Document type
        - Nationality
        - Any other important details
        
        Format as clear, structured text."""
        
        extracted_info = query_qwen_vision(id_card_path, id_prompt)
        
        # 2. Face verification
        face_result = DeepFace.verify(
            img1_path=id_card_path,
            img2_path=selfie_path,
            enforce_detection=False
        )
        
        verified = face_result["verified"]
        confidence = 1.0 - face_result["distance"]
        
        # 3. Generate verification report
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        verification_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        status_emoji = "✅" if verified else "❌"
        status_text = "VERIFIED" if verified else "FAILED"
        
        response = f"""
🏛️ <b>KYC VERIFICATION REPORT</b>

<b>Verification ID:</b> {verification_id}
<b>Timestamp:</b> {timestamp}
<b>Status:</b> {status_emoji} {status_text}

📋 <b>Extracted ID Information:</b>
<pre>{extracted_info}</pre>

👤 <b>Face Verification:</b>
• <b>Match:</b> {"YES" if verified else "NO"}
• <b>Confidence:</b> {confidence:.2%}
• <b>Technical Score:</b> {face_result["distance"]:.4f}

🤖 <b>Verification Method:</b> AI-powered analysis
📊 <b>Model:</b> Qwen 2.5 VLM + DeepFace

Use /start to perform another verification.
        """
        
        await update.message.reply_text(response, parse_mode='HTML')
        
    except Exception as e:
        await update.message.reply_text(
            f"❌ **KYC verification failed:**\n{str(e)}\n\n"
            "Please ensure you've uploaded clear, readable images."
        )
    
    finally:
        # Clean up both files and directories
        user_data = USER_DATA.get(user_id, {})
        
        # Clean up ID card
        if os.path.exists(id_card_path):
            os.remove(id_card_path)
        id_card_dir = os.path.dirname(id_card_path)
        if os.path.exists(id_card_dir):
            try:
                os.rmdir(id_card_dir)
            except OSError:
                pass  # Directory not empty
        
        # Clean up selfie
        if os.path.exists(selfie_path):
            os.remove(selfie_path)
        selfie_temp_dir = user_data.get('selfie_temp_dir')
        if selfie_temp_dir and os.path.exists(selfie_temp_dir):
            try:
                os.rmdir(selfie_temp_dir)
            except OSError:
                pass  # Directory not empty
        
        # Reset user state and data
        USER_STATES.pop(user_id, None)
        USER_DATA.pop(user_id, None)

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Cancel current operation."""
    user_id = update.effective_user.id
    
    # Clean up any temporary files
    user_data = USER_DATA.get(user_id, {})
    
    # Clean up first photo (from face comparison)
    first_photo = user_data.get('first_photo')
    if first_photo and os.path.exists(first_photo):
        os.remove(first_photo)
        first_photo_dir = os.path.dirname(first_photo)
        if os.path.exists(first_photo_dir):
            try:
                os.rmdir(first_photo_dir)
            except OSError:
                pass
    
    # Clean up ID card
    id_card = user_data.get('id_card')
    if id_card and os.path.exists(id_card):
        os.remove(id_card)
        id_card_dir = os.path.dirname(id_card)
        if os.path.exists(id_card_dir):
            try:
                os.rmdir(id_card_dir)
            except OSError:
                pass
    
    # Clean up selfie
    selfie_path = user_data.get('selfie_path')
    if selfie_path and os.path.exists(selfie_path):
        os.remove(selfie_path)
    
    selfie_temp_dir = user_data.get('selfie_temp_dir')
    if selfie_temp_dir and os.path.exists(selfie_temp_dir):
        try:
            os.rmdir(selfie_temp_dir)
        except OSError:
            pass
    
    USER_STATES.pop(user_id, None)
    USER_DATA.pop(user_id, None)
    
    await update.message.reply_text(
        "❌ <b>Operation cancelled.</b>\n\nUse /start to begin a new operation."
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Show help information."""
    help_text = """
🤖 <b>ZKYC Bot Help</b>

This bot provides AI-powered document analysis and face recognition for KYC verification.

<b>Available Commands:</b>
• <code>/start</code> - Start the bot and show main menu
• <code>/help</code> - Show this help message
• <code>/cancel</code> - Cancel current operation

<b>Features:</b>
📄 <b>Document Analysis</b> - Extract text from ID documents using AI
👤 <b>Face Recognition</b> - Compare faces between two photos
🏛️ <b>KYC Verification</b> - Complete identity verification workflow

<b>How to Use:</b>
1. Send <code>/start</code> to begin
2. Choose an option from the menu
3. Follow the prompts to upload images
4. Receive detailed AI analysis results

<b>Supported Formats:</b>
• Image types: JPG, PNG, GIF, BMP, TIFF
• Maximum file size: 20MB per image

<b>Technology:</b>
• AI Model: Qwen 2.5 Vision Language Model
• Face Recognition: DeepFace with multiple backends
• Processing: Real-time analysis with detailed reports

Use <code>/start</code> to begin using the bot!
    """
    
    await update.message.reply_text(help_text, parse_mode='HTML')

def main() -> None:
    """Start the bot."""
    logger.info("=== ZKYC Telegram Bot Starting ===")
    logger.info(f"Bot Token: {'✅ Set' if BOT_TOKEN else '❌ Missing'}")
    logger.info(f"Ollama URL: {OLLAMA_BASE_URL}")
    logger.info(f"Qwen Model: {QWEN_MODEL}")
    
    if not BOT_TOKEN:
        logger.error("TELEGRAM_BOT_TOKEN environment variable is required!")
        return
    
    # Test Ollama connection
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
        if response.status_code == 200:
            logger.info("✅ Ollama connection successful")
        else:
            logger.warning(f"⚠️ Ollama responded with status {response.status_code}")
    except Exception as e:
        logger.error(f"❌ Ollama connection failed: {str(e)}")
    
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Command handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("cancel", cancel))
    
    # Callback handlers
    application.add_handler(CallbackQueryHandler(button_handler))
    
    # Photo handler
    application.add_handler(MessageHandler(filters.PHOTO, handle_photo))
    
    # Start the bot
    logger.info("🚀 Starting ZKYC Telegram Bot...")
    try:
        application.run_polling()
    except Exception as e:
        logger.error(f"❌ Bot failed to start: {str(e)}")
        raise

if __name__ == '__main__':
    main() 