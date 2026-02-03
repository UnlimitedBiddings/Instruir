import { Company, ServicePackage, Instructor, Location } from '@/types';

// ============================================
// COORDENADAS DE GUARAPARI-ES
// ============================================
const GUARAPARI_BASE = { lat: -20.6500, lng: -40.4967 };

// ============================================
// BAIRROS/ZONAS DE GUARAPARI
// ============================================
const GUARAPARI_ZONES = {
  centro: ['Centro', 'Muquiçaba', 'Praia do Morro'],
  sul: ['Meaípe', 'Setiba', 'Perocão'],
  norte: ['Enseada Azul', 'Bacutia', 'Santa Mônica'],
};

// ============================================
// DADOS DAS 5 AUTOESCOLAS EM GUARAPARI
// ============================================

const createPackages = (companyId: string): ServicePackage[] => [
  {
    id: `${companyId}-pkg-1`,
    companyId,
    name: 'Básico',
    description: 'Pacote ideal para quem já tem alguma experiência',
    totalSessions: 10,
    priceTotal: 750,
    pricePerSession: 75,
    validityDays: 60,
    includes: ['10 aulas práticas de 50min', 'Material didático digital', 'Certificado de conclusão'],
  },
  {
    id: `${companyId}-pkg-2`,
    companyId,
    name: 'Completo',
    description: 'O mais vendido! Tudo que você precisa para passar de primeira',
    totalSessions: 20,
    priceTotal: 1400,
    pricePerSession: 70,
    validityDays: 90,
    includes: [
      '20 aulas práticas de 50min',
      '2 simulados práticos',
      'Taxa DETRAN inclusa',
      'Acompanhamento até aprovação',
      'Material didático completo',
    ],
    popular: true,
  },
  {
    id: `${companyId}-pkg-3`,
    companyId,
    name: 'Premium',
    description: 'Experiência VIP com aulas extras e suporte personalizado',
    totalSessions: 30,
    priceTotal: 1950,
    pricePerSession: 65,
    validityDays: 120,
    includes: [
      '30 aulas práticas de 50min',
      '4 simulados práticos',
      'Taxa DETRAN inclusa',
      'Aulas de reforço ilimitadas',
      'Agendamento prioritário',
      'Suporte via WhatsApp 24h',
      'Garantia de aprovação',
    ],
  },
];

