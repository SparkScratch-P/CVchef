import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import ResumeEditor from "./ResumeEditor";
import ResumeCard from "./ResumeCard";
import { toast } from "sonner";

export default function ResumeDashboard() {
  const resumes = useQuery(api.resumes.getResumes) || [];
  const createResume = useMutation(api.resumes.createResume);
  const deleteResume = useMutation(api.resumes.deleteResume);

  const [editingResumeId, setEditingResumeId] = useState<Id<"resumes"> | null>(
    null,
  );
  const [newResumeTitle, setNewResumeTitle] = useState("");

  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResumeTitle.trim()) {
      toast.error("Please enter a title for your new resume.");
      return;
    }
    try {
      const resumeId = await createResume({ title: newResumeTitle });
      setNewResumeTitle("");
      setEditingResumeId(resumeId);
      toast.success(`Resume "${newResumeTitle}" created!`);
    } catch (error) {
      console.error("Failed to create resume:", error);
      toast.error("Failed to create resume. Please try again.");
    }
  };

  const handleDeleteResume = async (resumeId: Id<"resumes">, resumeTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${resumeTitle}"?`)) {
      try {
        await deleteResume({ resumeId });
        toast.success(`Resume "${resumeTitle}" deleted.`);
        if (editingResumeId === resumeId) {
          setEditingResumeId(null);
        }
      } catch (error) {
        console.error("Failed to delete resume:", error);
        toast.error("Failed to delete resume. Please try again.");
      }
    }
  };

  if (editingResumeId) {
    return (
      <ResumeEditor
        resumeId={editingResumeId}
        onClose={() => setEditingResumeId(null)}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">Your Resumes</h1>
        <p className="text-secondary">Manage your professional profiles.</p>
      </div>

      <form
        onSubmit={handleCreateResume}
        className="mb-8 p-6 bg-white rounded-lg shadow-md flex flex-col sm:flex-row gap-4 items-center"
      >
        <input
          type="text"
          value={newResumeTitle}
          onChange={(e) => setNewResumeTitle(e.target.value)}
          placeholder="New Resume Title (e.g., Software Engineer Resume)"
          className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:ring-primary focus:border-primary outline-none transition-shadow shadow-sm hover:shadow-md"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 rounded-md bg-primary text-white font-semibold hover:bg-primary-hover transition-colors shadow-md hover:shadow-lg disabled:opacity-50"
          disabled={!newResumeTitle.trim()}
        >
          Create New Resume
        </button>
      </form>

      {resumes.length === 0 && (
        <p className="text-center text-gray-500">
          You don't have any resumes yet. Create one to get started!
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <ResumeCard
            key={resume._id}
            resume={resume}
            onEdit={() => setEditingResumeId(resume._id)}
            onDelete={() => handleDeleteResume(resume._id, resume.title)}
          />
        ))}
      </div>
    </div>
  );
}
