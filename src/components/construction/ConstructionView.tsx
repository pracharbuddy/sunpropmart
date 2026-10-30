import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Hammer,
  CheckCircle2,
  Clock,
  HardHat,
  Ruler,
  Layers,
  ShieldCheck,
  Building,
  ArrowRight,
} from 'lucide-react';

export const ConstructionView: React.FC<{ onOpenEnquiryModal: () => void }> = ({
  onOpenEnquiryModal,
}) => {
  const { projects } = useApp();

  const constructionProjects = projects.filter(
    (p) => p.project_type === 'Construction Projects' || p.project_type === 'Residential Projects'
  );

  const constructionMilestones = [
    {
      phase: 'Phase 01',
      title: 'Geotechnical & Soil Investigation',
      desc: 'Borewell soil testing, safe bearing capacity validation, and structural pile depth engineering.',
      status: 'Completed',
    },
    {
      phase: 'Phase 02',
      title: 'Substructure & Raft Foundation',
      desc: 'High-grade Fe-550D TMT bar reinforcement, anti-termite water barrier, and M35 concrete casting.',
      status: 'Completed',
    },
    {
      phase: 'Phase 03',
      title: 'Superstructure RCC High-Rise Frame',
      desc: 'Aluminium formwork (Mivan technology) monolithic casting ensuring seismic zone-IV resilience.',
      status: 'In Progress',
    },
    {
      phase: 'Phase 04',
      title: 'MEP Infrastructure & Conduit Fitting',
      desc: 'Fire suppression hydrants, dual plumbing lines for STP water recycling, and low-smoke zero-halogen cabling.',
      status: 'In Progress',
    },
    {
      phase: 'Phase 05',
      title: 'Architectural Finishes & Occupancy Certificate',
      desc: 'Italian marble flooring, double-glazed soundproof UPVC windows, and fire NOC clearance.',
      status: 'Upcoming',
    },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Banner */}
        <div className="bg-[#0B1528] rounded-2xl p-8 sm:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold tracking-[0.2em] text-[#E5B842] uppercase block mb-1">
              EPC & General Contracting
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Turnkey Construction Engineering
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              Combining world-class architectural vision, seismic structural integrity, and rigorous
              project management for high-rise residential towers, villas, and commercial complexes.
            </p>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-[#C99738] flex items-center justify-center mb-4">
              <Ruler className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Architectural & BIM Precision</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full 3D Building Information Modeling (BIM) clash detection, structural load
              calculations, and aesthetic spatial layout.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-[#C99738] flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Mivan Aluminium Formwork</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Accelerated construction cycles with glass-smooth monolithic concrete walls that eliminate
              brickwork leakage risks.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-[#C99738] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Quality & Material Audits</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Third-party batch cube compressive tests, steel elongation certification, and non-destructive
              concrete ultrasonic tests.
            </p>
          </div>
        </div>

        {/* Milestone Tracker Timeline */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs mb-16">
          <div className="border-b border-slate-200 pb-4 mb-8">
            <h2 className="text-2xl font-extrabold text-[#0B1528]">
              Standard 5-Phase Construction Lifecycle
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Every SunPropMart project adheres to strict CPWD guidelines and digital milestone audits
            </p>
          </div>

          <div className="space-y-6">
            {constructionMilestones.map((m, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0B1528] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#C99738] uppercase">
                      {m.phase}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">{m.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-2xl">{m.desc}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      m.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : m.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Banner */}
        <div className="bg-[#0B1528] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Have an Upcoming Land or Construction Mandate?</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              We execute turnkey EPC contracts for villas, institutional schools, and multi-storey commercial towers.
            </p>
          </div>
          <button
            onClick={onOpenEnquiryModal}
            className="px-6 py-3 rounded-xl bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0"
          >
            Request Construction Quote
          </button>
        </div>
      </div>
    </div>
  );
};
