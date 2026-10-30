import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BlogPost } from '../../types';
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Share2,
  Tag,
} from 'lucide-react';

export const BlogView: React.FC = () => {
  const { blogPosts, selectedBlogSlug, navigate, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const detailedPost = selectedBlogSlug
    ? blogPosts.find((b) => b.slug === selectedBlogSlug)
    : null;

  const categories = ['All', 'Market Insights', 'Investment Advisory', 'Buyer Guide'];

  const filteredPosts = blogPosts.filter((post) => {
    if (selectedCategory !== 'All' && post.category !== selectedCategory) return false;
    return post.status === 'published';
  });

  if (detailedPost) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <button onClick={() => navigate('home')} className="hover:text-slate-900">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button onClick={() => navigate('blog')} className="hover:text-slate-900">
              Blog
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-900 truncate">{detailedPost.title}</span>
          </div>

          <button
            onClick={() => navigate('blog')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C99738] hover:text-[#B88528] mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all articles</span>
          </button>

          {/* Article Article Container */}
          <article className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#C99738] uppercase">
                {detailedPost.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B1528] tracking-tight mt-1 mb-4">
                {detailedPost.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{detailedPost.author_name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {new Date(detailedPost.published_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{detailedPost.read_time}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="rounded-xl overflow-hidden aspect-[16/9] bg-slate-100">
              <img
                src={detailedPost.featured_image}
                alt={detailedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Body */}
            <div
              className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4 pt-4"
              dangerouslySetInnerHTML={{ __html: detailedPost.content }}
            />

            {/* Tags */}
            {detailedPost.tags && detailedPost.tags.length > 0 && (
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {detailedPost.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Banner */}
        <div className="bg-[#0B1528] rounded-2xl p-8 sm:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold tracking-[0.2em] text-[#E5B842] uppercase block mb-1">
              Editorial & Intelligence
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Real Estate News & Insights
            </h1>
            <p className="text-sm text-slate-300 mt-2">
              Expert market forecasts, Jewar airport growth corridor reports, and home financing
              guides curated by our senior analysts.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-white p-3 rounded-xl border border-slate-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0B1528] text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => navigate('blog-detail', { blogSlug: post.slug })}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#E5B842] text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
                  {post.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mb-2">
                    <span>
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span>·</span>
                    <span>{post.read_time}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 group-hover:text-[#C99738] text-base leading-snug line-clamp-2 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">By {post.author_name}</span>
                  <span className="text-xs font-bold text-[#C99738] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
