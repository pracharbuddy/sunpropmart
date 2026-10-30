import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Property, PropertyType } from '../../types';
import {
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Heart,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const PropertyList: React.FC<{ onOpenEnquiryModal: () => void }> = ({
  onOpenEnquiryModal,
}) => {
  const {
    properties,
    navigate,
    favorites,
    toggleFavorite,
    searchQuery,
    setSearchQuery,
    filterLocation,
    setFilterLocation,
    filterPropertyType,
    setFilterPropertyType,
    filterListingType,
    setFilterListingType,
    filterBudget,
    setFilterBudget,
  } = useApp();

  const [sortBy, setSortBy] = useState<'latest' | 'price-asc' | 'price-desc' | 'area'>('latest');
  const [selectedBeds, setSelectedBeds] = useState<number | 'all'>('all');
  const [selectedFurnishing, setSelectedFurnishing] = useState<string>('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Locations list
  const availableLocations = [
    'All Locations',
    'Greater Noida West',
    'Noida',
    'Yamuna Expressway',
    'Greater Noida',
    'Ghaziabad',
    'Delhi NCR',
  ];

  // Property Types list
  const propertyTypes: PropertyType[] = [
    'Apartment',
    'Villa',
    'Independent House',
    'Builder Floor',
    'Office',
    'Shop',
    'Showroom',
    'Warehouse',
    'Residential Plot',
    'Commercial Plot',
    'Industrial Land',
  ];

  // Filter logic (Server-like client processing for fast interactive response)
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => p.status === 'published' && !p.deleted_at)
      .filter((p) => {
        // Keyword Search
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchLoc = p.locality.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchId = p.property_id.toLowerCase().includes(q);
          if (!matchTitle && !matchLoc && !matchDesc && !matchId) return false;
        }

        // Location Filter
        if (filterLocation && filterLocation !== 'Any' && filterLocation !== 'All Locations') {
          if (!p.city.toLowerCase().includes(filterLocation.toLowerCase()) &&
              !p.locality.toLowerCase().includes(filterLocation.toLowerCase())) {
            return false;
          }
        }

        // Property Type Filter
        if (filterPropertyType && filterPropertyType !== 'Any') {
          if (p.property_type !== filterPropertyType) return false;
        }

        // Listing Type Filter
        if (filterListingType && filterListingType !== 'All') {
          if (p.listing_type !== filterListingType) return false;
        }

        // Bedrooms Filter
        if (selectedBeds !== 'all') {
          if (p.bedrooms !== selectedBeds) return false;
        }

        // Furnishing Filter
        if (selectedFurnishing !== 'all') {
          if (p.furnishing !== selectedFurnishing) return false;
        }

        // Budget Filter
        if (filterBudget && filterBudget !== 'Any') {
          if (filterBudget === 'under-50l' && p.price > 5000000) return false;
          if (filterBudget === '50l-1cr' && (p.price < 5000000 || p.price > 10000000)) return false;
          if (filterBudget === '1cr-2cr' && (p.price < 10000000 || p.price > 20000000)) return false;
          if (filterBudget === 'above-2cr' && p.price < 20000000) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'area') return b.area - a.area;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [
    properties,
    searchQuery,
    filterLocation,
    filterPropertyType,
    filterListingType,
    selectedBeds,
    selectedFurnishing,
    filterBudget,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setFilterLocation('Any');
    setFilterPropertyType('Any');
    setFilterListingType('All');
    setFilterBudget('Any');
    setSelectedBeds('all');
    setSelectedFurnishing('all');
    setSortBy('latest');
  };

  const formatPrice = (prop: Property) => {
    if (prop.listing_type === 'rent' && prop.rent) {
      return `₹${prop.rent.toLocaleString('en-IN')} / mo`;
    }
    if (prop.price >= 10000000) {
      return `₹${(prop.price / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    return `₹${(prop.price / 100000).toFixed(0)} Lac`;
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <button onClick={() => navigate('home')} className="hover:text-slate-900">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-900">Properties</span>
        </div>

        {/* Page Title & Search Bar */}
        <div className="bg-[#0B1528] rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#E5B842] uppercase block mb-1">
              Verified Real Estate Portfolio
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Explore Properties for Sale & Rent
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              All properties are verified with clear titles, sanctioned maps, and authorized by
              SunPropMart.
            </p>

            {/* Keyword Search Input */}
            <div className="mt-6 flex items-center bg-white rounded-xl p-1.5 shadow-lg border border-white/20">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by project name, sector, locality or property ID..."
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Filters + Main Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden flex items-center justify-between col-span-1 bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-900">
              {filteredProperties.length} Properties Found
            </span>
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1528] text-white text-xs font-bold"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Desktop Left Sidebar Filters */}
          <aside
            className={`lg:col-span-3 bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-6 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#C99738]" />
                <h3 className="font-bold text-slate-900 text-sm">Refine Search</h3>
              </div>
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#C99738] hover:text-[#B88528] font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Listing Type Tabs */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Listing Type</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                {['All', 'sale', 'rent'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterListingType(type)}
                    className={`py-1.5 rounded text-center capitalize transition-colors ${
                      filterListingType === type
                        ? 'bg-white text-slate-950 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {type === 'sale' ? 'Buy' : type === 'rent' ? 'Rent' : 'All'}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Location</label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#E5B842]"
              >
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Property Type</label>
              <select
                value={filterPropertyType}
                onChange={(e) => setFilterPropertyType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#E5B842]"
              >
                <option value="Any">All Property Types</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Filter */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Budget</label>
              <select
                value={filterBudget}
                onChange={(e) => setFilterBudget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#E5B842]"
              >
                <option value="Any">Any Budget</option>
                <option value="under-50l">Under ₹50 Lac</option>
                <option value="50l-1cr">₹50 Lac - ₹1 Cr</option>
                <option value="1cr-2cr">₹1 Cr - ₹2 Cr</option>
                <option value="above-2cr">Above ₹2 Cr</option>
              </select>
            </div>

            {/* Bedrooms Filter */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Bedrooms</label>
              <div className="flex flex-wrap gap-1.5">
                {['all', 1, 2, 3, 4].map((bed) => (
                  <button
                    key={bed}
                    onClick={() => setSelectedBeds(bed as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      selectedBeds === bed
                        ? 'bg-[#0B1528] text-white border-[#0B1528]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {bed === 'all' ? 'Any' : `${bed} BHK`}
                  </button>
                ))}
              </div>
            </div>

            {/* Furnishing */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Furnishing</label>
              <div className="space-y-1.5 text-xs">
                {['all', 'Furnished', 'Semi-Furnished', 'Unfurnished'].map((f) => (
                  <label
                    key={f}
                    className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900"
                  >
                    <input
                      type="radio"
                      name="furnishing"
                      checked={selectedFurnishing === f}
                      onChange={() => setSelectedFurnishing(f)}
                      className="text-[#C99738] focus:ring-amber-400"
                    />
                    <span>{f === 'all' ? 'All Furnishings' : f}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 space-y-6">
            {/* Top Toolbar: Results count & Sort */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs font-semibold text-slate-600">
                Showing <strong className="text-slate-900">{filteredProperties.length}</strong>{' '}
                verified properties
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 whitespace-nowrap">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-900 focus:outline-none focus:border-[#E5B842]"
                >
                  <option value="latest">Latest Listed</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="area">Area: Largest First</option>
                </select>
              </div>
            </div>

            {/* Empty State */}
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-[#C99738] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No properties match your criteria</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Try widening your budget, changing the location filter, or resetting all filters
                  to explore our complete inventory.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-5 px-5 py-2.5 rounded-lg bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Properties Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property) => {
                  const isFav = favorites.includes(property.id);

                  return (
                    <div
                      key={property.id}
                      className="bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col group cursor-pointer"
                      onClick={() =>
                        navigate('property-detail', { propertySlug: property.slug })
                      }
                    >
                      {/* Image Frame */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                        <img
                          src={property.featured_image}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                          {property.tag && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-[#E5B842] text-slate-950 shadow-sm">
                              {property.tag}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-[#0B1528] text-white shadow-sm">
                            {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
                          </span>
                        </div>

                        {/* Favorite button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(property.id);
                          }}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
                            isFav
                              ? 'bg-rose-500 text-white'
                              : 'bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>

                        {/* Title Verified */}
                        {property.is_verified && (
                          <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[11px] font-mono text-slate-400 mb-0.5">
                            {property.property_id}
                          </div>
                          <h3 className="font-bold text-slate-900 group-hover:text-[#C99738] transition-colors line-clamp-1 text-base">
                            {property.title}
                          </h3>

                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 line-clamp-1">
                            <MapPin className="w-3.5 h-3.5 text-[#C99738] shrink-0" />
                            <span>
                              {property.locality}, {property.city}
                            </span>
                          </div>

                          <div className="mt-3 flex items-baseline justify-between">
                            <span className="text-xl font-extrabold text-[#0B1528] tracking-tight">
                              {formatPrice(property)}
                            </span>
                            {property.price_per_sqft && (
                              <span className="text-[11px] text-slate-400">
                                ₹{property.price_per_sqft}/sq.ft
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Specs Strip */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                          {property.bedrooms ? (
                            <div className="flex items-center gap-1">
                              <Bed className="w-3.5 h-3.5 text-slate-400" />
                              <span>{property.bedrooms} Beds</span>
                            </div>
                          ) : null}

                          {property.bathrooms ? (
                            <div className="flex items-center gap-1">
                              <Bath className="w-3.5 h-3.5 text-slate-400" />
                              <span>{property.bathrooms} Baths</span>
                            </div>
                          ) : null}

                          <div className="flex items-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{property.area} Sq.ft</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
