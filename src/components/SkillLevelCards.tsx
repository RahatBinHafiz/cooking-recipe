import React from 'react';
import { Difficulty } from '../types/recipe';
import { Sparkles, Flame, Award, ChevronRight } from 'lucide-react';

interface SkillLevelCardsProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}

export const SkillLevelCards: React.FC<SkillLevelCardsProps> = ({
  onSelectDifficulty,
  easyCount,
  mediumCount,
  hardCount,
}) => {
  return (
    <section className="my-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#172033]">
            Start with your skill level
          </h2>
          <p className="text-sm text-[#667085] mt-0.5">
            Progress naturally from zero-stress weeknight staples to restaurant-level masterclasses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {/* Easy Card */}
        <div
          onClick={() => onSelectDifficulty('Easy')}
          className="group relative bg-white hover:bg-amber-50/50 rounded-2xl border-2 border-amber-200/90 p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSelectDifficulty('Easy');
          }}
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#FFF3C4] text-[#8C6B00] flex items-center justify-center shadow-xs">
              <Sparkles className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-xs font-bold text-amber-800 bg-[#FFF3C4] px-2.5 py-1 rounded-full tabular-nums">
              {easyCount} Recipes
            </span>
          </div>

          <div className="mt-5">
            <span className="text-xs font-bold tracking-wider uppercase text-amber-700 block mb-1">
              Beginner Friendly
            </span>
            <h3 className="text-xl font-bold text-[#172033] group-hover:text-amber-900 transition-colors">
              Easy
            </h3>
            <p className="text-sm text-[#667085] mt-1.5 leading-relaxed">
              Start cooking with confidence. Quick skillet meals, foolproof tenders, and aromatic everyday curries.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-800">
            <span>Explore Easy Recipes</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Medium Card */}
        <div
          onClick={() => onSelectDifficulty('Medium')}
          className="group relative bg-white hover:bg-sky-50/50 rounded-2xl border-2 border-sky-200/90 p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSelectDifficulty('Medium');
          }}
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#DCEEFF] text-[#0F4C81] flex items-center justify-center shadow-xs">
              <Flame className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-xs font-bold text-[#0F4C81] bg-[#DCEEFF] px-2.5 py-1 rounded-full tabular-nums">
              {mediumCount} Recipes
            </span>
          </div>

          <div className="mt-5">
            <span className="text-xs font-bold tracking-wider uppercase text-[#0F4C81] block mb-1">
              Intermediate Cooking
            </span>
            <h3 className="text-xl font-bold text-[#172033] group-hover:text-[#0F4C81] transition-colors">
              Medium
            </h3>
            <p className="text-sm text-[#667085] mt-1.5 leading-relaxed">
              Build your kitchen skills. Master slow-braised curries, pan sauces, double-fried Korean wings, and biryanis.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-sky-100 flex items-center justify-between text-xs font-bold text-[#0F4C81]">
            <span>Explore Medium Recipes</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Hard Card */}
        <div
          onClick={() => onSelectDifficulty('Hard')}
          className="group relative bg-white hover:bg-indigo-50/50 rounded-2xl border-2 border-indigo-200/90 p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSelectDifficulty('Hard');
          }}
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#E0E7FF] text-[#3730A3] flex items-center justify-center shadow-xs">
              <Award className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-xs font-bold text-[#3730A3] bg-[#E0E7FF] px-2.5 py-1 rounded-full tabular-nums">
              {hardCount} Recipes
            </span>
          </div>

          <div className="mt-5">
            <span className="text-xs font-bold tracking-wider uppercase text-[#3730A3] block mb-1">
              Chef & Advanced
            </span>
            <h3 className="text-xl font-bold text-[#172033] group-hover:text-[#3730A3] transition-colors">
              Hard
            </h3>
            <p className="text-sm text-[#667085] mt-1.5 leading-relaxed">
              Master restaurant-style dishes. Ballotine deboning, clarified consommé, French terrines, and sealed dum biryanis.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-indigo-100 flex items-center justify-between text-xs font-bold text-[#3730A3]">
            <span>Explore Hard Recipes</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
};
