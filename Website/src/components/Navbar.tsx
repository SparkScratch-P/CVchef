import React, { useState, useEffect } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import Button from './Button';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const handleLogin = () => {
    window.location.href = 'https://wooden-dragon-800.convex.app/';
  };

  const handleGetStarted = () => {
    window.location.href = 'https://wooden-dragon-800.convex.app/';
  };
  
  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <span className="ml-2 text-xl font-bold text-gray-900">CVChef</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-blue-500 font-medium transition-colors">Features</button>
            <button onClick={() => scrollToSection('demo')} className="text-gray-700 hover:text-blue-500 font-medium transition-colors">Demo</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-gray-700 hover:text-blue-500 font-medium transition-colors">Success Stories</button>
            <button onClick={() => scrollToSection('faq')} className="text-gray-700 hover:text-blue-500 font-medium transition-colors">FAQ</button>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={handleLogin}>Log in</Button>
            <Button variant="primary" size="sm" onClick={handleGetStarted}>Get Started</Button>
          </div>
          
          <button 
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col space-y-4 transition-all duration-300">
          <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-blue-500 font-medium py-2 transition-colors">Features</button>
          <button onClick={() => scrollToSection('demo')} className="text-gray-700 hover:text-blue-500 font-medium py-2 transition-colors">Demo</button>
          <button onClick={() => scrollToSection('testimonials')} className="text-gray-700 hover:text-blue-500 font-medium py-2 transition-colors">Success Stories</button>
          <button onClick={() => scrollToSection('faq')} className="text-gray-700 hover:text-blue-500 font-medium py-2 transition-colors">FAQ</button>
          <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
            <Button variant="outline" size="sm" className="w-full" onClick={handleLogin}>Log in</Button>
            <Button variant="primary" size="sm" className="w-full" onClick={handleGetStarted}>Get Started</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;