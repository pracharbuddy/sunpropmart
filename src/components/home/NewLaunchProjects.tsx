import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, ArrowRight } from 'lucide-react';

export const NewLaunchProjects: React.FC = () => {
  const { projects, navigate } = useApp();

  // Pick first 4 residential/commercial new launch projects
  const launchList = projects
    .filter((p) => p.project_type.includes('Projects') && p.status !== 'archived')
    .slice(0, 4);

  return (
    <section className="py-16 bg-white border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528] tracking-tight">
              New Launch Projects
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Explore the best new launch projects
            </p>
          </div>

          <button
            onClick={() => navigate('projects')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C99738] hover:text-[#B88528] group transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {launchList.map((project, idx) => {
            const tags = ['New Launch', 'Upcoming', 'New Launch', 'Pre-Launch'];
            const tag = tags[idx % tags.length];

            return (
              <div
                key={project.id}
                className="bg-[#F8FAFC] rounded-xl overflow-hidden border border-slate-200/80 hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
                onClick={() => navigate('project-detail', { projectSlug: project.slug })}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={project.cover_image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide bg-[#E5B842] text-slate-950 shadow-sm">
                      {tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-[#C99738] transition-colors text-base line-clamp-1">
                      {project.name}
                    </h3>

                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C99738] shrink-0" />
                      <span>{project.location}</span>
                    </div>

                    <div className="mt-3">
                      <span className="text-base font-extrabold text-[#0B1528]">
                        {project.highlights?.[0] || '₹75 Lac Onwards'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5">
                      {project.highlights?.[1] || '2, 3 & 4 BHK'}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('project-detail', { projectSlug: project.slug });
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider text-center transition-all cursor-pointer"
                    >
                      View Details
                    </button>
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
