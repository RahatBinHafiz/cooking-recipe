import React, { useState } from 'react';
import { Utensils } from 'lucide-react';

interface FoodImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatioClass?: string;
}

export const FoodImage: React.FC<FoodImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatioClass = 'aspect-4/3',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div
        className={`${aspectRatioClass} w-full bg-linear-to-br from-amber-50 via-slate-100 to-amber-100 flex flex-col items-center justify-center p-4 text-center border-b border-slate-100 ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded-full bg-amber-200/80 flex items-center justify-center text-amber-900 mb-2 shadow-inner">
          <Utensils className="w-6 h-6 stroke-[1.75]" />
        </div>
        <p className="text-xs font-semibold text-slate-700 max-w-[85%] truncate">{alt}</p>
        <span className="text-[10px] text-amber-700/80 uppercase font-medium tracking-wider mt-0.5">
          Chicken Kitchen
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${aspectRatioClass} ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <Utensils className="w-6 h-6 text-slate-300 animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};
