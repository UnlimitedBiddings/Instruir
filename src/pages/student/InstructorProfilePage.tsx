import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Car, 
  Clock, 
  Shield,
  Calendar,
  MessageCircle,
  Share2,
  Building2,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RatingStars } from '@/components/common/RatingStars';
import { VerificationBadges } from '@/components/common/VerificationBadge';
import { InstructorScheduleView } from '@/components/instructor/InstructorScheduleView';
import { mockInstructors, mockReviews } from '@/data/mockData';
import { getSchoolById } from '@/data/mockDrivingSchools';

export function InstructorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  
  const instructor = mockInstructors.find(i => i.id === id);
  const school = instructor?.companyId ? getSchoolById(instructor.companyId) : undefined;

  if (!instructor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">Instrutor não encontrado</p>
        <Button onClick={() => navigate('/explore')}>Voltar para Home</Button>
      </div>
    );
  }

  const isFromSchool = instructor.providerType === 'company';

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Image */}
      <div className="relative h-56 sm:h-72">
        <img
          src={instructor.vehicle?.image || instructor.avatar}
          alt={instructor.vehicle?.model || instructor.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        
        {/* Top Actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between safe-area-top">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 text-white hover:bg-black/50"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 text-white hover:bg-black/50"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Instructor Avatar */}
        <div className="absolute -bottom-12 left-4">
          <img
            src={instructor.avatar}
            alt={instructor.name}
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border-4 border-background shadow-lg"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-14 sm:pt-16">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl sm:text-2xl font-bold truncate">
              {instructor.name}
            </h1>
            {isFromSchool && school && (
              <button 
                onClick={() => navigate(`/school/${school.id}`)}
                className="flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <Building2 className="h-4 w-4" />
                <span className="truncate">{school.name}</span>
              </button>
            )}
            <div className="flex items-center gap-2 mt-1">
              <RatingStars 
                rating={instructor.rating} 
                reviewCount={instructor.reviewCount}
              />
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="price-tag text-base sm:text-lg">
              R$ {instructor.pricePerHour}/h
            </div>
          </div>
        </div>

        {/* Provider Type Badge */}
        {isFromSchool ? (
          <Badge className="bg-accent text-accent-foreground mb-4">
            <Building2 className="h-3 w-3 mr-1" />
            Autoescola
          </Badge>
        ) : (
          <Badge variant="secondary" className="mb-4">
            Instrutor Autônomo
          </Badge>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto p-1 bg-muted/50 rounded-xl mb-4">
            <TabsTrigger 
              value="info" 
              className="flex-1 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Info className="h-4 w-4 mr-2" />
              Sobre
            </TabsTrigger>
            <TabsTrigger 
              value="schedule" 
              className="flex-1 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Agenda
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="flex-1 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Star className="h-4 w-4 mr-2" />
              Avaliações
            </TabsTrigger>
          </TabsList>

          {/* Info Tab */}
          <TabsContent value="info" className="mt-0 space-y-4">
            {/* Verification */}
            <VerificationBadges verification={instructor.verified} size="sm" />

            {/* Bio */}
            <div>
              <h2 className="font-display font-semibold mb-2">Sobre</h2>
              <p className="text-muted-foreground text-sm sm:text-base">{instructor.bio}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="card-elevated p-3 text-center">
                <p className="font-display text-xl sm:text-2xl font-bold text-primary">
                  {instructor.totalLessons}
                </p>
                <p className="text-xs text-muted-foreground">Aulas</p>
              </div>
              <div className="card-elevated p-3 text-center">
                <p className="font-display text-xl sm:text-2xl font-bold text-primary">
                  {instructor.experience}
                </p>
                <p className="text-xs text-muted-foreground">Anos exp.</p>
              </div>
              <div className="card-elevated p-3 text-center">
                <p className="font-display text-xl sm:text-2xl font-bold text-primary">
                  {instructor.rating}
                </p>
                <p className="text-xs text-muted-foreground">Avaliação</p>
              </div>
            </div>

            {/* Vehicle */}
            {instructor.vehicle && (
              <div className="card-elevated p-4">
                <h2 className="font-display font-semibold mb-3 flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  Veículo
                </h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Modelo</p>
                    <p className="font-medium">{instructor.vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ano</p>
                    <p className="font-medium">{instructor.vehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cor</p>
                    <p className="font-medium">{instructor.vehicle.color}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Câmbio</p>
                    <p className="font-medium">
                      {instructor.vehicle.transmission === 'manual' ? 'Manual' : 'Automático'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            <div className="card-elevated p-4">
              <h2 className="font-display font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Localização
              </h2>
              <p className="text-sm text-muted-foreground">
                {instructor.location.address}, {instructor.location.city}
              </p>
              {instructor.location.distance && (
                <p className="text-sm text-primary mt-1">
                  {instructor.location.distance.toFixed(1)} km de você
                </p>
              )}
            </div>

            {/* Service Zones */}
            <div>
              <h2 className="font-display font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Regiões de atendimento
              </h2>
              <div className="flex flex-wrap gap-2">
                {instructor.serviceZones.map((zone) => (
                  <span 
                    key={zone}
                    className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="mt-0">
            <InstructorScheduleView 
              instructorId={instructor.id}
              instructorName={instructor.name}
              pricePerHour={instructor.pricePerHour}
            />
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-0 space-y-3">
            {mockReviews.slice(0, 5).map((review) => (
              <div key={review.id} className="card-elevated p-4">
                <div className="flex items-center gap-2 mb-2">
                  <RatingStars rating={review.rating} size="sm" showValue={false} />
                  <span className="text-xs text-muted-foreground">
                    {format(review.createdAt, "d 'de' MMM", { locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {review.comment}
                </p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="flex gap-3 max-w-lg mx-auto">
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-shrink-0"
            onClick={() => navigate(`/chat/${instructor.id}`)}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button 
            variant="hero" 
            size="lg" 
            className="flex-1"
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Agendar aula
          </Button>
        </div>
      </div>
    </div>
  );
}
