from datetime import datetime
import io
import json
import shutil
from fastapi import APIRouter, Form, HTTPException, File, Response, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
from app.models.ml_model import PaddyDiseaseModel
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Hardcoded paths (adjust as needed)
MODEL_PATH = "./ml_model/paddy_leaf_disease_sequential_model.h5"
TREATMENT_PATH = "./ml_model/Disease_Classes_and_Treatment_Suggestions.pkl"

# Initialize model
ml_model = PaddyDiseaseModel(MODEL_PATH, TREATMENT_PATH)

router = APIRouter()

# Pydantic model for request body
class PredictionDetails(BaseModel):
    image_path: str
    predicted_class: str
    predictions: list
    suggestions: dict

@router.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    """
    Endpoint to predict paddy disease from uploaded image
    
    :param file: Uploaded image file
    :return: Prediction results
    """
    try:
        # Read image bytes
        image_bytes = await file.read()
        
        # Predict disease
        prediction = ml_model.predict(image_bytes)
        
        return {
            "success": True,
            "result": prediction
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
  
    except Exception as e:
        # Log the full error for server-side debugging
        logger.error(f"Prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
@router.post("/download_pdf")
async def download_pdf(
    file: bytes = File(...),
    predicted_class: str = Form(...),
    predictions: str = Form(...),
    suggestions: str = Form(...)
):
    try:
        # Create unique temporary file names
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        temp_image_path = f"temp_image.jpg"
        pdf_path = f"temp_report_{timestamp}.pdf"

        try:
            # Save the image file
            with open(temp_image_path, "wb") as image_file:
                image_file.write(file)

            # Convert predictions string to list of floats
            predictions_list = [float(x) for x in predictions.strip('[]').split(',')]
            
            # Generate PDF
            success = ml_model.generate_pdf_report(
                temp_image_path,
                predicted_class,
                predictions_list,
                suggestions,
                pdf_path
            )

            if success and os.path.exists(pdf_path):
                with open(pdf_path, "rb") as pdf_file:
                    pdf_content = pdf_file.read()
                
                return Response(
                    content=pdf_content,
                    media_type="application/pdf",
                    headers={
                        "Content-Disposition": f"attachment; filename=paddy_disease_report_{timestamp}.pdf"
                    }
                )
            else:
                raise Exception("PDF generation failed")

        finally:
            # Clean up temporary files
            if os.path.exists(temp_image_path):
                os.remove(temp_image_path)
            if os.path.exists(pdf_path):
                os.remove(pdf_path)

    except Exception as e:
        return {"error": str(e)}