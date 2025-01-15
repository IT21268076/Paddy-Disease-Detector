import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import DiseaseDetection from './components/DiseaseDetection';
import TreatmentSuggestions from './components/TreatmentSuggestions';
import PddHomePage from './components/PddHomePage';
import Diseases from './components/Diseases';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Routes>
          <Route path="/pdd_home" element={<PddHomePage />} />
          <Route path="/detect" element={<DiseaseDetection />} />
          <Route path="/treatment" element={<TreatmentSuggestions />} />
          <Route path="/disease" element={<Diseases />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;