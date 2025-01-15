from datetime import datetime
from io import BytesIO
import os
from PIL import Image
from fpdf import FPDF
import numpy as np
import cv2
import pickle
import tensorflow as tf

class PaddyDiseaseModel:
    def __init__(self, model_path, treatment_path):
        """
        Initialize the ML model and load treatment suggestions
        
        :param model_path: Path to the saved model (.h5 file)
        :param treatment_path: Path to pickle file with treatment suggestions
        """
        # Load model
        try:
            self.model = tf.keras.models.load_model(model_path)
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Error loading model: {e}")
            raise

        # Classes (same as in the trained model)
        self.classes = ['bacterial_leaf_blight', 'brown_spot', 'healthy', 'leaf_blast', 'sheath_blight']
        
        # Image Dimensions
        self.image_size = (128, 128)

        # Load treatment suggestions
        try:
            with open(treatment_path, "rb") as file:
                self.treatment_data = pickle.load(file)
            print("Treatment data loaded successfully.")
            print("Available Treatment Classes:", list(self.treatment_data.keys()))
        except Exception as e:
            print(f"Error loading treatment data: {e}")
            self.treatment_data = {}

    def preprocess_image(self, image_bytes):
        """
        Preprocess the input image for model prediction
        
        :param image_bytes: Bytes of the uploaded image
        :return: Preprocessed image array
        """
        # Convert bytes to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        
        # Decode image
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Resize to match training dimensions
        img_resized = cv2.resize(img, self.image_size)
        
        # Normalize pixel values to [0, 1]
        img_normalized = img_resized / 255.0
        
        # Add batch dimension
        img_reshaped = np.expand_dims(img_normalized, axis=0)
        
        return img_reshaped

    def predict(self, image_bytes):
        """
        Predict paddy disease from image bytes
        
        :param image_bytes: Bytes of the uploaded image
        :return: Dictionary with prediction results
        """
        try:
            # Preprocess image
            processed_image = self.preprocess_image(image_bytes)
            
            # Make prediction
            predictions = self.model.predict(processed_image)
            
            # Get top prediction
            predicted_class_index = np.argmax(predictions)
            predicted_class = self.classes[predicted_class_index]
            
            # Calculate confidence as the maximum probability * 100
            confidence = float(np.max(predictions) * 100)
            
            # Prepare prediction probabilities
            prediction_probabilities = predictions[0].tolist()
            
            # Prepare detailed treatment suggestions
            treatment_suggestions = None
            normalized_class = predicted_class.lower()
            treatment_data_normalized = {key.lower(): value for key, value in self.treatment_data.items()}
            
            if normalized_class in treatment_data_normalized:
                treatment_suggestions = treatment_data_normalized[normalized_class]
            
            # Extract detailed brand-specific treatment information
            brand_treatments = []
            if treatment_suggestions:
                brand_names = treatment_suggestions.get('Treatment (Brand Names)', 'N/A')
                how_to_use = treatment_suggestions.get('How to Use', 'N/A')
                recommendations = treatment_suggestions.get('Recommendations', 'N/A')
                
                # Assuming brand names, how to use, and recommendations are delimited by commas
                brand_names_list = brand_names.split(',') if brand_names != 'N/A' else []
                how_to_use_list = how_to_use.split(';') if how_to_use != 'N/A' else []
                recommendations_list = recommendations.split('.') if recommendations != 'N/A' else []
                
                # Pair brand names with corresponding instructions
                for idx, brand_name in enumerate(brand_names_list):
                    brand_treatments.append({
                        "brandName": brand_name.strip(),
                        "howToUse": how_to_use_list[idx].strip() if idx < len(how_to_use_list) else 'N/A',
                        "recommendations": recommendations_list[idx].strip() if idx < len(recommendations_list) else 'N/A'
                    })
            
            return {
                "disease": predicted_class,
                "confidence": confidence,
                "prediction_probabilities": prediction_probabilities,
                "recommendations" : treatment_suggestions.get('Recommendations', 'N/A'),
                "treatment": {
                    "name": treatment_suggestions.get('Name', 'N/A') if treatment_suggestions else 'N/A',
                    "symptoms": treatment_suggestions.get('Symptoms', 'N/A') if treatment_suggestions else 'N/A',
                    "brandTreatments": brand_treatments  # List of brand-specific treatments
                }
            }
        except Exception as e:
            raise ValueError(f"Error during prediction: {str(e)}")
        
    def generate_pdf_report(self, image_path, predicted_class, predictions, suggestions, pdf_path):
        try:
            # Initialize PDF with custom margins
            pdf = FPDF()
            pdf.set_margins(left=20, top=0, right=20)
            pdf.set_auto_page_break(auto=True, margin=0)
            pdf.add_page()

            # Add Header with decorative elements
            pdf.set_fill_color(44, 62, 80)  # Dark blue background
            pdf.rect(0, 0, 210, 30, 'F')  # Header background
            
            pdf.set_font("Arial", style="B", size=24)
            pdf.set_text_color(255, 255, 255)  # White text
            pdf.cell(0, 20, "Paddy Disease Detection Report", ln=True, align="C")
            
            # Add Date and Report ID
            pdf.set_font("Arial", size=10)
            current_date = datetime.now().strftime("%B %d, %Y")
            report_id = datetime.now().strftime("%Y%m%d%H%M")
            pdf.set_text_color(200, 200, 200)  # Light gray
            pdf.cell(0, 5, f"Report Generated: {current_date}  |  Report ID: {report_id}", ln=True, align="C")
            
            pdf.ln(10)
            
            # Add Image Section with box
            pdf.set_text_color(44, 62, 80)  # Dark blue text
            pdf.set_font("Arial", style="B", size=16)
            pdf.cell(0, 10, "Analyzed Paddy Plant Image", ln=True, align="L")

            pdf.ln(10)
            
            # Add image with border and shadow effect
            try:
                # # Draw shadow
                # pdf.set_fill_color(200, 200, 200)
                # pdf.rect(31, 81, 150, 100, 'F')
                
                # # Draw white background
                # pdf.set_fill_color(255, 255, 255)
                # pdf.rect(30, 80, 150, 100, 'F')
                try:
                    img = Image.open(image_path)
                    img = img.convert("RGB")  # Ensure it's in RGB mode
                    image_path = "temp_image_fixed.jpeg"  # New path for the fixed image
                    img.save(image_path, "JPEG")
                except Exception as e:
                    print(f"Error fixing image: {e}")
                # Add image
                pdf.rect(50, pdf.get_y(), 110, 80)  # Draw rectangle for border
                pdf.image(image_path, x=55, y=pdf.get_y() + 5, w=100, h=70)
                
            except Exception as e:
                print(f"Error embedding image: {e}")
                pdf.cell(0, 50, "Error loading image", ln=True, align="C")
            
            pdf.ln(90)
            
            # Detection Results Section
            pdf.set_fill_color(44, 62, 80)
            pdf.rect(20, pdf.get_y(), 170, 0.5, 'F')  # Divider line
            pdf.ln(5)
            
            pdf.set_font("Arial", style="B", size=16)
            pdf.cell(5, 10, "Detection Results", ln=True, align="L")
            
            # Create a box for results
            pdf.set_fill_color(240, 240, 240)  # Light gray background
            pdf.rect(20, pdf.get_y(), 170, 30, 'F')
            
            # Disease and Confidence
            formatted_disease = predicted_class.replace('_', ' ').title()
            max_confidence = max(predictions) * 100
            
            pdf.set_font("Arial", style="B", size=12)
            pdf.cell(60, 15, "Detected Disease:", align="L")
            pdf.set_font("Arial", size=12)
            pdf.cell(0, 15, formatted_disease, ln=True, align="L")
            
            pdf.set_font("Arial", style="B", size=12)
            pdf.cell(60, 10, "Confidence Score:")
            pdf.set_font("Arial", size=12)
            pdf.cell(0, 10, f"{max_confidence:.2f}%", ln=True, align="L")
            
            pdf.ln(10)
            
            # Treatment Recommendations Section
            pdf.set_fill_color(44, 62, 80)
            pdf.rect(20, pdf.get_y(), 170, 0.5, 'F')  # Divider line
            pdf.ln(5)
            
            pdf.set_font("Arial", style="B", size=16)
            pdf.cell(0, 10, "Treatment Recommendations", ln=True, align="L")
            pdf.ln(5)
            
            # Add recommendations in a box
            pdf.set_fill_color(240, 240, 240)
            pdf.rect(20, pdf.get_y(), 170, 40, 'F')
            
            # Add suggestions with custom bullets
            pdf.set_font("Arial", size=12)
            y_pos = pdf.get_y() + 10
            for suggestion in suggestions.strip('"').split('. '):
                if suggestion:
                    pdf.cell(10, 10, chr(149), ln=0, align="L")  # Bullet point
                    pdf.cell(0, 10, suggestion.strip() + ".", ln=True, align="L")
                    # Suggestion text
                    # pdf.set_xy(35, y_pos)
                    # pdf.multi_cell(150, 8, suggestion.strip() + ".", align="L")
                    # y_pos += 15
            
            pdf.ln(5)

            # Add Footer
            pdf.set_y(-35)
            pdf.set_fill_color(44, 62, 80)
            pdf.rect(0, pdf.get_y(), 210, 35, 'F')
            pdf.set_text_color(255, 255, 255)
            pdf.set_font("Arial", style="B", size=10)
            pdf.cell(0, 15, "Important Notice", ln=True, align="C")
            pdf.set_font("Arial", size=9)
            pdf.cell(0, 5, "This report is generated automatically by the Paddy Disease Detection System.", ln=True, align="C")
            pdf.cell(0, 5, "Please consult with an agricultural expert for final confirmation and treatment plan.", ln=True, align="C")

            # Save the PDF
            pdf.output(pdf_path)
            print(f"PDF report saved at {pdf_path}")
            return True

        except Exception as e:
            print(f"Error generating PDF report: {e}")
            return False
