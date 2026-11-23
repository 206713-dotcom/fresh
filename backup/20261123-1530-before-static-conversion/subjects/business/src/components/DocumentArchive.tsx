"use client";

import React from "react";

export function DocumentArchive() {
  const documents = [
    {
      title: "Cambridge IGCSE Business 0264 Specimen Paper 1 (2027)",
      description: "Official Cambridge examination Paper 1 (Short Answer and Data Response). 80 marks, 1 hour 30 minutes.",
      category: "Official 0264 Specimen",
      url: "https://www.cambridgeinternational.org/Images/718443-2027-specimen-paper-1.pdf",
      markSchemeUrl: "https://www.cambridgeinternational.org/Images/718522-2027-specimen-paper-1-mark-scheme.pdf",
      isSpecimen: true,
    },
    {
      title: "Cambridge IGCSE Business 0264 Specimen Paper 2 (2027)",
      description: "Official Cambridge examination Paper 2 (Case Study). 80 marks, 1 hour 30 minutes, includes case insert.",
      category: "Official 0264 Specimen",
      url: "https://www.cambridgeinternational.org/Images/718446-2027-specimen-paper-2.pdf",
      markSchemeUrl: "https://www.cambridgeinternational.org/Images/718525-2027-specimen-paper-2-mark-scheme.pdf",
      insertUrl: "https://www.cambridgeinternational.org/Images/718535-2027-specimen-paper-2-insert.pdf",
      isSpecimen: true,
    },
    {
      title: "Cambridge IGCSE Business Studies 0264 Syllabus (2027–2029)",
      description: "Complete qualification curriculum syllabus document detailing Assessment Objectives AO1–AO4, subject content, and grading.",
      category: "Official Syllabus",
      url: "./assets/aistudio/718123-2027-2029-syllabus_74cc6921.pdf",
      isLocal: true,
    },
    {
      title: "CAIE IGCSE Business Studies Revision Guide",
      description: "Comprehensive structured revision summary of all chapters and CIE examination technique guidelines.",
      category: "Revision Guide",
      url: "./assets/aistudio/CAIE_-_IGCSE_-_Business_Studies__1__c3cb68cc.pdf",
      isLocal: true,
    },
  ];

  return (
    <div className="study-page">
      <div className="study-page-heading">
        <div>
          <h1 className="study-title">Cambridge Examination Document Archive</h1>
          <p className="study-description">
            Zero-cost access to official Cambridge International Education (CIE) 0264 specimen papers, mark schemes, case inserts, and syllabus specifications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:border-[#0F2042] dark:hover:border-[#38BDF8] transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#78716C] dark:text-neutral-400 mb-2">
                <span className="uppercase font-semibold text-[#8B1E1E] dark:text-[#F87171]">
                  {doc.category}
                </span>
                {doc.isSpecimen && (
                  <span className="bg-[#FAF9F6] dark:bg-black border border-[#E7E5E4] dark:border-neutral-800 px-2 py-0.5 rounded text-[10px] text-[#0F2042] dark:text-[#38BDF8]">
                    First Exam 2027
                  </span>
                )}
              </div>

              <h2 className="font-academic-serif text-xl font-bold text-[#0F2042] dark:text-white mb-3">
                {doc.title}
              </h2>

              <p className="text-xs text-[#57534E] dark:text-neutral-400 leading-relaxed mb-6">
                {doc.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#E7E5E4] dark:border-neutral-800 flex flex-wrap gap-2 text-xs">
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0F2042] dark:bg-[#38BDF8] hover:bg-[#1E3A8A] dark:hover:bg-[#0284C7] text-white dark:text-[#0F172A] px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                {doc.isLocal ? "Open Document PDF ↗" : "Question Paper PDF ↗"}
              </a>

              {doc.markSchemeUrl && (
                <a
                  href={doc.markSchemeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FAF9F6] dark:bg-black border border-[#D6D3D1] dark:border-neutral-700 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#1C1917] dark:text-neutral-200 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Mark Scheme PDF ↗
                </a>
              )}

              {doc.insertUrl && (
                <a
                  href={doc.insertUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FAF9F6] dark:bg-black border border-[#D6D3D1] dark:border-neutral-700 hover:bg-[#F5F5F4] dark:hover:bg-neutral-800 text-[#1C1917] dark:text-neutral-200 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Case Study Insert ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* External Repositories Strip */}
      <div className="p-6 bg-[#FAF9F6] dark:bg-neutral-900 border border-[#E7E5E4] dark:border-neutral-800 rounded-xl text-xs text-[#57534E] dark:text-neutral-400 space-y-3">
        <h3 className="font-academic-serif text-base font-bold text-[#0F2042] dark:text-white">
          Authoritative Cambridge Portals & Cloud Handlers
        </h3>
        <p className="leading-relaxed">
          As part of the EcBiz zero-cost infrastructure, paper archives and PDFs are fetched directly from official Cambridge portals and Google Drive storage links.
        </p>
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#0F2042] dark:text-[#38BDF8] pt-1">
          <a
            href="https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-business-0264/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Cambridge 0264 Qualification Portal ↗
          </a>
          <a
            href="https://pastpapers.papacambridge.com/papers/caie/igcse-business-studies-0450"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            PapaCambridge 0450 Archive ↗
          </a>
        </div>
      </div>
    </div>
  );
}
