import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { BLOG_ARTICLES } from '../data/articles';
import { Article } from '../types';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Check,
  Copy,
  Twitter,
  Linkedin,
  Facebook,
  MessageCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  List,
  ChevronRight,
  Play,
  Star,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  Tag,
  ExternalLink,
  Award,
} from 'lucide-react';

export const ArticleDetailView: React.FC = () => {
  const { currentArticleSlug, openArticle, setCurrentView, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Find article by slug, or fallback to first
  const article: Article =
    BLOG_ARTICLES.find((a) => a.slug === currentArticleSlug) || BLOG_ARTICLES[0];

  // Update dynamic document title, meta description, and Schema.org JSON-LD
  useEffect(() => {
    if (!article) return;

    // Document title
    document.title = `${article.metaTitle}`;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', article.metaDescription);
    }

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', `https://lingoloop.app/blog/${article.slug}`);

    // OpenGraph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', article.metaTitle);
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', article.metaDescription);
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `https://lingoloop.app/blog/${article.slug}`);

    // Schema.org Article & FAQPage Structured Data (JSON-LD)
    const jsonLdScriptId = 'article-structured-data';
    let scriptTag = document.getElementById(jsonLdScriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = jsonLdScriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.metaDescription,
          image: article.coverImage,
          datePublished: '2026-10-10T08:00:00+00:00',
          dateModified: '2026-10-14T09:00:00+00:00',
          keywords: [article.primaryKeyword, ...article.secondaryKeywords].join(', '),
          author: {
            '@type': 'Person',
            name: article.author.name,
            jobTitle: article.author.role,
          },
          publisher: {
            '@type': 'Organization',
            name: 'LingoLoop',
            logo: {
              '@type': 'ImageObject',
              url: window.location.origin + '/favicon.ico',
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': window.location.href,
          },
        },
        {
          '@type': 'FAQPage',
          mainEntity: article.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      ],
    };

    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      document.title = 'LingoLoop – Learn a Language Online with Free Courses';
      let canLink = document.querySelector('link[rel="canonical"]');
      if (canLink) {
        canLink.setAttribute('href', 'https://lingoloop.app/');
      }
      let metaD = document.querySelector('meta[name="description"]');
      if (metaD) {
        metaD.setAttribute(
          'content',
          'Learn a language online with LingoLoop. Access free language courses and interactive language practice to build daily speaking fluency in foreign languages.'
        );
      }
    };
  }, [article]);

  // Track scroll reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.round((window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    try {
      const url = `${window.location.origin}/blog/${article.slug}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      showToast('Clean article URL copied to clipboard! 📋', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Link copied!', 'info');
    }
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(`${window.location.origin}/blog/${article.slug}`);
    const text = encodeURIComponent(`Check out this guide: "${article.title}" on LingoLoop!`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(`${window.location.origin}/blog/${article.slug}`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(`${window.location.origin}/blog/${article.slug}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const url = encodeURIComponent(`${window.location.origin}/blog/${article.slug}`);
    const text = encodeURIComponent(`Read "${article.title}": `);
    window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Find related articles
  const relatedArticles = article.relatedArticleSlugs
    .map((slug) => BLOG_ARTICLES.find((a) => a.slug === slug))
    .filter((a): a is Article => Boolean(a))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-18 left-0 right-0 z-30 h-1 bg-slate-200">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Breadcrumb Navigation & Back to Hub Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('blog')}
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All 10 Guides</span>
          </button>

          <nav className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <button onClick={() => setCurrentView('home')} className="hover:text-slate-600">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button onClick={() => setCurrentView('blog')} className="hover:text-slate-600">Blog</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-700 font-bold truncate max-w-[220px]">{article.title}</span>
          </nav>
        </div>

        {/* Article Header Card */}
        <header className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-black uppercase tracking-wider">
              {article.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {article.publishedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {article.readTimeMinutes} min read
            </span>
            <span>•</span>
            <span className="text-slate-400 font-mono text-[11px]">
              Primary Keyword: <strong className="text-indigo-600">{article.primaryKeyword}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            {article.summary}
          </p>

          {/* Author Card + Social Share Ribbon */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl p-2 rounded-2xl bg-indigo-50 border border-indigo-100">
                {article.author.avatar}
              </div>
              <div>
                <div className="text-sm font-black text-slate-900">{article.author.name}</div>
                <div className="text-xs text-slate-400">{article.author.role}</div>
              </div>
            </div>

            {/* Social Share Icons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5" /> Share:
              </span>
              <button
                onClick={handleShareTwitter}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 flex items-center justify-center transition-colors"
                title="Share on X"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={handleShareLinkedIn}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </button>
              <button
                onClick={handleShareFacebook}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 flex items-center justify-center transition-colors"
                title="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 flex items-center justify-center transition-colors"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyLink}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  copied
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                title="Copy clean article URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Cover Photo */}
        <div className="relative rounded-3xl overflow-hidden shadow-md max-h-[440px] bg-slate-900 border-2 border-slate-200">
          <img
            src={article.coverImage}
            alt={article.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-white text-[11px] font-semibold">
            {article.imageAlt}
          </div>
        </div>

        {/* Content Body Layout: Sidebar Table of Contents + Main Text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sticky Table of Contents (Desktop) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 text-xs font-black uppercase tracking-wider text-slate-700">
                <List className="w-4 h-4 text-indigo-600" />
                <span>Table of Contents</span>
              </div>
              <nav className="space-y-1.5">
                {article.tableOfContents.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="w-full text-left p-2 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60 transition-all flex items-start gap-2 group"
                  >
                    <span className="text-slate-300 group-hover:text-indigo-500 font-mono text-[11px]">
                      0{idx + 1}.
                    </span>
                    <span className="line-clamp-2">{item.title}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Practice Promo Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-5 text-white shadow-md space-y-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <h4 className="font-black text-sm">Practice Free on LingoLoop</h4>
              <p className="text-xs text-indigo-100">
                Turn reading into conversational ability with short 3-minute interactive lessons.
              </p>
              <button
                onClick={() => setCurrentView('learn')}
                className="w-full py-2.5 bg-white hover:bg-slate-100 text-indigo-700 font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-indigo-700" />
                <span>Start Free Lesson</span>
              </button>
            </div>
          </aside>

          {/* Right Main Article Content */}
          <main className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200/80 shadow-sm space-y-10">
            {/* Introduction Section */}
            <div className="space-y-3 text-slate-700 text-sm sm:text-base leading-relaxed font-normal border-b border-slate-100 pb-8">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                Introduction
              </span>
              {article.introduction.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Main Article Sections */}
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28 space-y-4">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pb-2 border-b border-slate-100">
                  {section.heading}
                </h2>

                <div className="space-y-3 text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                  {section.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>

                {/* Callout Box */}
                {section.callout && (
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border-2 my-4 ${
                      section.callout.type === 'tip'
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                        : section.callout.type === 'quote'
                        ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950 italic'
                        : 'bg-amber-50/80 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="text-xs font-black uppercase tracking-wider mb-1">
                      {section.callout.title}
                    </div>
                    <div className="text-xs sm:text-sm font-medium leading-relaxed">
                      {section.callout.text}
                    </div>
                  </div>
                )}

                {/* Table Reference (if section has table) */}
                {section.table && (
                  <div className="overflow-x-auto rounded-2xl border-2 border-slate-200 my-4 shadow-2xs">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-100 text-slate-800 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200">
                        <tr>
                          {section.table.headers.map((h, i) => (
                            <th key={i} className="p-3 sm:p-3.5">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {section.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-3 sm:p-3.5 font-medium text-slate-700">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Bullet Points */}
                {section.bulletPoints && (
                  <ul className="space-y-2 pl-2 my-3 text-xs sm:text-sm text-slate-700">
                    {section.bulletPoints.map((bp, bpIdx) => (
                      <li key={bpIdx} className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* Recommended Products & Tools Section */}
            {article.recommendedProducts && article.recommendedProducts.length > 0 && (
              <section id="recommended-products" className="scroll-mt-28 space-y-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Recommended Products & Tools
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  We tested and evaluated the top resources to help you achieve your goals faster:
                </p>

                <div className="grid grid-cols-1 gap-4">
                  {article.recommendedProducts.map((prod, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-white transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-black text-slate-900">{prod.name}</h3>
                            {prod.badge && (
                              <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                                {prod.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-slate-400">{prod.category}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center text-amber-500 text-xs font-black">
                            <Star className="w-4 h-4 fill-amber-400 mr-1" />
                            <span>{prod.rating} / 5.0</span>
                          </div>
                          <span className="text-xs font-extrabold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                            {prod.price}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {prod.description}
                      </p>

                      <div className="text-xs font-bold text-indigo-700 bg-indigo-50/70 px-3 py-1.5 rounded-xl inline-block">
                        Best for: <span className="font-semibold">{prod.bestFor}</span>
                      </div>

                      {prod.highlights && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {prod.highlights.map((h, hIdx) => (
                            <span key={hIdx} className="text-[11px] font-medium bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                              ✓ {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Pros and Cons Section */}
            {article.prosAndCons && (
              <section id="pros-and-cons" className="scroll-mt-28 space-y-4 pt-4 border-t border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {article.prosAndCons.title || 'Pros and Cons Analysis'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pros Column */}
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 font-black text-sm uppercase tracking-wider">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>The Advantages (Pros)</span>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-emerald-950">
                      {article.prosAndCons.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-black">✓</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons Column */}
                  <div className="p-5 rounded-2xl bg-rose-50/70 border-2 border-rose-200 space-y-3">
                    <div className="flex items-center gap-2 text-rose-800 font-black text-sm uppercase tracking-wider">
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>The Limitations (Cons)</span>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-rose-950">
                      {article.prosAndCons.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-600 font-black">✕</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* Frequently Asked Questions (FAQs) Accordion Section */}
            {article.faqs && article.faqs.length > 0 && (
              <section id="faqs" className="scroll-mt-28 space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Frequently Asked Questions (FAQs)
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Got questions? Here are clear, straightforward answers to the most common queries:
                </p>

                <div className="space-y-3 pt-2">
                  {article.faqs.map((faq, fIdx) => {
                    const isOpen = openFaqIndex === fIdx;
                    return (
                      <div
                        key={fIdx}
                        className="rounded-2xl border-2 border-slate-200 overflow-hidden transition-all bg-white"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                          className="w-full p-4 sm:p-5 text-left font-black text-sm sm:text-base text-slate-900 hover:text-indigo-600 flex items-center justify-between gap-3 transition-colors"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                              isOpen ? 'rotate-180 text-indigo-600' : ''
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Conclusion Section */}
            <section id="conclusion" className="scroll-mt-28 space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Conclusion</h2>
              <div className="space-y-3 text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                {article.conclusion.text.map((t, idx) => (
                  <p key={idx}>{t}</p>
                ))}
              </div>

              {/* Conversion CTA Box */}
              <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/15 space-y-4 mt-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  Free Interactive Practice
                </div>
                <h3 className="text-xl sm:text-2xl font-black">{article.conclusion.ctaHeadline}</h3>
                <p className="text-xs sm:text-sm text-indigo-100 font-medium">
                  {article.conclusion.ctaPrompt}
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setCurrentView('learn')}
                    className="px-6 py-3.5 bg-white hover:bg-slate-100 text-indigo-700 font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-indigo-700" />
                    <span>Start Learning Free</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('practice')}
                    className="px-6 py-3.5 bg-indigo-500/30 hover:bg-indigo-500/50 text-white font-extrabold text-sm rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Practice Hub</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Article Tags & Secondary SEO Keywords */}
            <div className="pt-6 border-t border-slate-100 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Keywords:
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-extrabold px-3 py-1 rounded-xl">
                  {article.primaryKeyword}
                </span>
                {article.secondaryKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-xl"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </main>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Related Guides & Articles
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Continue learning with handpicked complementary topics
                </p>
              </div>
              <button
                onClick={() => setCurrentView('blog')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View all 10 guides</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => openArticle(rel.slug)}
                  className="cursor-pointer bg-white rounded-3xl border-2 border-slate-200/80 shadow-xs hover:shadow-lg hover:border-indigo-300 transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-36 w-full overflow-hidden bg-slate-100">
                      <img
                        src={rel.coverImage}
                        alt={rel.imageAlt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {rel.category}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>{rel.readTimeMinutes} min read</span>
                    <span className="text-indigo-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
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
