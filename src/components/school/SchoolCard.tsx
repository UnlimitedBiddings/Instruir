import { motion } from 'framer-motion';
import { Building2, MapPin, Users, Star, ChevronRight, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Company } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface SchoolCardProps {
  school: Company;
  compact?: boolean;
  isSelected?: boolean;
  index?: number;
}

export function SchoolCard({ 
  school, 
  compact = false, 
  isSelected = false,
  index = 0 
}: SchoolCardProps) {
  const navigate = useNavigate();
  const instructorCount = school.professionalIds?.length || 0;
  const popularPackage = school.packages?.find(p => p.popular);

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
        "bg-card border border-border rounded-2xl p-4 cursor-pointer group relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300",
        isSelected && "ring-2 ring-blue-500 shadow-xl"
      )}
      onClick={() => navigate(`/school/${school.id}`)}
    >
      {/* Blue gradient overlay on hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      
      <div className="relative flex gap-4">
        {/* Logo with glow effect */}
        <div className="relative flex-shrink-0">
          <motion.div
            className="absolute inset-0 bg-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
          />
          <div className={cn(
            "rounded-xl overflow-hidden relative z-10 ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all duration-300 bg-muted flex items-center justify-center",
            compact ? "h-16 w-16" : "h-20 w-20"
          )}>
            {school.logo ? (
              <img
                src={school.logo}
                alt={school.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          {school.verified && (
            <motion.div 
              className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1.5 shadow-lg z-20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, delay: 0.2 + index * 0.05 }}
            >
              <Building2 className="h-3 w-3" />
            </motion.div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs">
                  Autoescola
                </Badge>
              </div>
              <h3 className="font-display font-semibold text-foreground truncate group-hover:text-blue-600 transition-colors duration-200">
                {school.name}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-sm">{school.rating}</span>
                <span className="text-muted-foreground text-sm">({school.reviewCount})</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-2 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span className="text-sm">{instructorCount} instrutores</span>
            </div>
            {school.location?.distance && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-sm">{school.location.distance.toFixed(1)} km</span>
              </div>
            )}
          </div>

          {/* Popular package preview */}
          {!compact && popularPackage && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 rounded-lg">
                <Package className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">
                  {popularPackage.name}: R$ {popularPackage.priceTotal}
                </span>
              </div>
            </div>
          )}

          {!compact && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {school.description}
            </p>
          )}
        </div>

        {/* Arrow indicator */}
        <motion.div 
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-blue-500"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
        >
          <ChevronRight className="h-5 w-5" />
        </motion.div>
      </div>
    </motion.div>
  );
}
