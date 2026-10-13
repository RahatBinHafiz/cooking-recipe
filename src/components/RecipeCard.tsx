import React from 'react';
import { Recipe } from '../types/recipe';
import { FoodImage } from './FoodImage';
import { Clock, Users, UtensilsCrossed, Heart, Flame } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  isFav: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFav,
  onToggleFavorite,
  onSelectRecipe,
}) => {
  // Brand complementary difficulty styling
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-[#FFF3C4] text-[#8C6B00] border-amber-200/80';
      case 'Medium':
        return 'bg-[#DCEEFF] text-[#0F4C81] border-sky-200/80';
      case 'Hard':
        return 'bg-[#E0E7FF] text-[#3730A3] border-indigo-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <article
      onClick={() => onSelectRecipe(recipe)}
      className="group relative bg-white rounded-2xl border border-[#E7ECF2] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col h-full focus-within:ring-2 focus-within:ring-[#FFD447]"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectRecipe(recipe);
        }
      }}
      aria-label={`View recipe: ${recipe.title}`}
    >
      {/* Recipe Image with Favorite Overlay */}
      <div className="relative overflow-hidden aspect-4/3 w-full">
        <FoodImage src={recipe.image} alt={recipe.title} aspectRatioClass="aspect-4/3" />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(e, recipe.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
            isFav
              ? 'bg-white text-rose-500 fill-rose-500 hover:scale-110'
              : 'bg-white/85 text-slate-600 hover:text-rose-500 hover:bg-white hover:scale-110'
          }`}
          aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Cuisine & Difficulty strip at image bottom */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getDifficultyBadge(
              recipe.difficulty
            )} shadow-2xs backdrop-blur-sm`}
          >
            {recipe.difficulty}
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/95 text-slate-800 border border-slate-200/80 shadow-2xs backdrop-blur-sm">
            {recipe.cuisine}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Zero-pill discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-[#667085] mb-1.5">
            <span>{recipe.chickenCut}</span>
            <span aria-hidden="true">·</span>
            <span>{recipe.cookingMethods[0]}</span>
            {recipe.spicyLevel !== 'Mild' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-0.5 text-amber-700 font-medium">
                  <Flame className="w-3 h-3 text-amber-500 inline" />
                  {recipe.spicyLevel}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-[#172033] group-hover:text-[#173B67] transition-colors line-clamp-1 leading-snug">
            {recipe.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-[#667085] mt-1.5 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Footer Metrics (Tabular Discipline) */}
        <div className="pt-3.5 mt-3 border-t border-[#E7ECF2] flex items-center justify-between text-xs text-[#667085]">
          <div className="flex items-center gap-1.5 font-medium" title="Total Cooking Time">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="tabular-nums font-semibold text-slate-800">
              {recipe.totalTimeMinutes}m
            </span>
          </div>

          <div className="flex items-center gap-1.5" title="Number of Ingredients">
            <UtensilsCrossed className="w-3.5 h-3.5 text-slate-400" />
            <span className="tabular-nums">
              <strong className="font-semibold text-slate-800">{recipe.ingredients.length}</strong> ingr.
            </span>
          </div>

          <div className="flex items-center gap-1.5" title="Servings">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="tabular-nums">
              <strong className="font-semibold text-slate-800">{recipe.servings}</strong> serv.
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
