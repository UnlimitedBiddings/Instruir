import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, List, Map, Sparkles, Building2, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatedInstructorCard } from '@/components/instructor/AnimatedInstructorCard';
import { SchoolCard } from '@/components/school/SchoolCard';
import { InstructorMap } from '@/components/map/InstructorMap';
import { PageTransition, staggerContainer } from '@/components/common/PageTransition';
import { mockInstructors, mockIndependentInstructors } from '@/data/mockData';
import { mockDrivingSchools, mockSchoolInstructors } from '@/data/mockDrivingSchools';
import { Instructor, Company, ProviderType } from '@/types';

type ProviderFilter = 'all' | 'independent' | 'schools';

export function ExplorePage() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [providerFilter, setProviderFilter] = useState<ProviderFilter>('all');

  // Filtra instrutores baseado na busca
  const filteredInstructors = useMemo(() => {
    let instructors: Instructor[] = [];
    
    if (providerFilter === 'all') {
      instructors = mockInstructors;
    } else if (providerFilter === 'independent') {
      instructors = mockIndependentInstructors;
    } else {
      instructors = mockSchoolInstructors;
    }

    return instructors.filter(instructor =>
      instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.serviceZones.some(zone => zone.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, providerFilter]);

  // Filtra autoescolas baseado na busca
  const filteredSchools = useMemo(() => {
    if (providerFilter === 'independent') return [];
    
    return mockDrivingSchools.filter(school =>
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, providerFilter]);

  // Para o mapa, só mostramos instrutores quando não estamos no modo 'schools'
  const mapInstructors = providerFilter === 'schools' ? [] : filteredInstructors;

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
              placeholder="Buscar instrutor, autoescola ou região..."
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

        {/* Provider Type Toggle */}
        <motion.div 
          className="flex gap-1 mt-4 bg-muted/50 p-1 rounded-xl"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { id: 'all' as const, label: 'Todos', icon: null },
            { id: 'independent' as const, label: 'Autônomos', icon: User },
            { id: 'schools' as const, label: 'Autoescolas', icon: Building2 },
          ].map((option) => (
            <motion.button
              key={option.id}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all relative ${
                providerFilter === option.id 
                  ? option.id === 'schools' 
                    ? 'text-white' 
                    : 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setProviderFilter(option.id)}
              whileTap={{ scale: 0.98 }}
            >
              {providerFilter === option.id && (
                <motion.div
                  layoutId="providerToggle"
                  className={`absolute inset-0 rounded-lg ${
                    option.id === 'schools' ? 'bg-blue-500' : 'bg-primary'
                  }`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {option.icon && <option.icon className="h-3.5 w-3.5" />}
                {option.label}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* View Toggle */}
        <motion.div 
          className="flex gap-2 mt-3 bg-muted/50 p-1 rounded-xl"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
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
            {/* Schools Section - When showing schools */}
            {(providerFilter === 'all' || providerFilter === 'schools') && filteredSchools.length > 0 && (
              <>
                <motion.div 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <h2 className="font-display font-semibold text-lg">
                      Autoescolas
                    </h2>
                  </div>
                  <motion.span 
                    className="text-sm text-muted-foreground px-2 py-1 bg-blue-500/10 rounded-full text-blue-600"
                    key={filteredSchools.length}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {filteredSchools.length} encontradas
                  </motion.span>
                </motion.div>

                <motion.div 
                  className="space-y-3"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  <AnimatePresence>
                    {filteredSchools.map((school, index) => (
                      <SchoolCard 
                        key={school.id}
                        school={school} 
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </>
            )}

            {/* Instructors Section - When showing instructors */}
            {(providerFilter === 'all' || providerFilter === 'independent' || providerFilter === 'schools') && filteredInstructors.length > 0 && (
              <>
                <motion.div 
                  className="flex items-center justify-between mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <h2 className="font-display font-semibold text-lg">
                      {providerFilter === 'schools' ? 'Instrutores de Autoescolas' : 
                       providerFilter === 'independent' ? 'Instrutores Autônomos' : 
                       'Instrutores próximos'}
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
              </>
            )}

            {/* Empty state with animation */}
            <AnimatePresence>
              {filteredInstructors.length === 0 && filteredSchools.length === 0 && (
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
                    Nenhum resultado encontrado
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
            className="relative h-[calc(100vh-280px)]"
          >
            {/* Google Maps */}
            <InstructorMap
              instructors={mapInstructors}
              schools={providerFilter !== 'independent' ? filteredSchools : []}
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
                {/* School cards first when in schools mode */}
                {providerFilter !== 'independent' && filteredSchools.slice(0, 4).map((school, index) => (
                  <motion.div 
                    key={school.id} 
                    className="flex-shrink-0 w-72 snap-start"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SchoolCard 
                      school={school} 
                      compact 
                    />
                  </motion.div>
                ))}
                
                {/* Instructor cards */}
                {mapInstructors.slice(0, 8).map((instructor, index) => (
                  <motion.div 
                    key={instructor.id} 
                    className="flex-shrink-0 w-72 snap-start"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + (filteredSchools.length + index) * 0.05 }}
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
