import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  HardHat,
  Award,
} from 'lucide-react';

export const GovernmentWorksView: React.FC<{ onOpenEnquiryModal: () => void }> = ({
  onOpenEnquiryModal,
}) => {
  const { projects, navigate } = useApp();

  const govtProjects = projects.filter((p) => p.project_type === 'Government Projects');

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero Banner */}
        <div className="bg-[#0B1528] rounded-2xl p-8 sm:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-400/10 border border-amber-400/20 text-[#E5B842] text-xs font-bold uppercase tracking-wider mb-3">
              <Landmark className="w-3.5 h-3.5" />
              <span>State Infrastructure & Public Works Division</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Government Civil Works & EPC Tenders
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              Approved Class-A Civil Engineering Contractor registered with Uttar Pradesh Public
              Works Department (UP PWD) and Yamuna Expressway Industrial Development Authority
              (YEIDA).
            </p>
          </div>
        </div>

        {/* 4 Pillars of Government Execution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              title: 'Heavy Civil Infrastructure',
              desc: 'Arterial multi-lane expressways, stormwater culverts, flyovers, and logistics transit corridors.',
              icon: HardHat,
            },
            {
              title: 'Administrative Complexes',
              desc: 'Turnkey development of district headquarters, collectorate halls, and public utility grievance buildings.',
              icon: Landmark,
            },
            {
              title: 'Urban Local Body Works',
              desc: 'Road rejuvenation, drainage networking, high-mast illumination, and green belt embankments.',
              icon: ShieldCheck,
            },
            {
              title: 'Tender Compliance & JV',
              desc: 'Robust balance sheet, high bank solvency, and strict adherence to CPWD/UPPWD quality metrics.',
              icon: Award,
            },
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-[#C99738] flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{pillar.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Featured Government Projects */}
        <div className="space-y-8 mb-16">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-extrabold text-[#0B1528]">
              Executed & Ongoing Public Mandates
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Delivering high-durability public assets on schedule and within sanctioned budgets
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {govtProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                    <img
                      src={project.cover_image}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#E5B842] text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded shadow-sm">
                      {project.status.toUpperCase()}
                    </div>
                    {project.tender_number && (
                      <div className="absolute top-3 right-3 bg-black/60 text-white font-mono text-[11px] px-2.5 py-0.5 rounded backdrop-blur-xs">
                        Tender No: {project.tender_number}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="text-xs font-semibold text-[#C99738] uppercase tracking-wide">
                      {project.authority_name || 'Government of Uttar Pradesh'}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{project.name}</h3>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Highlights */}
                    <div className="mt-4 space-y-2">
                      {project.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Sanctioned Outlay</span>
                    <span className="text-base font-extrabold text-[#0B1528]">
                      {project.budget}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate('project-detail', { projectSlug: project.slug })}
                    className="px-4 py-2 rounded-lg bg-[#0B1528] hover:bg-[#162746] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tender & JV Contact Box */}
        <div className="bg-gradient-to-r from-[#0F1E36] to-[#1E293B] rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Government Tenders & Joint Ventures</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl">
              We welcome tender joint ventures, consortium bids, and sub-contracting inquiries from
              registered engineering firms and state departments.
            </p>
          </div>
          <button
            onClick={onOpenEnquiryModal}
            className="px-6 py-3 rounded-xl bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-extrabold text-xs uppercase tracking-wider shrink-0 transition-all shadow-md cursor-pointer"
          >
            Initiate Tender Query
          </button>
        </div>
      </div>
    </div>
  );
};
