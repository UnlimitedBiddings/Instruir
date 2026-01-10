import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, List, Map, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatedInstructorCard } from '@/components/instructor/AnimatedInstructorCard';
import { InstructorMap } from '@/components/map/InstructorMap';
import { PageTransition, staggerContainer } from '@/components/common/PageTransition';
import { mockInstructors } from '@/data/mockData';
import { Instructor } from '@/types';

export function ExplorePage() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

  const filteredInstructors = mockInstructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.serviceZones.some(zone => zone.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <PageTransition className="min-h-screen bg-background">
      {/* Header */}
      <motion.div 
        className="bg-card border-b border-border px-4 pt-4 pb-4 safe-area-top sticky top-0 z-30"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* Location indicator with animation */}
        <motion.div 
          className="flex items-center gap-2 mb-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <MapPin className="h-5 w-5 text-primary" />
          </motion.div>
          <div>
            <p className="text-xs text-muted-foreground">Sua localização</p>
            <p className="text-sm font-medium">Av. Paulista, São Paulo</p>
          </div>
        </motion.div>

        {/* Search Bar with micro-interaction */}
        <motion.div 
          className="flex gap-2"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Buscar instrutor ou região..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 bg-muted/50 border-transparent focus:border-primary/50 focus:bg-background transition-all duration-200"
            />
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="icon" className="h-12 w-12 hover:border-primary/50 hover:bg-primary/5 transition-all">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* View Toggle with animated indicator */}
        <motion.div 
          className="flex gap-2 mt-4 bg-muted/50 p-1 rounded-xl"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all relative ${
              viewMode === 'list' 
                ? 'text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setViewMode('list')}
            whileTap={{ scale: 0.98 }}
          >
            {viewMode === 'list' && (
              <motion.div
                layoutId="viewToggle"
                className="absolute inset-0 bg-primary rounded-lg"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <List className="h-4 w-4" />
              Lista
            </span>
          </motion.button>
          <motion.button
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all relative ${
              viewMode === 'map' 
                ? 'text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setViewMode('map')}
            whileTap={{ scale: 0.98 }}
          >
            {viewMode === 'map' && (
              <motion.div
                layoutId="viewToggle"
                className="absolute inset-0 bg-primary rounded-lg"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Map className="h-4 w-4" />
              Mapa
            </span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Content with AnimatePresence for view switching */}
      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="p-4 space-y-4 pb-24"
          >
            {/* Section header */}
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <h2 className="font-display font-semibold text-lg">
                  Instrutores próximos
                </h2>
              </div>
              <motion.span 
                className="text-sm text-muted-foreground px-2 py-1 bg-muted/50 rounded-full"
                key={filteredInstructors.length}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {filteredInstructors.length} encontrados
              </motion.span>
            </motion.div>

            {/* Instructor cards with stagger animation */}
            <motion.div 
              className="space-y-3"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence>
                {filteredInstructors.map((instructor, index) => (
                  <AnimatedInstructorCard 
                    key={instructor.id}
                    instructor={instructor} 
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty state with animation */}
            <AnimatePresence>
              {filteredInstructors.length === 0 && (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <motion.div 
                    className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </motion.div>
                  <h3 className="font-display font-semibold text-lg mb-2">
                    Nenhum instrutor encontrado
                  </h3>
                  <p className="text-muted-foreground">
                    Tente buscar por outra região ou nome.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            key="map-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative h-[calc(100vh-220px)]"
          >
            {/* Google Maps */}
            <InstructorMap
              instructors={filteredInstructors}
              onSelectInstructor={setSelectedInstructor}
              selectedInstructorId={selectedInstructor?.id}
            />

            {/* Floating Cards with improved animation */}
            <div className="absolute bottom-6 left-0 right-0 px-4 z-20">
              <motion.div 
                className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 400, damping: 30 }}
              >
                {filteredInstructors.slice(0, 8).map((instructor, index) => (
                  <motion.div 
                    key={instructor.id} 
                    className="flex-shrink-0 w-72 snap-start"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedInstructor(instructor)}
                  >
                    <AnimatedInstructorCard 
                      instructor={instructor} 
                      compact 
                      isSelected={instructor.id === selectedInstructor?.id}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
