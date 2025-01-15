import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';

const TreatmentSuggestions = () => {
  const location = useLocation();
  const { treatment, disease, confidence, imageFile, prediction_probabilities, recommendations } = location.state || {};

  // Example of handleDownloadGuide function
  const handleDownloadGuide = async () => {
    try {
      const predictedClass = disease;
      const suggestions = recommendations;
      const predictions = prediction_probabilities;
      const formData = new FormData();
  
      // Append the image file to FormData (imageFile should be the actual file object passed from the previous component)
      if (imageFile) {
        formData.append("file", imageFile);
      }
  
      // Append other data to FormData
      if (predictedClass) {
        formData.append("predicted_class", predictedClass);
      }
      if (predictions) {
        formData.append("predictions", JSON.stringify(predictions)); // Assuming predictions is an array of numbers
      }
      if (suggestions) {
        formData.append("suggestions", JSON.stringify(suggestions)); // Assuming suggestions is an object
      }
  
      // Make POST request to backend API to generate and download the PDF
      const response = await fetch('http://127.0.0.1:8000/api/download_pdf', {
        method: "POST",
        body: formData, // Send the form data including the image and other info
      });
  
      if (!response.ok) {
        throw new Error("Error downloading PDF");
      }
  
      // Handle the PDF download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "prediction_report.pdf";
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };


  return (
    <div className="bg-gray-100 py-12"
          style={{
            backgroundImage: "url('src/assets/background images/backn2.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "70vh",
          }}>
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Treatment Suggestions
        </h2>
        <div className="bg-gray-900 shadow-md rounded-lg p-6 bg-opacity-85">
          {/* Overview Section */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4 text-gray-100">
              Disease Overview
            </h3>
            <p className="text-gray-100">
              <strong>Disease Detected:</strong> {treatment.name}
            </p>
            <p className="text-gray-100">
              <strong>Confidence:</strong> {confidence.toFixed(2)}%
            </p>
            <p className="text-gray-100">
              <strong>Symptoms:</strong>
              {treatment.symptoms.split(',').map((symptom, index) => (
                <span key={index} style={{ display: 'block', marginLeft: '20px' }}>
                  • {symptom.trim()}
                </span>
              ))}
            </p>
          </div>

          {/* Treatment Details Table */}
          <h3 className="text-lg font-bold mb-4 text-gray-100">
            Treatment Recommendations
          </h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left p-3 border border-gray-300">Brand Name</th>
                <th className="text-left p-3 border border-gray-300">How to Use</th>
                <th className="text-left p-3 border border-gray-300">Recommendations</th>
              </tr>
            </thead>
            <tbody>
              {treatment.brandTreatments.map((brand, index) => (
                <tr key={index} className="border-t text-gray-100">
                  <td className="p-3 border border-gray-300">{brand.brandName}</td>
                  <td className="p-3 border border-gray-300">{brand.howToUse}</td>
                  <td className="p-3 border border-gray-300">{brand.recommendations}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Download Button */}
          <div className="mt-6 text-center">
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded-md"
              onClick={handleDownloadGuide}
            >
              Download Guide
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentSuggestions;
