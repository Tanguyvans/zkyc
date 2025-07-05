from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from deepface import DeepFace
import requests
import json
import base64
import tempfile
import os
from pathlib import Path
from datetime import datetime
from typing import Dict, Any
import cv2
import numpy as np

app = FastAPI(title="ZKYC Qwen Service", description="Face verification and AI-powered text extraction for KYC")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ollama configuration
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
QWEN_MODEL = "qwen2.5vl:3b"

# Create upload directory
current_dir = os.path.dirname(os.path.abspath(__file__))
uploads_dir = os.path.join(current_dir, "uploads")
os.makedirs(uploads_dir, exist_ok=True)

def encode_image_to_base64(image_path: str) -> str:
    """Convert image to base64 string for Ollama"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def query_qwen_vision(image_path: str, prompt: str) -> str:
    """Query Qwen2.5 VLM via Ollama"""
    try:
        # Encode image
        image_base64 = encode_image_to_base64(image_path)
        
        # Prepare request
        payload = {
            "model": QWEN_MODEL,
            "prompt": prompt,
            "images": [image_base64],
            "stream": False
        }
        
        # Make request to Ollama
        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "")
        else:
            raise Exception(f"Ollama request failed: {response.status_code} - {response.text}")
            
    except Exception as e:
        raise Exception(f"Error querying Qwen: {str(e)}")

@app.get("/")
async def root():
    return {"message": "ZKYC Qwen Service is running", "version": "1.0", "features": ["face_verification", "ai_text_extraction"]}

@app.get("/health")
async def health_check():
    """Check if Ollama and Qwen model are available"""
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=10)
        if response.status_code == 200:
            models = response.json().get("models", [])
            qwen_available = any(QWEN_MODEL in model.get("name", "") for model in models)
            return {
                "status": "healthy",
                "ollama_available": True,
                "qwen_model_available": qwen_available,
                "available_models": [model.get("name") for model in models]
            }
        else:
            return {"status": "unhealthy", "ollama_available": False, "error": "Ollama not responding"}
    except Exception as e:
        return {"status": "unhealthy", "ollama_available": False, "error": str(e)}

@app.post("/face-recognition")
async def face_recognition(
    img1: UploadFile = File(..., description="First image for comparison"),
    img2: UploadFile = File(..., description="Second image for comparison")
):
    """
    Compare two uploaded images to verify if they contain the same person using DeepFace
    """
    # Check if files are images
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp"]
    if img1.content_type not in allowed_types or img2.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    
    # Create temporary files to save uploaded images
    temp_dir = tempfile.mkdtemp()
    
    try:
        # Save first image
        img1_path = os.path.join(temp_dir, f"img1_{img1.filename}")
        with open(img1_path, "wb") as f:
            content = await img1.read()
            f.write(content)
        
        # Save second image
        img2_path = os.path.join(temp_dir, f"img2_{img2.filename}")
        with open(img2_path, "wb") as f:
            content = await img2.read()
            f.write(content)
        
        # Perform face verification
        result = DeepFace.verify(img1_path=img1_path, img2_path=img2_path, enforce_detection=False)
        
        # Clean up temporary files
        os.remove(img1_path)
        os.remove(img2_path)
        os.rmdir(temp_dir)
        
        return {
            "verified": result["verified"],
            "distance": result["distance"],
            "threshold": result["threshold"],
            "model": result["model"],
            "detector_backend": result["detector_backend"],
            "similarity_metric": result["similarity_metric"],
            "facial_areas": result["facial_areas"],
            "message": "Same person" if result["verified"] else "Different people"
        }
        
    except Exception as e:
        # Clean up temporary files in case of error
        if os.path.exists(img1_path):
            os.remove(img1_path)
        if os.path.exists(img2_path):
            os.remove(img2_path)
        if os.path.exists(temp_dir):
            os.rmdir(temp_dir)
        
        raise HTTPException(status_code=500, detail=f"Face recognition error: {str(e)}")

@app.post("/ai-extract")
async def ai_extract(
    file: UploadFile = File(...),
    prompt: str = "Extract all visible text from this image. Format the response as clear, structured text."
):
    """
    Extract text from uploaded image using Qwen2.5 VLM
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    temp_dir = tempfile.mkdtemp()
    
    try:
        # Save uploaded image
        image_path = os.path.join(temp_dir, f"image_{file.filename}")
        with open(image_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Query Qwen model
        extracted_text = query_qwen_vision(image_path, prompt)
        
        # Clean up
        os.remove(image_path)
        os.rmdir(temp_dir)
        
        return {
            "filename": file.filename,
            "prompt_used": prompt,
            "extracted_text": extracted_text,
            "model": QWEN_MODEL,
            "status": "success"
        }
        
    except Exception as e:
        # Clean up temporary files in case of error
        if os.path.exists(image_path):
            os.remove(image_path)
        if os.path.exists(temp_dir):
            os.rmdir(temp_dir)
        
        raise HTTPException(status_code=500, detail=f"AI extraction error: {str(e)}")

@app.post("/id-verify")
async def id_verify(
    id_card: UploadFile = File(..., description="ID card image"),
    selfie: UploadFile = File(..., description="Selfie image")
):
    """
    Complete KYC verification: AI-powered ID text extraction + face verification
    """
    if not id_card.content_type.startswith("image/") or not selfie.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Both files must be images")
    
    temp_dir = tempfile.mkdtemp()
    
    try:
        # Save uploaded images
        id_card_path = os.path.join(temp_dir, f"id_card_{id_card.filename}")
        selfie_path = os.path.join(temp_dir, f"selfie_{selfie.filename}")
        
        with open(id_card_path, "wb") as f:
            content = await id_card.read()
            f.write(content)
        
        with open(selfie_path, "wb") as f:
            content = await selfie.read()
            f.write(content)
        
        # 1. AI-powered ID extraction
        id_extraction_prompt = """
        Extract key information from this ID document:
        - Full name
        - ID number
        - Date of birth
        - Document type
        - Nationality
        - Any other important details
        
        Format as clear, structured text.
        """
        
        extracted_text = query_qwen_vision(id_card_path, id_extraction_prompt)
        
        # 2. Face verification
        face_result = DeepFace.verify(
            img1_path=id_card_path, 
            img2_path=selfie_path,
            enforce_detection=False
        )
        
        # 3. Save results with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        verification_data = {
            "timestamp": timestamp,
            "id_card_filename": id_card.filename,
            "selfie_filename": selfie.filename,
            "ai_extraction": {
                "extracted_info": extracted_text,
                "model": QWEN_MODEL,
                "method": "AI-powered vision"
            },
            "face_verification": {
                "verified": face_result["verified"],
                "distance": face_result["distance"],
                "threshold": face_result["threshold"],
                "model": face_result["model"]
            }
        }
        
        # Save verification log
        log_filename = f"ai_verification_{timestamp}.json"
        log_path = os.path.join(uploads_dir, log_filename)
        with open(log_path, "w", encoding="utf-8") as f:
            json.dump(verification_data, f, indent=2, ensure_ascii=False)
        
        # Clean up temporary files
        os.remove(id_card_path)
        os.remove(selfie_path)
        os.rmdir(temp_dir)
        
        return {
            "verification_id": timestamp,
            "face_verified": face_result["verified"],
            "face_confidence": 1.0 - face_result["distance"],
            "extracted_info": extracted_text,
            "extraction_method": "AI-powered vision",
            "verification_log": log_filename,
            "status": "success",
            "message": "AI-powered KYC verification completed successfully"
        }
        
    except Exception as e:
        # Clean up temporary files in case of error
        if os.path.exists(id_card_path):
            os.remove(id_card_path)
        if os.path.exists(selfie_path):
            os.remove(selfie_path)
        if os.path.exists(temp_dir):
            os.rmdir(temp_dir)
        
        raise HTTPException(status_code=500, detail=f"AI KYC verification error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 