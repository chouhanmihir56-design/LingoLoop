import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BLOG_ARTICLES } from '../data/articles';
import { Article } from '../types';
import {
  BookOpen,
  Search,
  Clock,
  Sparkles,
  ArrowRight,
  Compass,
  Tag,
  Share2,
  Calendar,
} from 'lucide-react';

export const BlogHubView: React.FC = () => {
  const { openArticle, setCurrentView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Beginner Guides',
    'App Reviews',
    'Study Habits',
    'Comparisons & Culture',
    'Pronunciation',
  ];

  const filteredArticles = useMemo(() => {
    return BLOG_ARTICLES.filter((article) => {
      const matchesCategory =
        selectedCategory === 'All' || article.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.primaryKeyword.toLowerCase().includes(q) ||
        article.secondaryKeywords.some((sk) => sk.toLowerCase().includes(q)) ||
        article.tags.some((t) => t.toLowerCase().includes(q)) ||
        article.author.name.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const featuredArticle = BLOG_ARTICLES.find((a) => a.featured) || BLOG_ARTICLES[0];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 pb-28">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            LingoLoop Learning Library
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Guides, Memory Science & Fluency Secrets
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Explore 10 comprehensive guides on grammar demystification, pronunciation hacks, habits, and cultural immersion.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, vocabulary, grammar..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Categories Horizontal Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Hero Article (if on 'All' and no search query) */}
        {selectedCategory === 'All' && !searchQuery && featuredArticle && (
          <div
            onClick={() => openArticle(featuredArticle.slug)}
            className="cursor-pointer bg-white rounded-3xl border-2 border-indigo-100 shadow-md hover:shadow-xl hover:border-indigo-300 transition-all overflow-hidden group grid grid-cols-1 lg:grid-cols-12 gap-0"
          >
            <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto overflow-hidden">
              <img
                src={featuredArticle.coverImage}
                alt={featuredArticle.imageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Featured Guide
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                  <span className="bg-indigo-50 px-2.5 py-0.5 rounded-md">
                    {featuredArticle.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredArticle.readTimeMinutes} min read
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {featuredArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {featuredArticle.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="text-2xl">{featuredArticle.author.avatar}</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {featuredArticle.author.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {featuredArticle.publishedDate}
                    </div>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 10 Articles Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900">
              {searchQuery
                ? `Search results for "${searchQuery}" (${filteredArticles.length})`
                : selectedCategory === 'All'
                ? 'All 10 In-Depth Articles'
                : `${selectedCategory} (${filteredArticles.length})`}
            </h2>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200">
              <p className="text-slate-500 text-sm font-semibold">
                No guides found matching your search. Try adjusting the keywords or category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => openArticle(article.slug)}
                  className="cursor-pointer bg-white rounded-3xl border-2 border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Cover Photo */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={article.coverImage}
                        alt={article.imageAlt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm">
                        {article.category}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTimeMinutes} min
                      </span>
                    </div>

                    {/* Content Excerpt */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                        <span>{article.publishedDate}</span>
                      </div>

                      <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  {/* Footer Author & Clean Slug Link */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{article.author.avatar}</span>
                        <div className="text-left">
                          <span className="block text-[11px] font-bold text-slate-800 truncate max-w-[120px]">
                            {article.author.name}
                          </span>
                          <span className="block text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                            /blog/{article.slug.slice(0, 15)}...
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Read
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
