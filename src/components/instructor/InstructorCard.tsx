import { MapPin, Car, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Instructor } from '@/types';
import { RatingStars } from '@/components/common/RatingStars';
import { cn } from '@/lib/utils';

export interface InstructorCardProps {
  instructor: Instructor;
  compact?: boolean;
  isSelected?: boolean;
}

export function InstructorCard({ instructor, compact = false, isSelected = false }: InstructorCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      className={cn(
        "instructor-card cursor-pointer transition-all",
        isSelected && "ring-2 ring-primary shadow-lg"
      )}
      onClick={() => navigate(`/instructor/${instructor.id}`)}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={instructor.avatar}
            alt={instructor.name}
            className={cn(
              "rounded-xl object-cover",
              compact ? "h-16 w-16" : "h-20 w-20"
            )}
          />
          {instructor.verified.cnh && instructor.verified.criminalRecord && (
            <div className="absolute -bottom-1 -right-1 bg-accent text-accent-foreground rounded-full p-1">
              <Zap className="h-3 w-3" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-foreground truncate">
                {instructor.name}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <RatingStars 
                  rating={instructor.rating} 
                  size="sm" 
                  reviewCount={instructor.reviewCount}
                />
              </div>
            </div>
            
            {/* Price */}
            <div className="price-tag flex-shrink-0">
              R$ {instructor.pricePerHour}/h
            </div>
          </div>

          {/* Vehicle */}
          <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
            <Car className="h-3.5 w-3.5" />
            <span className="text-sm truncate">
              {instructor.vehicle.model} • {instructor.vehicle.transmission === 'manual' ? 'Manual' : 'Automático'}
            </span>
          </div>

          {/* Distance */}
          {instructor.location.distance && (
            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-sm">
                {instructor.location.distance.toFixed(1)} km de você
              </span>
            </div>
          )}

          {!compact && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {instructor.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
