from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from deepface import DeepFace
import easyocr
import cv2
import numpy as np
import tempfile
import os
from pathlib import Path
from datetime import datetime
import json
from typing import Dict, Any

app = FastAPI(title="ZKYC OCR Service", description="Face verification and OCR text extraction for KYC")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

# Create upload directory
os.makedirs("uploads", exist_ok=True)

@app.get("/")
async def root():
    return {"message": "ZKYC OCR Service is running", "version": "1.0", "features": ["face_verification", "ocr_extraction"]}

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

@app.post("/ocr-extract")
async def ocr_extract(file: UploadFile = File(...)):
    """
    Extract text from uploaded image using EasyOCR
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read image file
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        # Perform OCR
        results = reader.readtext(img)
        
        # Extract text with confidence filtering
        extracted_text = []
        detailed_results = []
        
        for (bbox, text, confidence) in results:
            if confidence > 0.5:  # Filter out low confidence results
                extracted_text.append(text)
                detailed_results.append({
                    "text": text,
                    "confidence": float(confidence),
                    "bbox": [[float(coord) for coord in point] for point in bbox]
                })
        
        return {
            "filename": file.filename,
            "extracted_text": " ".join(extracted_text),
            "text_blocks": len(extracted_text),
            "detailed_results": detailed_results,
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR extraction error: {str(e)}")

@app.post("/id-verify")
async def id_verify(
    id_card: UploadFile = File(..., description="ID card image"),
    selfie: UploadFile = File(..., description="Selfie image")
):
    """
    Complete KYC verification: Extract text from ID card and verify face against selfie
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
        
        # 1. Extract text from ID card
        id_contents = cv2.imread(id_card_path)
        ocr_results = reader.readtext(id_contents)
        
        extracted_text = []
        for (bbox, text, confidence) in ocr_results:
            if confidence > 0.5:
                extracted_text.append(text)
        
        # 2. Verify face between ID card and selfie
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
            "ocr_results": {
                "extracted_text": " ".join(extracted_text),
                "text_blocks": len(extracted_text),
                "individual_texts": extracted_text
            },
            "face_verification": {
                "verified": face_result["verified"],
                "distance": face_result["distance"],
                "threshold": face_result["threshold"],
                "model": face_result["model"]
            }
        }
        
        # Save verification log
        log_filename = f"verification_{timestamp}.json"
        log_path = os.path.join("uploads", log_filename)
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
            "extracted_text": " ".join(extracted_text),
            "text_blocks_found": len(extracted_text),
            "verification_log": log_filename,
            "status": "success",
            "message": "KYC verification completed successfully"
        }
        
    except Exception as e:
        # Clean up temporary files in case of error
        if os.path.exists(id_card_path):
            os.remove(id_card_path)
        if os.path.exists(selfie_path):
            os.remove(selfie_path)
        if os.path.exists(temp_dir):
            os.rmdir(temp_dir)
        
        raise HTTPException(status_code=500, detail=f"KYC verification error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 