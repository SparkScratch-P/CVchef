import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export const createResume = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const resumeId = await ctx.db.insert("resumes", {
      userId,
      title: args.title,
      personalInfo: {},
      experience: [],
      education: [],
      skills: [],
      summary: "",
      customSections: [],
    });
    return resumeId;
  },
});

export const getResumes = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("resumes")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getResume = query({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const resume = await ctx.db.get(args.resumeId);
    if (!resume) {
      throw new Error("Resume not found");
    }
    if (resume.userId !== userId) {
      throw new Error("User not authorized to view this resume");
    }
    return resume;
  },
});

export const updateResume = mutation({
  args: {
    resumeId: v.id("resumes"),
    title: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const { resumeId, ...updates } = args;
    const existingResume = await ctx.db.get(resumeId);
    if (!existingResume) {
      throw new Error("Resume not found");
    }
    if (existingResume.userId !== userId) {
      throw new Error("User not authorized to update this resume");
    }
    await ctx.db.patch(resumeId, updates);
    return resumeId;
  },
});

export const deleteResume = mutation({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const existingResume = await ctx.db.get(args.resumeId);
    if (!existingResume) {
      throw new Error("Resume not found");
    }
    if (existingResume.userId !== userId) {
      throw new Error("User not authorized to delete this resume");
    }
    await ctx.db.delete(args.resumeId);
    return args.resumeId;
  },
});
