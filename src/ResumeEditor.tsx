import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react"; 
import { api } from "../convex/_generated/api";
import { Id, Doc } from "../convex/_generated/dataModel";
import { toast } from "sonner";
import Chatbot from "./Chatbot"; 
import { MessageSquareText, FileText, Zap, Loader2, PlusCircle, Trash2 } from "lucide-react";
import ATSFeedbackDisplay, { ATSFeedback } from "./ATSFeedbackDisplay"; 

interface ResumeEditorProps {
  resumeId: Id<"resumes">;
  onClose: () => void;
}

type ExperienceItem = NonNullable<Doc<"resumes">["experience"]>[number];
type EducationItem = NonNullable<Doc<"resumes">["education"]>[number];
type CustomSectionItem = NonNullable<Doc<"resumes">["customSections"]>[number];
type CustomSubSectionItem = NonNullable<CustomSectionItem["subsections"]>[number];


type ResumeData = Omit<Partial<Doc<"resumes">>, "experience" | "education" | "customSections"> & {
  experience?: Partial<ExperienceItem>[]; 
  education?: Partial<EducationItem>[];
  customSections?: Partial<CustomSectionItem>[];
};


const initialPersonalInfo = {
  fullName: "",
  email: "",
  phoneNumber: "",
  linkedin: "",
  github: "",
  portfolio: "",
  address: "",
};

const initialExperience: ExperienceItem = {
  id: Date.now().toString(),
  jobTitle: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  responsibilities: [""],
};

const initialEducation: EducationItem = {
  id: Date.now().toString(),
  institution: "",
  degree: "",
  fieldOfStudy: "",
  graduationDate: "",
  gpa: "",
};

const initialCustomSubSection: CustomSubSectionItem = {
  id: Date.now().toString(),
  subtitle: "",
  content: "",
};

const initialCustomSection: CustomSectionItem = {
  id: Date.now().toString(),
  title: "Custom Section",
  subtitle: "",
  content: "",
  subsections: [],
};