export const mockDrivingSchools: Company[] = [
  {
    id: 'school-1',
    name: 'Auto Escola Sabadini',
    type: 'driving_instructor',
    cnpj: '12.345.678/0001-01',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop',
    description: 'Há 20 anos formando motoristas conscientes em Guarapari. Nossa missão é transformar iniciantes em condutores seguros e confiantes. Localizada no coração da cidade.',
    address: 'Av. Getúlio Vargas, 500',
    city: 'Guarapari',
    phone: '(27) 3361-1001',
    email: 'contato@autoescolasabadini.com.br',
    rating: 4.9,
    reviewCount: 1250,
    verified: true,
    createdAt: new Date('2004-03-15'),
    packages: createPackages('school-1'),
    professionalIds: ['school-1-inst-1', 'school-1-inst-2', 'school-1-inst-3', 'school-1-inst-4', 'school-1-inst-5'],
    location: {
      lat: GUARAPARI_BASE.lat + 0.005,
      lng: GUARAPARI_BASE.lng + 0.003,
      address: 'Av. Getúlio Vargas, 500',
      city: 'Guarapari',
      distance: 0.8,
    },
  },
  {
    id: 'school-2',
    name: 'Auto Escola Vitorino',
    type: 'driving_instructor',
    cnpj: '12.345.678/0001-02',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop',
    description: 'Centro de Formação de Condutores moderno com simuladores de última geração. Metodologia inovadora focada na sua aprovação no DETRAN.',
    address: 'Rua Henrique Coutinho, 250',
    city: 'Guarapari',
    phone: '(27) 3361-2002',
    email: 'contato@autoescolavitorino.com.br',
    rating: 4.8,
    reviewCount: 890,
    verified: true,
    createdAt: new Date('2008-07-20'),
    packages: createPackages('school-2'),
    professionalIds: ['school-2-inst-1', 'school-2-inst-2', 'school-2-inst-3', 'school-2-inst-4', 'school-2-inst-5'],
    location: {
      lat: GUARAPARI_BASE.lat - 0.008,
      lng: GUARAPARI_BASE.lng + 0.012,
      address: 'Rua Henrique Coutinho, 250',
      city: 'Guarapari',
      distance: 1.5,
    },
  },
  {
    id: 'school-3',
    name: 'Auto Escola Sucesso',
    type: 'driving_instructor',
    cnpj: '12.345.678/0001-03',
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop',
    description: 'Especialistas em formação rápida sem perder qualidade. Horários flexíveis para quem tem rotina corrida. Atendemos toda a região de Guarapari.',
    address: 'Av. Ewerton Xavier, 1200',
    city: 'Guarapari',
    phone: '(27) 3361-3003',
    email: 'contato@autoescolasucesso.com.br',
    rating: 4.7,
    reviewCount: 720,
    verified: true,
    createdAt: new Date('2012-01-10'),
    packages: createPackages('school-3'),
    professionalIds: ['school-3-inst-1', 'school-3-inst-2', 'school-3-inst-3', 'school-3-inst-4', 'school-3-inst-5'],
    location: {
      lat: GUARAPARI_BASE.lat + 0.015,
      lng: GUARAPARI_BASE.lng - 0.010,
      address: 'Av. Ewerton Xavier, 1200',
      city: 'Guarapari',
      distance: 2.2,
    },
  },
  {
    id: 'school-4',
    name: 'Auto Escola Guarapari',
    type: 'driving_instructor',
    cnpj: '12.345.678/0001-04',
    logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=200&fit=crop',
    description: 'Tradição e qualidade na cidade sol. Mais de 15 mil alunos formados com índice de aprovação acima de 95%. A autoescola mais tradicional da cidade!',
    address: 'Rua Joaquim da Silva Lima, 300',
    city: 'Guarapari',
    phone: '(27) 3361-4004',
    email: 'contato@autoescolaguarapari.com.br',
    rating: 4.9,
    reviewCount: 1580,
    verified: true,
    createdAt: new Date('1998-05-01'),
    packages: createPackages('school-4'),
    professionalIds: ['school-4-inst-1', 'school-4-inst-2', 'school-4-inst-3', 'school-4-inst-4', 'school-4-inst-5'],
    location: {
      lat: GUARAPARI_BASE.lat - 0.003,
      lng: GUARAPARI_BASE.lng - 0.005,
      address: 'Rua Joaquim da Silva Lima, 300',
      city: 'Guarapari',
      distance: 0.6,
    },
  },
  {
    id: 'school-5',
    name: 'Auto Escola Karla',
    type: 'driving_instructor',
    cnpj: '12.345.678/0001-05',
    logo: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=200&h=200&fit=crop',
    description: 'Atendimento personalizado e acolhedor. Especializada em alunos que têm medo de dirigir. Instrutoras mulheres disponíveis.',
    address: 'Av. Jones dos Santos Neves, 800',
    city: 'Guarapari',
    phone: '(27) 3361-5005',
    email: 'contato@autoescolakarla.com.br',
    rating: 4.8,
    reviewCount: 650,
    verified: true,
    createdAt: new Date('2015-09-12'),
    packages: createPackages('school-5'),
    professionalIds: ['school-5-inst-1', 'school-5-inst-2', 'school-5-inst-3', 'school-5-inst-4', 'school-5-inst-5'],
    location: {
      lat: GUARAPARI_BASE.lat + 0.010,
      lng: GUARAPARI_BASE.lng + 0.008,
      address: 'Av. Jones dos Santos Neves, 800',
      city: 'Guarapari',
      distance: 1.3,
    },
  },
];

// ============================================
// INSTRUTORES VINCULADOS ÀS AUTOESCOLAS (25 total)
// ============================================

