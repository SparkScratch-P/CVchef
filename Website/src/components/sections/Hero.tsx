import React, { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../Button';

const Hero: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section id="hero" className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 flex flex-col fade-in-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Your Resume, <span className="text-blue-500">Reimagined</span> by AI
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-xl">
              Land more interviews with resumes that pass ATS screening and impress hiring managers. Let our AI chef cook up the perfect CV for your dream job.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="primary" 
                className="w-full sm:w-auto hover-lift"
                onClick={() => window.location.href = 'https://wooden-dragon-800.convex.app/'}
              >
                Build Your Resume
              </Button>
              <Button 
                size="lg" 
                variant="text" 
                className="w-full sm:w-auto hover-scale"
                icon={<ChevronRight className="h-5 w-5" />}
                onClick={() => scrollToSection('demo')}
              >
                See How It Works
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 text-center">
              <div className="flex flex-col scale-up">
                <span className="text-3xl font-bold text-blue-500">89%</span>
                <span className="text-sm text-gray-600 mt-1">Interview Rate</span>
              </div>
              <div className="flex flex-col scale-up" style={{ transitionDelay: '200ms' }}>
                <span className="text-3xl font-bold text-blue-500">300K+</span>
                <span className="text-sm text-gray-600 mt-1">Resumes Created</span>
              </div>
              <div className="flex flex-col scale-up" style={{ transitionDelay: '400ms' }}>
                <span className="text-3xl font-bold text-blue-500">97%</span>
                <span className="text-sm text-gray-600 mt-1">ATS Pass Rate</span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 fade-in-right">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg blur opacity-30 animate-pulse"></div>
              <div className="relative bg-white rounded-lg shadow-xl overflow-hidden hover-lift">
                <img 
                  src="https://images.pexels.com/photos/3760072/pexels-photo-3760072.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Professional resume created by CVChef" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent p-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-100 hover-scale">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        AI
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">AI Assistance</h3>
                        <p className="text-sm text-gray-600">Optimizing your experience section...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;