import React, { useState } from 'react';
import { Recipe } from '../types/recipe';
import { COMMON_PANTRY_INGREDIENTS } from '../data/recipes';
import { FoodImage } from './FoodImage';
import { X, Sparkles, Check, ChevronRight } from 'lucide-react';

interface PantryMatcherModalProps {
  allRecipes: Recipe[];
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const PantryMatcherModal: React.FC<PantryMatcherModalProps> = ({
  allRecipes,
  onClose,
  onSelectRecipe,
}) => {
  const [selectedPantry, setSelectedPantry] = useState<string[]>([
    'Chicken breast',
    'Garlic',
    'Butter',
    'Lemon',
  ]);

  const toggleIngredient = (ing: string) => {
    setSelectedPantry((prev) =>
      prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing]
    );
  };

  // Rank recipes by how many ingredients match
  const rankedRecipes = allRecipes
    .map((recipe) => {
      const totalIngredients = recipe.ingredients.length;
      let matchCount = 0;

      for (const ing of recipe.ingredients) {
        const ingNameLower = ing.name.toLowerCase();
        for (const selected of selectedPantry) {
          if (ingNameLower.includes(selected.toLowerCase())) {
            matchCount++;
            break;
          }
        }
      }

      const matchPercent = Math.min(
        100,
        Math.round((matchCount / Math.min(totalIngredients, 8)) * 100)
      );

      return {
        recipe,
        matchCount,
        matchPercent,
      };
    })
    .filter((item) => item.matchCount > 0)
    .sort((a, b) => b.matchPercent - a.matchPercent || b.matchCount - a.matchCount)
    .slice(0, 12);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-amber-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFD447] text-[#173B67] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 stroke-[2.25]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                What’s in your kitchen?
              </h2>
              <p className="text-xs text-slate-600">
                Select ingredients you already have to discover ready-to-cook chicken dishes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ingredient Chips Selector */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200">
          <span className="block text-xs font-bold text-slate-700 mb-2.5 uppercase tracking-wider">
            Tap Ingredients You Have ({selectedPantry.length} selected):
          </span>
          <div className="flex flex-wrap gap-2">
            {COMMON_PANTRY_INGREDIENTS.map((item) => {
              const isSelected = selectedPantry.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => toggleIngredient(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#173B67] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Matching Recipes Results Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span>
              Found <strong className="font-bold text-slate-900">{rankedRecipes.length}</strong> recipes matching your pantry
            </span>
            <span className="text-amber-800 font-semibold">Ranked by ingredient overlap</span>
          </div>

          {rankedRecipes.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">Select at least one ingredient to see matching recipes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rankedRecipes.map(({ recipe, matchPercent, matchCount }) => (
                <div
                  key={recipe.id}
                  onClick={() => {
                    onSelectRecipe(recipe);
                    onClose();
                  }}
                  className="p-3 bg-white hover:bg-amber-50/40 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all cursor-pointer flex gap-3 shadow-2xs group"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                    <FoodImage src={recipe.image} alt={recipe.title} aspectRatioClass="aspect-square" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900">
                          {matchPercent}% Match
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          {recipe.difficulty}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#173B67] line-clamp-1 mt-1">
                        {recipe.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {recipe.cuisine} · {recipe.totalTimeMinutes} mins
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-amber-800 font-semibold pt-1">
                      <span>{matchCount} pantry items matched</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
