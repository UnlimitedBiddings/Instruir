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
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from '@/components/common/RatingStars';
import { VerificationBadges } from '@/components/common/VerificationBadge';
import { mockInstructors, mockReviews } from '@/data/mockData';
import { getSchoolById } from '@/data/mockDrivingSchools';

export function InstructorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const instructor = mockInstructors.find(i => i.id === id);
  const school = instructor?.companyId ? getSchoolById(instructor.companyId) : undefined;

  if (!instructor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">Instrutor não encontrado</p>
        <Button onClick={() => navigate('/explore')}>Voltar para Explorar</Button>
      </div>
    );
  }

  const isFromSchool = instructor.providerType === 'company';

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Image */}
      <div className="relative h-72">
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
            className="h-24 w-24 rounded-2xl object-cover border-4 border-background shadow-lg"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-16">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display text-2xl font-bold">
                {instructor.name}
              </h1>
            </div>
            {isFromSchool && school && (
              <button 
                onClick={() => navigate(`/school/${school.id}`)}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline mb-2"
              >
                <Building2 className="h-4 w-4" />
                <span>{school.name}</span>
              </button>
            )}
            <div className="flex items-center gap-2 mt-1">
              <RatingStars 
                rating={instructor.rating} 
                reviewCount={instructor.reviewCount}
              />
            </div>
          </div>
          <div className="text-right">
            <div className="price-tag text-lg">
              R$ {instructor.pricePerHour}/h
            </div>
          </div>
        </div>

        {/* Provider Type Badge */}
        {isFromSchool ? (
          <Badge className="bg-blue-500 text-white mb-4">
            <Building2 className="h-3 w-3 mr-1" />
            Autoescola
          </Badge>
        ) : (
          <Badge variant="secondary" className="mb-4">
            Instrutor Autônomo
          </Badge>
        )}

        {/* Verification */}
        <div className="mb-6">
          <VerificationBadges verification={instructor.verified} size="sm" />
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h2 className="font-display font-semibold mb-2">Sobre</h2>
          <p className="text-muted-foreground">{instructor.bio}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card-elevated p-3 text-center">
            <p className="font-display text-2xl font-bold text-primary">
              {instructor.totalLessons}
            </p>
            <p className="text-xs text-muted-foreground">Aulas</p>
          </div>
          <div className="card-elevated p-3 text-center">
            <p className="font-display text-2xl font-bold text-primary">
              {instructor.experience}
            </p>
            <p className="text-xs text-muted-foreground">Anos exp.</p>
          </div>
          <div className="card-elevated p-3 text-center">
            <p className="font-display text-2xl font-bold text-primary">
              {instructor.rating}
            </p>
            <p className="text-xs text-muted-foreground">Avaliação</p>
          </div>
        </div>

        {/* Vehicle */}
        {instructor.vehicle && (
          <div className="card-elevated p-4 mb-6">
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
        <div className="card-elevated p-4 mb-6">
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
        <div className="mb-6">
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

        {/* Reviews */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Avaliações
            </h2>
            <Button variant="ghost" size="sm">
              Ver todas
            </Button>
          </div>
          
          <div className="space-y-3">
            {mockReviews.slice(0, 3).map((review) => (
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
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-shrink-0"
            onClick={() => navigate(`/chat/${instructor.id}`)}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="hero" size="lg" className="flex-1">
            <Calendar className="h-5 w-5 mr-2" />
            Agendar aula
          </Button>
        </div>
      </div>
    </div>
  );
}
