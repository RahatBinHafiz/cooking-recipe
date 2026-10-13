import React from 'react';
import { X, ShieldCheck, Thermometer, AlertTriangle, Snowflake, Sparkles } from 'lucide-react';

interface FoodSafetyModalProps {
  onClose: () => void;
}

export const FoodSafetyModal: React.FC<FoodSafetyModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-emerald-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#228B5A] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 stroke-[2.25]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Chicken Kitchen Food Safety Guide
              </h2>
              <span className="text-xs text-emerald-800 font-semibold">
                Culinary hygiene and safe poultry guidelines
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto text-sm text-slate-700 leading-relaxed">
          {/* Key Rule 1: Temperature */}
          <div className="flex gap-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
            <Thermometer className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-900 text-base">
                1. Safe Internal Temperature: 74°C (165°F)
              </h3>
              <p className="text-xs text-amber-900/90 mt-1">
                Always verify doneness using an instant-read meat thermometer inserted into the thickest part of the meat (avoiding bone). For whole stuffed birds, both the inner thigh and the center of the stuffing must reach at least 74°C (165°F).
              </p>
            </div>
          </div>

          {/* Key Rule 2: Never Wash Raw Chicken */}
          <div className="flex gap-4 p-4 rounded-2xl bg-rose-50/80 border border-rose-200">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-rose-900 text-base">
                2. Do Not Wash Raw Chicken
              </h3>
              <p className="text-xs text-rose-900/90 mt-1">
                Washing raw poultry under running water splashes bacteria (Campylobacter and Salmonella) up to 3 feet onto sinks, countertops, and nearby utensils. Thorough cooking to 74°C kills all bacteria safely.
              </p>
            </div>
          </div>

          {/* Key Rule 3: Safe Thawing */}
          <div className="flex gap-4 p-4 rounded-2xl bg-sky-50/80 border border-sky-200">
            <Snowflake className="w-6 h-6 text-sky-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sky-900 text-base">
                3. Three Approved Thawing Methods
              </h3>
              <p className="text-xs text-sky-900/90 mt-1">
                Never thaw frozen chicken on the kitchen counter at room temperature. Safe methods:
              </p>
              <ul className="text-xs text-sky-950 mt-1.5 list-disc list-inside space-y-1">
                <li><strong>In the refrigerator:</strong> Allow 24 hours per 2kg in a bowl at &lt;4°C.</li>
                <li><strong>Cold water bath:</strong> In leak-proof sealed bag, changing water every 30 mins.</li>
                <li><strong>Microwave defrost:</strong> Only if cooking immediately afterward.</li>
              </ul>
            </div>
          </div>

          {/* Storage & Leftovers */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 text-sm">Storage & Leftovers</h4>
            <p>
              Refrigerate cooked chicken within 2 hours in airtight containers. Consume within 3 to 4 days. When reheating, ensure food steams hot all the way through (74°C / 165°F). Frozen cooked chicken stays safe for up to 3 months.
            </p>
          </div>
        </div>

        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#173B67] hover:bg-[#0F2847] text-white font-bold text-xs shadow-xs transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
