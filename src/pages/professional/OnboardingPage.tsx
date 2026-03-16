import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useProfessionalProfile } from '@/hooks/useProfessionalProfile';
import { useValidation } from '@/hooks/useValidation';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  User,
  FileText,
  Car,
  MapPin,
  Wallet,
  CheckCircle2,
  Upload,
  X,
  Loader2,
  Shield,
  Camera,
  Search,
} from 'lucide-react';

const STEPS = [
  { id: 'personal', label: 'Dados Pessoais', icon: User },
  { id: 'documents', label: 'Documentos', icon: FileText },
  { id: 'vehicle', label: 'Veículo', icon: Car },
  { id: 'zones', label: 'Atendimento', icon: MapPin },
  { id: 'bank', label: 'Financeiro', icon: Wallet },
  { id: 'review', label: 'Revisão', icon: CheckCircle2 },
];

// File upload component
function FileUploadField({ 
  label, 
  accept = "image/*,.pdf", 
  onFileSelect, 
  currentUrl, 
  isUploading 
}: { 
  label: string; 
  accept?: string; 
  onFileSelect: (file: File) => void; 
  currentUrl?: string | null; 
  isUploading: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className={cn(
        "relative border-2 border-dashed rounded-xl p-6 text-center transition-colors",
        currentUrl ? "border-accent bg-accent/5" : "border-border hover:border-primary/50"
      )}>
        {currentUrl ? (
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
            <span className="text-sm text-accent font-medium truncate">Documento enviado</span>
          </div>
        ) : isUploading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Enviando...</span>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Clique para enviar</span>
            <span className="text-xs text-muted-foreground">JPG, PNG ou PDF (máx. 5MB)</span>
            <input
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileSelect(file);
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user, profile: authProfile, userRole } = useAuth();
  const { profile: userProfile, updateProfile: updateUserProfile } = useUserProfile();
  const { profile: profProfile, updateProfile: updateProfProfile, addVehicle, addBankAccount } = useProfessionalProfile();
  const { isValidating, validateCPF, validateCEP, formatCPF, formatCEP, formatPhone, quickValidateCPF, quickValidateCEP } = useValidation();
  const { upload, isUploading } = useDocumentUpload();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Step 1: Personal Data
  const [personalData, setPersonalData] = useState({
    name: '',
    cpf: '',
    birth_date: '',
    gender: '',
    phone: '',
    zip_code: '',
    address: '',
    address_number: '',
    address_complement: '',
    neighborhood: '',
    city: '',
    state: '',
    bio: '',
    price_per_hour: '',
    category: 'driving_instructor' as string,
  });

  // Step 2: Documents
  const [docData, setDocData] = useState({
    rg: '',
    rg_issuer: '',
    cnh_number: '',
    cnh_category: '',
    cnh_expiry: '',
    cnh_document_url: null as string | null,
    criminal_record_url: null as string | null,
    profile_document_url: null as string | null,
  });

  // Step 3: Vehicle
  const [vehicleData, setVehicleData] = useState({
    plate: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    transmission: 'manual',
    has_ac: true,
    has_dual_controls: false,
    image_url: null as string | null,
  });

  // Step 4: Service Zones
  const [zoneData, setZoneData] = useState({
    service_radius_km: '10',
    accepts_displacement: true,
    displacement_fee_per_km: '0',
    cities_served: '' as string,
    neighborhoods_served: '' as string,
  });

  // Step 5: Bank Account
  const [bankData, setBankData] = useState({
    bank_code: '',
    bank_name: '',
    agency: '',
    account_number: '',
    account_type: 'corrente',
    holder_name: '',
    holder_cpf: '',
    pix_key_type: '',
    pix_key: '',
    is_primary: true,
  });

  // Step 6: Terms
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  // Pre-fill data
  useEffect(() => {
    if (userProfile) {
      setPersonalData(prev => ({
        ...prev,
        name: userProfile.name || '',
        cpf: userProfile.cpf || '',
        birth_date: userProfile.birth_date || '',
        gender: userProfile.gender || '',
        phone: userProfile.phone || '',
        zip_code: userProfile.zip_code || '',
        address: userProfile.address || '',
        address_number: userProfile.address_number || '',
        address_complement: userProfile.address_complement || '',
        neighborhood: userProfile.neighborhood || '',
        city: userProfile.city || '',
        state: userProfile.state || '',
      }));
    }
    if (profProfile) {
      setPersonalData(prev => ({
        ...prev,
        bio: profProfile.bio || '',
        price_per_hour: profProfile.price_per_hour?.toString() || '',
        category: profProfile.category || 'driving_instructor',
      }));
      setDocData(prev => ({
        ...prev,
        rg: profProfile.rg || '',
        rg_issuer: profProfile.rg_issuer || '',
        cnh_number: profProfile.cnh_number || '',
        cnh_category: profProfile.cnh_category || '',
        cnh_expiry: profProfile.cnh_expiry || '',
        cnh_document_url: profProfile.cnh_document_url,
        criminal_record_url: profProfile.criminal_record_url,
        profile_document_url: profProfile.profile_document_url,
      }));
      setZoneData(prev => ({
        ...prev,
        service_radius_km: profProfile.service_radius_km?.toString() || '10',
        accepts_displacement: profProfile.accepts_displacement ?? true,
        displacement_fee_per_km: profProfile.displacement_fee_per_km?.toString() || '0',
        cities_served: profProfile.cities_served?.join(', ') || '',
        neighborhoods_served: profProfile.neighborhoods_served?.join(', ') || '',
      }));
    }
  }, [userProfile, profProfile]);

  // CEP lookup
  const handleCEPBlur = async () => {
    if (!quickValidateCEP(personalData.zip_code)) return;
    const result = await validateCEP(personalData.zip_code);
    if (result.valid && result.data) {
      setPersonalData(prev => ({
        ...prev,
        address: result.data!.address,
        neighborhood: result.data!.neighborhood,
        city: result.data!.city,
        state: result.data!.state,
        zip_code: result.data!.cep,
      }));
    }
  };

  const handleDocUpload = async (file: File, category: 'cnh' | 'criminal_record' | 'rg') => {
    const result = await upload(file, category);
    if (result.url) {
      const key = category === 'cnh' ? 'cnh_document_url' : 
                  category === 'criminal_record' ? 'criminal_record_url' : 'profile_document_url';
      setDocData(prev => ({ ...prev, [key]: result.url }));
    }
  };

  const handleVehicleImageUpload = async (file: File) => {
    const result = await upload(file, 'vehicle');
    if (result.url) {
      setVehicleData(prev => ({ ...prev, image_url: result.url }));
    }
  };

  const handleSaveStep = async () => {
    setIsSaving(true);
    try {
      switch (currentStep) {
        case 0: // Personal
          await updateUserProfile({
            name: personalData.name,
            cpf: personalData.cpf,
            birth_date: personalData.birth_date || null,
            gender: personalData.gender || null,
            phone: personalData.phone,
            zip_code: personalData.zip_code,
            address: personalData.address,
            address_number: personalData.address_number,
            address_complement: personalData.address_complement,
            neighborhood: personalData.neighborhood,
            city: personalData.city,
            state: personalData.state,
          });
          if (profProfile) {
            await updateProfProfile({
              bio: personalData.bio || null,
              price_per_hour: parseFloat(personalData.price_per_hour) || 0,
              category: personalData.category as any,
              city: personalData.city,
              address: personalData.address,
            });
          }
          break;
        case 1: // Documents
          if (profProfile) {
            await updateProfProfile({
              rg: docData.rg || null,
              rg_issuer: docData.rg_issuer || null,
              cnh_number: docData.cnh_number || null,
              cnh_category: docData.cnh_category || null,
              cnh_expiry: docData.cnh_expiry || null,
              cnh_document_url: docData.cnh_document_url,
              criminal_record_url: docData.criminal_record_url,
              profile_document_url: docData.profile_document_url,
            });
          }
          break;
        case 3: // Zones
          if (profProfile) {
            await updateProfProfile({
              service_radius_km: parseFloat(zoneData.service_radius_km) || 10,
              accepts_displacement: zoneData.accepts_displacement,
              displacement_fee_per_km: parseFloat(zoneData.displacement_fee_per_km) || 0,
              cities_served: zoneData.cities_served ? zoneData.cities_served.split(',').map(s => s.trim()).filter(Boolean) : null,
              neighborhoods_served: zoneData.neighborhoods_served ? zoneData.neighborhoods_served.split(',').map(s => s.trim()).filter(Boolean) : null,
            });
          }
          break;
      }
      setCurrentStep(prev => prev + 1);
    } catch (err) {
      toast.error('Erro ao salvar dados');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveVehicle = async () => {
    if (!vehicleData.plate || !vehicleData.brand || !vehicleData.model || !vehicleData.year) {
      toast.error('Preencha os campos obrigatórios do veículo');
      return;
    }
    setIsSaving(true);
    try {
      await addVehicle({
        plate: vehicleData.plate.toUpperCase(),
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: parseInt(vehicleData.year),
        color: vehicleData.color,
        transmission: vehicleData.transmission,
        has_ac: vehicleData.has_ac,
        has_dual_controls: vehicleData.has_dual_controls,
        is_primary: true,
        is_active: true,
        dpvat_paid: false,
        image_url: vehicleData.image_url,
        renavam: null,
        chassis: null,
        vehicle_document_url: null,
        insurance_company: null,
        insurance_policy_number: null,
        insurance_expiry: null,
        inspection_url: null,
        inspection_expiry: null,
      });
      setCurrentStep(prev => prev + 1);
    } catch (err) {
      toast.error('Erro ao salvar veículo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBank = async () => {
    if (!bankData.bank_code || !bankData.agency || !bankData.account_number || !bankData.holder_name || !bankData.holder_cpf) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    setIsSaving(true);
    try {
      await addBankAccount({
        bank_code: bankData.bank_code,
        bank_name: bankData.bank_name || bankData.bank_code,
        agency: bankData.agency,
        account_number: bankData.account_number,
        account_type: bankData.account_type,
        holder_name: bankData.holder_name,
        holder_cpf: bankData.holder_cpf,
        pix_key_type: bankData.pix_key_type || null,
        pix_key: bankData.pix_key || null,
        is_primary: true,
      });
      setCurrentStep(prev => prev + 1);
    } catch (err) {
      toast.error('Erro ao salvar conta bancária');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinish = async () => {
    if (!acceptedTerms || !acceptedPrivacy) {
      toast.error('Aceite os termos para continuar');
      return;
    }
    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      await updateUserProfile({
        terms_accepted_at: now,
        privacy_accepted_at: now,
      });
      toast.success('Cadastro finalizado com sucesso! 🎉');
      navigate('/profile');
    } catch (err) {
      toast.error('Erro ao finalizar cadastro');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 2) {
      // Vehicle step - can skip or save
      if (vehicleData.plate) {
        handleSaveVehicle();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } else if (currentStep === 4) {
      handleSaveBank();
    } else if (currentStep === 5) {
      handleFinish();
    } else {
      handleSaveStep();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return personalData.name && personalData.cpf && personalData.phone && personalData.price_per_hour;
      case 1:
        return true; // Documents are optional at this stage
      case 2:
        return true; // Vehicle is optional
      case 3:
        return true; // Zones have defaults
      case 4:
        return bankData.bank_code && bankData.agency && bankData.account_number && bankData.holder_name && bankData.holder_cpf;
      case 5:
        return acceptedTerms && acceptedPrivacy;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 safe-area-top sticky top-0 z-30">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : navigate('/profile')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-lg font-bold">Completar Cadastro</h1>
            <p className="text-xs text-muted-foreground">
              Etapa {currentStep + 1} de {STEPS.length}: {STEPS[currentStep].label}
            </p>
          </div>
          <Shield className="h-5 w-5 text-accent" />
        </div>

        {/* Progress bar */}
        <div className="flex gap-1">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex-1 h-1.5 rounded-full transition-all duration-300",
                index <= currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mt-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => index < currentStep && setCurrentStep(index)}
                disabled={index > currentStep}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all",
                  index === currentStep ? "text-primary" :
                  index < currentStep ? "text-accent cursor-pointer" :
                  "text-muted-foreground/40"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  index === currentStep ? "bg-primary text-primary-foreground" :
                  index < currentStep ? "bg-accent/20 text-accent" :
                  "bg-muted"
                )}>
                  {index < currentStep ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className="text-[10px] font-medium hidden sm:block">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-32 max-w-lg mx-auto">
        {/* Step 1: Personal Data */}
        {currentStep === 0 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-2">
              <Label>Categoria profissional *</Label>
              <Select value={personalData.category} onValueChange={(v) => setPersonalData(prev => ({ ...prev, category: v }))}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="driving_instructor">Instrutor de Direção</SelectItem>
                  <SelectItem value="language_teacher">Professor de Idiomas</SelectItem>
                  <SelectItem value="music_teacher">Professor de Música</SelectItem>
                  <SelectItem value="personal_trainer">Personal Trainer</SelectItem>
                  <SelectItem value="tutor">Tutor/Reforço Escolar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nome completo *</Label>
              <Input value={personalData.name} onChange={(e) => setPersonalData(prev => ({ ...prev, name: e.target.value }))} className="h-12" placeholder="Seu nome completo" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>CPF *</Label>
                <Input value={personalData.cpf} onChange={(e) => setPersonalData(prev => ({ ...prev, cpf: formatCPF(e.target.value) }))} className="h-12" placeholder="000.000.000-00" maxLength={14} />
              </div>
              <div className="space-y-2">
                <Label>Data de nascimento</Label>
                <Input type="date" value={personalData.birth_date} onChange={(e) => setPersonalData(prev => ({ ...prev, birth_date: e.target.value }))} className="h-12" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Gênero</Label>
                <Select value={personalData.gender} onValueChange={(v) => setPersonalData(prev => ({ ...prev, gender: v }))}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                    <SelectItem value="prefer_not_say">Prefiro não dizer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Telefone *</Label>
                <Input value={personalData.phone} onChange={(e) => setPersonalData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))} className="h-12" placeholder="(11) 99999-9999" maxLength={15} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-2">
                <Label>CEP</Label>
                <Input value={personalData.zip_code} onChange={(e) => setPersonalData(prev => ({ ...prev, zip_code: formatCEP(e.target.value) }))} onBlur={handleCEPBlur} className="h-12" placeholder="00000-000" maxLength={9} />
              </div>
              <div className="space-y-2">
                <Label>UF</Label>
                <Input value={personalData.state} onChange={(e) => setPersonalData(prev => ({ ...prev, state: e.target.value }))} className="h-12" placeholder="SP" maxLength={2} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Endereço</Label>
              <Input value={personalData.address} onChange={(e) => setPersonalData(prev => ({ ...prev, address: e.target.value }))} className="h-12" placeholder="Rua, Avenida..." />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Número</Label>
                <Input value={personalData.address_number} onChange={(e) => setPersonalData(prev => ({ ...prev, address_number: e.target.value }))} className="h-12" placeholder="123" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Complemento</Label>
                <Input value={personalData.address_complement} onChange={(e) => setPersonalData(prev => ({ ...prev, address_complement: e.target.value }))} className="h-12" placeholder="Apto, Bloco..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Bairro</Label>
                <Input value={personalData.neighborhood} onChange={(e) => setPersonalData(prev => ({ ...prev, neighborhood: e.target.value }))} className="h-12" />
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input value={personalData.city} onChange={(e) => setPersonalData(prev => ({ ...prev, city: e.target.value }))} className="h-12" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Valor por hora (R$) *</Label>
              <Input type="number" value={personalData.price_per_hour} onChange={(e) => setPersonalData(prev => ({ ...prev, price_per_hour: e.target.value }))} className="h-12" placeholder="85.00" min="0" step="0.01" />
            </div>

            <div className="space-y-2">
              <Label>Sobre você</Label>
              <Textarea value={personalData.bio} onChange={(e) => setPersonalData(prev => ({ ...prev, bio: e.target.value }))} placeholder="Conte um pouco sobre sua experiência e método de ensino..." rows={4} maxLength={500} />
              <p className="text-xs text-muted-foreground text-right">{personalData.bio.length}/500</p>
            </div>
          </div>
        )}

        {/* Step 2: Documents */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-4">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-accent">Verificação de Documentos</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Seus documentos serão analisados pela equipe do Instruir para garantir a segurança da plataforma.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>RG</Label>
                <Input value={docData.rg} onChange={(e) => setDocData(prev => ({ ...prev, rg: e.target.value }))} className="h-12" placeholder="00.000.000-0" />
              </div>
              <div className="space-y-2">
                <Label>Órgão emissor</Label>
                <Input value={docData.rg_issuer} onChange={(e) => setDocData(prev => ({ ...prev, rg_issuer: e.target.value }))} className="h-12" placeholder="SSP/SP" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Número da CNH</Label>
                <Input value={docData.cnh_number} onChange={(e) => setDocData(prev => ({ ...prev, cnh_number: e.target.value }))} className="h-12" placeholder="00000000000" />
              </div>
              <div className="space-y-2">
                <Label>Categoria CNH</Label>
                <Select value={docData.cnh_category} onValueChange={(v) => setDocData(prev => ({ ...prev, cnh_category: v }))}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="AB">AB</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Validade da CNH</Label>
              <Input type="date" value={docData.cnh_expiry} onChange={(e) => setDocData(prev => ({ ...prev, cnh_expiry: e.target.value }))} className="h-12" />
            </div>

            <FileUploadField
              label="Foto da CNH (frente e verso)"
              onFileSelect={(file) => handleDocUpload(file, 'cnh')}
              currentUrl={docData.cnh_document_url}
              isUploading={isUploading}
            />

            <FileUploadField
              label="Certidão de Antecedentes Criminais"
              onFileSelect={(file) => handleDocUpload(file, 'criminal_record')}
              currentUrl={docData.criminal_record_url}
              isUploading={isUploading}
            />

            <FileUploadField
              label="Foto de perfil com documento"
              onFileSelect={(file) => handleDocUpload(file, 'rg')}
              currentUrl={docData.profile_document_url}
              isUploading={isUploading}
            />
          </div>
        )}

        {/* Step 3: Vehicle */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-muted/50 rounded-xl p-4 mb-4">
              <p className="text-sm text-muted-foreground">
                {personalData.category === 'driving_instructor' 
                  ? 'Cadastre o veículo que será utilizado nas aulas práticas.'
                  : 'Se você utiliza veículo para deslocamento até o aluno, cadastre-o aqui. Caso contrário, pule esta etapa.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Placa *</Label>
                <Input value={vehicleData.plate} onChange={(e) => setVehicleData(prev => ({ ...prev, plate: e.target.value.toUpperCase() }))} className="h-12" placeholder="ABC1D23" maxLength={7} />
              </div>
              <div className="space-y-2">
                <Label>Ano *</Label>
                <Input type="number" value={vehicleData.year} onChange={(e) => setVehicleData(prev => ({ ...prev, year: e.target.value }))} className="h-12" placeholder="2024" min="1990" max="2030" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Marca *</Label>
                <Input value={vehicleData.brand} onChange={(e) => setVehicleData(prev => ({ ...prev, brand: e.target.value }))} className="h-12" placeholder="Chevrolet" />
              </div>
              <div className="space-y-2">
                <Label>Modelo *</Label>
                <Input value={vehicleData.model} onChange={(e) => setVehicleData(prev => ({ ...prev, model: e.target.value }))} className="h-12" placeholder="Onix" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Cor</Label>
                <Input value={vehicleData.color} onChange={(e) => setVehicleData(prev => ({ ...prev, color: e.target.value }))} className="h-12" placeholder="Branco" />
              </div>
              <div className="space-y-2">
                <Label>Câmbio</Label>
                <Select value={vehicleData.transmission} onValueChange={(v) => setVehicleData(prev => ({ ...prev, transmission: v }))}>
                  <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <Label className="cursor-pointer">Ar condicionado</Label>
              <Switch checked={vehicleData.has_ac} onCheckedChange={(v) => setVehicleData(prev => ({ ...prev, has_ac: v }))} />
            </div>

            {personalData.category === 'driving_instructor' && (
              <div className="flex items-center justify-between py-3">
                <Label className="cursor-pointer">Duplo comando</Label>
                <Switch checked={vehicleData.has_dual_controls} onCheckedChange={(v) => setVehicleData(prev => ({ ...prev, has_dual_controls: v }))} />
              </div>
            )}

            <FileUploadField
              label="Foto do veículo"
              accept="image/*"
              onFileSelect={handleVehicleImageUpload}
              currentUrl={vehicleData.image_url}
              isUploading={isUploading}
            />
          </div>
        )}

        {/* Step 4: Service Zones */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-2">
              <Label>Raio de atendimento (km)</Label>
              <Input type="number" value={zoneData.service_radius_km} onChange={(e) => setZoneData(prev => ({ ...prev, service_radius_km: e.target.value }))} className="h-12" placeholder="10" min="1" max="100" />
              <p className="text-xs text-muted-foreground">Distância máxima que você se desloca para atender.</p>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <Label className="cursor-pointer">Aceita deslocamento</Label>
                <p className="text-xs text-muted-foreground mt-1">Você vai até o local do aluno</p>
              </div>
              <Switch checked={zoneData.accepts_displacement} onCheckedChange={(v) => setZoneData(prev => ({ ...prev, accepts_displacement: v }))} />
            </div>

            {zoneData.accepts_displacement && (
              <div className="space-y-2">
                <Label>Taxa de deslocamento (R$/km)</Label>
                <Input type="number" value={zoneData.displacement_fee_per_km} onChange={(e) => setZoneData(prev => ({ ...prev, displacement_fee_per_km: e.target.value }))} className="h-12" placeholder="2.00" min="0" step="0.5" />
              </div>
            )}

            <div className="space-y-2">
              <Label>Cidades atendidas</Label>
              <Input value={zoneData.cities_served} onChange={(e) => setZoneData(prev => ({ ...prev, cities_served: e.target.value }))} className="h-12" placeholder="São Paulo, Guarulhos, Osasco" />
              <p className="text-xs text-muted-foreground">Separe as cidades por vírgula.</p>
            </div>

            <div className="space-y-2">
              <Label>Bairros atendidos</Label>
              <Textarea value={zoneData.neighborhoods_served} onChange={(e) => setZoneData(prev => ({ ...prev, neighborhoods_served: e.target.value }))} placeholder="Centro, Jardins, Moema, Vila Mariana..." rows={3} />
              <p className="text-xs text-muted-foreground">Separe os bairros por vírgula.</p>
            </div>
          </div>
        )}

        {/* Step 5: Bank Account */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-muted-foreground">
                Seus dados bancários são usados exclusivamente para transferência de pagamentos.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Código do banco *</Label>
                <Input value={bankData.bank_code} onChange={(e) => setBankData(prev => ({ ...prev, bank_code: e.target.value }))} className="h-12" placeholder="001" maxLength={4} />
              </div>
              <div className="space-y-2">
                <Label>Nome do banco</Label>
                <Input value={bankData.bank_name} onChange={(e) => setBankData(prev => ({ ...prev, bank_name: e.target.value }))} className="h-12" placeholder="Banco do Brasil" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Agência *</Label>
                <Input value={bankData.agency} onChange={(e) => setBankData(prev => ({ ...prev, agency: e.target.value }))} className="h-12" placeholder="0001" />
              </div>
              <div className="space-y-2">
                <Label>Conta *</Label>
                <Input value={bankData.account_number} onChange={(e) => setBankData(prev => ({ ...prev, account_number: e.target.value }))} className="h-12" placeholder="12345-6" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipo de conta</Label>
              <Select value={bankData.account_type} onValueChange={(v) => setBankData(prev => ({ ...prev, account_type: v }))}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="corrente">Conta Corrente</SelectItem>
                  <SelectItem value="poupanca">Poupança</SelectItem>
                  <SelectItem value="pagamento">Conta Pagamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nome do titular *</Label>
              <Input value={bankData.holder_name} onChange={(e) => setBankData(prev => ({ ...prev, holder_name: e.target.value }))} className="h-12" placeholder="Nome completo" />
            </div>

            <div className="space-y-2">
              <Label>CPF do titular *</Label>
              <Input value={bankData.holder_cpf} onChange={(e) => setBankData(prev => ({ ...prev, holder_cpf: formatCPF(e.target.value) }))} className="h-12" placeholder="000.000.000-00" maxLength={14} />
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <h3 className="font-medium mb-4">Chave PIX (opcional)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Tipo da chave</Label>
                  <Select value={bankData.pix_key_type} onValueChange={(v) => setBankData(prev => ({ ...prev, pix_key_type: v }))}>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpf">CPF</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="phone">Telefone</SelectItem>
                      <SelectItem value="random">Aleatória</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Chave PIX</Label>
                  <Input value={bankData.pix_key} onChange={(e) => setBankData(prev => ({ ...prev, pix_key: e.target.value }))} className="h-12" placeholder="Sua chave" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Review & Terms */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-accent">Quase lá!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Revise seus dados e aceite os termos para finalizar.
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="space-y-3">
              <SummaryCard title="Dados Pessoais" items={[
                { label: 'Nome', value: personalData.name },
                { label: 'CPF', value: personalData.cpf },
                { label: 'Telefone', value: personalData.phone },
                { label: 'Cidade', value: personalData.city },
                { label: 'Valor/hora', value: `R$ ${personalData.price_per_hour}` },
              ]} onEdit={() => setCurrentStep(0)} />

              <SummaryCard title="Documentos" items={[
                { label: 'CNH', value: docData.cnh_number || 'Não informado' },
                { label: 'Categoria', value: docData.cnh_category || 'Não informada' },
                { label: 'Foto CNH', value: docData.cnh_document_url ? '✅ Enviado' : '⚠️ Pendente' },
                { label: 'Antecedentes', value: docData.criminal_record_url ? '✅ Enviado' : '⚠️ Pendente' },
              ]} onEdit={() => setCurrentStep(1)} />

              {vehicleData.plate && (
                <SummaryCard title="Veículo" items={[
                  { label: 'Placa', value: vehicleData.plate },
                  { label: 'Veículo', value: `${vehicleData.brand} ${vehicleData.model} ${vehicleData.year}` },
                  { label: 'Câmbio', value: vehicleData.transmission === 'manual' ? 'Manual' : 'Automático' },
                ]} onEdit={() => setCurrentStep(2)} />
              )}

              <SummaryCard title="Conta Bancária" items={[
                { label: 'Banco', value: bankData.bank_name || bankData.bank_code },
                { label: 'Agência', value: bankData.agency },
                { label: 'Conta', value: bankData.account_number },
                { label: 'PIX', value: bankData.pix_key || 'Não informado' },
              ]} onEdit={() => setCurrentStep(4)} />
            </div>

            {/* Terms */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(v) => setAcceptedTerms(v === true)}
                />
                <label htmlFor="terms" className="text-sm cursor-pointer">
                  Li e aceito os <button className="text-primary hover:underline font-medium">Termos de Uso</button> da plataforma Instruir.
                </label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacy"
                  checked={acceptedPrivacy}
                  onCheckedChange={(v) => setAcceptedPrivacy(v === true)}
                />
                <label htmlFor="privacy" className="text-sm cursor-pointer">
                  Li e aceito a <button className="text-primary hover:underline font-medium">Política de Privacidade</button> e concordo com o tratamento dos meus dados conforme a LGPD.
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 safe-area-bottom z-30">
        <div className="max-w-lg mx-auto flex gap-3">
          {currentStep > 0 && (
            <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} className="flex-shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="hero"
            className="flex-1"
            onClick={handleNext}
            disabled={!canProceed() || isSaving || isUploading || isValidating}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </span>
            ) : currentStep === 5 ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Finalizar Cadastro
              </span>
            ) : currentStep === 2 && !vehicleData.plate ? (
              <span className="flex items-center gap-2">
                Pular etapa
                <ArrowRight className="h-4 w-4" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continuar
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Summary card component
function SummaryCard({ title, items, onEdit }: { 
  title: string; 
  items: { label: string; value: string }[]; 
  onEdit: () => void;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">{title}</h3>
        <button onClick={onEdit} className="text-xs text-primary hover:underline">Editar</button>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium truncate ml-4 max-w-[60%] text-right">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
