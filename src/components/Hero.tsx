import React from 'react';
import { Search, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { FoodImage } from './FoodImage';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onExploreClick: () => void;
  onBeginnerClick: () => void;
  onOpenSafetyGuide: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onExploreClick,
  onBeginnerClick,
  onOpenSafetyGuide,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 lg:pt-12 lg:pb-16 bg-linear-to-b from-amber-50/60 via-[#F8FAFC] to-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Search */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold mb-4 tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Your next favorite chicken dish starts here</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#172033] tracking-tight leading-[1.15] text-balance">
              What are we cooking today?
            </h1>

            <p className="text-base sm:text-lg text-[#667085] mt-4 leading-relaxed max-w-2xl text-pretty">
              Explore 158+ authentic chicken recipes from quick weeknight comfort food to unforgettable chef-level masterclasses across 19 global culinary cultures.
            </p>

            {/* Prominent Search Field */}
            <div className="mt-6 w-full max-w-xl relative">
              <div className="relative flex items-center shadow-md rounded-2xl overflow-hidden bg-white border-2 border-amber-300 focus-within:border-[#173B67] transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search chicken recipes, ingredients, or cuisines..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full px-4 py-3.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  aria-label="Search recipes"
                />
                {searchQuery ? (
                  <button
                    onClick={() => onSearchChange('')}
                    className="mr-3 px-2 py-1 text-xs text-slate-400 hover:text-slate-700"
                  >
                    Clear
                  </button>
                ) : (
                  <button
                    onClick={onExploreClick}
                    className="mr-2 px-4 py-2 bg-[#FFD447] hover:bg-[#F2C32E] text-[#173B67] font-bold text-xs sm:text-sm rounded-xl transition-colors whitespace-nowrap shrink-0"
                  >
                    Find Recipe
                  </button>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreClick}
                className="px-6 py-3 rounded-xl bg-[#FFD447] hover:bg-[#F2C32E] text-[#173B67] font-bold text-sm shadow-sm transition-all flex items-center gap-2 hover:-translate-y-0.5"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Recipes</span>
              </button>

              <button
                onClick={onBeginnerClick}
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#173B67] font-semibold text-sm border-2 border-[#173B67]/20 hover:border-[#173B67] shadow-xs transition-all flex items-center gap-2"
              >
                <span>I'm a Beginner</span>
              </button>

              <button
                onClick={onOpenSafetyGuide}
                className="px-3 py-3 text-xs text-[#228B5A] hover:text-[#196b44] font-semibold flex items-center gap-1.5 transition-colors"
                title="Food Safety & Temperature Standards"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>74°C / 165°F Safety Guide</span>
              </button>
            </div>

            {/* Trust and dataset stats (Tabular Discipline) */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 w-full grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-[#173B67] tabular-nums">158+</p>
                <p className="text-xs text-[#667085] mt-0.5">Tested Recipes</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-[#173B67] tabular-nums">19</p>
                <p className="text-xs text-[#667085] mt-0.5">Global Cuisines</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-[#228B5A] tabular-nums">74°C / 165°F</p>
                <p className="text-xs text-[#667085] mt-0.5">Safe Temp Verified</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Editorial Card Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Featured hero card */}
              <div className="bg-white rounded-3xl p-3 shadow-xl border border-slate-200/80 transform hover:-rotate-1 transition-transform duration-300">
                <div className="overflow-hidden rounded-2xl relative aspect-4/3">
                  <FoodImage
                    src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80"
                    alt="Garlic Butter Chicken"
                    aspectRatioClass="aspect-4/3"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-900 border border-amber-200 shadow-xs">
                    Popular Dish of the Week
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Garlic Butter Chicken</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Seared cutlets in pan garlic butter & lemon</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#FFF3C4] text-[#8C6B00]">
                      Easy · 30m
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating mini card: South Asian Wedding Chicken Roast */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white p-3 rounded-2xl shadow-lg border border-slate-200/80 items-center gap-3 max-w-xs animate-in fade-in slide-in-from-left duration-500">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <FoodImage
                    src="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80"
                    alt="Bangladeshi Chicken Roast"
                    aspectRatioClass="aspect-square"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                    Bangladeshi Heritage
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">Biye Barir Shahi Roast</h4>
                  <p className="text-[11px] text-slate-500">Caramelized onion beresta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
