import React from 'react';
import { useApp } from '../../context/AppContext';
import { SEOHead } from '../common/SEOHead';
import { FileText, ChevronRight, Scale, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const TermsView: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <SEOHead
        title="Terms & Conditions | SunPropMart Real Estate & Construction"
        description="Review the terms and conditions governing property searches, site visit requests, advisory mandates, and civil construction services provided by SunPropMart."
        canonicalUrl="https://sunpropmart.in/terms"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <button onClick={() => navigate('home')} className="hover:text-slate-900">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-900">Terms & Conditions</span>
        </div>

        {/* Header */}
        <div className="bg-[#0B1528] rounded-2xl p-8 sm:p-10 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs font-bold tracking-[0.2em] text-[#E5B842] uppercase block mb-1">
              Legal Terms & User Mandate
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Terms & Conditions of Service
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Effective Date: November 1, 2026 | Last Updated: November 2026
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <section>
            <h2 className="text-base sm:text-lg font-bold text-[#0B1528] mb-3 flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#C99738]" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing the web portal, mobile interfaces, or advisory
              services offered by SunPropMart Real Estate & Construction ("SunPropMart"), you agree to
              be bound by these Terms and Conditions. If you do not accept these terms in full, you
              must immediately cease all usage of our platform.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-[#0B1528] mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#C99738]" />
              2. Nature of Real Estate & Construction Services
            </h2>
            <p>
              SunPropMart provides enterprise real estate consultancy, project marketing, verified
              inventory matching, site visit facilitation, property valuation, legal documentation
              coordination, and heavy civil construction works across Uttar Pradesh and Delhi NCR.
            </p>
            <p className="mt-2">
              All project specifications, unit floor plans, carpet areas, and tentative possession
              dates are published in accordance with respective builder disclosures registered under
              the Uttar Pradesh Real Estate Regulatory Authority (UP RERA).
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-[#0B1528] mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#C99738]" />
              3. Property Pricing & Listing Accuracy
            </h2>
            <p>
              While SunPropMart enforces strict administrative verification and review procedures
              before approving property listings, property prices are subject to periodic builder
              revisions, inflation adjustments, floor escalation charges, and prevailing stamp duty
              modifications. Final transacted prices are governed solely by official Builder-Buyer
              Agreements (BBA) or registered Sale Deeds.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-[#0B1528] mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#C99738]" />
              4. User Obligations & Site Visit Protocol
            </h2>
            <p>
              Users requesting site visits, price consultations, or callback services agree to provide
              truthful, up-to-date contact details. Users must not attempt to circumvent assigned
              brokerage mandates or submit fraudulent inquiries.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-[#0B1528] mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C99738]" />
              5. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms & Conditions are construed under and governed by the laws of India. Any
              disputes arising hereunder shall be subject to the exclusive jurisdiction of the
              competent courts at Gautam Buddh Nagar / Greater Noida, Uttar Pradesh.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
