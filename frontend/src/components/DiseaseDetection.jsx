import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

const DiseaseDetection = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    setImage(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: false
  });

  const handlePredict = async () => {
    try {
      const formData = new FormData();
      formData.append('file', image);
      const response = await axios.post('http://127.0.0.1:8000/api/predict', formData);
      const result = response.data.result;
      const updatedResult = {
        ...result,      
        imageFile: image    
      };
      setResult(updatedResult);
    } catch (error) {
      console.error('Error predicting disease:', error);
    }
  };

  const handleUploadAnother = () => {
    setImage(null);
    setResult(null);
  };

  const handleViewTreatment = () => {
    navigate('/treatment', { state: result });
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: `url('src/assets/background images/backw.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 max-w-3xl pt-16 mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Disease Detection</h2>
        <div className="bg-gray-900 bg-opacity-85 shadow-md rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-white text-center">Upload Paddy Image</h3>
          {image ? (
            <div className="mb-4 flex justify-center">
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                className="w-64 h-64 object-cover rounded-md shadow-lg"
              />
            </div>
          ) : (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-green-500 bg-green-50' : 'hover:border-gray-400'}`}
            >
              <input {...getInputProps()} />
              <p className="text-gray-400">
                {isDragActive ? 'Drop the image here' : 'Drag and drop your paddy field image here or click to upload'}
              </p>
              <button
                type="button"
                className="bg-green-600 text-white px-4 py-2 rounded-md mt-4"
              >
                Upload Image
              </button>
            </div>
          )}
          {result ? (
            <div>
              <p className="text-green-600 font-bold mb-2">
                Detected: {result.disease} (Confidence: {parseFloat(result.confidence).toFixed(2)}%)
              </p>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  type="button"
                  className="bg-green-600 text-white px-4 py-2 rounded-md"
                  onClick={handleViewTreatment}
                >
                  View Treatment
                </button>
                <button
                  type="button"
                  className="bg-green-600 text-white px-4 py-2 rounded-md"
                  onClick={handleUploadAnother}
                >
                  Upload Another Image
                </button>
              </div>
            </div>
          ) : image && (
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-green-600 text-white px-4 py-2 rounded-md mt-4"
                onClick={handlePredict}
              >
                Predict Disease
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;