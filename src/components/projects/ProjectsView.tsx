import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectCategory } from '../../types';
import {
  Building2,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Landmark,
  ChevronRight,
  Percent,
} from 'lucide-react';

export const ProjectsView: React.FC<{ onOpenEnquiryModal: () => void }> = ({
  onOpenEnquiryModal,
}) => {
  const { projects, navigate, selectedProjectSlug } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeStatus, setActiveStatus] = useState<string>('All');

  // If a specific project is selected, show detail view
  const detailedProject = selectedProjectSlug
    ? projects.find((p) => p.slug === selectedProjectSlug)
    : null;

  const categories = [
    'All',
    'Residential Projects',
    'Commercial Projects',
    'Government Projects',
    'Infrastructure Projects',
  ];

  const filteredProjects = projects.filter((p) => {
    if (activeCategory !== 'All' && p.project_type !== activeCategory) return false;
    if (activeStatus !== 'All' && p.status !== activeStatus) return false;
    return true;
  });

  if (detailedProject) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <button onClick={() => navigate('home')} className="hover:text-slate-900">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button
              onClick={() => navigate('projects')}
              className="hover:text-slate-900"
            >
              Projects
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-900">{detailedProject.name}</span>
          </div>

          {/* Project Header Card */}
          <div className="bg-[#0B1528] rounded-2xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
            <div className="relative z-10 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-[#E5B842] text-slate-950">
                  {detailedProject.project_type}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-white/10 text-white capitalize">
                  Status: {detailedProject.status}
                </span>
                {detailedProject.tender_number && (
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-amber-500/20 text-amber-300">
                    Tender: {detailedProject.tender_number}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                {detailedProject.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#E5B842]" />
                  <span>{detailedProject.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#E5B842]" />
                  <span>Client: {detailedProject.client}</span>
                </div>
                {detailedProject.budget && (
                  <div className="flex items-center gap-1.5 font-bold text-[#E5B842]">
                    <span>Project Outlay: {detailedProject.budget}</span>
                  </div>
                )}
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 pt-6 border-t border-white/10 max-w-md">
                <div className="flex justify-between text-xs mb-1.5 font-bold">
                  <span>Construction Progress</span>
                  <span className="text-[#E5B842]">{detailedProject.progress_percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-[#E5B842] rounded-full transition-all duration-1000"
                    style={{ width: `${detailedProject.progress_percent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Project Images & Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-8">
              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 shadow-md">
                <img
                  src={detailedProject.cover_image}
                  alt={detailedProject.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Project Overview & Scope</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {detailedProject.description}
                </p>
                {detailedProject.scope && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                    <strong className="block text-slate-900 mb-1">Execution Scope:</strong>
                    {detailedProject.scope}
                  </div>
                )}
              </div>

              {/* Highlights */}
              {detailedProject.highlights && detailedProject.highlights.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Milestone Highlights</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {detailedProject.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 p-3 rounded-lg bg-amber-50/50 border border-amber-100 text-xs font-semibold text-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#C99738] shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar CTA */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-extrabold text-slate-900 text-base mb-2">Project Mandate</h3>
                <p className="text-xs text-slate-500 mb-4">
                  For site visits, commercial leasing, or joint venture execution enquiries on this
                  project:
                </p>

                <button
                  onClick={onOpenEnquiryModal}
                  className="w-full py-3 rounded-xl bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider text-center shadow-md transition-all cursor-pointer"
                >
                  Request Project Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Title */}
        <div className="bg-[#0B1528] rounded-2xl p-8 sm:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold tracking-[0.2em] text-[#E5B842] uppercase block mb-1">
              SunPropMart Portfolio
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Master-Planned Projects
            </h1>
            <p className="text-sm text-slate-300 mt-2">
              From signature luxury high-rises to multi-crore public sector infrastructure
              developments across Delhi NCR.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#0B1528] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Status:</span>
            <select
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-3 text-xs text-slate-800 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate('project-detail', { projectSlug: project.slug })}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={project.cover_image}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide bg-[#E5B842] text-slate-950">
                    {project.project_type}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="font-semibold capitalize bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                    {project.status}
                  </span>
                  <span className="font-bold text-amber-300">
                    {project.progress_percent}% Complete
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-[#C99738] text-base leading-snug transition-colors line-clamp-1">
                    {project.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C99738] shrink-0" />
                    <span>{project.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Bottom Strip */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400">Client: </span>
                    <span className="font-semibold text-slate-700 truncate max-w-[150px] inline-block align-bottom">
                      {project.client}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#C99738] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
