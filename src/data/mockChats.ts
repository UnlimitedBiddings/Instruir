import { mockInstructors } from './mockData';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: 'student' | 'instructor';
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

// Helper to create past dates
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000);
const minsAgo = (mins: number) => new Date(Date.now() - mins * 60 * 1000);

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participantId: '1',
    participantName: mockInstructors[0].name,
    participantAvatar: mockInstructors[0].avatar!,
    participantRole: 'instructor',
    lastMessage: 'Perfeito! Te espero amanhã às 14h então.',
    lastMessageTime: minsAgo(15),
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        senderId: 'student-1',
        receiverId: '1',
        content: 'Olá Carlos! Vi seu perfil e gostaria de agendar uma aula.',
        timestamp: hoursAgo(2),
        isRead: true,
      },
      {
        id: 'm2',
        senderId: '1',
        receiverId: 'student-1',
        content: 'Olá! Claro, será um prazer. Qual horário fica melhor para você?',
        timestamp: hoursAgo(1.5),
        isRead: true,
      },
      {
        id: 'm3',
        senderId: 'student-1',
        receiverId: '1',
        content: 'Amanhã às 14h seria perfeito!',
        timestamp: hoursAgo(1),
        isRead: true,
      },
      {
        id: 'm4',
        senderId: '1',
        receiverId: 'student-1',
        content: 'Perfeito! Te espero amanhã às 14h então.',
        timestamp: minsAgo(15),
        isRead: false,
      },
    ],
  },
  {
    id: 'conv-2',
    participantId: '2',
    participantName: mockInstructors[1].name,
    participantAvatar: mockInstructors[1].avatar!,
    participantRole: 'instructor',
    lastMessage: 'Pode sim! Mando a localização mais tarde.',
    lastMessageTime: hoursAgo(3),
    unreadCount: 0,
    messages: [
      {
        id: 'm5',
        senderId: 'student-1',
        receiverId: '2',
        content: 'Ana, tudo bem? Posso mudar o ponto de encontro da aula?',
        timestamp: hoursAgo(5),
        isRead: true,
      },
      {
        id: 'm6',
        senderId: '2',
        receiverId: 'student-1',
        content: 'Pode sim! Mando a localização mais tarde.',
        timestamp: hoursAgo(3),
        isRead: true,
      },
    ],
  },
  {
    id: 'conv-3',
    participantId: '3',
    participantName: mockInstructors[2].name,
    participantAvatar: mockInstructors[2].avatar!,
    participantRole: 'instructor',
    lastMessage: 'Obrigado pela aula! Foi ótimo!',
    lastMessageTime: hoursAgo(24),
    unreadCount: 0,
    messages: [
      {
        id: 'm7',
        senderId: '3',
        receiverId: 'student-1',
        content: 'Parabéns pela evolução na aula de hoje!',
        timestamp: hoursAgo(26),
        isRead: true,
      },
      {
        id: 'm8',
        senderId: 'student-1',
        receiverId: '3',
        content: 'Obrigado pela aula! Foi ótimo!',
        timestamp: hoursAgo(24),
        isRead: true,
      },
    ],
  },
];

// Simulated auto-responses for demo
export const autoResponses = [
  'Claro, sem problema!',
  'Perfeito, fica combinado assim.',
  'Entendi! Vou verificar e te aviso.',
  'Pode deixar comigo!',
  'Combinado! Até lá.',
  'Ótimo, qualquer dúvida me avisa!',
];