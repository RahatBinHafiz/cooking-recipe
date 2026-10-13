import React, { useState } from 'react';
import { Difficulty, Cuisine, ChickenCut, CookingMethod, SortOption } from '../types/recipe';
import { CUISINES, CHICKEN_CUTS, COOKING_METHODS } from '../data/recipes';
import { Filter, RotateCcw, X, ArrowUpDown, ChevronDown } from 'lucide-react';

export interface FilterState {
  search: string;
  difficulty: Difficulty | 'All';
  cuisine: Cuisine | 'All';
  chickenCut: ChickenCut | 'All';
  cookingMethod: CookingMethod | 'All';
  maxTime: number | null; // minutes
  spicyLevel: 'All' | 'Mild' | 'Medium' | 'Hot';
  dietary: {
    highProtein: boolean;
    dairyFree: boolean;
    glutenFree: boolean;
    lowCarb: boolean;
    budgetFriendly: boolean;
  };
  sort: SortOption;
}

interface FilterBarProps {
  filters: FilterState;
  onChangeFilters: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  resultCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  resultCount,
  totalCount,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleDifficultyChange = (diff: Difficulty | 'All') => {
    onChangeFilters({ ...filters, difficulty: diff });
  };

  const handleSortChange = (sort: SortOption) => {
    onChangeFilters({ ...filters, sort });
  };

  const hasActiveFilters =
    filters.difficulty !== 'All' ||
    filters.cuisine !== 'All' ||
    filters.chickenCut !== 'All' ||
    filters.cookingMethod !== 'All' ||
    filters.maxTime !== null ||
    filters.spicyLevel !== 'All' ||
    filters.dietary.highProtein ||
    filters.dietary.dairyFree ||
    filters.dietary.glutenFree ||
    filters.dietary.lowCarb ||
    filters.dietary.budgetFriendly ||
    Boolean(filters.search);

  return (
    <div className="bg-white rounded-2xl border border-[#E7ECF2] p-4 lg:p-5 shadow-xs mb-8">
      {/* Primary Row: Difficulty Segments & Sorting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Difficulty Filter Tabs (Segmented Control - Allowed as interactive buttons per Section 1.A) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => handleDifficultyChange(diff)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                filters.difficulty === diff
                  ? 'bg-white text-[#173B67] shadow-xs font-bold'
                  : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              {diff === 'All' ? 'All Difficulties' : diff}
            </button>
          ))}
        </div>

        {/* Right side controls: Sort selector and Advanced filter toggle */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-[#667085] hidden sm:inline">Sort:</span>
            <select
              value={filters.sort}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="bg-transparent font-semibold text-slate-900 focus:outline-none cursor-pointer text-xs"
              aria-label="Sort recipes by"
            >
              <option value="easiest">Easiest First (Default)</option>
              <option value="hardest">Hardest First</option>
              <option value="fastest">Fastest First (&lt;30m)</option>
              <option value="longest">Longest Cooking Time</option>
              <option value="alphabetical">Alphabetical (A–Z)</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>

          {/* Toggle More Filters */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              showAdvanced || hasActiveFilters
                ? 'bg-[#DCEEFF] text-[#173B67] border-[#173B67]/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Secondary Filter Drawer / Grid */}
      {showAdvanced && (
        <div className="mt-5 pt-5 border-t border-[#E7ECF2] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
          {/* Cuisine Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Cuisine</label>
            <select
              value={filters.cuisine}
              onChange={(e) =>
                onChangeFilters({ ...filters, cuisine: e.target.value as Cuisine | 'All' })
              }
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FFD447]"
            >
              <option value="All">All 19 Cuisines</option>
              {CUISINES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Chicken Cut */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Chicken Cut</label>
            <select
              value={filters.chickenCut}
              onChange={(e) =>
                onChangeFilters({ ...filters, chickenCut: e.target.value as ChickenCut | 'All' })
              }
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FFD447]"
            >
              <option value="All">All Cuts (Breast, Thigh, etc.)</option>
              {CHICKEN_CUTS.map((cut) => (
                <option key={cut} value={cut}>
                  {cut}
                </option>
              ))}
            </select>
          </div>

          {/* Cooking Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Cooking Method</label>
            <select
              value={filters.cookingMethod}
              onChange={(e) =>
                onChangeFilters({
                  ...filters,
                  cookingMethod: e.target.value as CookingMethod | 'All',
                })
              }
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FFD447]"
            >
              <option value="All">All Methods (Pan-Fried, Baked, etc.)</option>
              {COOKING_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          {/* Max Cooking Time */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Max Cooking Time</label>
            <select
              value={filters.maxTime ?? ''}
              onChange={(e) =>
                onChangeFilters({
                  ...filters,
                  maxTime: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FFD447]"
            >
              <option value="">Any Duration</option>
              <option value="15">Under 15 Minutes</option>
              <option value="30">Under 30 Minutes</option>
              <option value="45">Under 45 Minutes</option>
              <option value="60">Under 60 Minutes</option>
            </select>
          </div>

          {/* Dietary Checkboxes */}
          <div className="sm:col-span-2 lg:col-span-4 pt-2">
            <span className="block text-xs font-bold text-slate-700 mb-2">Dietary Preferences</span>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.dietary.highProtein}
                  onChange={(e) =>
                    onChangeFilters({
                      ...filters,
                      dietary: { ...filters.dietary, highProtein: e.target.checked },
                    })
                  }
                  className="rounded text-[#173B67] focus:ring-[#FFD447]"
                />
                <span>High Protein (&gt;35g)</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.dietary.dairyFree}
                  onChange={(e) =>
                    onChangeFilters({
                      ...filters,
                      dietary: { ...filters.dietary, dairyFree: e.target.checked },
                    })
                  }
                  className="rounded text-[#173B67] focus:ring-[#FFD447]"
                />
                <span>Dairy-Free</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.dietary.glutenFree}
                  onChange={(e) =>
                    onChangeFilters({
                      ...filters,
                      dietary: { ...filters.dietary, glutenFree: e.target.checked },
                    })
                  }
                  className="rounded text-[#173B67] focus:ring-[#FFD447]"
                />
                <span>Gluten-Free</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.dietary.lowCarb}
                  onChange={(e) =>
                    onChangeFilters({
                      ...filters,
                      dietary: { ...filters.dietary, lowCarb: e.target.checked },
                    })
                  }
                  className="rounded text-[#173B67] focus:ring-[#FFD447]"
                />
                <span>Low-Carb / Keto</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.dietary.budgetFriendly}
                  onChange={(e) =>
                    onChangeFilters({
                      ...filters,
                      dietary: { ...filters.dietary, budgetFriendly: e.target.checked },
                    })
                  }
                  className="rounded text-[#173B67] focus:ring-[#FFD447]"
                />
                <span>Budget Friendly</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Result Count Status Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#667085]">
        <span>
          Showing <strong className="font-bold text-slate-900 tabular-nums">{resultCount}</strong> of{' '}
          <span className="tabular-nums">{totalCount}</span> recipes
        </span>

        {filters.sort === 'easiest' && (
          <span className="text-amber-800 font-medium">Sorted: Easy → Medium → Hard</span>
        )}
      </div>
    </div>
  );
};
