import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import Button from '../Button';

const FloatingCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const scrollToSignup = () => {
    const element = document.getElementById('signup');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className={`fixed bottom-8 right-8 flex flex-col gap-3 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <Button
        variant="primary"
        className="shadow-lg"
        onClick={scrollToSignup}
      >
        Get Started
      </Button>
      
      <button
        onClick={scrollToTop}
        className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-blue-500 focus:outline-none transition-colors"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
};

export default FloatingCTA;