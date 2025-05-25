import React from "react";
import { AlertCircle, CheckCircle2, TrendingUp, Zap, Lightbulb } from "lucide-react";
import * as Diff from 'diff';

// Define the structure of the ATS feedback based on the AI action's return type
export interface ATSFeedback {
  overallScore: number;
  summary: string;
  keywordAnalysis: {
    jdKeywords: string[];
    resumeKeywords: string[];
    matchedKeywords: string[];
    missingKeywords: string[];
  };
  strengths: string[];
  areasForImprovement: string[];
  detailedSuggestions: Array<{
    section: string;
    suggestion: string;
    originalText?: string;
    suggestedText?: string;
  }>;
}

interface ATSFeedbackDisplayProps {
  feedback: ATSFeedback | null;
  isLoading: boolean;
}

const renderDiff = (original?: string, suggested?: string) => {
  if (!original || !suggested) return suggested || original || "";
  const diffResult = Diff.diffChars(original, suggested);
  return diffResult.map((part, index) => (
    <span
      key={index}
      className={
        part.added ? "bg-green-100 text-green-700" : part.removed ? "bg-red-100 text-red-700 line-through" : ""
      }
    >
      {part.value}
    </span>
  ));
};


export default function ATSFeedbackDisplay({ feedback, isLoading }: ATSFeedbackDisplayProps) {
  if (isLoading) {
    return (
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center min-h-[200px]">
        <Zap size={48} className="text-primary animate-pulse mb-4" />
        <p className="text-lg text-gray-600">Analyzing your resume against the job description...</p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full animate-pulse" style={{ width: "75%" }}></div>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-inner text-center">
        <Lightbulb size={32} className="text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Enter a job description and click "Analyze" to get ATS feedback.</p>
      </div>
    );
  }

  const scoreColor = feedback.overallScore >= 75 ? "text-green-500" : feedback.overallScore >= 50 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="mt-6 p-4 md:p-6 bg-white rounded-lg shadow-xl border border-gray-200">
      <h3 className="text-2xl font-bold text-primary mb-4 flex items-center">
        <TrendingUp size={28} className="mr-2" /> ATS Analysis Report
      </h3>

      <div className="mb-6 p-4 bg-primary-light rounded-md">
        <p className={`text-3xl font-bold text-center ${scoreColor}`}>
          Overall Match Score: <span className={`font-extrabold ${scoreColor}`}>{feedback.overallScore}/100</span>
        </p>
        <p className="mt-2 text-center text-secondary-dark">{feedback.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Strengths */}
        <div className="p-4 bg-green-50 rounded-md border border-green-200">
          <h4 className="text-lg font-semibold text-green-700 mb-2 flex items-center">
            <CheckCircle2 size={20} className="mr-2" /> Strengths
          </h4>
          {feedback.strengths.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-sm text-green-600">
              {feedback.strengths.map((strength, i) => <li key={i}>{strength}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No specific strengths highlighted for this comparison.</p>
          )}
        </div>

        {/* Areas for Improvement */}
        <div className="p-4 bg-red-50 rounded-md border border-red-200">
          <h4 className="text-lg font-semibold text-red-700 mb-2 flex items-center">
            <AlertCircle size={20} className="mr-2" /> Areas for Improvement
          </h4>
          {feedback.areasForImprovement.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
              {feedback.areasForImprovement.map((area, i) => <li key={i}>{area}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No specific areas for improvement highlighted.</p>
          )}
        </div>
      </div>
      
      {/* Keyword Analysis */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-700 mb-3">Keyword Analysis</h4>
        <div className="mb-2">
          <p className="text-sm font-medium text-gray-600">Job Description Keywords ({feedback.keywordAnalysis.jdKeywords.length}):</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {feedback.keywordAnalysis.jdKeywords.map(kw => <span key={kw} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{kw}</span>)}
          </div>
        </div>
        <div className="mb-2">
          <p className="text-sm font-medium text-green-600">Matched Keywords ({feedback.keywordAnalysis.matchedKeywords.length}):</p>
           <div className="flex flex-wrap gap-1 mt-1">
            {feedback.keywordAnalysis.matchedKeywords.map(kw => <span key={kw} className="text-xs bg-green-200 text-green-700 px-2 py-0.5 rounded-full">{kw}</span>)}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-red-600">Missing Keywords ({feedback.keywordAnalysis.missingKeywords.length}):</p>
           <div className="flex flex-wrap gap-1 mt-1">
            {feedback.keywordAnalysis.missingKeywords.map(kw => <span key={kw} className="text-xs bg-red-200 text-red-700 px-2 py-0.5 rounded-full">{kw}</span>)}
          </div>
        </div>
      </div>

      {/* Detailed Suggestions */}
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-3">Detailed Suggestions</h4>
        {feedback.detailedSuggestions.length > 0 ? (
          <div className="space-y-4">
            {feedback.detailedSuggestions.map((item, i) => (
              <div key={i} className="p-3 bg-blue-50 rounded-md border border-blue-200">
                <p className="font-semibold text-blue-700 text-md">{item.section}</p>
                <p className="text-sm text-blue-600 mt-1 mb-2">{item.suggestion}</p>
                {item.originalText && item.suggestedText && (
                  <div className="text-xs bg-white p-2 rounded border border-gray-300">
                    <p><strong>Original:</strong> {item.originalText}</p>
                    <p><strong>Suggested:</strong> {renderDiff(item.originalText, item.suggestedText)}</p>
                  </div>
                )}
                 {item.suggestedText && !item.originalText && (
                   <div className="text-xs bg-white p-2 rounded border border-gray-300">
                    <p><strong>Suggestion:</strong> {item.suggestedText}</p>
                  </div>
                 )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No specific detailed suggestions provided.</p>
        )}
      </div>
    </div>
  );
}
