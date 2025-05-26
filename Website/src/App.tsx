import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/sections/Hero';
import Features from './components/sections/Features';
import Demo from './components/sections/Demo';
import Testimonials from './components/sections/Testimonials';
import Pricing from './components/sections/Pricing';
import CTA from './components/sections/CTA';
import Footer from './components/sections/Footer';
import FloatingCTA from './components/sections/FloatingCTA';
import { useScrollAnimation } from './hooks/useScrollAnimation';

function App() {
  const animationRef = useScrollAnimation();
  
  useEffect(() => {
    // Update document title
    document.title = 'CVChef - AI-Powered Resume Builder';
    
    // Add a class to the body for styling
    document.body.classList.add('font-sans', 'antialiased', 'text-gray-900');
    
    // Simple loading animation
    const handleLoad = () => {
      const body = document.body;
      body.classList.add('loaded');
    };
    
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-white" ref={animationRef}>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Demo />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}

export default App;