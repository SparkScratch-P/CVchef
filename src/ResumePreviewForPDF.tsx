import React from 'react';
import { Doc } from '../convex/_generated/dataModel';

interface ResumePreviewForPDFProps {
  resume: Doc<'resumes'>;
}

// Basic inline styles for PDF rendering. Tailwind classes won't work directly here.
const styles = {
  page: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '10pt',
    lineHeight: '1.4',
    color: '#333',
    padding: '15mm', // Standard A4 margins
    width: '210mm', // A4 width
    boxSizing: 'border-box' as 'border-box',
  },
  header: {
    textAlign: 'center' as 'center',
    marginBottom: '10mm',
  },
  fullName: {
    fontSize: '18pt',
    fontWeight: 'bold' as 'bold',
    color: '#2c3e50', // Dark Blue Grey
    marginBottom: '2mm',
  },
  contactInfo: {
    fontSize: '9pt',
    color: '#555',
    marginBottom: '8mm',
  },
  contactLink: {
    color: '#3498db', // Blue
    textDecoration: 'none',
  },
  section: {
    marginBottom: '8mm',
  },
  sectionTitle: {
    fontSize: '12pt',
    fontWeight: 'bold' as 'bold',
    color: '#2980b9', // Stronger Blue
    borderBottom: '1px solid #bdc3c7', // Light Grey Border
    paddingBottom: '1mm',
    marginBottom: '3mm',
  },
  subHeader: {
    fontSize: '10pt',
    fontWeight: 'bold' as 'bold',
    display: 'flex',
    justifyContent: 'space-between' as 'space-between',
    marginBottom: '1mm',
  },
  subHeaderLeft: {
    color: '#333',
  },
  subHeaderRight: {
    color: '#555',
    fontStyle: 'italic' as 'italic',
  },
  listItem: {
    marginLeft: '5mm',
    marginBottom: '1mm',
  },
  content: {
    fontSize: '10pt',
    color: '#444',
  },
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    gap: '5px',
  },
  skillBadge: {
    backgroundColor: '#ecf0f1', // Light Grey Blue
    color: '#34495e', // Dark Blue Grey
    padding: '2px 6px',
    borderRadius: '3px',
    fontSize: '9pt',
  },
  customSubSection: {
    marginLeft: '5mm',
    marginTop: '2mm',
  },
  customSubSectionTitle: {
    fontSize: '10pt',
    fontStyle: 'italic' as 'italic',
    color: '#555',
    marginBottom: '0.5mm',
  }
};

const ResumePreviewForPDF: React.FC<ResumePreviewForPDFProps> = ({ resume }) => {
  return (
    <div style={styles.page}>
      {/* Personal Info */}
      <div style={styles.header}>
        {resume.personalInfo?.fullName && <div style={styles.fullName}>{resume.personalInfo.fullName}</div>}
        <div style={styles.contactInfo}>
          {resume.personalInfo?.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo?.phoneNumber && <span> | {resume.personalInfo.phoneNumber}</span>}
          {resume.personalInfo?.address && <div>{resume.personalInfo.address}</div>}
          {resume.personalInfo?.linkedin && <div><a href={resume.personalInfo.linkedin} style={styles.contactLink}>LinkedIn</a></div>}
          {resume.personalInfo?.github && <div><a href={resume.personalInfo.github} style={styles.contactLink}>GitHub</a></div>}
          {resume.personalInfo?.portfolio && <div><a href={resume.personalInfo.portfolio} style={styles.contactLink}>Portfolio</a></div>}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Summary</div>
          <div style={styles.content}>{resume.summary}</div>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Experience</div>
          {resume.experience.map((exp, index) => (
            <div key={exp.id || index} style={{ marginBottom: '5mm' }}>
              <div style={styles.subHeader}>
                <span style={styles.subHeaderLeft}>{exp.jobTitle} at {exp.company} {exp.location && `- ${exp.location}`}</span>
                <span style={styles.subHeaderRight}>{exp.startDate} - {exp.endDate || 'Present'}</span>
              </div>
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul style={{ paddingLeft: '5mm', margin: 0 }}>
                  {exp.responsibilities.map((resp, rIndex) => (
                    <li key={rIndex} style={styles.listItem}>{resp}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Education</div>
          {resume.education.map((edu, index) => (
            <div key={edu.id || index} style={{ marginBottom: '3mm' }}>
              <div style={styles.subHeader}>
                <span style={styles.subHeaderLeft}>{edu.degree} in {edu.fieldOfStudy} - {edu.institution}</span>
                <span style={styles.subHeaderRight}>{edu.graduationDate}</span>
              </div>
              {edu.gpa && <div style={{...styles.content, fontSize: '9pt', marginLeft: '5mm'}}>GPA: {edu.gpa}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Skills</div>
          <div style={styles.skillsContainer}>
            {resume.skills.map((skill, index) => (
              <span key={index} style={styles.skillBadge}>{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {resume.customSections && resume.customSections.length > 0 && (
        resume.customSections.map((section, index) => (
          <div key={section.id || index} style={styles.section}>
            <div style={styles.sectionTitle}>
              {section.title}
              {section.subtitle && <span style={{fontSize: '10pt', fontStyle: 'italic', color: '#555', marginLeft: '5px'}}>({section.subtitle})</span>}
            </div>
            {section.content && <div style={styles.content}>{section.content}</div>}
            {section.subsections && section.subsections.length > 0 && (
              section.subsections.map((sub, subIndex) => (
                <div key={sub.id || subIndex} style={styles.customSubSection}>
                  {sub.subtitle && <div style={styles.customSubSectionTitle}>{sub.subtitle}</div>}
                  {sub.content && <div style={{...styles.content, marginLeft: sub.subtitle ? '5mm' : '0'}}>{sub.content}</div>}
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ResumePreviewForPDF;