const createSchoolInstructor = (
  id: string,
  name: string,
  avatar: string,
  bio: string,
  rating: number,
  reviewCount: number,
  pricePerHour: number,
  vehicle: { model: string; transmission: 'manual' | 'automatic' },
  location: Location,
  companyId: string,
  experience: number,
  totalLessons: number
): Instructor => ({
  id,
  name,
  email: `${id.replace(/-/g, '.')}@instruir.com.br`,
  phone: '(27) 99999-0000',
  avatar,
  role: 'professional',
  category: 'driving_instructor',
  createdAt: new Date(),
  bio,
  rating,
  reviewCount,
  pricePerHour,
  vehicle: {
    model: vehicle.model,
    year: 2024,
    color: 'Branco',
    transmission: vehicle.transmission,
    hasAirConditioning: true,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
  },
  location,
  serviceZones: GUARAPARI_ZONES.centro,
  availability: [],
  verified: {
    identity: true,
    background: true,
    credentials: true,
    cnh: true,
    criminalRecord: true,
    vehicleInspection: true,
  },
  totalLessons,
  experience,
  providerType: 'company',
  companyId,
});

// Auto Escola Sabadini - 5 instrutores
const sabadiniInstructors: Instructor[] = [
  createSchoolInstructor(
    'school-1-inst-1', 'André Campos',
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop&crop=face',
    'Instrutor sênior com 15 anos de experiência. Especialista em alunos iniciantes e direção defensiva.',
    4.9, 320, 75, { model: 'Chevrolet Onix Plus', transmission: 'manual' },
    { lat: GUARAPARI_BASE.lat + 0.005, lng: GUARAPARI_BASE.lng + 0.003, address: 'Av. Getúlio Vargas, 500', city: 'Guarapari', distance: 0.8 },
    'school-1', 15, 2500
  ),
  createSchoolInstructor(
    'school-1-inst-2', 'Beatriz Alves',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    'Instrutora dedicada a mulheres. Ambiente acolhedor e sem julgamentos. Especialista em superar o medo de dirigir.',
    4.8, 245, 75, { model: 'Hyundai HB20', transmission: 'automatic' },
    { lat: GUARAPARI_BASE.lat + 0.006, lng: GUARAPARI_BASE.lng + 0.002, address: 'Av. Getúlio Vargas, 500', city: 'Guarapari', distance: 0.9 },
    'school-1', 8, 1200
  ),
  createSchoolInstructor(
    'school-1-inst-3', 'Diego Moreira',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    'Paciente e metódico. Foco em direção defensiva e situações de risco.',
    4.7, 189, 75, { model: 'VW Polo', transmission: 'manual' },
    { lat: GUARAPARI_BASE.lat + 0.004, lng: GUARAPARI_BASE.lng + 0.004, address: 'Av. Getúlio Vargas, 500', city: 'Guarapari', distance: 0.7 },
    'school-1', 6, 890
  ),
  createSchoolInstructor(
    'school-1-inst-4', 'Elisa Fernandes',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    'Especialista em baliza e manobras. Taxa de aprovação de 98% no DETRAN!',
    4.9, 278, 75, { model: 'Toyota Yaris', transmission: 'automatic' },
    { lat: GUARAPARI_BASE.lat + 0.005, lng: GUARAPARI_BASE.lng + 0.003, address: 'Av. Getúlio Vargas, 500', city: 'Guarapari', distance: 0.8 },
    'school-1', 10, 1800
  ),
  createSchoolInstructor(
    'school-1-inst-5', 'Felipe Torres',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'Instrutor jovem e dinâmico. Aulas descontraídas e eficientes.',
    4.6, 156, 75, { model: 'Fiat Argo', transmission: 'manual' },
    { lat: GUARAPARI_BASE.lat + 0.006, lng: GUARAPARI_BASE.lng + 0.002, address: 'Av. Getúlio Vargas, 500', city: 'Guarapari', distance: 0.9 },
    'school-1', 4, 650
  ),
];

