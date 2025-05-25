"use node"; 

import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { Doc } from "./_generated/dataModel"; 

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const getChatCompletion = action({
  args: {
    messageHistory: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
        content: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // The system prompt is now more specific and restrictive.
    const systemPrompt = `You are CVChef's AI Assistant, an expert in resumes, job searching, and career skills. 
Your goal is to provide concise, actionable advice to help users build and improve their resumes and job applications. 
Focus ONLY on topics directly related to resumes (content, formatting, strategy), job descriptions, interview preparation, and relevant professional skills. 
If a user asks a question outside of these topics, politely decline to answer and steer the conversation back to resume or career-related subjects. 
For example, if asked about the weather or a recipe, you should say something like: "I can only help with resume and career-related questions. Do you have any questions about your resume or job search?"
Format your responses using Markdown for readability (e.g., use bullet points for lists, bold for emphasis).
If the user provides their resume context, tailor your advice to it.`;

    const messages = [
      { 
        role: "system" as const, 
        content: systemPrompt
      },
      ...args.messageHistory.filter(msg => msg.role !== "system"), // Filter out any previous system messages from history
    ];

    // Check if the last user message contains resume context (added by the frontend)
    // and prepend it to the user's actual query if so.
    const lastUserMessageIndex = messages.map(m => m.role).lastIndexOf("user");
    if (lastUserMessageIndex > -1) {
        const resumeContextSystemMessage = args.messageHistory.find(m => m.role === 'system' && m.content.startsWith("Current resume context:"));
        if (resumeContextSystemMessage) {
            messages[lastUserMessageIndex].content = `${resumeContextSystemMessage.content}\n\nUser query: ${messages[lastUserMessageIndex].content}`;
        }
    }


    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-nano", 
        messages: messages.map(m => ({role: m.role as "user" | "assistant" | "system", content: m.content })),
      });
      
      const assistantResponse = response.choices[0].message.content;
      if (!assistantResponse) {
        throw new Error("OpenAI returned an empty response.");
      }
      return assistantResponse;

    } catch (error) {
      console.error("Error getting chat completion from OpenAI:", error);
      if (error instanceof OpenAI.APIError) {
        throw new Error(`OpenAI API Error: ${error.status} ${error.message} ${JSON.stringify(error.error)}`);
      }
      throw new Error("Failed to get response from AI assistant.");
    }
  },
});

// Helper to stringify resume data for the AI prompt
const stringifyResume = (resume: Partial<Doc<"resumes">>) => {
  let resumeString = `Title: ${resume.title || "N/A"}\nSummary: ${resume.summary || "N/A"}\n`;
  if (resume.skills && resume.skills.length > 0) {
    resumeString += `Skills: ${resume.skills.join(", ")}\n`;
  }
  if (resume.experience && resume.experience.length > 0) {
    resumeString += "Experience:\n";
    resume.experience.forEach(exp => {
      resumeString += `- ${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate || "Present"})\n`;
      exp.responsibilities?.forEach(resp => {
        resumeString += `  - ${resp}\n`;
      });
    });
  }
  if (resume.education && resume.education.length > 0) {
    resumeString += "Education:\n";
    resume.education.forEach(edu => {
      resumeString += `- ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution} (Graduated: ${edu.graduationDate})\n`;
    });
  }
  if (resume.customSections && resume.customSections.length > 0) {
    resume.customSections.forEach(section => {
      resumeString += `${section.title} ${section.subtitle ? `(${section.subtitle})` : ''}:\n`;
      if (section.content) {
        resumeString += `${section.content}\n`;
      }
      section.subsections?.forEach(sub => {
        resumeString += `  - ${sub.subtitle ? `${sub.subtitle}: ` : ''}${sub.content}\n`;
      });
    });
  }
  return resumeString;
};

