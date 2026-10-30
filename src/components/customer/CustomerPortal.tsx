import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  Calendar,
  FileText,
  User,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Trash2,
  Phone,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const CustomerPortal: React.FC<{ onOpenSiteVisitModal: () => void }> = ({
  onOpenSiteVisitModal,
}) => {
  const {
    currentUser,
    properties,
    favorites,
    toggleFavorite,
    siteVisits,
    leads,
    navigate,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'favorites' | 'visits' | 'enquiries'>('favorites');

  const favoriteProps = properties.filter((p) => favorites.includes(p.id));

  const myVisits = siteVisits.filter(
    (v) =>
      v.customer_email === currentUser?.email ||
      v.customer_name === currentUser?.full_name ||
      currentUser?.role === 'customer'
  );

  const myEnquiries = leads.filter(
    (l) =>
      l.customer_email === currentUser?.email ||
      l.customer_name === currentUser?.full_name ||
      currentUser?.role === 'customer'
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Customer Header */}
        <div className="bg-[#0B1528] rounded-2xl p-6 sm:p-10 text-white shadow-xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={
                currentUser?.avatar_url ||
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'
              }
              alt=""
              className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-400"
            />
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#E5B842] uppercase block">
                SunPropMart Client Portal
              </span>
              <h1 className="text-2xl font-black">{currentUser?.full_name || 'Priya Kapoor'}</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser?.email || 'priya.k@example.com'} · {currentUser?.phone || '+91 99887 76655'}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('properties')}
            className="px-5 py-2.5 rounded-xl bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider self-start sm:self-auto shadow-md"
          >
            Explore More Properties
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-3 border-b border-slate-200 mb-8 text-xs font-bold">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'favorites'
                ? 'border-[#C99738] text-[#C99738]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Properties ({favoriteProps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('visits')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'visits'
                ? 'border-[#C99738] text-[#C99738]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Scheduled Site Visits ({myVisits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'enquiries'
                ? 'border-[#C99738] text-[#C99738]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Inquiries ({myEnquiries.length})</span>
          </button>
        </div>

        {/* Tab 1: Favorites */}
        {activeTab === 'favorites' && (
          <div>
            {favoriteProps.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No saved properties yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Browse our portfolio and tap the heart icon on any property to save it here for
                  easy comparison.
                </p>
                <button
                  onClick={() => navigate('properties')}
                  className="mt-4 px-4 py-2 rounded-lg bg-[#E5B842] text-slate-950 font-bold text-xs uppercase"
                >
                  Browse Properties
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProps.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col group cursor-pointer"
                    onClick={() => navigate('property-detail', { propertySlug: prop.slug })}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={prop.featured_image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(prop.id);
                        }}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-white text-rose-500 shadow-md hover:scale-110 transition-transform"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-[#E5B842] text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded">
                        {prop.property_type}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-[#C99738] text-sm">
                          {prop.title}
                        </h3>
                        <div className="text-xs text-slate-500 mt-1">
                          {prop.locality}, {prop.city}
                        </div>
                        <div className="text-lg font-black text-[#0B1528] mt-2">
                          ₹{(prop.price / 100000).toFixed(2)} Lac
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        {prop.bedrooms && <span>{prop.bedrooms} BHK</span>}
                        <span>{prop.area} sq.ft</span>
                        <span className="font-bold text-[#C99738] flex items-center gap-1">
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Site Visits */}
        {activeTab === 'visits' && (
          <div className="space-y-4">
            {myVisits.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No site visits scheduled</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Schedule private inspections on any property details page.
                </p>
              </div>
            ) : (
              myVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#C99738] uppercase">
                      Confirmed Site Visit
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-0.5">
                      {visit.property_title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-600 mt-2 font-mono">
                      <span>Date: {visit.visit_date}</span>
                      <span>Time: {visit.visit_time}</span>
                      <span>Consultant: {visit.assigned_agent_name || 'Rahul Sharma'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        visit.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {visit.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Enquiries */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            {myEnquiries.map((enq) => (
              <div
                key={enq.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {enq.property_title || 'General Consultation'}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">
                    Submitted on {new Date(enq.created_at).toLocaleDateString()} · Assigned to{' '}
                    {enq.assigned_agent_name || 'Senior Consultant'}
                  </div>
                  {enq.message && (
                    <p className="text-xs text-slate-600 mt-2 italic bg-slate-50 p-2 rounded">
                      &ldquo;{enq.message}&rdquo;
                    </p>
                  )}
                </div>

                <div>
                  <span className="px-3 py-1 rounded text-xs font-bold uppercase bg-slate-100 text-slate-800">
                    Status: {enq.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
