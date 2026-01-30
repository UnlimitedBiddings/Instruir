import { motion } from 'framer-motion';
import { MapPin, Car, Zap, ChevronRight, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Instructor } from '@/types';
import { RatingStars } from '@/components/common/RatingStars';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface AnimatedInstructorCardProps {
  instructor: Instructor;
  compact?: boolean;
  isSelected?: boolean;
  index?: number;
}

export function AnimatedInstructorCard({ 
  instructor, 
  compact = false, 
  isSelected = false,
  index = 0 
}: AnimatedInstructorCardProps) {
  const navigate = useNavigate();
  const isFromSchool = instructor.providerType === 'company';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 28,
        delay: index * 0.05,
      }}
      whileHover={{ 
        y: -6,
        transition: { type: 'spring', stiffness: 400, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "instructor-card cursor-pointer group relative overflow-hidden",
        isSelected && "ring-2 ring-primary shadow-xl",
        isFromSchool && "ring-1 ring-blue-500/30"
      )}
      onClick={() => navigate(`/instructor/${instructor.id}`)}
    >
      {/* Subtle gradient overlay on hover */}
      <motion.div 
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          isFromSchool 
            ? "bg-gradient-to-r from-blue-500/5 to-blue-400/5" 
            : "bg-gradient-to-r from-primary/5 to-accent/5"
        )}
      />
      
      <div className="relative flex gap-4">
        {/* Avatar with glow effect */}
        <div className="relative flex-shrink-0">
          <motion.div
            className={cn(
              "absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300",
              isFromSchool ? "bg-blue-500/20" : "bg-primary/20"
            )}
          />
          <motion.img
            src={instructor.avatar}
            alt={instructor.name}
            className={cn(
              "rounded-xl object-cover relative z-10 ring-2 ring-transparent transition-all duration-300",
              compact ? "h-16 w-16" : "h-20 w-20",
              isFromSchool ? "group-hover:ring-blue-500/20" : "group-hover:ring-primary/20"
            )}
            layoutId={`avatar-${instructor.id}`}
          />
          {instructor.verified.cnh && instructor.verified.criminalRecord && (
            <motion.div 
              className={cn(
                "absolute -bottom-1 -right-1 rounded-full p-1.5 shadow-lg z-20",
                isFromSchool ? "bg-blue-500 text-white" : "bg-accent text-accent-foreground"
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, delay: 0.2 + index * 0.05 }}
            >
              {isFromSchool ? <Building2 className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
            </motion.div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {isFromSchool && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs mb-1">
                  <Building2 className="h-3 w-3 mr-1" />
                  Autoescola
                </Badge>
              )}
              <h3 className={cn(
                "font-display font-semibold text-foreground truncate transition-colors duration-200",
                isFromSchool ? "group-hover:text-blue-600" : "group-hover:text-primary"
              )}>
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
            
            {/* Price with pulse animation */}
            <motion.div 
              className="price-tag flex-shrink-0 group-hover:shadow-lg transition-shadow duration-200"
              whileHover={{ scale: 1.05 }}
            >
              R$ {instructor.pricePerHour}/h
            </motion.div>
          </div>

          {/* Vehicle */}
          <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
            <Car className="h-3.5 w-3.5" />
            <span className="text-sm truncate">
              {instructor.vehicle.model} • {instructor.vehicle.transmission === 'manual' ? 'Manual' : 'Auto'}
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

        {/* Arrow indicator */}
        <motion.div 
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100",
            isFromSchool ? "text-blue-500" : "text-primary"
          )}
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
        >
          <ChevronRight className="h-5 w-5" />
        </motion.div>
      </div>
    </motion.div>
  );
}
