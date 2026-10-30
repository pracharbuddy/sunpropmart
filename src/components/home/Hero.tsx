import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  MapPin,
  Building,
  Home,
  Compass,
  Sparkles,
  Key,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const {
    navigate,
    setSearchQuery,
    setFilterLocation,
    setFilterPropertyType,
    setFilterListingType,
    setFilterBudget,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'buy' | 'rent' | 'projects' | 'commercial' | 'plots'>('buy');
  const [locationInput, setLocationInput] = useState('');
  const [selectedType, setSelectedType] = useState('Any');
  const [selectedBudget, setSelectedBudget] = useState('Any');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(locationInput);
    setFilterLocation(locationInput || 'Any');
    setFilterPropertyType(selectedType);
    setFilterListingType(
      activeTab === 'rent' ? 'rent' : activeTab === 'buy' ? 'sale' : 'All'
    );
    setFilterBudget(selectedBudget);

    if (activeTab === 'projects') {
      navigate('projects');
    } else {
      navigate('properties');
    }
  };

  const handleCategoryClick = (categoryName: string, listingType: string = 'All') => {
    setFilterPropertyType(categoryName);
    setFilterListingType(listingType);
    navigate('properties');
  };

  return (
    <div className="relative bg-[#070E1E] text-white overflow-hidden pb-12 sm:pb-16 w-full max-w-full">
      {/* Background Architectural Collage & Gradient */}
      <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
        <img
          src="/assets/aistudio/SunPropMart_Real_Estate_Homepage_d5574129.png"
          alt="SunPropMart Real Estate Masterpiece"
          className="w-full h-full object-cover object-top scale-105 filter blur-[1px]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070E1E] via-[#0B1528]/90 to-[#070E1E]" />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-8 sm:pt-16 lg:pt-20 relative z-10 w-full min-w-0">
        {/* Hero Top Headers */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10 min-w-0">
          <div className="max-w-3xl min-w-0">
            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded bg-amber-400/10 border border-amber-400/20 text-[#E5B842] text-[10px] sm:text-xs font-bold tracking-[0.18em] uppercase mb-3 sm:mb-4">
              <span>Find Your Dream Property</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight sm:leading-none mb-3 break-words">
              Buy <span className="text-[#E5B842]">|</span> Rent{' '}
              <span className="text-[#E5B842]">|</span> Invest
            </h1>

            <div className="text-sm sm:text-xl lg:text-2xl font-light text-amber-100/90 tracking-wide mb-3 sm:mb-4 break-words">
              Residential <span className="text-[#E5B842]">|</span> Commercial{' '}
              <span className="text-[#E5B842]">|</span> Plots
            </div>

            <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              Your trusted real estate partner for a better tomorrow. Explore verified properties,
              premium projects and the best investment opportunities with SunPropMart.
            </p>
          </div>

          {/* Artistic Script Callout "A Better Tomorrow" from Screenshot */}
          <div className="hidden lg:block text-right pr-6 pb-2 shrink-0">
            <span
              className="font-serif italic text-4xl lg:text-5xl text-[#E5B842]/90 block drop-shadow-md select-none transform -rotate-3"
              style={{ fontFamily: "'Playfair Display', cursive, serif" }}
            >
              A Better
              <br />
              <span className="ml-6">Tomorrow</span>
            </span>
          </div>
        </div>

        {/* Search Engine Container */}
        <div className="bg-[#0D182E]/95 border border-white/10 rounded-2xl shadow-2xl p-3.5 sm:p-6 backdrop-blur-md w-full min-w-0">
          {/* Search Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 border-b border-white/10 pb-3">
            {[
              { id: 'buy', label: 'Buy' },
              { id: 'rent', label: 'Rent' },
              { id: 'projects', label: 'Projects' },
              { id: 'commercial', label: 'Commercial' },
              { id: 'plots', label: 'Plots / Land' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'commercial') setSelectedType('Office');
                  else if (tab.id === 'plots') setSelectedType('Residential Plot');
                  else setSelectedType('Any');
                }}
                className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#E5B842] text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center w-full min-w-0"
          >
            {/* Location Input */}
            <div className="lg:col-span-5 relative w-full min-w-0">
              <MapPin className="w-4 h-4 text-[#E5B842] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter location, city or project..."
                className="w-full min-w-0 bg-[#070D1A] border border-white/15 rounded-lg py-2.5 sm:py-3 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#E5B842] focus:ring-1 focus:ring-[#E5B842]"
              />
            </div>

            {/* Property Type Dropdown */}
            <div className="lg:col-span-3 relative w-full min-w-0">
              <label className="text-[10px] text-slate-400 block mb-0.5 ml-1">Property Type</label>
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full min-w-0 bg-[#070D1A] border border-white/15 rounded-lg py-2.5 px-3 pr-8 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E5B842] appearance-none cursor-pointer"
                >
                  <option value="Any">Any Property Type</option>
                  <option value="Apartment">Apartment / Flat</option>
                  <option value="Villa">Luxury Villa</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Builder Floor">Builder Floor</option>
                  <option value="Office">Office Space</option>
                  <option value="Shop">Shop / Retail Showroom</option>
                  <option value="Residential Plot">Residential Plot</option>
                  <option value="Commercial Plot">Commercial Plot</option>
                  <option value="Industrial Land">Industrial Land</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Budget Dropdown */}
            <div className="lg:col-span-2 relative w-full min-w-0">
              <label className="text-[10px] text-slate-400 block mb-0.5 ml-1">Budget</label>
              <div className="relative">
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full min-w-0 bg-[#070D1A] border border-white/15 rounded-lg py-2.5 px-3 pr-8 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E5B842] appearance-none cursor-pointer"
                >
                  <option value="Any">Any Budget</option>
                  <option value="under-50l">Under ₹50 Lac</option>
                  <option value="50l-1cr">₹50 Lac - ₹1 Cr</option>
                  <option value="1cr-2cr">₹1 Cr - ₹2 Cr</option>
                  <option value="above-2cr">Above ₹2 Cr</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-2 sm:col-span-2 pt-1 sm:pt-4 lg:pt-3 w-full min-w-0">
              <button
                type="submit"
                className="w-full bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-extrabold py-2.5 sm:py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/25 transition-all text-xs sm:text-sm uppercase tracking-wider cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>

        {/* Quick Category Icons Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mt-6 sm:mt-8 w-full min-w-0">
          {[
            {
              title: 'Residential Properties',
              icon: Home,
              action: () => handleCategoryClick('Apartment', 'sale'),
            },
            {
              title: 'Commercial Properties',
              icon: Building,
              action: () => handleCategoryClick('Office', 'sale'),
            },
            {
              title: 'Plots & Land',
              icon: Compass,
              action: () => handleCategoryClick('Residential Plot', 'sale'),
            },
            {
              title: 'New Projects',
              icon: Sparkles,
              action: () => navigate('projects'),
            },
            {
              title: 'Ready to Move',
              icon: Key,
              action: () => {
                setFilterListingType('sale');
                navigate('properties');
              },
            },
            {
              title: 'Rental Properties',
              icon: ShieldCheck,
              action: () => {
                setFilterListingType('rent');
                navigate('properties');
              },
            },
          ].map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <button
                key={idx}
                onClick={cat.action}
                className="group p-2.5 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#E5B842]/50 transition-all text-center flex flex-col items-center justify-center gap-2 hover:-translate-y-1 cursor-pointer min-w-0"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-400/10 group-hover:bg-[#E5B842] text-[#E5B842] group-hover:text-slate-950 flex items-center justify-center transition-colors shrink-0">
                  <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-200 group-hover:text-white leading-tight truncate max-w-full">
                  {cat.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
