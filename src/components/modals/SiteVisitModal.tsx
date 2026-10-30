import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';
import { X, Calendar, Clock, Car, CheckCircle2 } from 'lucide-react';

interface SiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProperty?: Property | null;
}

export const SiteVisitModal: React.FC<SiteVisitModalProps> = ({
  isOpen,
  onClose,
  selectedProperty,
}) => {
  const { bookSiteVisit, currentUser } = useApp();

  const [name, setName] = useState(currentUser?.full_name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [date, setDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [time, setTime] = useState('11:30 AM');
  const [needPickup, setNeedPickup] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await bookSiteVisit({
      property_id: selectedProperty?.id || 'prop-001',
      property_title: selectedProperty?.title || 'SunPropMart Property',
      customer_name: name || 'Prospective Buyer',
      customer_email: email || 'buyer@example.com',
      customer_phone: phone || '+91 98000 00000',
      visit_date: date,
      visit_time: time,
      notes: `${notes} ${needPickup ? '(Client requested AC pickup)' : ''}`.trim(),
    });
    setSubmitted(true);
  };

  const handleDone = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-slate-200">
        <button
          onClick={handleDone}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">Site Visit Booked!</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
              Your private site inspection has been confirmed for <strong>{date}</strong> at{' '}
              <strong>{time}</strong>. Our senior consultant will contact you with gate pass details.
            </p>
            <button
              onClick={handleDone}
              className="mt-6 px-6 py-2.5 rounded-lg bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider"
            >
              Great, Thank You
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <span className="text-[10px] font-bold tracking-widest text-[#C99738] uppercase block">
                VIP Private Inspection
              </span>
              <h2 className="text-xl font-extrabold text-[#0B1528] mt-0.5">
                Schedule a Private Site Visit
              </h2>
              {selectedProperty && (
                <div className="text-xs text-slate-500 mt-0.5 font-medium">
                  {selectedProperty.title} ({selectedProperty.property_id})
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Preferred Time *</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-[#E5B842]"
                  >
                    <option value="10:00 AM">10:00 AM - Morning Slot</option>
                    <option value="11:30 AM">11:30 AM - Prime Morning</option>
                    <option value="02:00 PM">02:00 PM - Afternoon</option>
                    <option value="04:30 PM">04:30 PM - Evening Golden Hour</option>
                    <option value="06:00 PM">06:00 PM - Sunset Tour</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikramaditya"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

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

              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#C99738]" />
                  <span className="text-slate-800 font-semibold">Request Complimentary AC Vehicle Pickup</span>
                </div>
                <input
                  type="checkbox"
                  checked={needPickup}
                  onChange={(e) => setNeedPickup(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Special Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Visiting with family, interested in inspecting tower 3 club level..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Confirm Site Visit Reservation</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
