import React from 'react';
import { useApp } from '../../context/AppContext';
import { SEOHead } from '../common/SEOHead';
import { ShieldCheck, ChevronRight, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <SEOHead
        title="Privacy Policy | SunPropMart Real Estate & Construction"
        description="Learn how SunPropMart collects, secures, and handles your property enquiries, site visit schedules, personal data, and transactions under Indian data protection regulations."
        canonicalUrl="https://sunpropmart.in/privacy"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <button onClick={() => navigate('home')} className="hover:text-slate-900">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-900">Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="bg-[#0B1528] rounded-2xl p-8 sm:p-10 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs font-bold tracking-[0.2em] text-[#E5B842] uppercase block mb-1">
              Data Governance & Trust
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              SunPropMart Privacy Policy
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
              <ShieldCheck className="w-5 h-5 text-[#C99738]" />
              1. Commitment to Personal Data Protection
            </h2>
            <p>
              SunPropMart Real Estate & Construction ("SunPropMart", "we", "our", or "us"),
              operating from F-2, Krishna Plaza, Upper HDFC Bank, Alpha-I Commercial Belt, Greater
              Noida, Uttar Pradesh 201310, is committed to safeguarding the privacy and personal data
              entrusted to us by property buyers, sellers, tenants, investors, and website visitors.
            </p>
            <p className="mt-2">
              This Privacy Policy explains what personal information we collect, why we collect it,
              how we store it securely, and your rights under the Information Technology Act, 2000,
              the Digital Personal Data Protection Act (DPDPA), 2023, and Real Estate (Regulation and
              Development) Act, 2016 (RERA).
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-[#0B1528] mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#C99738]" />
              2. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>
                <strong>Contact Information:</strong> Full name, verified mobile number, email
                address, and residential city when submitting enquiries, requesting site visits, or
                downloading brochures.
              </li>
              <li>
                <strong>Property Preferences:</strong> Desired localities (e.g. Greater Noida West,
                Yamuna Expressway), budget parameters, unit configurations (e.g. 2, 3, or 4 BHK,
                commercial plots), and purchase timelines.
              </li>
              <li>
                <strong>Financial & KYC Information (Transaction Stage Only):</strong> PAN details,
                Aadhaar copies, bank statements, or proof of address exclusively collected during
                direct builder allotments, registry documentation, and loan processing.
              </li>
              <li>
                <strong>Technical & Usage Data:</strong> IP address, browser type, device
                characteristics, referrer URLs, and interaction timestamps used strictly to diagnose
                server performance and improve user experience.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-[#0B1528] mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#C99738]" />
              3. Purpose & Legal Basis of Processing
            </h2>
            <p>We process your data strictly for legitimate real estate business purposes:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Connecting you with our licensed property advisors and organizing verified site visits.</li>
              <li>Executing property valuation, due diligence, and registry assistance services.</li>
              <li>Providing transaction status notifications, price alerts, and new launch updates.</li>
              <li>Complying with statutory reporting requirements under RERA and local municipal authorities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-[#0B1528] mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C99738]" />
              4. Data Retention & Security Architecture
            </h2>
            <p>
              SunPropMart utilizes enterprise-grade Supabase PostgreSQL infrastructure with
              strictly enforced Row Level Security (RLS) policies. Sensitive private documents
              (such as draft sale agreements and title deeds) are housed in authenticated private
              storage buckets with time-limited signed URLs. We do NOT sell, rent, or trade your
              personal information to third-party telemarketing networks.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-[#0B1528] mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#C99738]" />
              5. Contact Our Data Grievance Officer
            </h2>
            <p>
              If you have inquiries regarding this privacy statement or wish to exercise your data
              access or deletion rights, please contact our designated grievance team:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-3 text-xs space-y-1">
              <div><strong>Company:</strong> SunPropMart Real Estate & Construction</div>
              <div><strong>Email:</strong> info@sunpropmart.in</div>
              <div><strong>Helpline:</strong> +91 98730 83899</div>
              <div><strong>Office:</strong> F-2, Krishna Plaza, Upper HDFC Bank, Alpha-I Commercial Belt, Greater Noida, Uttar Pradesh 201310</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
