import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Image, MaximizeIcon } from 'lucide-react';

const ImageGallery = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  
  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };
  
  return (
    <div className="relative">
      {/* Main image */}
      <div className={`relative ${fullscreen ? 'fixed inset-0 z-50 bg-black flex items-center justify-center' : 'rounded-lg overflow-hidden'}`}>
        <img 
          src={images[activeIndex]} 
          alt="Property" 
          className={`w-full ${fullscreen ? 'max-h-screen object-contain' : 'h-80 sm:h-96 md:h-[500px] object-cover'}`} 
        />
        
        {/* Fullscreen button */}
        <button 
          onClick={toggleFullscreen} 
          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        >
          {fullscreen ? <X size={20} /> : <MaximizeIcon size={20} />}
        </button>
        
        {/* Navigation arrows */}
        <button 
          onClick={handlePrev} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={handleNext} 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        >
          <ChevronRight size={24} />
        </button>
        
        {/* Image counter */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {activeIndex + 1} / {images.length}
        </div>
      </div>
      
      {/* Thumbnails */}
      {!fullscreen && (
        <div className="flex space-x-2 mt-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden cursor-pointer transition-all ${index === activeIndex ? 'ring-2 ring-blue-600' : 'opacity-70 hover:opacity-100'}`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img 
                src={image} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;