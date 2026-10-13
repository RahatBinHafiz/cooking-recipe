import React, { useState } from 'react';
import { Recipe } from '../types/recipe';
import { FoodImage } from './FoodImage';
import {
  formatScaledQuantity,
  getRecipeChecklist,
  toggleRecipeIngredientCheck,
} from '../services/storage';
import {
  X,
  Heart,
  Clock,
  Users,
  Utensils,
  Play,
  Printer,
  Share2,
  Plus,
  Minus,
  Check,
  ShieldAlert,
  Flame,
  Thermometer,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
  isFav: boolean;
  onToggleFavorite: (id: string) => void;
  onStartGuidedCooking: (recipe: Recipe) => void;
  onAddToShoppingList: (items: any[]) => void;
  onSelectRelatedRecipe: (recipe: Recipe) => void;
  allRecipes: Recipe[];
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  isFav,
  onToggleFavorite,
  onStartGuidedCooking,
  onAddToShoppingList,
  onSelectRelatedRecipe,
  allRecipes,
}) => {
  const [servings, setServings] = useState<number>(recipe.servings);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>(() =>
    getRecipeChecklist(recipe.id)
  );
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Scaled servings handler
  const handleServingsChange = (delta: number) => {
    setServings((prev) => Math.max(1, Math.min(24, prev + delta)));
  };

  const handleToggleCheck = (ingredientId: string) => {
    const updated = toggleRecipeIngredientCheck(recipe.id, ingredientId);
    setCheckedIngredients(updated);
  };

  const handleAddAllToShopping = () => {
    const items = recipe.ingredients.map((ing) => ({
      name: ing.name,
      quantity: ing.scalable
        ? Math.round(((ing.quantity * servings) / recipe.servings) * 10) / 10
        : ing.quantity,
      unit: ing.unit,
      category: ing.category,
      recipeSource: recipe.title,
      recipeId: recipe.id,
    }));
    onAddToShoppingList(items);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Chicken Kitchen: ${recipe.title}`,
          text: recipe.description,
          url: shareUrl,
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Find 3 related recipes (same cuisine or same difficulty, excluding current)
  const relatedRecipes = allRecipes
    .filter(
      (r) =>
        r.id !== recipe.id &&
        (r.cuisine === recipe.cuisine || r.chickenCut === recipe.chickenCut || r.difficulty === recipe.difficulty)
    )
    .slice(0, 3);

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
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 lg:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-4xl min-h-screen sm:min-h-0 sm:rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200 flex flex-col max-h-[96vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar with Close, Favorite, Share, Print */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${getDifficultyBadge(
                recipe.difficulty
              )}`}
            >
              {recipe.difficulty}
            </span>
            <span className="text-xs text-slate-500 font-medium">{recipe.cuisine}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(recipe.id)}
              className={`p-2 rounded-xl transition-colors ${
                isFav
                  ? 'bg-rose-50 text-rose-500 fill-rose-500'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-rose-500'
              }`}
              title={isFav ? 'Favorited' : 'Save to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="Share Recipe Link"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="Print Recipe"
            >
              <Printer className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors ml-1"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Recipe Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 lg:p-8 space-y-8 recipe-print-container">
          {copyFeedback && (
            <div className="bg-emerald-50 text-emerald-800 text-xs px-3 py-2 rounded-lg font-semibold flex items-center gap-2 border border-emerald-200">
              <Check className="w-4 h-4" /> Link copied to clipboard!
            </div>
          )}

          {/* Hero Image & Primary Details Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs">
              <FoodImage
                src={recipe.image}
                alt={recipe.title}
                aspectRatioClass="aspect-4/3 sm:aspect-square"
              />
            </div>

            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight leading-tight">
                  {recipe.title}
                </h1>

                <p className="text-sm text-[#667085] mt-2.5 leading-relaxed">
                  {recipe.description}
                </p>

                {/* Dietary Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                  {recipe.highProtein && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      High Protein
                    </span>
                  )}
                  {recipe.dairyFree && (
                    <span className="text-[11px] font-medium text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                      Dairy-Free
                    </span>
                  )}
                  {recipe.glutenFree && (
                    <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                      Gluten-Free
                    </span>
                  )}
                </div>
              </div>

              {/* Time & Servings KPI Grid */}
              <div className="mt-5 grid grid-cols-4 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                <div>
                  <span className="text-[11px] text-slate-500 block">Prep Time</span>
                  <span className="text-sm font-bold text-slate-800 tabular-nums">
                    {recipe.prepTimeMinutes}m
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Cook Time</span>
                  <span className="text-sm font-bold text-slate-800 tabular-nums">
                    {recipe.cookTimeMinutes}m
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Total</span>
                  <span className="text-sm font-bold text-[#173B67] tabular-nums">
                    {recipe.totalTimeMinutes}m
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Cut</span>
                  <span className="text-xs font-bold text-slate-800 truncate block">
                    {recipe.chickenCut}
                  </span>
                </div>
              </div>

              {/* Guided Cooking Mode Launch Button */}
              <div className="mt-5 no-print">
                <button
                  onClick={() => onStartGuidedCooking(recipe)}
                  className="w-full py-3.5 px-4 bg-[#FFD447] hover:bg-[#F2C32E] text-[#173B67] font-bold text-sm sm:text-base rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 hover:shadow-md"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Guided Cooking Mode</span>
                </button>
              </div>
            </div>
          </div>

          {/* Food Safety & Safe Temperature Callout */}
          <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 flex items-start gap-3">
            <Thermometer className="w-5 h-5 text-[#228B5A] shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 leading-relaxed">
              <strong className="font-bold block text-emerald-900 mb-0.5">
                Food Safety Notice: 74°C (165°F) Target Internal Temperature
              </strong>
              {recipe.foodSafetyNotes}
            </div>
          </div>

          {/* Ingredients & Equipment Section with Scaling */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-slate-200">
            {/* Ingredients Column */}
            <div className="lg:col-span-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#172033]">Ingredients</h2>
                  <p className="text-xs text-[#667085]">
                    Tick off items while you prep. Saved automatically.
                  </p>
                </div>

                {/* Servings Stepper */}
                <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1 shrink-0">
                  <span className="text-xs font-medium text-slate-600 px-2">Servings:</span>
                  <button
                    onClick={() => handleServingsChange(-1)}
                    disabled={servings <= 1}
                    className="w-7 h-7 bg-white text-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors disabled:opacity-40"
                    aria-label="Decrease servings"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-slate-900 px-2 tabular-nums min-w-[20px] text-center">
                    {servings}
                  </span>
                  <button
                    onClick={() => handleServingsChange(1)}
                    disabled={servings >= 24}
                    className="w-7 h-7 bg-white text-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors disabled:opacity-40"
                    aria-label="Increase servings"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {servings !== recipe.servings && (
                <p className="text-[11px] text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg mb-3 border border-amber-200">
                  Quantities scaled for {servings} servings (original: {recipe.servings}). Note: cooking times may vary slightly.
                </p>
              )}

              {/* Ingredient Checklist */}
              <div className="space-y-2">
                {recipe.ingredients.map((ing) => {
                  const isChecked = checkedIngredients.includes(ing.id);
                  const scaledQty = ing.scalable
                    ? formatScaledQuantity(ing.quantity, servings, recipe.servings)
                    : ing.quantity.toString();

                  return (
                    <div
                      key={ing.id}
                      onClick={() => handleToggleCheck(ing.id)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                          : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isChecked
                            ? 'bg-[#228B5A] border-[#228B5A] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="flex-1 text-xs sm:text-sm">
                        <span className="font-semibold text-slate-900 mr-1.5 tabular-nums">
                          {scaledQty} {ing.unit}
                        </span>
                        <span>{ing.name}</span>
                        {ing.preparationNotes && (
                          <span className="text-slate-500 italic ml-1">
                            ({ing.preparationNotes})
                          </span>
                        )}
                        {ing.optionalAlternative && (
                          <span className="text-amber-700 block text-[11px] mt-0.5">
                            Alternative: {ing.optionalAlternative}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add to Shopping List Button */}
              <div className="mt-4 no-print">
                <button
                  onClick={handleAddAllToShopping}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Ingredients to Shopping List</span>
                </button>
              </div>
            </div>

            {/* Equipment, Nutrition & Allergens Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Equipment */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-[#173B67]" />
                  <span>Equipment Required</span>
                </h3>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                  {recipe.equipment.map((eq, i) => (
                    <li key={i}>{eq}</li>
                  ))}
                </ul>
              </div>

              {/* Estimated Nutrition */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Estimated Nutrition (per serving)</h3>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Calories</span>
                    <strong className="font-bold text-slate-800 tabular-nums">
                      {recipe.nutritionEstimate.calories}
                    </strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Protein</span>
                    <strong className="font-bold text-emerald-700 tabular-nums">
                      {recipe.nutritionEstimate.proteinG}g
                    </strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Carbs</span>
                    <strong className="font-bold text-slate-800 tabular-nums">
                      {recipe.nutritionEstimate.carbsG}g
                    </strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Fat</span>
                    <strong className="font-bold text-slate-800 tabular-nums">
                      {recipe.nutritionEstimate.fatG}g
                    </strong>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-center">
                  *Calculated estimate based on standard chicken prep.
                </p>
              </div>

              {/* Allergens & Storage */}
              <div className="space-y-3 text-xs text-slate-600">
                <div>
                  <strong className="font-bold text-slate-800 block">Allergens:</strong>
                  <span>
                    {recipe.allergens.length > 0
                      ? recipe.allergens.join(', ')
                      : 'None declared (Naturally dairy & gluten free with safe substitutions)'}
                  </span>
                </div>

                <div>
                  <strong className="font-bold text-slate-800 block">Storage & Reheating:</strong>
                  <span>{recipe.storageInstructions}</span>
                </div>

                {recipe.substitutions.length > 0 && (
                  <div>
                    <strong className="font-bold text-slate-800 block">Chef Variations & Substitutions:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {recipe.substitutions.map((sub, i) => (
                        <li key={i}>{sub}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cooking Instructions Section */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#172033]">Step-by-Step Instructions</h2>
                <p className="text-xs text-[#667085]">
                  Follow numbered instructions with temperatures and doneness verification.
                </p>
              </div>
              <button
                onClick={() => onStartGuidedCooking(recipe)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF3C4] hover:bg-[#FFE894] text-[#8C6B00] text-xs font-bold rounded-lg transition-colors no-print"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Guided Timer Runner</span>
              </button>
            </div>

            <div className="space-y-4">
              {recipe.instructions.map((step) => (
                <div
                  key={step.step}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-[#173B67] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {step.step}
                  </div>

                  <div className="flex-1 space-y-2">
                    {step.title && (
                      <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                    )}
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                      {step.text}
                    </p>

                    {/* Step Metrics: Duration, Temp, Doneness Cue */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      {step.durationMinutes && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>~{step.durationMinutes} mins</span>
                        </span>
                      )}

                      {step.temperatureC && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 font-medium border border-amber-200">
                          <Flame className="w-3.5 h-3.5 text-amber-600" />
                          <span>
                            {step.temperatureC}°C ({step.temperatureF}°F)
                          </span>
                        </span>
                      )}

                      {step.donenessCue && (
                        <div className="w-full mt-1 p-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#228B5A] shrink-0" />
                          <span>
                            <strong>Visual Doneness:</strong> {step.donenessCue}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Recipes Section */}
          {relatedRecipes.length > 0 && (
            <div className="pt-8 border-t border-slate-200 no-print">
              <h3 className="text-lg font-bold text-slate-900 mb-3">You might also enjoy</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedRecipes.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelatedRecipe(rel)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-[#FFD447] bg-white cursor-pointer transition-all hover:-translate-y-0.5 shadow-2xs group"
                  >
                    <div className="rounded-lg overflow-hidden aspect-4/3 mb-2">
                      <FoodImage src={rel.image} alt={rel.title} aspectRatioClass="aspect-4/3" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase">
                      {rel.difficulty} · {rel.cuisine}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#173B67] line-clamp-1">
                      {rel.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      {rel.totalTimeMinutes} mins
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
