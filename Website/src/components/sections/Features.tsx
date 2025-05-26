import React from 'react';
import { Brain, FileCheck, PenTool, BarChart } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0 }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 group fade-up hover-lift"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Features to Land Your Dream Job
          </h2>
          <p className="text-xl text-gray-600">
            Our intelligent tools analyze your resume, optimize it for ATS systems, and suggest improvements to make your application stand out.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Brain className="h-6 w-6" />}
            title="AI Consultation"
            description="Get personalized recommendations and feedback on your resume from our advanced AI assistant."
            delay={0}
          />
          <FeatureCard 
            icon={<FileCheck className="h-6 w-6" />}
            title="ATS Optimization"
            description="Ensure your resume passes through Applicant Tracking Systems with our keyword analysis and formatting."
            delay={200}
          />
          <FeatureCard 
            icon={<PenTool className="h-6 w-6" />}
            title="Professional Templates"
            description="Choose from dozens of ATS-friendly templates designed by HR professionals and resume experts."
            delay={400}
          />
          <FeatureCard 
            icon={<BarChart className="h-6 w-6" />}
            title="Performance Analytics"
            description="Track how your resume performs and get insights on how to improve your application success rate."
            delay={600}
          />
        </div>
        
        <div className="mt-20 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 flex flex-col justify-center fade-in-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                How CVChef Transforms Your Resume
              </h3>
              <ul className="space-y-4">
                {[
                  "Analyzes your experience to highlight relevant achievements",
                  "Identifies and adds missing keywords for your target role",
                  "Rewrites bullet points to showcase quantifiable results",
                  "Optimizes formatting for better readability and ATS compatibility",
                  "Provides personalized suggestions based on industry standards"
                ].map((item, index) => (
                  <li key={index} className="flex items-start scale-up" style={{ transitionDelay: `${index * 100}ms` }}>
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 lg:p-12 text-white flex flex-col justify-center fade-in-right">
              <h3 className="text-2xl font-bold mb-6">
                Unlock Your Career Potential
              </h3>
              <div className="space-y-6">
                {[
                  { value: "3x", text: "More likely to get an interview with an optimized resume" },
                  { value: "40%", text: "Higher response rate from recruiters" },
                  { value: "2x", text: "Faster job search with professional guidance" }
                ].map((stat, index) => (
                  <div key={index} className="flex items-center scale-up hover-lift" style={{ transitionDelay: `${index * 200}ms` }}>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold">{stat.value}</span>
                    </div>
                    <p className="ml-4">{stat.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;