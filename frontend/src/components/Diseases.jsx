import React from 'react';
import { Info, AlertCircle, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const DiseaseCard = ({ title, description, imagePath }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="bg-gray-100 rounded-lg shadow-lg overflow-hidden hover:shadow-xl  transition-shadow"
    >
      <div className="grid md:grid-cols-12 gap-6 h-[500px]">
        <div className="relative overflow-hidden rounded-[50%] md:rounded-[0%] md:rounded-r-[0%] md:col-span-5">
          <img 
            src={imagePath} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        
        <div className="p-6 flex flex-col md:col-span-7">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="text-green-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
          
          <p className="text-gray-600 leading-relaxed">{description}</p>
          
          <div className="mt-4 flex items-start gap-2">
            <AlertCircle className="text-yellow-600 mt-1 flex-shrink-0" size={20} />
            <p className="text-sm text-gray-500">
              Early detection and proper management practices are crucial for controlling this disease.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Diseases = () => {
  const diseases = [
    {
      title: "Rice False Smut",
      description: `Rice false smut, caused by the fungus Ustilaginoidea virens, manifests as individual rice grains transformed into velvety, black smut balls. Initially orange, these balls mature to a greenish-black color and burst, releasing spores that spread the disease. Affected grains suffer from reduced weight, chalkiness, and decreased germination rates. Warm and humid conditions, frequent rainfall, dense canopies, excessive nitrogen fertilization, and susceptible rice varieties favor false smut development.Rice false smut, caused by the fungus Ustilaginoidea virens, manifests as individual rice grains transformed into velvety, black smut balls. Initially orange, these balls mature to a greenish-black color and burst, releasing spores that spread the disease. Affected grains suffer from reduced weight, chalkiness, and decreased germination rates. Warm and humid conditions, frequent rainfall, dense canopies, excessive nitrogen fertilization, and susceptible rice varieties favor false smut development.`,
      imagePath: "src/assets/disease images/rice false smut.jpg"
    },
    {
      title: "Rice False Smut",
      description: `Rice false smut, caused by the fungus Ustilaginoidea virens, manifests as individual rice grains transformed into velvety, black smut balls. Initially orange, these balls mature to a greenish-black color and burst, releasing spores that spread the disease. Affected grains suffer from reduced weight, chalkiness, and decreased germination rates. Warm and humid conditions, frequent rainfall, dense canopies, excessive nitrogen fertilization, and susceptible rice varieties favor false smut development. Rice false smut, caused by the fungus Ustilaginoidea virens, manifests as individual rice grains transformed into velvety, black smut balls. Initially orange, these balls mature to a greenish-black color and burst, releasing spores that spread the disease. Affected grains suffer from reduced weight, chalkiness, and decreased germination rates. Warm and humid conditions, frequent rainfall, dense canopies, excessive nitrogen fertilization, and susceptible rice varieties favor false smut development.`,
      imagePath: "src/assets/disease images/rice false smut.jpg"
    },
    // Add more diseases here
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="space-y-8"
      >
        {diseases.map((disease, index) => (
          <DiseaseCard 
            key={index}
            title={disease.title}
            description={disease.description}
            imagePath={disease.imagePath}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Diseases;