// Auto Escola Vitorino - 5 instrutores
const vitorinoInstructors: Instructor[] = [
  createSchoolInstructor(
    'school-2-inst-1', 'Gustavo Lima',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'Ex-piloto profissional. Aulas dinâmicas e seguras com foco total na sua aprovação.',
    4.8, 290, 80, { model: 'Honda Fit', transmission: 'automatic' },
    { lat: GUARAPARI_BASE.lat - 0.008, lng: GUARAPARI_BASE.lng + 0.012, address: 'Rua Henrique Coutinho, 250', city: 'Guarapari', distance: 1.5 },
    'school-2', 12, 2100
  ),
  createSchoolInstructor(
    'school-2-inst-2', 'Helena Costa',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    'Psicóloga e instrutora. Trabalho especializado com ansiedade ao volante e medo de dirigir.',
    4.9, 312, 80, { model: 'Nissan Kicks', transmission: 'automatic' },
    { lat: GUARAPARI_BASE.lat - 0.009, lng: GUARAPARI_BASE.lng + 0.011, address: 'Rua Henrique Coutinho, 250', city: 'Guarapari', distance: 1.4 },
    'school-2', 9, 1500
  ),
  createSchoolInstructor(
    'school-2-inst-3', 'Igor Nascimento',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'Instrutor bilíngue (português/inglês). Atende turistas e moradores estrangeiros.',
    4.7, 178, 80, { model: 'Chevrolet Tracker', transmission: 'automatic' },
    { lat: GUARAPARI_BASE.lat - 0.007, lng: GUARAPARI_BASE.lng + 0.013, address: 'Rua Henrique Coutinho, 250', city: 'Guarapari', distance: 1.6 },
    'school-2', 5, 720
  ),
  createSchoolInstructor(
    'school-2-inst-4', 'Juliana Reis',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    'Foco em direção noturna e em condições adversas. Preparação completa para qualquer situação.',
    4.6, 145, 80, { model: 'Jeep Renegade', transmission: 'manual' },
    { lat: GUARAPARI_BASE.lat - 0.008, lng: GUARAPARI_BASE.lng + 0.012, address: 'Rua Henrique Coutinho, 250', city: 'Guarapari', distance: 1.5 },
    'school-2', 7, 980
  ),
  createSchoolInstructor(
    'school-2-inst-5', 'Kaio Mendes',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    'Especialista em direção em rodovias e estradas. Ideal para viagens longas.',
    4.8, 234, 80, { model: 'VW T-Cross', transmission: 'automatic' },
    { lat: GUARAPARI_BASE.lat - 0.009, lng: GUARAPARI_BASE.lng + 0.011, address: 'Rua Henrique Coutinho, 250', city: 'Guarapari', distance: 1.4 },
    'school-2', 11, 1850
  ),
];

// Auto Escola Sucesso - 5 instrutores
const sucessoInstructors: Instructor[] = [
  createSchoolInstructor(
    'school-3-inst-1', 'Leonardo Souza',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    'Instrutor calmo e paciente. Ideal para iniciantes que nunca sentaram ao volante.',
    4.7, 198, 72, { model: 'Hyundai Creta', transmission: 'automatic' },
    { lat: GUARAPARI_BASE.lat + 0.015, lng: GUARAPARI_BASE.lng - 0.010, address: 'Av. Ewerton Xavier, 1200', city: 'Guarapari', distance: 2.2 },
    'school-3', 6, 850
  ),
  createSchoolInstructor(
    'school-3-inst-2', 'Marina Oliveira',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    'Especialista em direção defensiva. 10 anos sem acidentes. Segurança em primeiro lugar!',
    4.8, 267, 72, { model: 'Toyota Corolla', transmission: 'automatic' },
    { lat: GUARAPARI_BASE.lat + 0.016, lng: GUARAPARI_BASE.lng - 0.009, address: 'Av. Ewerton Xavier, 1200', city: 'Guarapari', distance: 2.1 },
    'school-3', 10, 1650
  ),
  createSchoolInstructor(
    'school-3-inst-3', 'Nicolas Ferreira',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face',
    'Método rápido e eficiente. Aprovação garantida ou seu dinheiro de volta!',
    4.6, 134, 72, { model: 'Chevrolet Spin', transmission: 'manual' },
    { lat: GUARAPARI_BASE.lat + 0.014, lng: GUARAPARI_BASE.lng - 0.011, address: 'Av. Ewerton Xavier, 1200', city: 'Guarapari', distance: 2.3 },
    'school-3', 4, 520
  ),
  createSchoolInstructor(
    'school-3-inst-4', 'Olivia Martins',
    'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    'Instrutora dedicada. Horários flexíveis disponíveis inclusive aos finais de semana.',
    4.7, 189, 72, { model: 'Fiat Cronos', transmission: 'automatic' },
    { lat: GUARAPARI_BASE.lat + 0.015, lng: GUARAPARI_BASE.lng - 0.010, address: 'Av. Ewerton Xavier, 1200', city: 'Guarapari', distance: 2.2 },
    'school-3', 5, 680
  ),
  createSchoolInstructor(
    'school-3-inst-5', 'Pedro Henrique',
    'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
    'Foco em alunos que já reprovaram no DETRAN. Segunda chance com método exclusivo!',
    4.9, 289, 72, { model: 'Renault Kwid', transmission: 'manual' },
    { lat: GUARAPARI_BASE.lat + 0.016, lng: GUARAPARI_BASE.lng - 0.009, address: 'Av. Ewerton Xavier, 1200', city: 'Guarapari', distance: 2.1 },
    'school-3', 8, 1420
  ),
];

