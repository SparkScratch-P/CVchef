import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  resumes: defineTable({
    userId: v.id("users"),
    title: v.string(),
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
    summary: v.optional(v.string()),
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
  }).index("by_userId", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
