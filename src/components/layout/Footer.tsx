import React from 'react';
import { useApp } from '../../context/AppContext';
import { SunLogo } from '../common/SunLogo';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Shield,
  ArrowRight,
} from 'lucide-react';

interface FooterProps {
  onOpenEnquiryModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenEnquiryModal }) => {
  const { navigate, switchRole } = useApp();

  return (
    <footer className="bg-[#070D1A] text-slate-300 border-t border-white/10">
      {/* 1. Pre-Footer Call to Action Strip (From Screenshot) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0F1E36] via-[#162746] to-[#241A0B] border-b border-amber-500/20 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#E5B842] uppercase">
              Ready to find your dream property?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Let&apos;s Find the Perfect Property for You
            </h2>
            <p className="text-sm text-slate-300 mt-1.5 max-w-xl">
              Connect with our certified property specialists for verified listings, private site
              visits, and institutional investment consultations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => navigate('contact')}
              className="px-5 py-2.5 rounded-lg bg-transparent border-2 border-[#E5B842] text-[#E5B842] hover:bg-[#E5B842] hover:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all text-center"
            >
              Contact Us
            </button>
            <button
              onClick={onOpenEnquiryModal}
              className="px-5 py-2.5 rounded-lg bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Request a Callback</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <SunLogo size="md" variant="dark" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Your trusted real estate and construction partner for a better tomorrow. Delivering
              verified luxury residences, commercial towers, and state infrastructure works across
              Delhi NCR.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#facebook"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#E5B842] hover:text-slate-950 flex items-center justify-center transition-colors border border-white/10"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#instagram"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#E5B842] hover:text-slate-950 flex items-center justify-center transition-colors border border-white/10"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#youtube"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#E5B842] hover:text-slate-950 flex items-center justify-center transition-colors border border-white/10"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#linkedin"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#E5B842] hover:text-slate-950 flex items-center justify-center transition-colors border border-white/10"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4 border-b border-amber-500/30 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('home')}
                  className="hover:text-[#E5B842] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('properties')}
                  className="hover:text-[#E5B842] transition-colors"
                >
                  Properties Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('projects')}
                  className="hover:text-[#E5B842] transition-colors"
                >
                  Featured Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('services')}
                  className="hover:text-[#E5B842] transition-colors"
                >
                  Our Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('government-work')}
                  className="hover:text-[#E5B842] transition-colors"
                >
                  Government Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('construction')}
                  className="hover:text-[#E5B842] transition-colors"
                >
                  Construction EPC
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('blog')}
                  className="hover:text-[#E5B842] transition-colors"
                >
                  News & Insights
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('about')}
                  className="hover:text-[#E5B842] transition-colors"
                >
                  About SunPropMart
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('contact')}
                  className="hover:text-[#E5B842] transition-colors"
                >
                  Contact & Enquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4 border-b border-amber-500/30 pb-2">
              Our Services
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('services')}
                  className="hover:text-[#E5B842] transition-colors"
                >
                  Buy Property
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('services')}
                  className="hover:text-[#E5B842] transition-colors"
                >
                  Rent & Lease Property
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('services')}
                  className="hover:text-[#E5B842] transition-colors"
                >
                  Sell Property Valuation
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('services')}
                  className="hover:text-[#E5B842] transition-colors"
                >
                  Property Management & NRI Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('services')}
                  className="hover:text-[#E5B842] transition-colors"
                >
                  Investment Advisory
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('services')}
                  className="hover:text-[#E5B842] transition-colors"
                >
                  Legal Due Diligence & RERA
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('government-work')}
                  className="hover:text-[#E5B842] transition-colors"
                >
                  Public Works & Civil Tenders
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4 border-b border-amber-500/30 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E5B842] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  F-2, Krishna Plaza, Upper HDFC Bank, Alpha-I Commercial Belt, Greater Noida, Uttar Pradesh 201310
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E5B842] shrink-0" />
                <a href="tel:+919873083899" className="hover:text-[#E5B842] transition-colors">
                  +91 98730 83899
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E5B842] shrink-0" />
                <a href="mailto:info@sunpropmart.in" className="hover:text-[#E5B842] transition-colors">
                  info@sunpropmart.in
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#E5B842] shrink-0" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </li>
            </ul>

            {/* Quick Staff Portal Access */}
            <div className="mt-5 pt-3 border-t border-white/10">
              <div className="text-[11px] text-slate-400 mb-2">Staff & Portal Access:</div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    switchRole('admin', 'usr-admin-01');
                    navigate('admin-dashboard');
                  }}
                  className="px-2.5 py-1 text-[11px] rounded bg-white/5 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" />
                  <span>Admin Login</span>
                </button>
                <button
                  onClick={() => {
                    switchRole('agent', 'usr-agent-01');
                    navigate('agent-dashboard');
                  }}
                  className="px-2.5 py-1 text-[11px] rounded bg-white/5 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
                >
                  Agent Portal
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Legal & Copyright Bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 text-center sm:text-left">
          <p>© 2026 SunPropMart. All Rights Reserved. Company Controlled Real Estate Platform.</p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <button onClick={() => navigate('careers')} className="hover:text-white transition-colors">
              Careers
            </button>
            <span>|</span>
            <button onClick={() => navigate('privacy')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <span>|</span>
            <button onClick={() => navigate('terms')} className="hover:text-white transition-colors">
              Terms & Conditions
            </button>
            <span>|</span>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Sitemap.xml
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
