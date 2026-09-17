import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useProfessionalProfile } from '@/hooks/useProfessionalProfile';
import { useValidation } from '@/hooks/useValidation';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  User,
  FileText,
  Car,
  MapPin,
  Wallet,
  CheckCircle2,
  Upload,
  Loader2,
  Shield,
  Pencil,
  Trash2,
  Plus,
} from 'lucide-react';

type TabId = 'personal' | 'documents' | 'vehicle' | 'zones' | 'bank';

const TABS = [
  { id: 'personal' as TabId, label: 'Pessoal', icon: User },
  { id: 'documents' as TabId, label: 'Documentos', icon: FileText },
  { id: 'vehicle' as TabId, label: 'Veículo', icon: Car },
  { id: 'zones' as TabId, label: 'Atendimento', icon: MapPin },
  { id: 'bank' as TabId, label: 'Financeiro', icon: Wallet },
];

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
        "relative border-2 border-dashed rounded-xl p-5 text-center transition-colors",
        currentUrl ? "border-accent bg-accent/5" : "border-border hover:border-primary/50"
      )}>
        {currentUrl ? (
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
            <span className="text-sm text-accent font-medium truncate flex-1">Documento enviado</span>
            <label className="cursor-pointer text-xs text-primary hover:underline">
              Trocar
              <input type="file" accept={accept} className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileSelect(file);
              }} />
            </label>
          </div>
        ) : isUploading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Enviando...</span>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center gap-2">
            <Upload className="h-7 w-7 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Clique para enviar</span>
            <span className="text-xs text-muted-foreground">JPG, PNG ou PDF (máx. 5MB)</span>
            <input type="file" accept={accept} className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
            }} />
          </label>
        )}
      </div>
    </div>
  );
}

