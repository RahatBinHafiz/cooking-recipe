export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Cuisine =
  | 'Bangladeshi'
  | 'Indian'
  | 'Pakistani'
  | 'Chinese'
  | 'Thai'
  | 'Japanese'
  | 'Korean'
  | 'Italian'
  | 'Mexican'
  | 'American'
  | 'Asian-American'
  | 'Middle Eastern'
  | 'Mediterranean'
  | 'French'
  | 'Indonesian'
  | 'Filipino'
  | 'Vietnamese'
  | 'Caribbean'
  | 'African'
  | 'Global Fusion';

export type ChickenCut =
  | 'Breast'
  | 'Thigh'
  | 'Drumstick'
  | 'Wings'
  | 'Whole Chicken'
  | 'Minced Chicken'
  | 'Chicken Tenderloins'
  | 'Chicken Liver & Offal';

export type CookingMethod =
  | 'Pan-Fried'
  | 'Deep-Fried'
  | 'Oven-Baked'
  | 'Grilled'
  | 'Air-Fried'
  | 'Slow-Cooked'
  | 'Pressure-Cooked'
  | 'Steamed'
  | 'Boiled'
  | 'Braised'
  | 'Roasted'
  | 'Stir-Fried'
  | 'Sous-Vide'
  | 'One-Pot Meals';

export type MealType =
  | 'Breakfast'
  | 'Lunch'
  | 'Dinner'
  | 'Snacks'
  | 'Appetizers'
  | 'Soups'
  | 'Salads'
  | 'Rice Dishes'
  | 'Noodles and Pasta'
  | 'Sandwiches and Wraps'
  | 'Curries'
  | 'One-Pot Meals';

export type IngredientCategory = 'Poultry' | 'Produce' | 'Spices' | 'Dairy' | 'Pantry' | 'Other';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  preparationNotes?: string;
  optionalAlternative?: string;
  scalable: boolean;
  category: IngredientCategory;
}

export interface InstructionStep {
  step: number;
  title?: string;
  text: string;
  durationMinutes?: number;
  timerSeconds?: number;
  temperatureC?: number;
  temperatureF?: number;
  donenessCue?: string;
}

export interface NutritionEstimate {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  difficulty: Difficulty;
  cuisine: Cuisine;
  categories: string[];
  chickenCut: ChickenCut;
  cookingMethods: CookingMethod[];
  mealTypes: MealType[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  restingTimeMinutes: number;
  totalTimeMinutes: number;
  handsOnTimeMinutes: number;
  servings: number;
  ingredients: Ingredient[];
  equipment: string[];
  instructions: InstructionStep[];
  tags: string[];
  allergens: string[];
  nutritionEstimate: NutritionEstimate;
  storageInstructions: string;
  substitutions: string[];
  foodSafetyNotes: string;
  dateAdded: string;
  spicyLevel: 'Mild' | 'Medium' | 'Hot';
  budgetFriendly: boolean;
  highProtein: boolean;
  dairyFree: boolean;
  glutenFree: boolean;
  lowCarb: boolean;
  isPopular?: boolean;
  collectionIds?: string[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: IngredientCategory;
  checked: boolean;
  recipeSource?: string;
  recipeId?: string;
  notes?: string;
}

export interface ActiveCookingSession {
  recipeId: string;
  currentStep: number;
  startedAt: string;
}

export type SortOption =
  | 'easiest'
  | 'hardest'
  | 'fastest'
  | 'longest'
  | 'alphabetical'
  | 'newest';
