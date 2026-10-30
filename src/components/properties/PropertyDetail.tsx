import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Compass,
  Car,
  Layers,
  ShieldCheck,
  Check,
  Phone,
  MessageCircle,
  Clock,
  Heart,
  Share2,
  ChevronRight,
  ArrowLeft,
  Calculator,
  FileText,
  Video,
} from 'lucide-react';

interface PropertyDetailProps {
  onOpenEnquiryModal: (property?: Property) => void;
  onOpenSiteVisitModal: (property?: Property) => void;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({
  onOpenEnquiryModal,
  onOpenSiteVisitModal,
}) => {
  const { properties, selectedPropertySlug, navigate, favorites, toggleFavorite, showToast } =
    useApp();

  // Find active property by slug or default to first
  const property =
    properties.find((p) => p.slug === selectedPropertySlug) ||
    properties.find((p) => p.status === 'published') ||
    properties[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(
    property ? Math.round(property.price * 0.8) : 8000000
  );
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  if (!property) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold">Property not found</h2>
        <button onClick={() => navigate('properties')} className="mt-4 text-[#C99738] underline">
          Back to Properties
        </button>
      </div>
    );
  }

  const allImages =
    property.gallery_images && property.gallery_images.length > 0
      ? property.gallery_images
      : [property.featured_image];

  const isFav = favorites.includes(property.id);

