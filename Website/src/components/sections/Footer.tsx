import React from 'react';
import { FileText, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-6">
              <FileText className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">CVChef</span>
            </div>
            <p className="text-gray-400 mb-6">
              AI-powered resume builder helping professionals land their dream jobs with optimized, ATS-friendly resumes.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/SparkScratch-P" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/prodyumna-pal/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="https://sparkscratch-p.github.io/" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="https://sparkscratch-p.github.io/" className="text-gray-400 hover:text-white transition-colors">Developer</a></li>
              <li><a href="https://github.com/SparkScratch-P/CVchef" className="text-gray-400 hover:text-white transition-colors">Source</a></li>
              <li><a href="https://github.com/SparkScratch-P" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resume Templates</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cover Letter Examples</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Career Advice</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Interview Tips</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Job Search Guide</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li>
                <a href="mailto:support@cvchef.com" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  support@cvchef.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CVChef. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="https://github.com/SparkScratch-P/CVchef/blob/main/LICENSE" className="text-gray-500 hover:text-gray-400 text-sm">License</a>
            <a href="https://github.com/SparkScratch-P/CVchef/blob/main/README.md" className="text-gray-500 hover:text-gray-400 text-sm">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;