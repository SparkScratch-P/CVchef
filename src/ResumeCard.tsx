import React from "react";
import { Doc, Id } from "../convex/_generated/dataModel";
import { FileText, Edit3, Trash2, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactDOMServer from "react-dom/server";
import ResumePreviewForPDF from "./ResumePreviewForPDF"; // We'll create this next

interface ResumeCardProps {
  resume: Doc<"resumes">;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ResumeCard({ resume, onEdit, onDelete }: ResumeCardProps) {
  const handleDownloadPDF = async () => {
    const resumePreviewElement = document.createElement("div");
    // Hide the element from view while rendering
    resumePreviewElement.style.position = "absolute";
    resumePreviewElement.style.left = "-9999px";
    resumePreviewElement.style.width = "210mm"; // A4 width
    resumePreviewElement.style.fontFamily = "Arial, sans-serif"; // Ensure consistent font
    
    document.body.appendChild(resumePreviewElement);

    // Render the ResumePreviewForPDF component to an HTML string and set it
    const resumeHTML = ReactDOMServer.renderToString(
      <ResumePreviewForPDF resume={resume} />
    );
    resumePreviewElement.innerHTML = resumeHTML;
    
    // Allow images and styles to load
    await new Promise(resolve => setTimeout(resolve, 500));


    try {
        const canvas = await html2canvas(resumePreviewElement, {
            scale: 2, // Increase scale for better quality
            useCORS: true, // If you have external images
            logging: true,
            width: resumePreviewElement.offsetWidth,
            windowWidth: resumePreviewElement.scrollWidth,
            windowHeight: resumePreviewElement.scrollHeight,
        });
        
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        
        let imgHeight = pdfWidth / ratio;
        let imgWidth = pdfWidth;

        if (imgHeight > pdfHeight) {
            imgHeight = pdfHeight;
            imgWidth = imgHeight * ratio;
        }
        
        const x = (pdfWidth - imgWidth) / 2;
        const y = 0; // Start from top

        pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
        pdf.save(`${resume.title.replace(/\s+/g, '_') || "resume"}.pdf`);

    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF. Please try again.");
    } finally {
        document.body.removeChild(resumePreviewElement);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      <div className="p-6 flex-grow">
        <div className="flex items-center text-primary mb-3">
          <FileText size={24} className="mr-2" />
          <h3 className="text-xl font-semibold truncate" title={resume.title}>
            {resume.title}
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-1">
          Last Updated: {new Date(resume._creationTime).toLocaleDateString()}
        </p>
        {resume.summary && (
          <p className="text-sm text-gray-500 line-clamp-3 mt-2">
            {resume.summary}
          </p>
        )}
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end items-center space-x-2">
        <button
          onClick={handleDownloadPDF}
          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
          title="Download PDF"
        >
          <Download size={20} />
        </button>
        <button
          onClick={onEdit}
          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors"
          title="Edit Resume"
        >
          <Edit3 size={20} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
          title="Delete Resume"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
