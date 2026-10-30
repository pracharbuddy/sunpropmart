import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Award, Building, Users, CheckCircle2, Landmark } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Banner */}
        <div className="bg-[#0B1528] rounded-2xl p-8 sm:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold tracking-[0.2em] text-[#E5B842] uppercase block mb-1">
              About SunPropMart
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Building Properties. Creating Opportunities.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              Founded with the vision to eliminate marketplace ambiguity, SunPropMart is a
              company-controlled corporate real estate and infrastructure development platform
              delivering certified properties across Delhi NCR.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl font-extrabold text-[#0B1528]">
              A Principled Approach to Real Estate & Construction
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Unlike open listing classifieds where anyone can post unverified broker ads,
              SunPropMart owns, verifies, or formally mandates every single property in our
              portfolio. Every residential apartment, independent luxury villa, and commercial
              office is audited by our in-house legal and civil engineering teams.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              In parallel, our heavy civil construction arm executes multi-crore public sector works
              for Uttar Pradesh PWD and YEIDA, bringing institutional engineering discipline into
              every project we construct.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-3xl font-extrabold text-[#0B1528]">10+</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Years in NCR</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-3xl font-extrabold text-[#0B1528]">100+</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Projects Executed</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-3xl font-extrabold text-[#0B1528]">5000+</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Happy Families</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-3xl font-extrabold text-[#0B1528]">100%</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Title Verified</div>
            </div>
          </div>
        </div>

        {/* Accreditations */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs mb-12">
          <h2 className="text-xl font-bold text-[#0B1528] mb-6">
            Statutory Accreditations & Certifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-900">UP RERA Registered</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Compliant Real Estate Agent</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Landmark className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-900">UP PWD Class-A</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Approved Civil Contractor</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-900">YEIDA Empaneled</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Industrial Corridor Developer</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-900">ISO 9001:2015</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Quality Management Certified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
