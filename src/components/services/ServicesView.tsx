import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Home,
  Key,
  ShieldCheck,
  Hammer,
  Landmark,
  Globe,
  Scale,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const ServicesView: React.FC<{ onOpenEnquiryModal: () => void }> = ({
  onOpenEnquiryModal,
}) => {
  const { services, navigate } = useApp();

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Banner */}
        <div className="bg-[#0B1528] rounded-2xl p-8 sm:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold tracking-[0.2em] text-[#E5B842] uppercase block mb-1">
              End-to-End Solutions
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Real Estate & Construction Services
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              From verified residential acquisitions to institutional commercial leasing, legal
              scrutiny, and government tender execution.
            </p>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-12">
          {services.map((srv, idx) => (
            <div
              key={srv.id}
              className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col lg:flex-row items-center gap-8 ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="lg:w-1/2 w-full rounded-xl overflow-hidden aspect-[16/10] bg-slate-100 shadow-sm shrink-0">
                <img
                  src={srv.image_url}
                  alt={srv.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="lg:w-1/2 w-full space-y-4">
                <span className="text-xs font-bold tracking-widest text-[#C99738] uppercase">
                  {srv.category}
                </span>
                <h2 className="text-2xl font-extrabold text-[#0B1528] tracking-tight">
                  {srv.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">{srv.full_content}</p>

                {/* Features */}
                {srv.features && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {srv.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 flex items-center gap-4">
                  <button
                    onClick={onOpenEnquiryModal}
                    className="px-5 py-2.5 rounded-lg bg-[#0B1528] hover:bg-[#162746] text-white font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Inquire For {srv.title}
                  </button>
                  {srv.title.includes('Property') && (
                    <button
                      onClick={() => navigate('properties')}
                      className="text-xs font-bold text-[#C99738] hover:underline flex items-center gap-1"
                    >
                      <span>Explore listings</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
