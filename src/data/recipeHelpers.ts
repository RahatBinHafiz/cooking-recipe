import { Recipe, IngredientCategory } from '../types/recipe';

export function makeIng(
  id: string,
  name: string,
  quantity: number,
  unit: string,
  category: IngredientCategory = 'Pantry',
  notes?: string,
  alternative?: string
) {
  return {
    id,
    name,
    quantity,
    unit,
    category,
    preparationNotes: notes,
    optionalAlternative: alternative,
    scalable: true,
  };
}

// Consistent safe food notes across chicken types
export const FOOD_SAFETY_CHICKEN =
  'Always cook chicken until internal temperature reaches at least 74°C (165°F) at the thickest part. Never wash raw chicken under running water to prevent cross-contamination. Use dedicated cutting boards for raw poultry and wash hands thoroughly with warm soapy water for 20 seconds after handling.';

export const STORAGE_STANDARD =
  'Refrigerate leftovers within 2 hours in an airtight container for up to 3–4 days at 4°C (40°F) or below. Reheat until steaming hot throughout (at least 74°C / 165°F). Can be frozen for up to 3 months.';