export function EditProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile: userProfile, updateProfile: updateUserProfile, uploadAvatar } = useUserProfile();
  const { 
    profile: profProfile, 
    vehicles, 
    bankAccounts,
    updateVehicle,
    deleteVehicle,
    updateBankAccount,
    deleteBankAccount,
    refetch: refetchProf,
  } = useProfessionalProfile();
  const { isValidating, validateCEP, formatCPF, formatCEP, formatPhone, quickValidateCEP } = useValidation();
  const { upload, isUploading } = useDocumentUpload();

  const [activeTab, setActiveTab] = useState<TabId>('personal');
  const [isSaving, setIsSaving] = useState(false);

  // Personal Data
  const [personalData, setPersonalData] = useState({
    name: '', cpf: '', birth_date: '', gender: '', phone: '',
    zip_code: '', address: '', address_number: '', address_complement: '',
    neighborhood: '', city: '', state: '', bio: '', price_per_hour: '',
    category: 'driving_instructor',
  });

  // Documents
  const [docData, setDocData] = useState({
    rg: '', rg_issuer: '', cnh_number: '', cnh_category: '', cnh_expiry: '',
    cnh_document_url: null as string | null,
    criminal_record_url: null as string | null,
    profile_document_url: null as string | null,
  });

  // Zones
  const [zoneData, setZoneData] = useState({
    service_radius_km: '10', accepts_displacement: true,
    displacement_fee_per_km: '0', cities_served: '', neighborhoods_served: '',
  });

  // Pre-fill
  useEffect(() => {
    if (userProfile) {
      setPersonalData(prev => ({
        ...prev,
        name: userProfile.name || '', cpf: userProfile.cpf || '',
        birth_date: userProfile.birth_date || '', gender: userProfile.gender || '',
        phone: userProfile.phone || '', zip_code: userProfile.zip_code || '',
        address: userProfile.address || '', address_number: userProfile.address_number || '',
        address_complement: userProfile.address_complement || '',
        neighborhood: userProfile.neighborhood || '', city: userProfile.city || '',
        state: userProfile.state || '',
      }));
    }
    if (profProfile) {
      setPersonalData(prev => ({
        ...prev,
        bio: profProfile.bio || '', price_per_hour: profProfile.price_per_hour?.toString() || '',
        category: profProfile.category || 'driving_instructor',
      }));
      setDocData({
        rg: profProfile.rg || '', rg_issuer: profProfile.rg_issuer || '',
        cnh_number: profProfile.cnh_number || '', cnh_category: profProfile.cnh_category || '',
        cnh_expiry: profProfile.cnh_expiry || '',
        cnh_document_url: profProfile.cnh_document_url,
        criminal_record_url: profProfile.criminal_record_url,
        profile_document_url: profProfile.profile_document_url,
      });
      setZoneData({
        service_radius_km: profProfile.service_radius_km?.toString() || '10',
        accepts_displacement: profProfile.accepts_displacement ?? true,
        displacement_fee_per_km: profProfile.displacement_fee_per_km?.toString() || '0',
        cities_served: profProfile.cities_served?.join(', ') || '',
        neighborhoods_served: profProfile.neighborhoods_served?.join(', ') || '',
      });
    }
  }, [userProfile, profProfile]);

  const handleCEPBlur = async () => {
    if (!quickValidateCEP(personalData.zip_code)) return;
    const result = await validateCEP(personalData.zip_code);
    if (result.valid && result.data) {
      setPersonalData(prev => ({
        ...prev,
        address: result.data!.address || prev.address,
        neighborhood: result.data!.neighborhood || prev.neighborhood,
        city: result.data!.city || prev.city,
        state: result.data!.state || prev.state,
        zip_code: result.data!.cep || prev.zip_code,
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

  const handleSavePersonal = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile({
        name: personalData.name, cpf: personalData.cpf,
        birth_date: personalData.birth_date || null, gender: personalData.gender || null,
        phone: personalData.phone, zip_code: personalData.zip_code,
        address: personalData.address, address_number: personalData.address_number,
        address_complement: personalData.address_complement,
        neighborhood: personalData.neighborhood, city: personalData.city,
        state: personalData.state,
      });

      if (user?.id) {
        await supabase.from('professionals').update({
          bio: personalData.bio || null,
          price_per_hour: parseFloat(personalData.price_per_hour) || 50,
          category: personalData.category as any,
          city: personalData.city || null,
          address: personalData.address || null,
        }).eq('user_id', user.id);
      }
      toast.success('Dados pessoais atualizados!');
    } catch (err) {
      toast.error('Erro ao salvar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDocuments = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      const { data: prof, error: profErr } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (profErr) throw profErr;
      if (!prof?.id) throw new Error('Perfil profissional não encontrado');

      const { error } = await supabase.from('professional_documents').upsert({
        professional_id: prof.id,
        rg: docData.rg || null, rg_issuer: docData.rg_issuer || null,
        cnh_number: docData.cnh_number || null, cnh_category: docData.cnh_category || null,
        cnh_expiry: docData.cnh_expiry || null,
        cnh_document_url: docData.cnh_document_url,
        criminal_record_url: docData.criminal_record_url,
        profile_document_url: docData.profile_document_url,
      }, { onConflict: 'professional_id' });
      if (error) throw error;
      toast.success('Documentos atualizados!');
    } catch (err) {
      toast.error('Erro ao salvar documentos');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveZones = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('professionals').update({
        service_radius_km: parseFloat(zoneData.service_radius_km) || 10,
        accepts_displacement: zoneData.accepts_displacement,
        displacement_fee_per_km: parseFloat(zoneData.displacement_fee_per_km) || 0,
        cities_served: zoneData.cities_served ? zoneData.cities_served.split(',').map(s => s.trim()).filter(Boolean) : null,
        neighborhoods_served: zoneData.neighborhoods_served ? zoneData.neighborhoods_served.split(',').map(s => s.trim()).filter(Boolean) : null,
      }).eq('user_id', user.id);
      if (error) throw error;
      toast.success('Zona de atendimento atualizada!');
    } catch (err) {
      toast.error('Erro ao salvar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (confirm('Remover este veículo?')) {
      await deleteVehicle(id);
    }
  };

  const handleDeleteBank = async (id: string) => {
    if (confirm('Remover esta conta bancária?')) {
      await deleteBankAccount(id);
    }
  };

  const handleSave = () => {
    switch (activeTab) {
      case 'personal': handleSavePersonal(); break;
      case 'documents': handleSaveDocuments(); break;
      case 'zones': handleSaveZones(); break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 safe-area-top sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-lg font-bold">Editar Perfil</h1>
          </div>
          <Shield className="h-5 w-5 text-accent" />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-card border-b border-border overflow-x-auto">
        <div className="flex min-w-max px-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-28 max-w-lg mx-auto">
        {/* Personal Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-2">
              <Label>Categoria profissional</Label>
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
              <Label>Nome completo</Label>
              <Input value={personalData.name} onChange={(e) => setPersonalData(prev => ({ ...prev, name: e.target.value }))} className="h-12" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input value={personalData.cpf} onChange={(e) => setPersonalData(prev => ({ ...prev, cpf: formatCPF(e.target.value) }))} className="h-12" maxLength={14} />
              </div>
              <div className="space-y-2">
                <Label>Nascimento</Label>
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
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={personalData.phone} onChange={(e) => setPersonalData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))} className="h-12" maxLength={15} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-2">
                <Label>CEP</Label>
                <Input value={personalData.zip_code} onChange={(e) => setPersonalData(prev => ({ ...prev, zip_code: formatCEP(e.target.value) }))} onBlur={handleCEPBlur} className="h-12" maxLength={9} />
              </div>
              <div className="space-y-2">
                <Label>UF</Label>
                <Input value={personalData.state} onChange={(e) => setPersonalData(prev => ({ ...prev, state: e.target.value }))} className="h-12" maxLength={2} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Endereço</Label>
              <Input value={personalData.address} onChange={(e) => setPersonalData(prev => ({ ...prev, address: e.target.value }))} className="h-12" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Número</Label>
                <Input value={personalData.address_number} onChange={(e) => setPersonalData(prev => ({ ...prev, address_number: e.target.value }))} className="h-12" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Complemento</Label>
                <Input value={personalData.address_complement} onChange={(e) => setPersonalData(prev => ({ ...prev, address_complement: e.target.value }))} className="h-12" />
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
              <Label>Valor por hora (R$)</Label>
              <Input type="number" value={personalData.price_per_hour} onChange={(e) => setPersonalData(prev => ({ ...prev, price_per_hour: e.target.value }))} className="h-12" min="0" step="0.01" />
            </div>

            <div className="space-y-2">
              <Label>Sobre você</Label>
              <Textarea value={personalData.bio} onChange={(e) => setPersonalData(prev => ({ ...prev, bio: e.target.value }))} rows={4} maxLength={500} />
              <p className="text-xs text-muted-foreground text-right">{personalData.bio.length}/500</p>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>RG</Label>
                <Input value={docData.rg} onChange={(e) => setDocData(prev => ({ ...prev, rg: e.target.value }))} className="h-12" />
              </div>
              <div className="space-y-2">
                <Label>Órgão emissor</Label>
                <Input value={docData.rg_issuer} onChange={(e) => setDocData(prev => ({ ...prev, rg_issuer: e.target.value }))} className="h-12" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Número da CNH</Label>
                <Input value={docData.cnh_number} onChange={(e) => setDocData(prev => ({ ...prev, cnh_number: e.target.value }))} className="h-12" />
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

            <FileUploadField label="Foto da CNH" onFileSelect={(f) => handleDocUpload(f, 'cnh')} currentUrl={docData.cnh_document_url} isUploading={isUploading} />
            <FileUploadField label="Antecedentes Criminais" onFileSelect={(f) => handleDocUpload(f, 'criminal_record')} currentUrl={docData.criminal_record_url} isUploading={isUploading} />
            <FileUploadField label="Foto com documento" onFileSelect={(f) => handleDocUpload(f, 'rg')} currentUrl={docData.profile_document_url} isUploading={isUploading} />
          </div>
        )}

        {/* Vehicle Tab */}
        {activeTab === 'vehicle' && (
          <div className="space-y-5 animate-fade-in">
            {vehicles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Car className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Nenhum veículo cadastrado</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/onboarding')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar via Onboarding
                </Button>
              </div>
            ) : (
              vehicles.map((v) => (
                <div key={v.id} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{v.brand} {v.model} ({v.year})</h3>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleDeleteVehicle(v.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Placa:</span> {v.plate}</div>
                    <div><span className="text-muted-foreground">Cor:</span> {v.color}</div>
                    <div><span className="text-muted-foreground">Câmbio:</span> {v.transmission === 'manual' ? 'Manual' : 'Automático'}</div>
                    <div><span className="text-muted-foreground">AC:</span> {v.has_ac ? 'Sim' : 'Não'}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Zones Tab */}
        {activeTab === 'zones' && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-2">
              <Label>Raio de atendimento (km)</Label>
              <Input type="number" value={zoneData.service_radius_km} onChange={(e) => setZoneData(prev => ({ ...prev, service_radius_km: e.target.value }))} className="h-12" min="1" max="100" />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <Label>Aceita deslocamento</Label>
                <p className="text-xs text-muted-foreground mt-1">Você vai até o aluno</p>
              </div>
              <Switch checked={zoneData.accepts_displacement} onCheckedChange={(v) => setZoneData(prev => ({ ...prev, accepts_displacement: v }))} />
            </div>

            {zoneData.accepts_displacement && (
              <div className="space-y-2">
                <Label>Taxa (R$/km)</Label>
                <Input type="number" value={zoneData.displacement_fee_per_km} onChange={(e) => setZoneData(prev => ({ ...prev, displacement_fee_per_km: e.target.value }))} className="h-12" min="0" step="0.5" />
              </div>
            )}

            <div className="space-y-2">
              <Label>Cidades atendidas</Label>
              <Input value={zoneData.cities_served} onChange={(e) => setZoneData(prev => ({ ...prev, cities_served: e.target.value }))} className="h-12" placeholder="Separe por vírgula" />
            </div>

            <div className="space-y-2">
              <Label>Bairros atendidos</Label>
              <Textarea value={zoneData.neighborhoods_served} onChange={(e) => setZoneData(prev => ({ ...prev, neighborhoods_served: e.target.value }))} rows={3} placeholder="Separe por vírgula" />
            </div>
          </div>
        )}

        {/* Bank Tab */}
        {activeTab === 'bank' && (
          <div className="space-y-5 animate-fade-in">
            {bankAccounts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Nenhuma conta bancária cadastrada</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/onboarding')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar via Onboarding
                </Button>
              </div>
            ) : (
              bankAccounts.map((acc) => (
                <div key={acc.id} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{acc.bank_name}</h3>
                    <div className="flex items-center gap-1">
                      {acc.is_verified && <CheckCircle2 className="h-4 w-4 text-accent" />}
                      <Button variant="ghost" size="icon-sm" onClick={() => handleDeleteBank(acc.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Agência:</span> {acc.agency}</div>
                    <div><span className="text-muted-foreground">Conta:</span> {acc.account_number}</div>
                    <div><span className="text-muted-foreground">Titular:</span> {acc.holder_name}</div>
                    {acc.pix_key && <div><span className="text-muted-foreground">PIX:</span> {acc.pix_key}</div>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Save Button (for editable tabs) */}
      {(activeTab === 'personal' || activeTab === 'documents' || activeTab === 'zones') && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 safe-area-bottom z-30">
          <div className="max-w-lg mx-auto">
            <Button
              variant="hero"
              className="w-full"
              onClick={handleSave}
              disabled={isSaving || isUploading || isValidating}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
