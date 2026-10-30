import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Mail, CheckCircle } from 'lucide-react';

export const BlogInsightsSection: React.FC = () => {
  const { blogPosts, navigate, showToast } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const posts = blogPosts.slice(0, 3);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed! You will receive market alerts and new launch updates.');
    setEmailInput('');
  };

  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528] tracking-tight">
              Latest News & Insights
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Real estate news, market insights and investment tips
            </p>
          </div>

          <button
            onClick={() => navigate('blog')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C99738] hover:text-[#B88528] group transition-colors"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Content Layout: 3 Articles on Left (Col 8) + Stay Updated Card on Right (Col 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Articles (3 cards) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate('blog-detail', { blogSlug: post.slug })}
                className="bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500">
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-[#C99738] text-sm mt-1 leading-snug line-clamp-2 transition-colors">
                      {post.title}
                    </h3>
                  </div>

                  <div className="mt-4 pt-2 flex items-center gap-1 text-xs font-bold text-[#C99738] group-hover:text-[#B88528]">
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stay Updated Newsletter Card (Exact from Screenshot) */}
          <div className="lg:col-span-4 bg-white rounded-xl p-6 border border-slate-200/80 shadow-md flex flex-col justify-between">
            <div className="text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-[#C99738] flex items-center justify-center mx-auto sm:mx-0 mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-[#0B1528] tracking-tight">
                Stay Updated
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Subscribe to our newsletter for the latest properties, market forecasts, and new
                launch priority allocations.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="mt-6 space-y-3">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E5B842] focus:ring-1 focus:ring-[#E5B842]"
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#E5B842] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {subscribed ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-900" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
