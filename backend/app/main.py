from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import prediction_routes

# Create FastAPI application
app = FastAPI(
    title="Paddy Disease Detector",
    description="ML-powered paddy leaf disease detection API"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include prediction routes
app.include_router(prediction_routes.router, prefix="/api")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Paddy Disease Detection API",
        "status": "Running",
        "endpoints": [
            "/api/predict (POST) - Predict paddy leaf disease",
            "/api/download_pdf (POST) - Download Pdf"
        ]
    }

