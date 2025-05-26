import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  name: string;
  position: string;
  company: string;
  image: string;
  quote: string;
  rating: number;
  achievement: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    position: "Senior Marketing Manager",
    company: "TechCorp",
    image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    quote: "After using CVChef, I received calls from 5 companies within a week. The AI suggestions made my experience sound much more impressive, and I ended up with 3 job offers!",
    rating: 5,
    achievement: "Landed dream job in 3 weeks"
  },
  {
    name: "Michael Rodriguez",
    position: "Software Engineer",
    company: "DataSystems",
    image: "https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    quote: "As a developer, I was skeptical about AI helping with my resume. I was wrong. CVChef helped me highlight my projects in a way that caught recruiters' attention.",
    rating: 5,
    achievement: "40% salary increase"
  },
  {
    name: "Lisa Chen",
    position: "Project Manager",
    company: "Global Innovations",
    image: "https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    quote: "The resume templates are beautiful and professional. The AI feedback helped me quantify my achievements in a way I hadn't thought of before. Highly recommend!",
    rating: 5,
    achievement: "4 interviews in first week"
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentIndex]);
  
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600">
            See how CVChef has helped thousands of job seekers land their dream roles with optimized resumes.
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <button 
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:text-blue-500 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/3">
                        <div className="aspect-square rounded-xl overflow-hidden">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="mt-6">
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                          <p className="text-gray-600">{testimonial.position}</p>
                          <p className="text-gray-500 text-sm">{testimonial.company}</p>
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <div className="h-full flex flex-col">
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-6">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                  <path d="M2 17l10 5 10-5"></path>
                                  <path d="M2 12l10 5 10-5"></path>
                                </svg>
                              </div>
                              <p className="font-medium text-blue-700">{testimonial.achievement}</p>
                            </div>
                          </div>
                          <blockquote className="text-xl text-gray-700 italic flex-grow">
                            "{testimonial.quote}"
                          </blockquote>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:text-blue-500 focus:outline-none"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
              <span className="text-2xl font-bold">87%</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interview Success</h3>
            <p className="text-gray-600">of our users report getting more interview callbacks after using CVChef</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
              <span className="text-2xl font-bold">45%</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Faster Job Search</h3>
            <p className="text-gray-600">reduction in average job search time for users with CVChef resumes</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
              <span className="text-2xl font-bold">92%</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">User Satisfaction</h3>
            <p className="text-gray-600">of users would recommend CVChef to a friend or colleague</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;