import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout  } from 'lucide-react';

const PddHomePage = () => {
  const navigate = useNavigate();

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

      {/* Content */}
      <div className="relative z-10 flex flex-col justify- pt-28 min-h-screen text-white px-20">
        <h2 className="text-lg tracking-widest uppercase mb-8">
          Welcome to RiceGenie's
        </h2>
        
        <h1 className="text-7xl font-bold max-w-4xl mb-0 uppercase flex items-center gap-4">
        Paddy Disease <Sprout  size={96} />
        
        </h1>
        <h1 className="text-7xl font-bold max-w-3xl mb-10 uppercase flex items-center gap-4">
        Detection System
        
        </h1>
        
        <p className="text-sm tracking-widest mb-14 leading-loose">
        With the rise of digital technologies, a well-designed user interface (UI) and user experience (UX) can help make a company's offerings more trustworthy and usable. Due to the increasing needs for efficient and intuitive digital presences, the need for UX and UI professionals has also increased.

        In fact, CNNMoney/PayScale's list of Best Jobs in America ranked User Experience ain differences between UX and UI, and free UX/UI-related resources recommended by the panelists.
        </p>
        <div className="flex gap-8">
            <button
                onClick={() => navigate('/detect')}
                className="bg-yellow-600 text-white tracking-widest px-8 py-3  font-medium hover:bg-opacity-80 transition-all w-fit"
            >
                Proceed
            </button>
            <button
                onClick={() => navigate('/disease')}
                className="bg-yellow-600 text-white tracking-widest px-8 py-3  font-medium hover:bg-opacity-80 transition-all w-fit"
            >
                Pre-Harvesting Diseases
            </button>
        </div>
        
      </div>
    </div>
  );
};

export default PddHomePage;