export const getResumeATSComparison = action({
  args: {
    resumeData: v.object({ 
      title: v.optional(v.string()),
      summary: v.optional(v.string()),
      personalInfo: v.optional(
        v.object({
          fullName: v.optional(v.string()),
          email: v.optional(v.string()),
          phoneNumber: v.optional(v.string()),
          linkedin: v.optional(v.string()),
          github: v.optional(v.string()),
          portfolio: v.optional(v.string()),
          address: v.optional(v.string()),
        }),
      ),
      experience: v.optional(
        v.array(
          v.object({
            id: v.string(),
            jobTitle: v.optional(v.string()),
            company: v.optional(v.string()),
            location: v.optional(v.string()),
            startDate: v.optional(v.string()),
            endDate: v.optional(v.string()),
            responsibilities: v.optional(v.array(v.string())),
          }),
        ),
      ),
      education: v.optional(
        v.array(
          v.object({
            id: v.string(),
            institution: v.optional(v.string()),
            degree: v.optional(v.string()),
            fieldOfStudy: v.optional(v.string()),
            graduationDate: v.optional(v.string()),
            gpa: v.optional(v.string()),
          }),
        ),
      ),
      skills: v.optional(v.array(v.string())),
      customSections: v.optional(
        v.array(
          v.object({
            id: v.string(),
            title: v.string(),
            subtitle: v.optional(v.string()),
            content: v.optional(v.string()),
            subsections: v.optional(v.array(
              v.object({
                id: v.string(),
                subtitle: v.optional(v.string()),
                content: v.string(),
              })
            ))
          }),
        ),
      ),
    }),
    jobDescription: v.string(),
  },
  handler: async (ctx, args) => {
    const resumeText = stringifyResume(args.resumeData);
    const jobDescText = args.jobDescription;

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) and resume analyzer.
Your task is to compare the provided resume against the job description and give detailed feedback.
Output your response as a JSON object with the following structure:
{
  "overallScore": number, // A score from 0 to 100 representing the match.
  "summary": string, // A brief summary of the match and key recommendations.
  "keywordAnalysis": {
    "jdKeywords": string[], // Keywords extracted from the job description.
    "resumeKeywords": string[], // Keywords found in the resume.
    "matchedKeywords": string[], // Keywords present in both.
    "missingKeywords": string[] // Keywords from JD not found in resume.
  },
  "strengths": string[], // Specific strengths of the resume in relation to the JD.
  "areasForImprovement": string[], // Specific areas where the resume can be improved to better match the JD.
  "detailedSuggestions": [ // Array of objects with specific suggestions
    {
      "section": string, // e.g., "Summary", "Experience: [Job Title]", "Skills", "Custom Section: [Title]"
      "suggestion": string, // Specific advice for this section
      "originalText": string, // Optional: original text from resume
      "suggestedText": string // Optional: AI suggested improved text
    }
  ]
}
Be thorough and provide actionable advice. Focus on quantifiable metrics where possible for the score.
The score should reflect keyword matching, relevance of experience and skills, and overall alignment.
If the resume or job description is too short or lacks detail for a full analysis, reflect this in the summary and score.
`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescText}` }
        ],
        response_format: { type: "json_object" }, 
      });

      const rawResponse = response.choices[0].message.content;
      if (!rawResponse) {
        throw new Error("OpenAI returned an empty response for ATS comparison.");
      }

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(rawResponse);
      } catch (parseError) {
        console.error("Failed to parse JSON response from OpenAI:", rawResponse, parseError);
        throw new Error("AI returned an invalid format. Please try again.");
      }
      
      return parsedResponse;

    } catch (error) {
      console.error("Error getting ATS comparison from OpenAI:", error);
      if (error instanceof OpenAI.APIError) {
        throw new Error(`OpenAI API Error for ATS: ${error.status} ${error.message} ${JSON.stringify(error.error)}`);
      }
      throw new Error("Failed to get ATS comparison from AI assistant.");
    }
  },
});
