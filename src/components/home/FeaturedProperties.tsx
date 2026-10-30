import React from 'react';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Heart,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const FeaturedProperties: React.FC = () => {
  const { properties, navigate, favorites, toggleFavorite } = useApp();

  // Dynamically filter published properties that are featured or active
  const featuredList = properties
    .filter((p) => p.status === 'published' && !p.deleted_at)
    .slice(0, 4);

  const formatPrice = (prop: Property) => {
    if (prop.listing_type === 'rent' && prop.rent) {
      return `₹${prop.rent.toLocaleString('en-IN')} / month`;
    }
    if (prop.price >= 10000000) {
      return `₹${(prop.price / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    return `₹${(prop.price / 100000).toFixed(0)} Lac`;
  };

  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528] tracking-tight">
              Featured Properties
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Handpicked properties for you
            </p>
          </div>

          <button
            onClick={() => navigate('properties')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C99738] hover:text-[#B88528] group transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredList.map((property) => {
            const isFav = favorites.includes(property.id);

            return (
              <div
                key={property.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 flex flex-col group cursor-pointer"
                onClick={() => navigate('property-detail', { propertySlug: property.slug })}
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={property.featured_image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Subtle Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                    {property.tag && (
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide bg-[#E5B842] text-slate-950 shadow-sm">
                        {property.tag}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide bg-[#0B1528] text-white shadow-sm">
                      {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                  </div>

                  {/* Favorite Heart Button */}
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
                    title={isFav ? 'Remove from Saved' : 'Save Property'}
                    aria-label="Save property"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Verified Indicator */}
                  {property.is_verified && (
                    <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified Title</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-[#C99738] transition-colors line-clamp-1 text-base">
                      {property.title}
                    </h3>

                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C99738] shrink-0" />
                      <span>
                        {property.locality}, {property.city}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-3">
                      <span className="text-xl font-extrabold text-[#0B1528] tracking-tight">
                        {formatPrice(property)}
                      </span>
                    </div>
                  </div>

                  {/* Property Specifications Strip */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    {property.bedrooms ? (
                      <div className="flex items-center gap-1" title="Bedrooms">
                        <Bed className="w-3.5 h-3.5 text-slate-400" />
                        <span>{property.bedrooms} Beds</span>
                      </div>
                    ) : null}

                    {property.bathrooms ? (
                      <div className="flex items-center gap-1" title="Bathrooms">
                        <Bath className="w-3.5 h-3.5 text-slate-400" />
                        <span>{property.bathrooms} Baths</span>
                      </div>
                    ) : null}

                    <div className="flex items-center gap-1" title="Super Area">
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{property.area} Sq.ft</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
