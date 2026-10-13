import { Recipe, Cuisine, ChickenCut, CookingMethod, MealType } from '../types/recipe';
import { easyRecipes } from './recipesEasy';
import { mediumRecipes } from './recipesMedium';
import { hardRecipes } from './recipesHard';

// Combined master recipe database (155 complete recipes)
export const allRecipes: Recipe[] = [...easyRecipes, ...mediumRecipes, ...hardRecipes];

export const CUISINES: Cuisine[] = [
  'Bangladeshi',
  'Indian',
  'Pakistani',
  'Chinese',
  'Thai',
  'Japanese',
  'Korean',
  'Italian',
  'Mexican',
  'American',
  'Asian-American',
  'Middle Eastern',
  'Mediterranean',
  'French',
  'Indonesian',
  'Filipino',
  'Vietnamese',
  'Caribbean',
  'African',
  'Global Fusion',
];

export const CHICKEN_CUTS: ChickenCut[] = [
  'Breast',
  'Thigh',
  'Drumstick',
  'Wings',
  'Whole Chicken',
  'Minced Chicken',
  'Chicken Tenderloins',
  'Chicken Liver & Offal',
];

export const COOKING_METHODS: CookingMethod[] = [
  'Pan-Fried',
  'Deep-Fried',
  'Oven-Baked',
  'Grilled',
  'Air-Fried',
  'Slow-Cooked',
  'Pressure-Cooked',
  'Steamed',
  'Boiled',
  'Braised',
  'Roasted',
  'Stir-Fried',
  'Sous-Vide',
];

export const MEAL_TYPES: MealType[] = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
  'Appetizers',
  'Soups',
  'Salads',
  'Rice Dishes',
  'Noodles and Pasta',
  'Sandwiches and Wraps',
  'Curries',
  'One-Pot Meals',
];

export const QUICK_CATEGORIES = [
  'Under 15 Minutes',
  'Under 30 Minutes',
  'Beginner Friendly',
  'High Protein',
  'Air Fryer',
  'One-Pot Meals',
  'Spicy',
  'Family Favorites',
  'Budget Friendly',
  'Healthy Choices',
];

export interface CuratedCollection {
  id: string;
  title: string;
  tagline: string;
  description: string;
  filterFn: (r: Recipe) => boolean;
}

export const CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    id: 'start-here-10',
    title: 'Start Here: 10 Easy Chicken Recipes',
    tagline: 'Absolute Beginners',
    description: 'Guaranteed success for beginners. Foolproof techniques with straightforward ingredients and clear doneness cues.',
    filterFn: (r) => r.difficulty === 'Easy' && (r.collectionIds?.includes('start-here-10') || false),
  },
  {
    id: 'under-30-mins',
    title: 'Cook Something in 30 Minutes',
    tagline: 'Busy Weeknights',
    description: 'Lightning-fast, high-flavor chicken dinners that go from raw ingredients to table in 30 minutes or less.',
    filterFn: (r) => r.totalTimeMinutes <= 30,
  },
  {
    id: 'bangladeshi-favorites',
    title: 'Bangladeshi Chicken Favorites',
    tagline: 'Regional Heritage',
    description: 'Authentic Bhuna, Wedding Shahi Roast, Tehari, Rezala, and rainy-day Khichuri from traditional Bengal kitchens.',
    filterFn: (r) => r.cuisine === 'Bangladeshi',
  },
  {
    id: 'impress-guests',
    title: 'Impress Your Guests',
    tagline: 'Chef & Masterclass',
    description: 'Showstopper ballotines, layered royal biryanis, crystal consommé, and elegant dinner party centerpieces.',
    filterFn: (r) => r.difficulty === 'Hard' || (r.collectionIds?.includes('impress-guests') || false),
  },
];

// Common ingredients for "What You Have in Your Kitchen" Pantry Matcher
export const COMMON_PANTRY_INGREDIENTS = [
  'Chicken breast',
  'Chicken thigh',
  'Garlic',
  'Onion',
  'Butter',
  'Olive oil',
  'Soy sauce',
  'Lemon',
  'Rice',
  'Ginger',
  'Tomato',
  'Yogurt',
  'Potatoes',
  'Bell pepper',
  'Heavy cream',
  'Egg',
  'Pasta',
  'Spinach',
  'Honey',
  'Parmesan cheese',
  'Broccoli',
  'Cumin',
];

// Helper to look up recipe by slug or ID
export function getRecipeById(idOrSlug: string): Recipe | undefined {
  return allRecipes.find((r) => r.id === idOrSlug || r.slug === idOrSlug);
}
