import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Users, Award, ArrowRight } from 'lucide-react';

export const ProjectsBanner: React.FC = () => {
  const { navigate } = useApp();

  return (
    <section className="bg-[#0B1528] text-white overflow-hidden py-14 sm:py-16 relative">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#070D1A] via-[#0B1528] to-[#122344] opacity-90" />
      <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Visual Architectural Showcase */}
          <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl shadow-2xl border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80"
              alt="SunPropMart Landmark Architecture"
              className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#E5B842] block">
                Integrated High-Rise Developments
              </span>
              <p className="text-sm font-semibold text-white mt-0.5">
                Engineered with seismic precision and international amenities
              </p>
            </div>
          </div>

          {/* Center Column: Value Proposition & CTA */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-bold tracking-[0.2em] text-[#E5B842] uppercase block">
              Premium Projects
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Explore Our <br className="hidden sm:inline" />
              Latest Projects
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Discover new launch and ongoing projects from top developers in NCR. RERA registered,
              bank approved, and master-planned for modern community living.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('projects')}
                className="px-6 py-3 rounded-lg bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>View All Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: 3 Key Metrics Icons (From Screenshot) */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-6 pt-4 lg:pt-0 w-full min-w-0">
            <div className="flex flex-row lg:flex-row items-center lg:items-start text-left gap-3 p-3 rounded-xl bg-white/5 border border-white/10 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-[#E5B842] flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  100+
                </div>
                <div className="text-xs text-slate-300 font-medium">Projects Managed</div>
              </div>
            </div>

            <div className="flex flex-row lg:flex-row items-center lg:items-start text-left gap-3 p-3 rounded-xl bg-white/5 border border-white/10 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-[#E5B842] flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  5000+
                </div>
                <div className="text-xs text-slate-300 font-medium">Happy Clients</div>
              </div>
            </div>

            <div className="flex flex-row lg:flex-row items-center lg:items-start text-left gap-3 p-3 rounded-xl bg-white/5 border border-white/10 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-[#E5B842] flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  10+
                </div>
                <div className="text-xs text-slate-300 font-medium">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
