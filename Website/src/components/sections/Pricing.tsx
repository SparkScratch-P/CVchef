import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
        {isOpen ? (
          <Minus className="h-5 w-5 text-blue-500 flex-shrink-0" />
        ) : (
          <Plus className="h-5 w-5 text-blue-500 flex-shrink-0" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-6' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

const Pricing: React.FC = () => {
  const faqs = [
    {
      question: "How does CVChef's AI enhance my resume?",
      answer: "Our AI analyzes your experience and skills, suggesting improvements in language, formatting, and content. It optimizes your resume for ATS systems and highlights your achievements with impactful metrics and keywords specific to your industry."
    },
    {
      question: "Is my data secure with CVChef?",
      answer: "Yes, we take data security seriously. All your information is encrypted and stored securely. We never share your personal data with third parties, and you have complete control over your information."
    },
    {
      question: "Can I create multiple versions of my resume?",
      answer: "Absolutely! You can create different versions of your resume tailored to specific job applications. Our AI helps you customize each version to match the requirements of different positions and companies."
    },
    {
      question: "How does the ATS optimization work?",
      answer: "Our AI scans job descriptions and optimizes your resume with relevant keywords and formatting that ATS systems look for. This increases your chances of getting past automated screening and into the hands of hiring managers."
    },
    {
      question: "Do I need technical knowledge to use CVChef?",
      answer: "Not at all! CVChef is designed to be user-friendly. Simply input your information, and our AI guides you through the process with suggestions and improvements. No technical expertise required."
    },
    {
      question: "Can I export my resume in different formats?",
      answer: "Yes, you can export your resume in multiple formats including PDF, Word, and plain text. All formats are optimized for both digital sharing and printing."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about creating your perfect resume with CVChef
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;