import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, MapPin } from 'lucide-react';

export const PopularLocations: React.FC = () => {
  const { navigate, setFilterLocation } = useApp();

  const locations = [
    {
      name: 'Greater Noida West',
      count: '2500+ Properties',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Noida',
      count: '4000+ Properties',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Yamuna Expressway',
      count: '1200+ Properties',
      image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Greater Noida',
      count: '3800+ Properties',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Ghaziabad',
      count: '1800+ Properties',
      image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Delhi NCR',
      count: '5200+ Properties',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleLocationClick = (locName: string) => {
    setFilterLocation(locName);
    navigate('properties');
  };

  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528] tracking-tight">
              Popular Locations
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Find properties in prime locations
            </p>
          </div>

          <button
            onClick={() => navigate('properties')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C99738] hover:text-[#B88528] group transition-colors"
          >
            <span>View All Locations</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 w-full min-w-0">
          {locations.map((loc, idx) => (
            <div
              key={idx}
              onClick={() => handleLocationClick(loc.name)}
              className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1 min-w-0"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2 left-2 text-white">
                  <MapPin className="w-3.5 h-3.5 text-[#E5B842]" />
                </div>
              </div>

              <div className="p-3 text-center">
                <h3 className="font-bold text-slate-900 group-hover:text-[#C99738] text-xs sm:text-sm transition-colors truncate">
                  {loc.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                  {loc.count}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
