import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Users, 
  Calendar,
  Shield,
  Check,
  Package,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTransition } from '@/components/common/PageTransition';
import { AnimatedInstructorCard } from '@/components/instructor/AnimatedInstructorCard';
import { RatingStars } from '@/components/common/RatingStars';
import { mockDrivingSchools, getInstructorsBySchool } from '@/data/mockDrivingSchools';
import { cn } from '@/lib/utils';

export function SchoolProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const school = mockDrivingSchools.find(s => s.id === id);
  const instructors = school ? getInstructorsBySchool(school.id) : [];

  if (!school) {
    return (
      <PageTransition className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Autoescola não encontrada</h1>
          <Button onClick={() => navigate('/explore')}>Voltar</Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-background pb-24">
      {/* Header Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/30" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-10 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* School Info */}
      <div className="px-4 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 shadow-lg border border-border"
        >
          <div className="flex gap-4">
            {/* Logo */}
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0 ring-4 ring-background">
              {school.logo ? (
                <img src={school.logo} alt={school.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Verificada
                </Badge>
              </div>
              <h1 className="font-display font-bold text-xl truncate">{school.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <RatingStars rating={school.rating} size="sm" reviewCount={school.reviewCount} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600">
                <Users className="h-4 w-4" />
                <span className="font-bold">{instructors.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Instrutores</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600">
                <Calendar className="h-4 w-4" />
                <span className="font-bold">{new Date().getFullYear() - new Date(school.createdAt).getFullYear()}</span>
              </div>
              <p className="text-xs text-muted-foreground">Anos</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-bold">{school.rating}</span>
              </div>
              <p className="text-xs text-muted-foreground">Avaliação</p>
            </div>
          </div>

          {/* Contact buttons */}
          <div className="flex gap-2 mt-4">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              Entrar em Contato
            </Button>
            <Button variant="outline" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sobre a autoescola</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{school.description}</p>
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{school.address}, {school.city}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{school.email}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Packages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-5 w-5 text-blue-600" />
            <h2 className="font-display font-semibold text-lg">Pacotes de Aulas</h2>
          </div>
          
          <div className="space-y-3">
            {school.packages?.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className={cn(
                  "relative overflow-hidden",
                  pkg.popular && "ring-2 ring-blue-500"
                )}>
                  {pkg.popular && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                      Mais Popular
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{pkg.name}</h3>
                        <p className="text-sm text-muted-foreground">{pkg.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          R$ {pkg.priceTotal.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pkg.totalSessions} aulas • R$ {pkg.pricePerSession}/aula
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Inclui:</p>
                      <div className="grid grid-cols-1 gap-1">
                        {pkg.includes.slice(0, 4).map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                        {pkg.includes.length > 4 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            + {pkg.includes.length - 4} benefícios
                          </p>
                        )}
                      </div>
                    </div>

                    <Button 
                      className={cn(
                        "w-full mt-4",
                        pkg.popular 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "bg-muted text-foreground hover:bg-muted/80"
                      )}
                    >
                      Contratar Pacote
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Instructors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="font-display font-semibold text-lg">Nossos Instrutores</h2>
          </div>
          
          <div className="space-y-3">
            {instructors.map((instructor, index) => (
              <AnimatedInstructorCard 
                key={instructor.id}
                instructor={instructor}
                index={index}
                compact
              />
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
