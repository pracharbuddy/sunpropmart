import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Property, Project } from '../../types';
import { X, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProperty?: Property | null;
  selectedProject?: Project | null;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  selectedProperty,
  selectedProject,
}) => {
  const { addLead, currentUser } = useApp();

  const [name, setName] = useState(currentUser?.full_name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [budget, setBudget] = useState('₹1 Cr - 1.5 Cr');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await addLead({
      customer_name: name || 'Interested Buyer',
      customer_email: email,
      customer_phone: phone,
      property_id: selectedProperty?.id,
      property_title: selectedProperty?.title,
      project_id: selectedProject?.id,
      project_name: selectedProject?.name,
      budget_range: budget,
      message,
      source: selectedProperty ? 'Property Page' : 'Website',
    });
    setLoading(false);
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-slate-200">
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">Enquiry Received</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
              Our certified property consultant has received your details and will call you
              with verified documentation and price breakdowns.
            </p>
            <button
              onClick={handleResetAndClose}
              className="mt-6 px-6 py-2.5 rounded-lg bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <span className="text-[10px] font-bold tracking-widest text-[#C99738] uppercase block">
                Official Enquiry
              </span>
              <h2 className="text-xl font-extrabold text-[#0B1528] mt-0.5">
                {selectedProperty ? `Inquire about ${selectedProperty.title}` : 'Consult Our Property Specialist'}
              </h2>
              {selectedProperty && (
                <div className="text-xs text-slate-500 mt-0.5">
                  ID: {selectedProperty.property_id} · {selectedProperty.locality}, {selectedProperty.city}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-[#E5B842]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Budget Range</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-[#E5B842]"
                >
                  <option value="Under ₹50 Lac">Under ₹50 Lac</option>
                  <option value="₹50 Lac - 1 Cr">₹50 Lac - ₹1 Cr</option>
                  <option value="₹1 Cr - 1.5 Cr">₹1 Cr - ₹1.5 Cr</option>
                  <option value="₹1.5 Cr - 2.5 Cr">₹1.5 Cr - ₹2.5 Cr</option>
                  <option value="Above ₹2.5 Cr">Above ₹2.5 Cr</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Specific Requirements or Questions</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Inquiring about home loan eligibility, high floor preferences, or possession timeline..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Submit Enquiry'}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Your contact info is never sold. 100% company privacy guarantee.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