// Auto Escola Guarapari - 5 instrutores
const guarapariInstructors: Instructor[] = [
  createSchoolInstructor(
    'school-4-inst-1', 'Quirino Santos',
    'https://images.unsplash.com/photo-1559418162-0d309d3b1f11?w=150&h=150&fit=crop&crop=face',
    'Instrutor sênior com mais de 3000 alunos formados. O mais experiente da cidade!',
    4.9, 456, 78, { model: 'Honda City', transmission: 'automatic' },
    { lat: GUARAPARI_BASE.lat - 0.003, lng: GUARAPARI_BASE.lng - 0.005, address: 'Rua Joaquim da Silva Lima, 300', city: 'Guarapari', distance: 0.6 },
    'school-4', 18, 3200
  ),
  createSchoolInstructor(
    'school-4-inst-2', 'Rafaela Dias',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'Metodologia exclusiva para mulheres. Confiança total ao volante!',
    4.8, 334, 78, { model: 'VW Virtus', transmission: 'automatic' },
    { lat: GUARAPARI_BASE.lat - 0.004, lng: GUARAPARI_BASE.lng - 0.004, address: 'Rua Joaquim da Silva Lima, 300', city: 'Guarapari', distance: 0.5 },
    'school-4', 12, 2100
  ),
  createSchoolInstructor(
    'school-4-inst-3', 'Samuel Almeida',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
    'Instrutor paciente. Especial para quem tem medo de dirigir.',
    4.7, 223, 78, { model: 'Peugeot 208', transmission: 'manual' },
    { lat: GUARAPARI_BASE.lat - 0.002, lng: GUARAPARI_BASE.lng - 0.006, address: 'Rua Joaquim da Silva Lima, 300', city: 'Guarapari', distance: 0.7 },
    'school-4', 7, 1150
  ),
  createSchoolInstructor(
    'school-4-inst-4', 'Tatiane Rocha',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face',
    'Foco em eficiência. Aprenda rápido sem pressão com método comprovado.',
    4.8, 278, 78, { model: 'Citroën C3', transmission: 'automatic' },
    { lat: GUARAPARI_BASE.lat - 0.003, lng: GUARAPARI_BASE.lng - 0.005, address: 'Rua Joaquim da Silva Lima, 300', city: 'Guarapari', distance: 0.6 },
    'school-4', 9, 1580
  ),
  createSchoolInstructor(
    'school-4-inst-5', 'Ulisses Neto',
    'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop&crop=face',
    'Instrutor jovem com técnicas modernas de ensino. Aulas dinâmicas e interativas.',
    4.6, 167, 78, { model: 'Ford Ka', transmission: 'manual' },
    { lat: GUARAPARI_BASE.lat - 0.004, lng: GUARAPARI_BASE.lng - 0.004, address: 'Rua Joaquim da Silva Lima, 300', city: 'Guarapari', distance: 0.5 },
    'school-4', 5, 720
  ),
];

