import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
}

export function RatingStars({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  showValue = true,
  reviewCount,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, index) => {
          const fillPercentage = Math.min(Math.max(rating - index, 0), 1) * 100;
          
          return (
            <div key={index} className="relative">
              <Star 
                className={cn(sizeClasses[size], 'text-muted stroke-muted-foreground/30')} 
                fill="currentColor"
              />
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <Star 
                  className={cn(sizeClasses[size], 'text-warning')} 
                  fill="currentColor"
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {showValue && (
        <span className={cn('font-semibold text-foreground', textClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}
      
      {reviewCount !== undefined && (
        <span className={cn('text-muted-foreground', textClasses[size])}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
