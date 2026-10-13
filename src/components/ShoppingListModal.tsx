import React, { useState } from 'react';
import { ShoppingItem, IngredientCategory } from '../types/recipe';
import {
  X,
  Plus,
  Trash2,
  Check,
  Copy,
  ShoppingBag,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ShoppingListModalProps {
  items: ShoppingItem[];
  onClose: () => void;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClearCompleted: () => void;
  onAddCustomItem: (name: string, quantity: number, unit: string, category: IngredientCategory) => void;
}

const CATEGORY_ORDER: IngredientCategory[] = [
  'Poultry',
  'Produce',
  'Spices',
  'Dairy',
  'Pantry',
  'Other',
];

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  items,
  onClose,
  onToggleItem,
  onDeleteItem,
  onClearCompleted,
  onAddCustomItem,
}) => {
  const [customName, setCustomName] = useState('');
  const [customQty, setCustomQty] = useState('');
  const [customUnit, setCustomUnit] = useState('');
  const [customCat, setCustomCat] = useState<IngredientCategory>('Pantry');
  const [copied, setCopied] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const qty = parseFloat(customQty) || 1;
    onAddCustomItem(customName.trim(), qty, customUnit.trim() || 'item', customCat);
    setCustomName('');
    setCustomQty('');
    setCustomUnit('');
  };

  const handleCopyText = () => {
    if (items.length === 0) return;
    const text = items
      .map((it) => `${it.checked ? '[x]' : '[ ]'} ${it.quantity} ${it.unit} ${it.name}`)
      .join('\n');
    navigator.clipboard.writeText(`Chicken Kitchen Grocery List:\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completedCount = items.filter((i) => i.checked).length;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFD447] text-[#173B67] flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5 stroke-[2.25]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Shopping List</h2>
              <span className="text-xs text-slate-500 tabular-nums">
                {items.length} items ({completedCount} purchased)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={handleCopyText}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-colors"
                title="Copy entire list to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add custom item form */}
        <form onSubmit={handleAdd} className="p-4 bg-slate-100/60 border-b border-slate-200">
          <div className="grid grid-cols-12 gap-2">
            <input
              type="text"
              placeholder="Add item (e.g., Greek yogurt)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="col-span-6 text-xs p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FFD447]"
            />
            <input
              type="number"
              step="any"
              placeholder="Qty"
              value={customQty}
              onChange={(e) => setCustomQty(e.target.value)}
              className="col-span-2 text-xs p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FFD447]"
            />
            <input
              type="text"
              placeholder="Unit"
              value={customUnit}
              onChange={(e) => setCustomUnit(e.target.value)}
              className="col-span-2 text-xs p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FFD447]"
            />
            <button
              type="submit"
              disabled={!customName.trim()}
              className="col-span-2 bg-[#173B67] hover:bg-[#0F2847] text-white rounded-xl text-xs font-bold flex items-center justify-center transition-colors disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>

        {copied && (
          <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-2 font-semibold text-center border-b border-emerald-200">
            Grocery list copied to clipboard!
          </div>
        )}

        {/* Grouped Shopping Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {items.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-medium text-slate-600">Your shopping list is empty</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Add ingredients directly from any recipe view using the "Add Ingredients to Shopping List" button.
              </p>
            </div>
          ) : (
            CATEGORY_ORDER.map((category) => {
              const categoryItems = items.filter((i) => i.category === category);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category} className="space-y-2">
                  <span className="text-xs font-bold text-[#173B67] uppercase tracking-wider block">
                    {category === 'Poultry'
                      ? 'Poultry & Meat'
                      : category === 'Produce'
                      ? 'Produce & Vegetables'
                      : category === 'Spices'
                      ? 'Spices & Seasonings'
                      : category}
                  </span>

                  <div className="space-y-1.5">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                          item.checked
                            ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                            : 'bg-white border-slate-200/90 text-slate-900 shadow-2xs'
                        }`}
                      >
                        <div
                          onClick={() => onToggleItem(item.id)}
                          className="flex items-center gap-3 flex-1 cursor-pointer"
                        >
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                              item.checked
                                ? 'bg-[#228B5A] border-[#228B5A] text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <div className="text-xs sm:text-sm">
                            <span className="font-bold mr-1.5 tabular-nums">
                              {item.quantity} {item.unit}
                            </span>
                            <span>{item.name}</span>
                            {item.recipeSource && (
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                for: {item.recipeSource}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors ml-2"
                          aria-label={`Delete ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Clear Completed */}
        {completedCount > 0 && (
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500 tabular-nums">
              {completedCount} of {items.length} completed
            </span>
            <button
              onClick={onClearCompleted}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Completed</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
