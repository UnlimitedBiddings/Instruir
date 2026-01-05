import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { mockConversations, autoResponses, Message } from '@/data/mockChats';
import { mockInstructors } from '@/data/mockData';

export function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find conversation or instructor
  const existingConversation = mockConversations.find(
    (c) => c.participantId === id
  );
  
  const instructor = mockInstructors.find((i) => i.id === id);
  
  const participant = existingConversation
    ? {
        id: existingConversation.participantId,
        name: existingConversation.participantName,
        avatar: existingConversation.participantAvatar,
      }
    : instructor
    ? {
        id: instructor.id,
        name: instructor.name,
        avatar: instructor.avatar,
      }
    : null;

  const [messages, setMessages] = useState<Message[]>(
    existingConversation?.messages || []
  );
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (content: string) => {
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: 'student-1',
      receiverId: id!,
      content,
      timestamp: new Date(),
      isRead: false,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate typing indicator and auto-response
    setIsTyping(true);
    const responseDelay = 1500 + Math.random() * 1500;
    
    setTimeout(() => {
      setIsTyping(false);
      const autoResponse: Message = {
        id: `m-${Date.now()}-response`,
        senderId: id!,
        receiverId: 'student-1',
        content: autoResponses[Math.floor(Math.random() * autoResponses.length)],
        timestamp: new Date(),
        isRead: true,
      };
      setMessages((prev) => [...prev, autoResponse]);
    }, responseDelay);
  };

  if (!participant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Conversa não encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 safe-area-top">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <img
          src={participant.avatar}
          alt={participant.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-semibold truncate">
            {participant.name}
          </h2>
          {isTyping && (
            <p className="text-xs text-primary animate-pulse">
              Digitando...
            </p>
          )}
        </div>

        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              Inicie uma conversa com {participant.name}
            </p>
          </div>
        )}
        
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            content={message.content}
            timestamp={message.timestamp}
            isSent={message.senderId === 'student-1'}
            isRead={message.isRead}
          />
        ))}
        
        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="safe-area-bottom">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}