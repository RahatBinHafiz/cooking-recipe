import React, { useState, useMemo, useEffect } from 'react';
import {
  allRecipes,
  CUISINES,
  COOKING_METHODS,
  CHICKEN_CUTS,
  QUICK_CATEGORIES,
  CURATED_COLLECTIONS,
} from './data/recipes';
import { Recipe, Difficulty, Cuisine, SortOption } from './types/recipe';
import {
  getFavoriteRecipeIds,
  toggleFavorite,
  getShoppingList,
  addIngredientsToShoppingList,
  saveShoppingList,
  getRecentlyViewedIds,
  addRecentlyViewed,
  clearRecentlyViewed,
} from './services/storage';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SkillLevelCards } from './components/SkillLevelCards';
import { RecipeCard } from './components/RecipeCard';
import { FilterBar, FilterState } from './components/FilterBar';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { GuidedCookingModal } from './components/GuidedCookingModal';
import { ShoppingListModal } from './components/ShoppingListModal';
import { PantryMatcherModal } from './components/PantryMatcherModal';
import { FoodSafetyModal } from './components/FoodSafetyModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Footer } from './components/Footer';

import {
  Sparkles,
  Heart,
  Clock,
  Compass,
  Utensils,
  ChevronRight,
  ShieldCheck,
  Flame,
  Search,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

const initialFilters: FilterState = {
  search: '',
  difficulty: 'All',
  cuisine: 'All',
  chickenCut: 'All',
  cookingMethod: 'All',
  maxTime: null,
  spicyLevel: 'All',
  dietary: {
    highProtein: false,
    dairyFree: false,
    glutenFree: false,
    lowCarb: false,
    budgetFriendly: false,
  },
  sort: 'easiest', // DEFAULT: Easiest First as mandated!
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'explore' | 'levels' | 'cuisines' | 'favorites'>('home');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getFavoriteRecipeIds());
  const [shoppingItems, setShoppingItems] = useState(() => getShoppingList());
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => getRecentlyViewedIds());

  // Modals state
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeGuidedRecipe, setActiveGuidedRecipe] = useState<Recipe | null>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showPantryMatcher, setShowPantryMatcher] = useState(false);
  const [showSafetyGuide, setShowSafetyGuide] = useState(false);

  // Toast feedback state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync favorites
  const handleToggleFavorite = (e: React.MouseEvent | null, recipeId: string) => {
    if (e) e.stopPropagation();
    const updated = toggleFavorite(recipeId);
    setFavoriteIds(updated);
    const isNowFav = updated.includes(recipeId);
    const target = allRecipes.find((r) => r.id === recipeId);
    if (target) {
      addToast(
        isNowFav ? 'Saved to Favorites' : 'Removed from Favorites',
        target.title,
        isNowFav ? 'success' : 'info'
      );
    }
  };

  const handleOpenRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    addRecentlyViewed(recipe.id);
    setRecentlyViewedIds(getRecentlyViewedIds());
  };

  // Shopping list handlers
  const handleAddToShoppingList = (itemsToAdd: any[]) => {
    const updated = addIngredientsToShoppingList(itemsToAdd);
    setShoppingItems(updated);
    addToast('Added to Shopping List', `${itemsToAdd.length} items added successfully.`);
  };

  const handleToggleShoppingItem = (id: string) => {
    const updated = shoppingItems.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setShoppingItems(updated);
    saveShoppingList(updated);
  };

  const handleDeleteShoppingItem = (id: string) => {
    const updated = shoppingItems.filter((i) => i.id !== id);
    setShoppingItems(updated);
    saveShoppingList(updated);
  };

  const handleClearCompletedShopping = () => {
    const updated = shoppingItems.filter((i) => !i.checked);
    setShoppingItems(updated);
    saveShoppingList(updated);
    addToast('Shopping List Cleaned', 'Completed items cleared.');
  };

  const handleAddCustomShoppingItem = (name: string, quantity: number, unit: string, category: any) => {
    const updated = addIngredientsToShoppingList([{ name, quantity, unit, category, recipeSource: 'Custom' }]);
    setShoppingItems(updated);
    addToast('Item Added', `${name} added to your shopping list.`);
  };

  // Skill difficulty card navigation
  const handleSelectDifficulty = (diff: Difficulty) => {
    setFilters({ ...initialFilters, difficulty: diff });
    setCurrentTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick category chip handler
  const handleQuickCategoryClick = (category: string) => {
    if (category === 'Under 15 Minutes') {
      setFilters({ ...initialFilters, maxTime: 15 });
    } else if (category === 'Under 30 Minutes') {
      setFilters({ ...initialFilters, maxTime: 30 });
    } else if (category === 'Beginner Friendly') {
      setFilters({ ...initialFilters, difficulty: 'Easy' });
    } else if (category === 'High Protein') {
      setFilters({
        ...initialFilters,
        dietary: { ...initialFilters.dietary, highProtein: true },
      });
    } else if (category === 'Air Fryer') {
      setFilters({ ...initialFilters, cookingMethod: 'Air-Fried' });
    } else if (category === 'One-Pot Meals') {
      setFilters({ ...initialFilters, cookingMethod: 'One-Pot Meals' });
    } else if (category === 'Spicy') {
      setFilters({ ...initialFilters, spicyLevel: 'Medium' });
    } else if (category === 'Budget Friendly') {
      setFilters({
        ...initialFilters,
        dietary: { ...initialFilters.dietary, budgetFriendly: true },
      });
    } else {
      setFilters({ ...initialFilters, search: category });
    }
    setCurrentTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCuisineCardClick = (cuisine: Cuisine) => {
    setFilters({ ...initialFilters, cuisine });
    setCurrentTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter & Sort Logic
  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((r) => {
      // Search text across title, description, ingredients, cuisine, methods, and tags
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const searchTerms = query.split(/\s+/).filter(Boolean);

        const searchableFields = [
          r.title,
          r.description,
          r.cuisine,
          r.chickenCut,
          ...r.cookingMethods,
          ...r.tags,
          ...(r.categories || []),
          ...r.ingredients.map((ing) => ing.name),
        ].join(' ').toLowerCase();

        // Direct full query substring match OR all individual tokens match
        const directMatch = searchableFields.includes(query);
        const allTermsMatch = searchTerms.every((term) => searchableFields.includes(term));

        if (!directMatch && !allTermsMatch) {
          return false;
        }
      }

      // Difficulty
      if (filters.difficulty !== 'All' && r.difficulty !== filters.difficulty) {
        return false;
      }

      // Cuisine
      if (filters.cuisine !== 'All' && r.cuisine !== filters.cuisine) {
        return false;
      }

      // Chicken cut
      if (filters.chickenCut !== 'All' && r.chickenCut !== filters.chickenCut) {
        return false;
      }

      // Cooking method
      if (filters.cookingMethod !== 'All' && !r.cookingMethods.includes(filters.cookingMethod)) {
        return false;
      }

      // Max time
      if (filters.maxTime !== null && r.totalTimeMinutes > filters.maxTime) {
        return false;
      }

      // Spicy
      if (filters.spicyLevel !== 'All' && r.spicyLevel !== filters.spicyLevel) {
        return false;
      }

      // Dietary
      if (filters.dietary.highProtein && !r.highProtein) return false;
      if (filters.dietary.dairyFree && !r.dairyFree) return false;
      if (filters.dietary.glutenFree && !r.glutenFree) return false;
      if (filters.dietary.lowCarb && !r.lowCarb) return false;
      if (filters.dietary.budgetFriendly && !r.budgetFriendly) return false;

      return true;
    });
  }, [filters]);

  // Sorting
  const sortedRecipes = useMemo(() => {
    const list = [...filteredRecipes];
    const difficultyWeight = { Easy: 1, Medium: 2, Hard: 3 };

    switch (filters.sort) {
      case 'easiest':
        // Default requirement: Easy -> Medium -> Hard, then by estimated complexity/time
        return list.sort((a, b) => {
          const diff = difficultyWeight[a.difficulty] - difficultyWeight[b.difficulty];
          if (diff !== 0) return diff;
          return a.totalTimeMinutes - b.totalTimeMinutes;
        });

      case 'hardest':
        return list.sort((a, b) => {
          const diff = difficultyWeight[b.difficulty] - difficultyWeight[a.difficulty];
          if (diff !== 0) return diff;
          return b.totalTimeMinutes - a.totalTimeMinutes;
        });

      case 'fastest':
        return list.sort((a, b) => a.totalTimeMinutes - b.totalTimeMinutes);

      case 'longest':
        return list.sort((a, b) => b.totalTimeMinutes - a.totalTimeMinutes);

      case 'alphabetical':
        return list.sort((a, b) => a.title.localeCompare(b.title));

      case 'newest':
        return list.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));

      default:
        return list;
    }
  }, [filteredRecipes, filters.sort]);

  // Counts for skill level badges
  const easyCount = allRecipes.filter((r) => r.difficulty === 'Easy').length;
  const mediumCount = allRecipes.filter((r) => r.difficulty === 'Medium').length;
  const hardCount = allRecipes.filter((r) => r.difficulty === 'Hard').length;

  // Favorite recipes list
  const favoriteRecipes = allRecipes.filter((r) => favoriteIds.includes(r.id));

  // Recently viewed recipes
  const recentlyViewedRecipes = allRecipes.filter((r) => recentlyViewedIds.includes(r.id));

  // Popular recipes sample
  const popularRecipes = allRecipes.filter((r) => r.isPopular).slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#172033] font-sans selection:bg-[#FFD447] selection:text-[#173B67]">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab: any) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        favoritesCount={favoriteIds.length}
        shoppingListCount={shoppingItems.filter((i) => !i.checked).length}
        onOpenShoppingList={() => setShowShoppingList(true)}
        onOpenPantryMatcher={() => setShowPantryMatcher(true)}
        onOpenFoodSafety={() => setShowSafetyGuide(true)}
        searchQuery={filters.search}
        onSearchChange={(q) => setFilters((prev) => ({ ...prev, search: q }))}
      />

      <main className="flex-1">
        {/* ======================= HOME TAB ======================= */}
        {currentTab === 'home' && (
          <div>
            {/* Hero Section */}
            <Hero
              searchQuery={filters.search}
              onSearchChange={(q) => {
                setFilters((prev) => ({ ...prev, search: q }));
                setCurrentTab('explore');
              }}
              onExploreClick={() => {
                setCurrentTab('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBeginnerClick={() => handleSelectDifficulty('Easy')}
              onOpenSafetyGuide={() => setShowSafetyGuide(true)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 mt-4">
              {/* Quick Category Chips Section (Section 4.B) */}
              <section className="overflow-x-auto pb-2 scrollbar-none">
                <div className="flex items-center gap-2 min-w-max">
                  {QUICK_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleQuickCategoryClick(cat)}
                      className="px-4 py-2 bg-white hover:bg-[#FFD447] text-slate-800 hover:text-[#173B67] font-semibold text-xs rounded-xl border border-slate-200/90 shadow-2xs transition-all whitespace-nowrap hover:scale-105 active:scale-95"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </section>

              {/* Start with your skill level (Section 4.C) */}
              <SkillLevelCards
                onSelectDifficulty={handleSelectDifficulty}
                easyCount={easyCount}
                mediumCount={mediumCount}
                hardCount={hardCount}
              />

              {/* Curated Collections Showcase */}
              <section className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#172033]">
                      Featured Collections
                    </h2>
                    <p className="text-sm text-[#667085] mt-0.5">
                      Curated handpicked selections for specific dining moments.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {CURATED_COLLECTIONS.map((col) => {
                    const count = allRecipes.filter(col.filterFn).length;
                    return (
                      <div
                        key={col.id}
                        onClick={() => {
                          if (col.id === 'bangladeshi-favorites') {
                            setFilters({ ...initialFilters, cuisine: 'Bangladeshi' });
                          } else if (col.id === 'under-30-mins') {
                            setFilters({ ...initialFilters, maxTime: 30 });
                          } else if (col.id === 'start-here-10') {
                            setFilters({ ...initialFilters, difficulty: 'Easy' });
                          } else {
                            setFilters({ ...initialFilters, difficulty: 'Hard' });
                          }
                          setCurrentTab('explore');
                        }}
                        className="p-5 rounded-2xl bg-white border border-[#E7ECF2] hover:border-[#173B67] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        <div>
                          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                            {col.tagline}
                          </span>
                          <h3 className="text-base font-bold text-[#172033] group-hover:text-[#173B67] transition-colors leading-snug">
                            {col.title}
                          </h3>
                          <p className="text-xs text-[#667085] mt-1.5 line-clamp-2">
                            {col.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#173B67]">
                          <span className="tabular-nums text-slate-500">{count} dishes</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Popular Chicken Recipes (Section 4.D) */}
              <section className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#172033]">
                      Popular Chicken Dishes
                    </h2>
                    <p className="text-sm text-[#667085] mt-0.5">
                      World-renowned crowd favorites with proven flavor.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentTab('explore');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-[#173B67] hover:underline flex items-center gap-1"
                  >
                    <span>View all {allRecipes.length}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {popularRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFav={favoriteIds.includes(recipe.id)}
                      onToggleFavorite={(e) => handleToggleFavorite(e, recipe.id)}
                      onSelectRecipe={handleOpenRecipe}
                    />
                  ))}
                </div>
              </section>

              {/* Explore by Cuisine (Section 4.E) */}
              <section className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#172033]">
                      Explore by Cuisine
                    </h2>
                    <p className="text-sm text-[#667085] mt-0.5">
                      Travel the globe through authentic regional chicken preparations.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {CUISINES.map((cuisine) => {
                    const count = allRecipes.filter((r) => r.cuisine === cuisine).length;
                    return (
                      <button
                        key={cuisine}
                        onClick={() => handleCuisineCardClick(cuisine)}
                        className="p-3.5 bg-white hover:bg-slate-50 border border-[#E7ECF2] hover:border-[#FFD447] rounded-xl text-left shadow-2xs transition-all group"
                      >
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#173B67] transition-colors truncate">
                          {cuisine}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-medium tabular-nums mt-0.5 block">
                          {count} recipes
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Cooking by Method (Section 4.F) */}
              <section className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#172033]">
                      Cooking by Method
                    </h2>
                    <p className="text-sm text-[#667085] mt-0.5">
                      Choose the culinary technique that suits your kitchen tonight.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                  {COOKING_METHODS.map((method) => {
                    const count = allRecipes.filter((r) => r.cookingMethods.includes(method)).length;
                    return (
                      <button
                        key={method}
                        onClick={() => {
                          setFilters({ ...initialFilters, cookingMethod: method });
                          setCurrentTab('explore');
                        }}
                        className="p-3 bg-white hover:bg-amber-50/50 border border-[#E7ECF2] rounded-xl text-left transition-all"
                      >
                        <h4 className="text-xs font-bold text-slate-800 truncate">{method}</h4>
                        <span className="text-[10px] text-slate-500 tabular-nums block mt-0.5">
                          {count} dishes
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Personalized Sections: Recently Viewed (Section 4.G) */}
              {recentlyViewedRecipes.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-[#172033]">Recently Viewed</h2>
                      <p className="text-xs text-[#667085]">Dishes you checked out recently.</p>
                    </div>
                    <button
                      onClick={() => {
                        clearRecentlyViewed();
                        setRecentlyViewedIds([]);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Clear History
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recentlyViewedRecipes.slice(0, 4).map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        isFav={favoriteIds.includes(recipe.id)}
                        onToggleFavorite={(e) => handleToggleFavorite(e, recipe.id)}
                        onSelectRecipe={handleOpenRecipe}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}

        {/* ======================= EXPLORE TAB ======================= */}
        {currentTab === 'explore' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold text-[#172033] tracking-tight">
                Explore Chicken Recipes
              </h1>
              <p className="text-sm text-[#667085] mt-1">
                Discover dishes organized from easiest weeknight staples to advanced masterclasses.
              </p>
            </div>

            {/* Filter Bar with real client-side multi-filtering & default Easiest First sorting */}
            <FilterBar
              filters={filters}
              onChangeFilters={setFilters}
              onResetFilters={() => setFilters(initialFilters)}
              resultCount={sortedRecipes.length}
              totalCount={allRecipes.length}
            />

            {/* Recipes Grid */}
            {sortedRecipes.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
                <Utensils className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No recipes match these filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your search query or relaxing your dietary and cooking method constraints.
                </p>
                <button
                  onClick={() => setFilters(initialFilters)}
                  className="px-4 py-2 bg-[#FFD447] text-[#173B67] text-xs font-bold rounded-xl shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {sortedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFav={favoriteIds.includes(recipe.id)}
                    onToggleFavorite={(e) => handleToggleFavorite(e, recipe.id)}
                    onSelectRecipe={handleOpenRecipe}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================= LEVELS TAB ======================= */}
        {currentTab === 'levels' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            <div>
              <h1 className="text-3xl font-extrabold text-[#172033] tracking-tight">
                Cooking by Skill Level
              </h1>
              <p className="text-sm text-[#667085] mt-1">
                Find recipes tailored to your current confidence in the kitchen.
              </p>
            </div>

            <SkillLevelCards
              onSelectDifficulty={handleSelectDifficulty}
              easyCount={easyCount}
              mediumCount={mediumCount}
              hardCount={hardCount}
            />

            {/* Easy Sample Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#172033]">Beginner Staples (Easy)</h3>
                  <p className="text-xs text-slate-500">Fast, forgiving, and guaranteed delicious.</p>
                </div>
                <button
                  onClick={() => handleSelectDifficulty('Easy')}
                  className="text-xs font-bold text-[#173B67] hover:underline"
                >
                  View all {easyCount}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {allRecipes
                  .filter((r) => r.difficulty === 'Easy')
                  .slice(0, 4)
                  .map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFav={favoriteIds.includes(recipe.id)}
                      onToggleFavorite={(e) => handleToggleFavorite(e, recipe.id)}
                      onSelectRecipe={handleOpenRecipe}
                    />
                  ))}
              </div>
            </div>

            {/* Medium Sample Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#172033]">Intermediate Cooking (Medium)</h3>
                  <p className="text-xs text-slate-500">Pan reductions, slow curries, and biryanis.</p>
                </div>
                <button
                  onClick={() => handleSelectDifficulty('Medium')}
                  className="text-xs font-bold text-[#173B67] hover:underline"
                >
                  View all {mediumCount}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {allRecipes
                  .filter((r) => r.difficulty === 'Medium')
                  .slice(0, 4)
                  .map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFav={favoriteIds.includes(recipe.id)}
                      onToggleFavorite={(e) => handleToggleFavorite(e, recipe.id)}
                      onSelectRecipe={handleOpenRecipe}
                    />
                  ))}
              </div>
            </div>

            {/* Hard Sample Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#172033]">Chef & Masterclasses (Hard)</h3>
                  <p className="text-xs text-slate-500">Ballotines, clarified stocks, and terrines.</p>
                </div>
                <button
                  onClick={() => handleSelectDifficulty('Hard')}
                  className="text-xs font-bold text-[#173B67] hover:underline"
                >
                  View all {hardCount}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {allRecipes
                  .filter((r) => r.difficulty === 'Hard')
                  .slice(0, 4)
                  .map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFav={favoriteIds.includes(recipe.id)}
                      onToggleFavorite={(e) => handleToggleFavorite(e, recipe.id)}
                      onSelectRecipe={handleOpenRecipe}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================= CUISINES TAB ======================= */}
        {currentTab === 'cuisines' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#172033] tracking-tight">
                Global Chicken Cuisines
              </h1>
              <p className="text-sm text-[#667085] mt-1">
                Authentic recipes from 19 culinary traditions around the globe.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {CUISINES.map((cuisine) => {
                const cuisineRecipes = allRecipes.filter((r) => r.cuisine === cuisine);
                return (
                  <div
                    key={cuisine}
                    onClick={() => handleCuisineCardClick(cuisine)}
                    className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 hover:border-[#173B67] shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#173B67] transition-colors">
                        {cuisine}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {cuisineRecipes.map((r) => r.title).slice(0, 2).join(', ')}...
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#173B67]">
                      <span className="tabular-nums text-slate-500">{cuisineRecipes.length} recipes</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================= FAVORITES TAB ======================= */}
        {currentTab === 'favorites' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-[#172033] tracking-tight">
                  Your Favorite Dishes
                </h1>
                <p className="text-sm text-[#667085] mt-1">
                  Saved chicken recipes ready for your kitchen.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500 tabular-nums">
                {favoriteRecipes.length} saved
              </span>
            </div>

            {favoriteRecipes.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
                <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No favorites saved yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Tap the heart icon on any recipe card to save your favorite dishes here for fast access.
                </p>
                <button
                  onClick={() => setCurrentTab('explore')}
                  className="px-5 py-2.5 bg-[#FFD447] text-[#173B67] text-xs font-bold rounded-xl shadow-xs"
                >
                  Explore Recipes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {favoriteRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFav={true}
                    onToggleFavorite={(e) => handleToggleFavorite(e, recipe.id)}
                    onSelectRecipe={handleOpenRecipe}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={(tab: any) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectDifficulty={handleSelectDifficulty}
        onOpenSafetyGuide={() => setShowSafetyGuide(true)}
      />

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isFav={favoriteIds.includes(selectedRecipe.id)}
          onToggleFavorite={(id) => handleToggleFavorite(null, id)}
          onStartGuidedCooking={(recipe) => {
            setSelectedRecipe(null);
            setActiveGuidedRecipe(recipe);
          }}
          onAddToShoppingList={handleAddToShoppingList}
          onSelectRelatedRecipe={handleOpenRecipe}
          allRecipes={allRecipes}
        />
      )}

      {/* Guided Cooking Mode Full-Screen Runner */}
      {activeGuidedRecipe && (
        <GuidedCookingModal
          recipe={activeGuidedRecipe}
          onClose={() => setActiveGuidedRecipe(null)}
          onFinishCooking={(id) => {
            addToast('Recipe Completed!', `Great job cooking ${activeGuidedRecipe.title}.`);
          }}
        />
      )}

      {/* Shopping List Modal */}
      {showShoppingList && (
        <ShoppingListModal
          items={shoppingItems}
          onClose={() => setShowShoppingList(false)}
          onToggleItem={handleToggleShoppingItem}
          onDeleteItem={handleDeleteShoppingItem}
          onClearCompleted={handleClearCompletedShopping}
          onAddCustomItem={handleAddCustomShoppingItem}
        />
      )}

      {/* Pantry Ingredient Matcher Modal */}
      {showPantryMatcher && (
        <PantryMatcherModal
          allRecipes={allRecipes}
          onClose={() => setShowPantryMatcher(false)}
          onSelectRecipe={handleOpenRecipe}
        />
      )}

      {/* Food Safety Modal */}
      {showSafetyGuide && <FoodSafetyModal onClose={() => setShowSafetyGuide(false)} />}

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
