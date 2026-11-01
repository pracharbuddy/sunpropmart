import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SEOHead } from '../common/SEOHead';
import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  Building,
  GraduationCap,
  Users,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  openings: number;
  description: string;
  requirements: string[];
}

export const CareersView: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantResumeNote, setApplicantResumeNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jobs: JobPosition[] = [
    {
      id: 'job-01',
      title: 'Senior Property Acquisition Consultant',
      department: 'Residential & Luxury Sales',
      location: 'Greater Noida West, U.P.',
      type: 'Full-time',
      experience: '4 - 8 Years',
      openings: 3,
      description:
        'Lead high-value residential portfolio transactions across Noida Extension and Yamuna Expressway. Interface with high-net-worth investors and guide end-to-end property acquisitions.',
      requirements: [
        'Demonstrated track record of residential sales in Greater Noida or Noida',
        'In-depth knowledge of RERA regulations and local authority bye-laws',
        'Strong client presentation and institutional negotiation capabilities',
      ],
    },
    {
      id: 'job-02',
      title: 'Site Civil Engineer (Heavy Infrastructure & Commercial)',
      department: 'Construction & Public Works',
      location: 'Sector 22D / Jewar Airport Corridor',
      type: 'Full-time',
      experience: '5 - 10 Years',
      openings: 2,
      description:
        'Supervise civil execution, quality assurance, and contractor progress on commercial developments and public sector infrastructure projects.',
      requirements: [
        'B.Tech / Diploma in Civil Engineering with on-site execution experience',
        'Experience with RCC structures, QA/QC checklists, and BBS preparation',
        'Familiarity with government PWD/authority measurement sheets and safety codes',
      ],
    },
    {
      id: 'job-03',
      title: 'Institutional CRM & Client Success Manager',
      department: 'Client Relations & CRM',
      location: 'Alpha-I Commercial Belt, Greater Noida',
      type: 'Full-time',
      experience: '3 - 6 Years',
      openings: 2,
      description:
        'Drive client satisfaction from lead ingestion through site visits, documentation, registry coordination, and post-possession care.',
      requirements: [
        'Proven real estate CRM workflow experience and pipeline tracking',
        'Excellent verbal & written English and Hindi communication skills',
        'Customer-centric mindset with high empathy and problem-solving aptitude',
      ],
    },
    {
      id: 'job-04',
      title: 'Legal Due Diligence & RERA Compliance Specialist',
      department: 'Legal & Risk Assessment',
      location: 'Corporate HQ, Greater Noida',
      type: 'Full-time',
      experience: '4 - 7 Years',
      openings: 1,
      description:
        'Conduct rigorous title verification, encumbrance checks, builder-buyer agreement audits, and authority compliance verification.',
      requirements: [
        'LL.B. degree with specialization in property and real estate law',
        'Hands-on experience verifying title deeds, mutation records, and RERA disclosures',
        'Meticulous documentation review and legal draft preparation skills',
      ],
    },
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !applicantPhone) {
      showToast('Please fill in your name, email, and phone number.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Application submitted successfully! Our HR team will reach out.');
      setSelectedJob(null);
      setApplicantName('');
      setApplicantEmail('');
      setApplicantPhone('');
      setApplicantResumeNote('');
    }, 700);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <SEOHead
        title="Careers at SunPropMart | Real Estate & Engineering Careers in NCR"
        description="Join SunPropMart, Greater Noida's leading real estate, civil construction, and corporate infrastructure enterprise. Explore career openings for consultants, civil engineers, and CRM specialists."
        canonicalUrl="https://sunpropmart.in/careers"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <button onClick={() => navigate('home')} className="hover:text-slate-900">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-900">Careers</span>
        </div>

        {/* Hero Banner */}
        <div className="bg-[#0B1528] rounded-2xl p-8 sm:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold tracking-[0.2em] text-[#E5B842] uppercase block mb-1">
              Join Our Mission
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Build Your Career with SunPropMart
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              We are shaping the urban future of Delhi NCR. Join a dynamic team of real estate
              strategists, civil engineers, and client advisors committed to absolute transparency
              and high craftsmanship.
            </p>
          </div>
        </div>

        {/* Company Culture / Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#C99738] flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Rapid Growth</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Fast-track promotions, milestone bonuses, and exposure to NCR's premier developments.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#C99738] flex items-center justify-center mb-4">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Diversified Assets</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Experience spanning residential, commercial retail, YEIDA plots, and public works.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#C99738] flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Meritocracy</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Transparent commission structures, ethical practices, and full administrative support.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#C99738] flex items-center justify-center mb-4">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Continuous Learning</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Direct mentorship from industry veterans and ongoing RERA legal masterclasses.
            </p>
          </div>
        </div>

        {/* Current Job Openings */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-black text-[#0B1528] tracking-tight">
                Current Opportunities
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Explore open roles across sales, engineering, CRM, and legal compliance.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-full w-fit">
              {jobs.length} Positions Open
            </span>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-[#E5B842]/60 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C99738] bg-amber-50 px-2.5 py-0.5 rounded">
                      {job.department}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {job.openings} Openings
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C99738]" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C99738]" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-[#C99738]" />
                      Exp: {job.experience}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0B1528] hover:bg-[#13223f] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Apply for Role</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#E5B842]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-[#C99738] uppercase tracking-wider">
                  Apply for Position
                </span>
                <h3 className="text-lg font-black text-slate-900">{selectedJob.title}</h3>
                <p className="text-xs text-slate-500">{selectedJob.location}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-[#C99738]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="rajesh@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-[#C99738]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-[#C99738]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Experience & Key Achievements *
                </label>
                <textarea
                  rows={3}
                  value={applicantResumeNote}
                  onChange={(e) => setApplicantResumeNote(e.target.value)}
                  placeholder="Share a brief overview of your real estate, engineering, or sales background..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-[#C99738]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0B1528] hover:bg-[#13223f] text-[#E5B842] text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
