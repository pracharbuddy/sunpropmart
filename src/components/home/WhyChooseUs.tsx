import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Building,
  UserCheck,
  FileText,
  BadgePercent,
  Headphones,
  ArrowRight,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const { navigate } = useApp();

  const reasons = [
    {
      title: 'Verified Properties',
      desc: '100% verified listings',
      icon: ShieldCheck,
    },
    {
      title: 'Trusted Developers',
      desc: 'Top builders & projects',
      icon: Building,
    },
    {
      title: 'Expert Guidance',
      desc: 'From industry professionals',
      icon: UserCheck,
    },
    {
      title: 'Easy Documentation',
      desc: 'Hassle-free process',
      icon: FileText,
    },
    {
      title: 'Best Deals',
      desc: 'Competitive pricing',
      icon: BadgePercent,
    },
    {
      title: 'Dedicated Support',
      desc: 'Always here for you',
      icon: Headphones,
    },
  ];

  return (
    <section className="bg-[#0B1528] text-white py-16 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#070D1A] via-[#0B1528] to-[#122344] opacity-95" />
      <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Title Column */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-bold tracking-[0.2em] text-[#E5B842] uppercase block">
              Why Choose
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              SunPropMart
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your trusted partner in real estate. With company-controlled listings, zero duplicate
              spam, and vetted legal certifications, your investments are protected at every phase.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('about')}
                className="px-6 py-2.5 rounded-lg bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-amber-500/25"
              >
                <span>Know More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Grid of 6 Trust Badges */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 w-full min-w-0">
            {reasons.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#E5B842]/50 hover:bg-white/10 transition-all flex flex-col items-center text-center group min-w-0"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-400/10 group-hover:bg-[#E5B842] text-[#E5B842] group-hover:text-slate-950 flex items-center justify-center transition-colors mb-2.5 sm:mb-3 shrink-0">
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#E5B842] transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
