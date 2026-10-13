import React from 'react';
import { ChefHat, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Difficulty } from '../types/recipe';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onSelectDifficulty: (d: Difficulty) => void;
  onOpenSafetyGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onSelectDifficulty,
  onOpenSafetyGuide,
}) => {
  return (
    <footer className="bg-[#172033] text-slate-300 pt-16 pb-12 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FFD447] flex items-center justify-center text-[#173B67] shadow-sm">
                <ChefHat className="w-6 h-6 stroke-[2.25]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Chicken Kitchen
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your next favorite chicken dish starts here. Dedicated to authentic, foolproof chicken dishes from around the world—organized from easiest meals to chef-level masterclasses.
            </p>
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Grounded in verified 74°C (165°F) food safety standards.</span>
            </div>
          </div>

          {/* Skill Levels Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Skill Levels</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onSelectDifficulty('Easy')}
                  className="hover:text-[#FFD447] transition-colors"
                >
                  Easy Recipes (64 Beginner Staples)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDifficulty('Medium')}
                  className="hover:text-[#FFD447] transition-colors"
                >
                  Medium Recipes (62 Intermediate Dishes)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDifficulty('Hard')}
                  className="hover:text-[#FFD447] transition-colors"
                >
                  Hard Recipes (29 Chef Masterclasses)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('explore')}
                  className="hover:text-[#FFD447] transition-colors"
                >
                  Browse Complete Catalog
                </button>
              </li>
            </ul>
          </div>

          {/* Regional Heritage & Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Curated Collections</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onSelectTab('explore')}
                  className="hover:text-[#FFD447] transition-colors"
                >
                  Start Here: 10 Easy Recipes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('explore')}
                  className="hover:text-[#FFD447] transition-colors"
                >
                  Cook Something in 30 Minutes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('cuisines')}
                  className="hover:text-[#FFD447] transition-colors"
                >
                  Bangladeshi Chicken Favorites
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('explore')}
                  className="hover:text-[#FFD447] transition-colors"
                >
                  Impress Your Guests
                </button>
              </li>
            </ul>
          </div>

          {/* Safety & Kitchen Tools */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Kitchen Guides</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={onOpenSafetyGuide}
                  className="hover:text-[#FFD447] transition-colors text-emerald-400 font-semibold"
                >
                  Food Safety & Temps
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('favorites')}
                  className="hover:text-[#FFD447] transition-colors"
                >
                  Your Saved Favorites
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Chicken Kitchen. Built for passionate home cooks.</p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>Crafted with love for good food</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
