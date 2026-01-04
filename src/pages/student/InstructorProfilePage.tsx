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
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/common/RatingStars';
import { VerificationBadges } from '@/components/common/VerificationBadge';
import { mockInstructors, mockReviews } from '@/data/mockData';

export function InstructorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const instructor = mockInstructors.find(i => i.id === id);

  if (!instructor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Instrutor não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Image */}
      <div className="relative h-72">
        <img
          src={instructor.vehicle.image || instructor.avatar}
          alt={instructor.vehicle.model}
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
            <h1 className="font-display text-2xl font-bold">
              {instructor.name}
            </h1>
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
          <Button variant="outline" size="lg" className="flex-shrink-0">
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
