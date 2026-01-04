import { Instructor } from '@/types';
import { cn } from '@/lib/utils';

interface MapMarkerProps {
  instructor: Instructor;
  isSelected?: boolean;
  onClick?: () => void;
}

export function MapMarker({ instructor, isSelected, onClick }: MapMarkerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative transition-all duration-200 hover:scale-110",
        isSelected && "scale-110 z-10"
      )}
    >
      {/* Marker Container */}
      <div 
        className={cn(
          "flex items-center gap-1.5 px-2 py-1.5 rounded-xl shadow-lg transition-colors",
          isSelected 
            ? "bg-accent text-accent-foreground" 
            : "bg-card text-foreground border border-border"
        )}
      >
        <img 
          src={instructor.avatar} 
          alt={instructor.name}
          className="h-6 w-6 rounded-full object-cover"
        />
        <span className="text-xs font-bold">
          R${instructor.pricePerHour}
        </span>
      </div>
      
      {/* Pointer */}
      <div 
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent -mt-[1px]",
          isSelected 
            ? "border-t-accent" 
            : "border-t-card"
        )}
      />
    </button>
  );
}
