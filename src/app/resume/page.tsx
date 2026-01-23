"use client";

import Image from "next/image";
import Link from "next/link";
import { profile } from "@/data/profile";
import { career } from "@/data/career";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { awards } from "@/data/awards";

export default function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-gray-100 overflow-auto z-50">
      {/* Control Bar - Hidden in print */}
      <div className="print:hidden sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
          >
            ← Back to Home
          </Link>
          <h2 className="text-gray-800 font-semibold hidden sm:block">
            {profile.nameKr}&apos;s Resume
          </h2>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
        >
          Download PDF
        </button>
      </div>

      {/* Resume Content */}
      <div className="flex justify-center py-8 print:py-0 px-4">
        <div
          className="bg-white text-black w-full max-w-[210mm] min-h-[297mm] p-8 md:p-[20mm] shadow-lg print:shadow-none print:p-[15mm] print:max-w-none"
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          {/* Page 1: Header + About + Career */}
          <div className="page-content">
            {/* Header Section */}
            <header className="flex flex-col sm:flex-row gap-6 mb-6 pb-4 border-b-2 border-gray-200">
              <div className="flex-shrink-0 flex justify-center sm:justify-start">
                <Image
                  src="/info/profile.jpg"
                  alt="Profile"
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                  style={{ width: 100, height: 100 }}
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {profile.nameKr}
                  <span className="text-lg font-normal text-gray-500 ml-2">
                    ({profile.name})
                  </span>
                </h1>
                <p className="text-lg text-blue-600 font-medium mb-2">
                  {profile.title}
                </p>
                <div className="text-xs text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-1">
                  <p>📞 {profile.phone}</p>
                  <p>📧 {profile.email}</p>
                  <p>📍 {profile.location}</p>
                  <p>🎓 {profile.education.split("(")[0].trim()}</p>
                </div>
              </div>
            </header>

            {/* Summary */}
            <section className="mb-5">
              <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300">
                ABOUT
              </h2>
              <div className="text-xs text-gray-700 leading-relaxed space-y-1">
                {profile.bio.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </section>

            {/* Skills Section */}
            <section className="mb-5">
              <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300">
                SKILLS
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {skills.map((category) => (
                  <div key={category.category}>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {category.category}
                    </h3>
                    <p className="text-gray-600">{category.items.join(", ")}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Career Section */}
            <section className="mb-5">
              <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300">
                EXPERIENCE
              </h2>
              <div className="space-y-3">
                {career.map((item) => (
                  <div key={item.id} className="career-item">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-0.5">
                      <h3 className="font-bold text-gray-900 text-sm">{item.company}</h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-blue-600 font-medium text-xs mb-1">
                      {item.position}
                    </p>
                    <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5">
                      {item.description.map((desc, idx) => (
                        <li key={idx}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Awards */}
            <section className="mb-5">
              <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300">
                AWARDS
              </h2>
              <div className="flex flex-wrap gap-4 text-xs">
                {awards.map((award) => (
                  <div key={award.id}>
                    <span className="font-semibold">{award.title}</span>
                    <span className="text-gray-500"> - {award.prize}</span>
                    <span className="text-gray-400"> ({award.organization})</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Page Break */}
          <div className="page-break" />

          {/* Page 2: Projects */}
          <div className="page-content">
            {/* Projects Section */}
            <section>
              <h2 className="text-base font-bold text-gray-900 mb-3 pb-1 border-b border-gray-300">
                PROJECTS
              </h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="project-item">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-0.5">
                      <h3 className="font-bold text-gray-900 text-sm">{project.name}</h3>
                      <span className="text-xs text-gray-500">{project.period}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-gray-600 space-y-0.5">
                      {project.details.slice(0, 4).map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
