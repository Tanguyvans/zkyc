from fastapi import FastAPI, UploadFile, File, HTTPException
from deepface import DeepFace
import tempfile
import os
from pathlib import Path

app = FastAPI()

@app.post("/")
async def post_root():
    return {"message": "Hello World", "method": "POST"}

@app.post("/face-recognition")
async def face_recognition(
    img1: UploadFile = File(..., description="First image for comparison"),
    img2: UploadFile = File(..., description="Second image for comparison")
):
    """
    Compare two uploaded images to verify if they contain the same person
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
        result = DeepFace.verify(img1_path=img1_path, img2_path=img2_path)
        
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)