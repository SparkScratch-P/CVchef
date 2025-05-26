import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../Button';

const CTA: React.FC = () => {
  return (
    <section id="signup" className="py-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-blue-100">
              Join thousands of professionals who have accelerated their job search with CVChef's AI-powered resume builder.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Start for Free</h3>
                <ul className="space-y-3">
                  {[
                    "Create your first optimized resume in minutes",
                    "No credit card required to start",
                    "7-day free access to all premium features",
                    "Cancel anytime, no obligations"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-blue-200 text-blue-600 flex items-center justify-center mr-3 mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="text-blue-50">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg w-full sm:w-auto"
                    icon={<ArrowRight className="h-5 w-5" />}
                    onClick={() => window.location.href = 'https://wooden-dragon-800.convex.app/'}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-1 bg-white/20 rounded-lg blur"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <img 
                        src="https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                        alt="User testimonial" 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium">Emily K.</h4>
                        <p className="text-sm text-blue-200">Product Designer</p>
                      </div>
                    </div>
                    <blockquote className="text-blue-50 italic text-sm">
                      "CVChef helped me land interviews at top tech companies. The AI suggestions made my resume stand out, and I received multiple offers within weeks!"
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <p className="text-blue-200 text-sm">
              Join over 50,000+ professionals who have already advanced their careers with CVChef
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              {[
                "Google", "Microsoft", "Amazon", "Apple", "Meta", "Adobe"
              ].map((company, index) => (
                <div key={index} className="text-white font-medium opacity-80">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA