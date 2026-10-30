import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Key,
  BadgePercent,
  ShieldCheck,
  TrendingUp,
  Globe,
  Scale,
  Building,
  ArrowRight,
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { navigate } = useApp();

  const servicesList = [
    {
      title: 'Buy Property',
      desc: 'Find your dream home',
      icon: Home,
    },
    {
      title: 'Rent Property',
      desc: 'Verified rental options',
      icon: Key,
    },
    {
      title: 'Sell Property',
      desc: 'Best value for your property',
      icon: BadgePercent,
    },
    {
      title: 'Property Management',
      desc: 'Hassle-free management',
      icon: Building,
    },
    {
      title: 'Property Valuation',
      desc: 'Know your property value',
      icon: ShieldCheck,
    },
    {
      title: 'Investment Advisory',
      desc: 'Expert guidance',
      icon: TrendingUp,
    },
    {
      title: 'NRI Services',
      desc: 'Dedicated NRI support',
      icon: Globe,
    },
    {
      title: 'Legal Support',
      desc: 'End-to-end assistance',
      icon: Scale,
    },
  ];

  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528] tracking-tight">
              Our Services
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Complete real estate solutions under one roof
            </p>
          </div>

          <button
            onClick={() => navigate('services')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C99738] hover:text-[#B88528] group transition-colors"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 8 Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-4 w-full min-w-0">
          {servicesList.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate('services')}
                className="bg-white rounded-xl p-2.5 sm:p-4 text-center border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-[#E5B842] transition-all duration-300 flex flex-col items-center justify-between group cursor-pointer hover:-translate-y-1 min-w-0"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-50 group-hover:bg-[#E5B842]/15 text-[#0B1528] group-hover:text-[#C99738] flex items-center justify-center transition-colors mb-2 sm:mb-3 shrink-0">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-[#C99738] text-xs sm:text-sm leading-tight transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {service.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