  // EMI Calculation: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const monthlyEMI = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1) || 0
  );

  const formatPrice = (p: Property) => {
    if (p.listing_type === 'rent' && p.rent) {
      return `₹${p.rent.toLocaleString('en-IN')} / month`;
    }
    if (p.price >= 10000000) {
      return `₹${(p.price / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    return `₹${(p.price / 100000).toFixed(2)} Lac`;
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Property link copied to clipboard!');
    }
  };

  // Similar properties
  const similarProperties = properties
    .filter(
      (p) =>
        p.id !== property.id &&
        p.status === 'published' &&
        (p.city === property.city || p.property_type === property.property_type)
    )
    .slice(0, 3);

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8">
      {/* Schema.org JSON-LD Script for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': property.property_type === 'Apartment' ? 'Apartment' : 'Residence',
            name: property.title,
            description: property.description,
            image: property.featured_image,
            identifier: property.property_id,
            address: {
              '@type': 'PostalAddress',
              streetAddress: property.address,
              addressLocality: property.city,
              addressRegion: property.state,
              postalCode: property.pincode,
              addressCountry: 'IN',
            },
            offers: {
              '@type': 'Offer',
              price: property.price,
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
            },
          }),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
            <button
              onClick={() => navigate('home')}
              className="hover:text-slate-900 transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <button
              onClick={() => navigate('properties')}
              className="hover:text-slate-900 transition-colors"
            >
              Properties
            </button>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold text-slate-900 truncate">{property.title}</span>
          </div>

          <button
            onClick={() => navigate('properties')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C99738] hover:text-[#B88528] shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to listings</span>
          </button>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                {property.property_id}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#E5B842] text-slate-950 px-2.5 py-0.5 rounded">
                {property.tag || 'Verified Listing'}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#0B1528] text-white px-2.5 py-0.5 rounded">
                {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
              {property.rera_number && (
                <span className="text-xs text-slate-500 font-mono">
                  RERA: {property.rera_number}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528] tracking-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
              <MapPin className="w-4 h-4 text-[#C99738] shrink-0" />
              <span>{property.address}</span>
            </div>
          </div>

          {/* Pricing & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:text-right shrink-0">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#0B1528]">
                {formatPrice(property)}
              </div>
              {property.price_per_sqft && (
                <div className="text-xs text-slate-500">
                  ₹{property.price_per_sqft.toLocaleString('en-IN')}/sq.ft
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(property.id)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isFav
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                title="Share Property"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-10 space-y-3">
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-lg">
            <img
              src={allImages[activeImageIndex] || property.featured_image}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {property.is_verified && (
              <div className="absolute top-4 left-4 bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Title Verified by SunPropMart Legal Team</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#E5B842] ring-2 ring-amber-400/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Grid: Details (Col 8) + Consultant Card (Col 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview Strip */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <h2 className="text-lg font-bold text-[#0B1528] mb-4">Property Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                {property.bedrooms ? (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                      <Bed className="w-4 h-4 text-[#C99738]" />
                      <span>Bedrooms</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">{property.bedrooms} BHK</div>
                  </div>
                ) : null}

                {property.bathrooms ? (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                      <Bath className="w-4 h-4 text-[#C99738]" />
                      <span>Bathrooms</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">{property.bathrooms} Baths</div>
                  </div>
                ) : null}

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                    <Maximize2 className="w-4 h-4 text-[#C99738]" />
                    <span>Super Area</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{property.area} Sq.ft</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                    <Layers className="w-4 h-4 text-[#C99738]" />
                    <span>Floor Level</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {property.floor || 1} of {property.total_floors || 20}
                  </div>
                </div>

                {property.facing && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                      <Compass className="w-4 h-4 text-[#C99738]" />
                      <span>Facing</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">{property.facing}</div>
                  </div>
                )}

                {property.furnishing && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                      <Layers className="w-4 h-4 text-[#C99738]" />
                      <span>Furnishing</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">{property.furnishing}</div>
                  </div>
                )}

                {property.parking !== undefined && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                      <Car className="w-4 h-4 text-[#C99738]" />
                      <span>Reserved Parking</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">{property.parking} Covered</div>
                  </div>
                )}

                {property.construction_year && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                      <Calendar className="w-4 h-4 text-[#C99738]" />
                      <span>Year Built</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {property.construction_year}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <h2 className="text-lg font-bold text-[#0B1528] mb-3">About This Property</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <h2 className="text-lg font-bold text-[#0B1528] mb-4">Amenities & Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floor Plan */}
            {property.floor_plan_url && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#0B1528]">Sanctioned Floor Plan</h2>
                  <span className="text-xs text-[#C99738] font-bold">RERA Approved Layout</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2">
                  <img
                    src={property.floor_plan_url}
                    alt="Floor Plan"
                    className="w-full max-h-96 object-contain mx-auto"
                  />
                </div>
              </div>
            )}

            {/* EMI Calculator */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-[#C99738]" />
                <h2 className="text-lg font-bold text-[#0B1528]">Home Loan EMI Calculator</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Loan Amount (₹): {loanAmount.toLocaleString('en-IN')}
                  </label>
                  <input
                    type="range"
                    min="1000000"
                    max="50000000"
                    step="100000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Interest Rate (%): {interestRate}%
                  </label>
                  <input
                    type="range"
                    min="7"
                    max="14"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Tenure: {tenureYears} Years
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-[#0B1528] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-300">Estimated Monthly EMI</div>
                  <div className="text-2xl font-black text-[#E5B842]">
                    ₹{monthlyEMI.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-slate-300">/ month</span>
                  </div>
                </div>
                <div className="text-xs text-slate-300">
                  Pre-approved with SBI, HDFC, ICICI & Axis Bank
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Assigned Consultant & Booking CTA */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Consultant Profile Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
              <div className="text-xs font-bold uppercase tracking-wider text-[#C99738] mb-3">
                Assigned Property Consultant
              </div>

              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                  alt={property.assigned_agent_name || 'Rahul Sharma'}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-400/50"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {property.assigned_agent_name || 'Rahul Sharma'}
                  </h3>
                  <div className="text-xs text-slate-500">Senior Property Specialist</div>
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>SunPropMart Authorized</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <a
                  href={`tel:${property.assigned_agent_phone || '+919811234567'}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0B1528] hover:bg-[#162746] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#E5B842]" />
                  <span>Call {property.assigned_agent_phone || '+91 98112 34567'}</span>
                </a>

                <a
                  href={`https://wa.me/919811234567?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(
                    property.title
                  )}%20(${property.property_id})`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <button
                  onClick={() => onOpenSiteVisitModal(property)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Site Visit</span>
                </button>

                <button
                  onClick={() => onOpenEnquiryModal(property)}
                  className="w-full py-2.5 px-4 rounded-xl border-2 border-slate-300 hover:border-[#0B1528] text-slate-900 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Send Enquiry</span>
                </button>
              </div>

              {/* Trust Box */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Zero brokerage on new builder launches</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free doorstep legal documentation review</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dedicated AC site-visit vehicle provided</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1528] mb-6">
              Similar Verified Properties
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((simProp) => (
                <div
                  key={simProp.id}
                  onClick={() => {
                    navigate('property-detail', { propertySlug: simProp.slug });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={simProp.featured_image}
                      alt={simProp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2 bg-[#E5B842] text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded">
                      {simProp.tag || 'Verified'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 group-hover:text-[#C99738] text-sm truncate">
                      {simProp.title}
                    </h3>
                    <div className="text-xs text-slate-500 mt-1 truncate">
                      {simProp.locality}, {simProp.city}
                    </div>
                    <div className="mt-2 text-base font-extrabold text-[#0B1528]">
                      {formatPrice(simProp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
