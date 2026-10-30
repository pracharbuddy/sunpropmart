import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SunLogo } from '../common/SunLogo';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { addLead, showToast } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Property Acquisition Enquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      showToast('Please provide your name and phone number');
      return;
    }

    setLoading(true);
    await addLead({
      customer_name: fullName,
      customer_email: email,
      customer_phone: phone,
      source: 'Website',
      message: `${subject}: ${message}`,
      preferred_location: 'Delhi NCR',
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Banner */}
        <div className="bg-[#0B1528] rounded-2xl p-8 sm:p-12 text-white shadow-xl mb-12 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-amber-500/20">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold tracking-[0.2em] text-[#E5B842] uppercase block mb-1">
              Connect With Us
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Get in Touch with SunPropMart
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              Whether you are planning to purchase a dream home, lease commercial office suites, or
              discuss tender execution, our senior partners are ready to assist.
            </p>
          </div>
          <div className="relative z-10 shrink-0 hidden sm:block">
            <SunLogo size="lg" variant="dark" />
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card (Col 5) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="text-xl font-bold text-[#0B1528]">Corporate Headquarters</h2>

            <div className="space-y-5 text-sm text-slate-600">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 text-[#C99738] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                    Registered Office
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600">
                    F-2, Krishna Plaza, Upper HDFC Bank, Alpha-I Commercial Belt, Greater Noida, Uttar Pradesh 201310
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 text-[#C99738] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                    Phone Numbers
                  </div>
                  <p className="text-xs text-slate-600">
                    Direct Line: <a href="tel:+919873083899" className="text-slate-900 font-semibold hover:text-[#C99738]">+91 98730 83899</a>
                  </p>
                  <p className="text-xs text-slate-600">
                    Customer Desk: <a href="tel:+919873083899" className="text-slate-900 font-semibold hover:text-[#C99738]">+91 98730 83899</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 text-[#C99738] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                    Email Correspondence
                  </div>
                  <p className="text-xs text-slate-600">
                    General Inquiries: <a href="mailto:info@sunpropmart.in" className="text-slate-900 font-semibold hover:text-[#C99738]">info@sunpropmart.in</a>
                  </p>
                  <p className="text-xs text-slate-600">
                    Official & Tenders: <a href="mailto:info@sunpropmart.in" className="text-slate-900 font-semibold hover:text-[#C99738]">info@sunpropmart.in</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 text-[#C99738] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                    Business Hours
                  </div>
                  <p className="text-xs text-slate-600">
                    Monday - Saturday: 9:00 AM - 7:00 PM (IST)
                  </p>
                  <p className="text-xs text-slate-500">
                    Sunday: By prior confirmed appointment for site visits
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Enquiry Form (Col 7) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-xl font-bold text-[#0B1528] mb-2">Send Us an Official Enquiry</h2>
            <p className="text-xs text-slate-500 mb-6">
              Fill out the details below. Our assigned property specialist will respond within 2
              hours during working hours.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-emerald-900">Enquiry Submitted Successfully</h3>
                <p className="text-xs text-emerald-700 mt-1 max-w-sm mx-auto">
                  Thank you, {fullName}. Your query has been logged into our CRM system and assigned
                  to our regional consultant.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-5 px-5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rajesh Singhania"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E5B842]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98000 00000"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E5B842]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rajesh@company.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E5B842]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Inquiry Purpose</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#E5B842]"
                    >
                      <option value="Property Acquisition Enquiry">Buying a Residential Property</option>
                      <option value="Commercial Leasing Enquiry">Commercial Office / Retail Space</option>
                      <option value="Industrial Land / YEIDA Plot">Industrial / Warehouse Land</option>
                      <option value="Government Tender & Civil Works">Government Civil Tender JV</option>
                      <option value="Property Management / NRI Desk">NRI Investment Consultation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Message or Requirements</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your budget, preferred configuration (2/3/4 BHK or office sq.ft), or project specifications..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Submit Contact Enquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