// Auto Escola Karla - 5 instrutores
const karlaInstructors: Instructor[] = [
  createSchoolInstructor(
    'school-5-inst-1', 'Vitor Hugo',
    'https://images.unsplash.com/photo-1557862921-37829c790f19?w=150&h=150&fit=crop&crop=face',
    'Instrutor calmo e acolhedor. Especialista em alunos com medo de dirigir.',
    4.8, 234, 82, { model: 'Toyota Etios', transmission: 'manual' },
    { lat: GUARAPARI_BASE.lat + 0.010, lng: GUARAPARI_BASE.lng + 0.008, address: 'Av. Jones dos Santos Neves, 800', city: 'Guarapari', distance: 1.3 },
    'school-5', 8, 1350
  ),
  createSchoolInstructor(
    'school-5-inst-2', 'Wanda Cristina',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    'Especialista em ansiedade ao volante. Abordagem calma e empática.',
    4.9, 298, 82, { model: 'Hyundai i30', transmission: 'automatic' },
    { lat: GUARAPARI_BASE.lat + 0.011, lng: GUARAPARI_BASE.lng + 0.007, address: 'Av. Jones dos Santos Neves, 800', city: 'Guarapari', distance: 1.2 },
    'school-5', 11, 1920
  ),
  createSchoolInstructor(
    'school-5-inst-3', 'Xavier Monteiro',
    'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
    'Método prático e direto. Sem enrolação, foco total na aprovação!',
    4.6, 145, 82, { model: 'Chevrolet Prisma', transmission: 'manual' },
    { lat: GUARAPARI_BASE.lat + 0.009, lng: GUARAPARI_BASE.lng + 0.009, address: 'Av. Jones dos Santos Neves, 800', city: 'Guarapari', distance: 1.4 },
    'school-5', 4, 580
  ),
  createSchoolInstructor(
    'school-5-inst-4', 'Yasmin Lopes',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face',
    'Instrutora paciente. Ideal para quem está recomeçando após anos sem dirigir.',
    4.7, 189, 82, { model: 'Fiat Mobi', transmission: 'automatic' },
    { lat: GUARAPARI_BASE.lat + 0.010, lng: GUARAPARI_BASE.lng + 0.008, address: 'Av. Jones dos Santos Neves, 800', city: 'Guarapari', distance: 1.3 },
    'school-5', 6, 920
  ),
  createSchoolInstructor(
    'school-5-inst-5', 'Zeca Ribeiro',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face',
    'Instrutor experiente. Foco em aprovação no DETRAN-ES com método comprovado.',
    4.8, 267, 82, { model: 'Renault Sandero', transmission: 'manual' },
    { lat: GUARAPARI_BASE.lat + 0.011, lng: GUARAPARI_BASE.lng + 0.007, address: 'Av. Jones dos Santos Neves, 800', city: 'Guarapari', distance: 1.2 },
    'school-5', 14, 2450
  ),
];

// Todos os instrutores de autoescolas
export const mockSchoolInstructors: Instructor[] = [
  ...sabadiniInstructors,
  ...vitorinoInstructors,
  ...sucessoInstructors,
  ...guarapariInstructors,
  ...karlaInstructors,
];

// Helper para buscar instrutores por autoescola
export const getInstructorsBySchool = (schoolId: string): Instructor[] => {
  return mockSchoolInstructors.filter(instructor => instructor.companyId === schoolId);
};

// Helper para buscar autoescola por ID
export const getSchoolById = (schoolId: string): Company | undefined => {
  return mockDrivingSchools.find(school => school.id === schoolId);
};

// Helper para buscar autoescola de um instrutor
export const getSchoolByInstructorId = (instructorId: string): Company | undefined => {
  const instructor = mockSchoolInstructors.find(i => i.id === instructorId);
  if (!instructor?.companyId) return undefined;
  return getSchoolById(instructor.companyId);
};