export default function ResumeEditor({ resumeId, onClose }: ResumeEditorProps) {
  const resume = useQuery(api.resumes.getResume, { resumeId });
  const updateResume = useMutation(api.resumes.updateResume);
  const getATSComparison = useAction(api.ai.getResumeATSComparison); 

  const [formData, setFormData] = useState<ResumeData>({});
  const [isLoadingData, setIsLoadingData] = useState(true); 
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const [jobDescription, setJobDescription] = useState(""); 
  const [atsFeedback, setATSFeedback] = useState<ATSFeedback | null>(null); 
  const [isAnalyzingATS, setIsAnalyzingATS] = useState(false); 
  const [resumeContextString, setResumeContextString] = useState("");


  useEffect(() => {
    if (resume) {
      const currentFormData = {
        title: resume.title || "",
        summary: resume.summary || "",
        personalInfo: resume.personalInfo || { ...initialPersonalInfo },
        experience: resume.experience?.map(exp => ({...exp})) || [],
        education: resume.education?.map(edu => ({...edu})) || [],
        skills: resume.skills || [],
        customSections: resume.customSections?.map(cs => ({
          ...cs, 
          subsections: cs.subsections?.map(sub => ({...sub})) || [] 
        })) || [],
      };
      setFormData(currentFormData);
      updateResumeContextString(currentFormData);
      setIsLoadingData(false);
    } else if (resume === null) { 
      toast.error("Could not load resume data.");
      onClose();
    }
  }, [resume, onClose]);

  const updateResumeContextString = (currentData: ResumeData) => {
    const contextStr = `
      Title: ${currentData.title}
      Summary: ${currentData.summary}
      Skills: ${currentData.skills?.join(", ")}
      Experience: ${currentData.experience?.map(e => `${e.jobTitle} at ${e.company}`).join("; ")}
      Education: ${currentData.education?.map(e => `${e.degree} from ${e.institution}`).join("; ")}
      Custom Sections: ${currentData.customSections?.map(cs => `${cs.title}${cs.subtitle ? ` (${cs.subtitle})` : ''}: ${cs.content || cs.subsections?.map(s => `${s.subtitle ? s.subtitle+': ' : ''}${s.content}`).join(', ')}`).join("; ")}
    `.replace(/\s+/g, ' ').trim();
    setResumeContextString(contextStr);
  };


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    sectionKey?: keyof ResumeData | "customSubSection", 
    index?: number,
    field?: string,
    subIndex?: number, 
    customSectionIndex?: number, 
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev)) as ResumeData; 

      if (sectionKey === "customSubSection" && customSectionIndex !== undefined && index !== undefined && field) {
        const customSection = newState.customSections?.[customSectionIndex];
        if (customSection && customSection.subsections && customSection.subsections[index]) {
          (customSection.subsections[index] as Record<string, any>)[field] = value;
        }
      } else if (sectionKey && index !== undefined && field && sectionKey !== "customSubSection") { 
        const sectionArray = newState[sectionKey] as Array<any> | undefined;
        if (sectionArray && sectionArray[index]) {
          if (subIndex !== undefined && field === "responsibilities" && Array.isArray(sectionArray[index][field])) {
            const responsibilitiesArray = [...sectionArray[index][field]];
            responsibilitiesArray[subIndex] = value;
            sectionArray[index][field] = responsibilitiesArray;
          } else {
            sectionArray[index][field] = value;
          }
        }
      } else if (sectionKey && field && sectionKey !== "customSubSection") { 
        const sectionObject = newState[sectionKey] as Record<string, any> | undefined;
        if (sectionObject) {
          sectionObject[field] = value;
        } else { 
          (newState[sectionKey] as Record<string, any>) = { [field]: value };
        }
      } else { 
        (newState as Record<string, any>)[name] = value;
      }
      updateResumeContextString(newState);
      return newState;
    });
  };
  
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsArray = e.target.value.split(",").map(skill => skill.trim());
    setFormData(prev => {
      const newState = { ...prev, skills: skillsArray };
      updateResumeContextString(newState);
      return newState;
    });
  };


  const addItem = (section: "experience" | "education" | "customSections" | "skills") => {
    setFormData((prev) => {
      const newState = { ...prev };
      let newItem;
      if (section === "experience") newItem = { ...initialExperience, id: Date.now().toString() };
      else if (section === "education") newItem = { ...initialEducation, id: Date.now().toString() };
      else if (section === "customSections") newItem = { ...initialCustomSection, id: Date.now().toString(), subsections: [] };
      else if (section === "skills") { 
        newState.skills = [...(newState.skills || []), "New Skill"];
        updateResumeContextString(newState);
        return newState;
      } else return prev;

      const currentSection = newState[section] as Array<any> | undefined;
      newState[section] = [...(currentSection || []), newItem];
      updateResumeContextString(newState);
      return newState;
    });
  };

  const removeItem = (section: "experience" | "education" | "customSections" | "skills", index: number) => {
    setFormData((prev) => {
      const newState = { ...prev };
      const currentSection = newState[section] as Array<any> | undefined;
      if (currentSection) {
        newState[section] = currentSection.filter((_, i) => i !== index);
      }
      updateResumeContextString(newState);
      return newState;
    });
  };

  const addResponsibility = (expIndex: number) => {
    setFormData(prev => {
      const newExperience = prev.experience ? [...prev.experience] : [];
      if (newExperience[expIndex]) {
        newExperience[expIndex] = {
          ...newExperience[expIndex],
          responsibilities: [...(newExperience[expIndex].responsibilities || []), ""],
          id: newExperience[expIndex].id || Date.now().toString(), 
        };
      }
      const newState = { ...prev, experience: newExperience };
      updateResumeContextString(newState);
      return newState;
    });
  };

  const removeResponsibility = (expIndex: number, respIndex: number) => {
    setFormData(prev => {
      const newExperience = prev.experience ? [...prev.experience] : [];
      if (newExperience[expIndex] && newExperience[expIndex].responsibilities) {
        newExperience[expIndex].responsibilities = newExperience[expIndex].responsibilities!.filter((_, i) => i !== respIndex);
      }
      const newState = { ...prev, experience: newExperience };
      updateResumeContextString(newState);
      return newState;
    });
  };

  const addCustomSubSection = (customSectionIndex: number) => {
    setFormData(prev => {
      const newCustomSections = prev.customSections ? [...prev.customSections] : [];
      if (newCustomSections[customSectionIndex]) {
        newCustomSections[customSectionIndex] = {
          ...newCustomSections[customSectionIndex],
          subsections: [...(newCustomSections[customSectionIndex].subsections || []), { ...initialCustomSubSection, id: Date.now().toString() }],
          id: newCustomSections[customSectionIndex].id || Date.now().toString(),
        };
      }
      const newState = { ...prev, customSections: newCustomSections };
      updateResumeContextString(newState);
      return newState;
    });
  };

  const removeCustomSubSection = (customSectionIndex: number, subSectionIndex: number) => {
    setFormData(prev => {
      const newCustomSections = prev.customSections ? [...prev.customSections] : [];
      if (newCustomSections[customSectionIndex] && newCustomSections[customSectionIndex].subsections) {
        newCustomSections[customSectionIndex].subsections = newCustomSections[customSectionIndex].subsections!.filter((_, i) => i !== subSectionIndex);
      }
      const newState = { ...prev, customSections: newCustomSections };
      updateResumeContextString(newState);
      return newState;
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeId) return;
    
    const finalExperience: ExperienceItem[] = (formData.experience || []).map(exp => ({
      ...initialExperience, 
      ...exp,
      id: exp.id || Date.now().toString(), 
      responsibilities: exp.responsibilities?.filter(r => r.trim() !== "") || [],
    }));

    const finalEducation: EducationItem[] = (formData.education || []).map(edu => ({
      ...initialEducation, 
      ...edu,
      id: edu.id || Date.now().toString(), 
    }));

    const finalCustomSections: CustomSectionItem[] = (formData.customSections || []).map(section => ({
      ...initialCustomSection, 
      ...section,
      id: section.id || Date.now().toString(), 
      title: section.title || "Custom Section", 
      subtitle: section.subtitle || "",
      content: section.content || "",
      subsections: (section.subsections || []).map(sub => ({
        ...initialCustomSubSection,
        ...sub,
        id: sub.id || Date.now().toString(),
        subtitle: sub.subtitle || "",
        content: sub.content || "",
      })).filter(sub => sub.content.trim() !== "" || sub.subtitle?.trim() !== ""),
    }));
    
    const finalSkills: string[] = formData.skills?.filter(skill => skill.trim() !== "") || [];
    
    const payload: Parameters<typeof updateResume>[0] = {
        resumeId,
        title: formData.title || "", 
        personalInfo: formData.personalInfo || initialPersonalInfo,
        experience: finalExperience,
        education: finalEducation,
        skills: finalSkills,
        summary: formData.summary || "",
        customSections: finalCustomSections,
    };

    try {
      await updateResume(payload);
      toast.success(`Resume "${resume?.title || "Resume"}" updated successfully!`);
    } catch (error) {
      console.error("Failed to update resume:", error);
      toast.error("Failed to update resume. Please try again.");
    }
  };

  const handleATSAnalysis = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description to analyze.");
      return;
    }
    setIsAnalyzingATS(true);
    setATSFeedback(null);

    const experiencesForATS = (formData.experience || []).map(exp => ({
        ...initialExperience, 
        ...exp, 
        id: exp.id || Date.now().toString(), 
        responsibilities: exp.responsibilities?.filter(r => r.trim() !== "") || [],
    }));

    const educationForATS = (formData.education || []).map(edu => ({
        ...initialEducation,
        ...edu,
        id: edu.id || Date.now().toString(),
    }));

    const customSectionsForATS = (formData.customSections || []).map(cs => ({
        ...initialCustomSection,
        ...cs,
        id: cs.id || Date.now().toString(),
        title: cs.title || "Custom Section", 
        subtitle: cs.subtitle || "",
        content: cs.content || "", 
        subsections: (cs.subsections || []).map(sub => ({
          ...initialCustomSubSection,
          ...sub,
          id: sub.id || Date.now().toString(),
          subtitle: sub.subtitle || "",
          content: sub.content || "",
        })),
    }));


    try {
      const feedback = await getATSComparison({ 
        resumeData: { 
            title: formData.title || "",
            summary: formData.summary || "",
            personalInfo: formData.personalInfo || initialPersonalInfo,
            experience: experiencesForATS,
            education: educationForATS,
            skills: formData.skills?.filter(s => s.trim() !== "") || [],
            customSections: customSectionsForATS,
        }, 
        jobDescription 
      });
      setATSFeedback(feedback as ATSFeedback); 
      toast.success("ATS analysis complete!");
    } catch (error: any) {
      console.error("ATS Analysis failed:", error);
      toast.error(error.message || "Failed to get ATS analysis. Please try again.");
      setATSFeedback(null);
    } finally {
      setIsAnalyzingATS(false);
    }
  };


  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="ml-4 text-lg">Loading resume data...</p>
      </div>
    );
  }
  
  if (!resume) {
    return <p className="text-red-500 text-center">Could not load resume. It might have been deleted or you may not have access.</p>;
  }


  return (
    <div className="p-4 md:p-8 bg-white rounded-lg shadow-xl relative">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold text-primary flex items-center">
          <FileText size={28} className="mr-2" /> Editing: {formData.title || "Untitled Resume"}
        </h2>
        <div className="flex items-center gap-3">
            <button
                onClick={() => setIsChatOpen(true)}
                className="p-2 text-primary hover:bg-primary-light rounded-full transition-colors"
                title="Open AI Assistant"
            >
                <MessageSquareText size={24} />
            </button>
            <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
            Close Editor
            </button>
        </div>
      </div>

      {/* ATS Analysis Section */}
      <div className="my-8 p-6 bg-slate-50 rounded-lg shadow-md border border-slate-200">
        <h3 className="text-xl font-semibold text-primary mb-3">ATS & Job Description Analysis</h3>
        <p className="text-sm text-gray-600 mb-4">
          Paste a job description below to analyze how well your current resume matches, and get AI-powered suggestions for improvement.
        </p>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          rows={8}
          className="w-full p-3 rounded-md border border-gray-300 focus:ring-primary focus:border-primary shadow-sm mb-4"
          disabled={isAnalyzingATS}
        />
        <button
          onClick={handleATSAnalysis}
          disabled={isAnalyzingATS || !jobDescription.trim()}
          className="w-full px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-md transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isAnalyzingATS ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" /> Analyzing...
            </>
          ) : (
            <>
              <Zap size={20} className="mr-2" /> Analyze with AI
            </>
          )}
        </button>
        <ATSFeedbackDisplay feedback={atsFeedback} isLoading={isAnalyzingATS} />
      </div>


      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Resume Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Resume Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary shadow-sm"
          />
        </div>

        {/* Summary Section */}
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">Summary / Objective</label>
          <textarea
            name="summary"
            id="summary"
            rows={4}
            value={formData.summary || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary shadow-sm"
            placeholder="A brief professional summary or career objective."
          />
        </div>
        
        {/* Personal Info Section */}
        <div className="space-y-4 p-4 border rounded-md">
          <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
          {Object.keys(initialPersonalInfo).map((key) => (
            <div key={key}>
              <label htmlFor={`personalInfo-${key}`} className="block text-sm font-medium text-gray-700 capitalize mb-1">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                name={`personalInfo-${key}`} 
                id={`personalInfo-${key}`}
                value={(formData.personalInfo as Record<string, any>)?.[key] || ""}
                onChange={(e) => handleInputChange(e, "personalInfo", undefined, key)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary shadow-sm"
              />
            </div>
          ))}
        </div>

        {/* Experience Section */}
        <div className="space-y-4 p-4 border rounded-md">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
            <button type="button" onClick={() => addItem("experience")} className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 flex items-center"><PlusCircle size={16} className="mr-1"/>Add Experience</button>
          </div>
          {formData.experience?.map((exp, index) => (
            <div key={exp.id || index} className="p-3 border rounded-md space-y-3 bg-gray-50">
              {Object.keys(initialExperience).filter(k => k !== 'id' && k !== 'responsibilities').map(key => (
                <div key={key}>
                  <label htmlFor={`exp-${index}-${key}`} className="block text-sm font-medium text-gray-700 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                  <input
                    type={key.includes("Date") ? "date" : "text"}
                    id={`exp-${index}-${key}`}
                    value={(exp as Record<string, any>)[key] || ""}
                    onChange={(e) => handleInputChange(e, "experience", index, key)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary shadow-sm"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                {exp.responsibilities?.map((resp, rIndex) => (
                  <div key={rIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={resp}
                      onChange={(e) => handleInputChange(e, "experience", index, "responsibilities", rIndex)}
                      className="flex-grow px-3 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary shadow-sm"
                      placeholder="Responsibility or achievement"
                    />
                    <button type="button" onClick={() => removeResponsibility(index, rIndex)} className="p-1 text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                  </div>
                ))}
                <button type="button" onClick={() => addResponsibility(index)} className="mt-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"><PlusCircle size={16} className="mr-1"/>Add Responsibility</button>
              </div>
              <button type="button" onClick={() => removeItem("experience", index)} className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 flex items-center"><Trash2 size={16} className="mr-1"/>Remove Experience</button>
            </div>
          ))}
        </div>

        {/* Education Section */}
         <div className="space-y-4 p-4 border rounded-md">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Education</h3>
            <button type="button" onClick={() => addItem("education")} className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 flex items-center"><PlusCircle size={16} className="mr-1"/>Add Education</button>
          </div>
          {formData.education?.map((edu, index) => (
            <div key={edu.id || index} className="p-3 border rounded-md space-y-3 bg-gray-50">
              {Object.keys(initialEducation).filter(k => k !== 'id').map(key => (
                <div key={key}>
                  <label htmlFor={`edu-${index}-${key}`} className="block text-sm font-medium text-gray-700 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                  <input
                    type={key.includes("Date") ? "date" : "text"}
                    id={`edu-${index}-${key}`}
                    value={(edu as Record<string, any>)[key] || ""}
                    onChange={(e) => handleInputChange(e, "education", index, key)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary shadow-sm"
                  />
                </div>
              ))}
              <button type="button" onClick={() => removeItem("education", index)} className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 flex items-center"><Trash2 size={16} className="mr-1"/>Remove Education</button>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div className="p-4 border rounded-md">
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
          <input
            type="text"
            name="skills"
            id="skills"
            value={formData.skills?.join(", ") || ""}
            onChange={handleSkillsChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary shadow-sm"
            placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
          />
           <small className="text-xs text-gray-500">Separate skills with a comma.</small>
        </div>

        {/* Custom Sections */}
        <div className="space-y-4 p-4 border rounded-md">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Custom Sections</h3>
            <button type="button" onClick={() => addItem("customSections")} className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 flex items-center"><PlusCircle size={16} className="mr-1"/>Add Custom Section</button>
          </div>
          {formData.customSections?.map((section, index) => (
            <div key={section.id || index} className="p-3 border rounded-md space-y-3 bg-gray-50">
              <div>
                <label htmlFor={`custom-${index}-title`} className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                <input
                  type="text"
                  id={`custom-${index}-title`}
                  value={section.title || ""}
                  onChange={(e) => handleInputChange(e, "customSections", index, "title")}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary shadow-sm"
                />
              </div>
              <div>
                <label htmlFor={`custom-${index}-subtitle`} className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle (Optional)</label>
                <input
                  type="text"
                  id={`custom-${index}-subtitle`}
                  value={section.subtitle || ""}
                  onChange={(e) => handleInputChange(e, "customSections", index, "subtitle")}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary shadow-sm"
                />
              </div>
              <div>
                <label htmlFor={`custom-${index}-content`} className="block text-sm font-medium text-gray-700 mb-1">Main Content (Optional if using subsections)</label>
                <textarea
                  id={`custom-${index}-content`}
                  rows={3}
                  value={section.content || ""}
                  onChange={(e) => handleInputChange(e, "customSections", index, "content")}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary shadow-sm"
                />
              </div>

              {/* Subsections */}
              <div className="pl-4 mt-3 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-semibold text-gray-700">Subsections</h4>
                  <button type="button" onClick={() => addCustomSubSection(index)} className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"><PlusCircle size={14} className="mr-1"/>Add Subsection</button>
                </div>
                {section.subsections?.map((sub, subIndex) => (
                  <div key={sub.id || subIndex} className="p-2 border rounded-md bg-white space-y-2">
                    <div>
                      <label htmlFor={`custom-${index}-sub-${subIndex}-subtitle`} className="block text-xs font-medium text-gray-600 mb-0.5">Subsection Subtitle (Optional)</label>
                      <input
                        type="text"
                        id={`custom-${index}-sub-${subIndex}-subtitle`}
                        value={sub.subtitle || ""}
                        onChange={(e) => handleInputChange(e, "customSubSection", subIndex, "subtitle", undefined, index)}
                        className="w-full px-2 py-1 text-sm rounded-md border border-gray-300 focus:ring-primary focus:border-primary shadow-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor={`custom-${index}-sub-${subIndex}-content`} className="block text-xs font-medium text-gray-600 mb-0.5">Subsection Content</label>
                      <textarea
                        id={`custom-${index}-sub-${subIndex}-content`}
                        rows={2}
                        value={sub.content || ""}
                        onChange={(e) => handleInputChange(e, "customSubSection", subIndex, "content", undefined, index)}
                        className="w-full px-2 py-1 text-sm rounded-md border border-gray-300 focus:ring-primary focus:border-primary shadow-sm"
                      />
                    </div>
                    <button type="button" onClick={() => removeCustomSubSection(index, subIndex)} className="mt-1 p-1 text-xs text-red-500 hover:text-red-700"><Trash2 size={14}/> Remove Subsection</button>
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => removeItem("customSections", index)} className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 flex items-center"><Trash2 size={16} className="mr-1"/>Remove Section</button>
            </div>
          ))}
        </div>


        <div className="flex justify-end pt-6 border-t">
          <button
            type="button"
            onClick={onClose}
            className="mr-3 px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-md transition-colors shadow-sm"
          >
            Save Resume
          </button>
        </div>
      </form>
      <Chatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        resumeContext={resumeContextString} 
      />
    </div>
  );
}
