import React, { useState } from 'react';
import { ChevronsRight, Zap } from 'lucide-react';
import Button from '../Button';

const Demo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');
  
  const beforeResume = {
    headline: "Marketing Professional with 5 years of experience",
    experience: [
      "Managed social media accounts for company",
      "Worked on various marketing campaigns",
      "Helped with content creation and SEO",
      "Coordinated with team members on projects"
    ]
  };
  
  const afterResume = {
    headline: "Strategic Digital Marketing Manager with 5+ years driving ROI",
    experience: [
      "Increased social media engagement by 78% across 6 platforms through data-driven content strategies",
      "Orchestrated 12 high-impact marketing campaigns resulting in $2.3M in new revenue",
      "Optimized content strategy achieving 65% increase in organic traffic and 42% improvement in conversion rates",
      "Led cross-functional team of 8 specialists, delivering 15 successful projects ahead of schedule"
    ]
  };
  
  return (
    <section id="demo" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See the CVChef Difference
          </h2>
          <p className="text-xl text-gray-600">
            Transform a basic resume into a powerful career tool that gets results. Our AI analyzes and enhances every section.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'before' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('before')}
            >
              Before
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'after' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('after')}
            >
              After
            </button>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="mb-6 flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {activeTab === 'before' ? 'John Smith' : 'John Smith'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {activeTab === 'before' ? beforeResume.headline : afterResume.headline}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium uppercase text-gray-500 mb-3">Experience</h4>
                    <div className="border-l-2 border-gray-300 pl-4 space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-900">
                          {activeTab === 'before' ? 'Marketing Specialist' : 'Digital Marketing Manager'}
                        </h5>
                        <p className="text-sm text-gray-600">XYZ Company • 2018 - Present</p>
                        <ul className="mt-2 space-y-2">
                          {(activeTab === 'before' ? beforeResume.experience : afterResume.experience).map((item, index) => (
                            <li key={index} className="text-gray-700 text-sm">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {activeTab === 'after' && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <Zap className="h-4 w-4" />
                        </div>
                        <span className="ml-2 text-sm text-blue-700">ATS Compatibility Score: 98%</span>
                      </div>
                      <span className="text-xs text-blue-600 font-medium">Excellent</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className={`h-full flex flex-col ${activeTab === 'after' ? '' : 'opacity-0'}`}>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 flex-1">
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                      <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                      AI Improvements Made
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <ChevronsRight className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Added quantifiable achievements and metrics</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronsRight className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Enhanced job title for better keyword matching</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronsRight className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Used action verbs that demonstrate leadership</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronsRight className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Optimized for industry-specific keywords</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronsRight className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Highlighted specific skills relevant to target jobs</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="primary" size="lg" className="w-full">
                      Transform Your Resume Now
                    </Button>
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

export default Demo;