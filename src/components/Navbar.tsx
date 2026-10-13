import React from 'react';
import { ChefHat, Heart, ShoppingBag, Search, Sparkles, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  favoritesCount: number;
  shoppingListCount: number;
  onOpenShoppingList: () => void;
  onOpenPantryMatcher: () => void;
  onOpenFoodSafety: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onFocusSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  favoritesCount,
  shoppingListCount,
  onOpenShoppingList,
  onOpenPantryMatcher,
  onOpenFoodSafety,
  searchQuery,
  onSearchChange,
  onFocusSearch,
}) => {
  return (
    <>
      {/* Desktop Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7ECF2] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFD447] flex items-center justify-center text-[#173B67] shadow-sm group-hover:rotate-6 transition-transform">
              <ChefHat className="w-6 h-6 stroke-[2.25]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#173B67] leading-none block">
                Chicken Kitchen
              </span>
              <span className="text-[11px] font-medium text-[#667085] leading-none block mt-0.5">
                Around the World
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 single-line clean nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#172033]">
            <button
              onClick={() => onSelectTab('home')}
              className={`hover:text-[#173B67] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentTab === 'home'
                  ? 'border-[#FFD447] text-[#173B67] font-bold'
                  : 'border-transparent text-[#667085]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onSelectTab('explore')}
              className={`hover:text-[#173B67] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentTab === 'explore'
                  ? 'border-[#FFD447] text-[#173B67] font-bold'
                  : 'border-transparent text-[#667085]'
              }`}
            >
              Explore Recipes
            </button>
            <button
              onClick={() => onSelectTab('levels')}
              className={`hover:text-[#173B67] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentTab === 'levels'
                  ? 'border-[#FFD447] text-[#173B67] font-bold'
                  : 'border-transparent text-[#667085]'
              }`}
            >
              Difficulty Levels
            </button>
            <button
              onClick={() => onSelectTab('cuisines')}
              className={`hover:text-[#173B67] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentTab === 'cuisines'
                  ? 'border-[#FFD447] text-[#173B67] font-bold'
                  : 'border-transparent text-[#667085]'
              }`}
            >
              Cuisines
            </button>
            <button
              onClick={() => onSelectTab('favorites')}
              className={`hover:text-[#173B67] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                currentTab === 'favorites'
                  ? 'border-[#FFD447] text-[#173B67] font-bold'
                  : 'border-transparent text-[#667085]'
              }`}
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              <span>Favorites</span>
              {favoritesCount > 0 && (
                <span className="text-[11px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full font-bold tabular-nums">
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: 1 primary action or quick utilities */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Desktop quick search bar */}
            <div className="hidden lg:flex items-center relative w-56 xl:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search chicken recipes..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentTab !== 'explore') onSelectTab('explore');
                }}
                onFocus={onFocusSearch}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD447] focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Pantry ingredient matcher */}
            <button
              onClick={onOpenPantryMatcher}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#173B67] bg-[#DCEEFF] hover:bg-[#c9e4ff] rounded-lg transition-colors whitespace-nowrap"
              title="Find recipes using what you have in your fridge"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#173B67]" />
              <span>Pantry Match</span>
            </button>

            {/* Shopping List Button */}
            <button
              onClick={onOpenShoppingList}
              className="relative p-2.5 rounded-lg text-slate-700 hover:text-[#173B67] hover:bg-slate-100 transition-colors"
              aria-label="View Shopping List"
              title="Shopping List"
            >
              <ShoppingBag className="w-5 h-5" />
              {shoppingListCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFD447] text-[#173B67] font-bold text-[11px] rounded-full flex items-center justify-center shadow-xs tabular-nums">
                  {shoppingListCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Bottom Navigation (<15% screen height cap) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7ECF2] px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-medium transition-colors ${
            currentTab === 'home' ? 'text-[#173B67] font-bold' : 'text-[#667085]'
          }`}
        >
          <ChefHat className={`w-5 h-5 ${currentTab === 'home' ? 'text-[#FFD447]' : ''}`} />
          <span>Home</span>
        </button>

        <button
          onClick={() => onSelectTab('explore')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-medium transition-colors ${
            currentTab === 'explore' ? 'text-[#173B67] font-bold' : 'text-[#667085]'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => onSelectTab('favorites')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-medium relative transition-colors ${
            currentTab === 'favorites' ? 'text-[#173B67] font-bold' : 'text-[#667085]'
          }`}
        >
          <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
          <span>Favorites</span>
          {favoritesCount > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenShoppingList}
          className="flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-medium text-[#667085] relative"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Grocery</span>
          {shoppingListCount > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 bg-[#FFD447] text-[#173B67] text-[9px] font-bold rounded-full flex items-center justify-center">
              {shoppingListCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenPantryMatcher}
          className="flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-medium text-[#667085]"
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>What I Have</span>
        </button>
      </nav>
    </>
  );
};
