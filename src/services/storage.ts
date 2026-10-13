import { ShoppingItem, ActiveCookingSession } from '../types/recipe';

const FAVORITES_KEY = 'chicken_kitchen_favorites';
const RECENT_KEY = 'chicken_kitchen_recent';
const SHOPPING_KEY = 'chicken_kitchen_shopping';
const CHECKLIST_KEY = 'chicken_kitchen_checklists';
const COOKING_SESSION_KEY = 'chicken_kitchen_active_session';
const COOKED_RECIPES_KEY = 'chicken_kitchen_cooked';

// Safe localStorage wrapper
function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// Favorites
export function getFavoriteRecipeIds(): string[] {
  return safeGet<string[]>(FAVORITES_KEY, [
    'garlic-butter-chicken',
    'chicken-biryani',
    'butter-chicken',
    'crispy-fried-chicken',
    'bangladeshi-chicken-bhuna',
  ]);
}

export function toggleFavorite(recipeId: string): string[] {
  const current = getFavoriteRecipeIds();
  const exists = current.includes(recipeId);
  const updated = exists ? current.filter((id) => id !== recipeId) : [...current, recipeId];
  safeSet(FAVORITES_KEY, updated);
  return updated;
}

export function isFavorite(recipeId: string): boolean {
  return getFavoriteRecipeIds().includes(recipeId);
}

// Recently Viewed
export function getRecentlyViewedIds(): string[] {
  return safeGet<string[]>(RECENT_KEY, ['butter-chicken', 'garlic-butter-chicken']);
}

export function addRecentlyViewed(recipeId: string): void {
  const current = getRecentlyViewedIds().filter((id) => id !== recipeId);
  const updated = [recipeId, ...current].slice(0, 20);
  safeSet(RECENT_KEY, updated);
}

export function clearRecentlyViewed(): void {
  safeSet(RECENT_KEY, []);
}

// Shopping List
export function getShoppingList(): ShoppingItem[] {
  return safeGet<ShoppingItem[]>(SHOPPING_KEY, [
    {
      id: 'shop-init-1',
      name: 'Boneless skinless chicken breasts',
      quantity: 500,
      unit: 'g',
      category: 'Poultry',
      checked: false,
      recipeSource: 'Garlic Butter Chicken',
      recipeId: 'garlic-butter-chicken',
    },
    {
      id: 'shop-init-2',
      name: 'Garlic heads (fresh)',
      quantity: 2,
      unit: 'heads',
      category: 'Produce',
      checked: false,
      recipeSource: 'Garlic Butter Chicken',
      recipeId: 'garlic-butter-chicken',
    },
    {
      id: 'shop-init-3',
      name: 'Unsalted butter',
      quantity: 60,
      unit: 'g',
      category: 'Dairy',
      checked: true,
      recipeSource: 'Garlic Butter Chicken',
      recipeId: 'garlic-butter-chicken',
    },
  ]);
}

export function saveShoppingList(items: ShoppingItem[]): void {
  safeSet(SHOPPING_KEY, items);
}

export function addIngredientsToShoppingList(
  items: Array<{ name: string; quantity: number; unit: string; category: any; recipeSource?: string; recipeId?: string }>
): ShoppingItem[] {
  const current = getShoppingList();
  const newItems = [...current];

  for (const item of items) {
    let existingIndex = -1;
    for (let i = newItems.length - 1; i >= 0; i--) {
      const existing = newItems[i];
      if (
        existing.name.toLowerCase().trim() === item.name.toLowerCase().trim() &&
        existing.unit.toLowerCase().trim() === item.unit.toLowerCase().trim() &&
        !existing.checked
      ) {
        existingIndex = i;
        break;
      }
    }

    if (existingIndex >= 0 && item.quantity > 0) {
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: Math.round((newItems[existingIndex].quantity + item.quantity) * 100) / 100,
        recipeSource: newItems[existingIndex].recipeSource
          ? `${newItems[existingIndex].recipeSource}, ${item.recipeSource || ''}`
          : item.recipeSource,
      };
    } else {
      newItems.push({
        id: `shop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category || 'Pantry',
        checked: false,
        recipeSource: item.recipeSource,
        recipeId: item.recipeId,
      });
    }
  }

  saveShoppingList(newItems);
  return newItems;
}

// Recipe Ingredient Checklists
export function getRecipeChecklist(recipeId: string): string[] {
  const all = safeGet<Record<string, string[]>>(CHECKLIST_KEY, {});
  return all[recipeId] || [];
}

export function toggleRecipeIngredientCheck(recipeId: string, ingredientId: string): string[] {
  const all = safeGet<Record<string, string[]>>(CHECKLIST_KEY, {});
  const current = all[recipeId] || [];
  const updated = current.includes(ingredientId)
    ? current.filter((id) => id !== ingredientId)
    : [...current, ingredientId];
  all[recipeId] = updated;
  safeSet(CHECKLIST_KEY, all);
  return updated;
}

export function resetRecipeChecklist(recipeId: string): void {
  const all = safeGet<Record<string, string[]>>(CHECKLIST_KEY, {});
  delete all[recipeId];
  safeSet(CHECKLIST_KEY, all);
}

// Active Cooking Session
export function getActiveCookingSession(): ActiveCookingSession | null {
  return safeGet<ActiveCookingSession | null>(COOKING_SESSION_KEY, null);
}

export function saveActiveCookingSession(session: ActiveCookingSession): void {
  safeSet(COOKING_SESSION_KEY, session);
}

export function clearActiveCookingSession(): void {
  try {
    localStorage.removeItem(COOKING_SESSION_KEY);
  } catch (e) {
    console.error(e);
  }
}

// Cooked Recipes tracking
export function getCookedRecipeIds(): string[] {
  return safeGet<string[]>(COOKED_RECIPES_KEY, []);
}

export function markRecipeAsCooked(recipeId: string): void {
  const current = getCookedRecipeIds();
  if (!current.includes(recipeId)) {
    safeSet(COOKED_RECIPES_KEY, [...current, recipeId]);
  }
}

// Quantity Scaling Formatter
export function formatScaledQuantity(baseQty: number, targetServings: number, baseServings: number): string {
  if (baseQty <= 0) return '';
  const scaled = (baseQty * targetServings) / (baseServings || 1);

  // Round smartly
  if (scaled >= 100) {
    return Math.round(scaled).toString();
  }
  if (scaled >= 10) {
    return (Math.round(scaled * 10) / 10).toString();
  }

  // Common fraction rendering
  const whole = Math.floor(scaled);
  const frac = scaled - whole;

  if (Math.abs(frac - 0.25) < 0.05) return whole ? `${whole} ¼` : '¼';
  if (Math.abs(frac - 0.33) < 0.05) return whole ? `${whole} ⅓` : '⅓';
  if (Math.abs(frac - 0.5) < 0.05) return whole ? `${whole} ½` : '½';
  if (Math.abs(frac - 0.66) < 0.05) return whole ? `${whole} ⅔` : '⅔';
  if (Math.abs(frac - 0.75) < 0.05) return whole ? `${whole} ¾` : '¾';

  const rounded = Math.round(scaled * 10) / 10;
  return rounded.toString();
}
