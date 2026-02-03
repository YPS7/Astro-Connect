import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Phone, Video, MoreVertical, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WalletDisplay } from '@/components/WalletDisplay';
import { Message, Astrologer } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  astrologer: Astrologer;
  messages: Message[];
  balance: number;
  isLow: boolean;
  isEmpty: boolean;
  isActive: boolean;
  onSendMessage: (content: string) => void;
  onEndChat: () => void;
  onAddFunds: () => void;
}

export const ChatInterface = ({
  astrologer,
  messages,
  balance,
  isLow,
  isEmpty,
  isActive,
  onSendMessage,
  onEndChat,
  onAddFunds,
}: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() && isActive && !isEmpty) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const avatarUrl = astrologer.avatar_url || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(astrologer.name)}&background=f59e0b&color=fff&size=150`;

  return (
    <div className="flex flex-col h-screen bg-gradient-cosmic">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEndChat}
            className="h-9 w-9 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-success/50">
                <img
                  src={avatarUrl}
                  alt={astrologer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-card" />
            </div>
            
            <div>
              <h2 className="font-serif font-semibold text-foreground leading-tight">
                {astrologer.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isActive ? (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                    Active · ₹{astrologer.price_per_min}/min
                  </span>
                ) : (
                  'Session ended'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <WalletDisplay
            balance={balance}
            isLow={isLow}
            isEmpty={isEmpty}
            onAddFunds={onAddFunds}
            showAddButton={false}
            className="text-sm"
          />
        </div>
      </header>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
        <div className="py-4 space-y-4 max-w-2xl mx-auto">
          {/* Session Start Message */}
          <div className="flex justify-center">
            <div className="bg-secondary/80 text-muted-foreground text-xs px-4 py-2 rounded-full">
              Session started with {astrologer.name}
            </div>
          </div>

          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className={cn(
                'flex animate-fade-in',
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] px-4 py-3 rounded-2xl shadow-sm',
                  message.sender === 'user'
                    ? 'bg-gradient-gold text-primary-foreground rounded-br-md'
                    : 'bg-card border border-border rounded-bl-md'
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p
                  className={cn(
                    'text-[10px] mt-1 opacity-70',
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  )}
                >
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Session Ended Message */}
          {!isActive && (
            <div className="flex justify-center">
              <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {isEmpty
                  ? 'Session ended - Insufficient balance'
                  : 'Session ended'}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="px-4 py-3 bg-card/80 backdrop-blur-sm border-t border-border">
        <div className="max-w-2xl mx-auto">
          {isEmpty && (
            <div className="flex items-center justify-center gap-3 mb-3 p-3 bg-destructive/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span className="text-sm text-destructive">Your balance is empty</span>
              <Button
                size="sm"
                onClick={onAddFunds}
                className="bg-gradient-gold hover:shadow-glow"
              >
                Add Funds
              </Button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isActive && !isEmpty
                  ? "Type your question..."
                  : "Session ended"
              }
              disabled={!isActive || isEmpty}
              className="flex-1 rounded-full bg-secondary/50 border-border focus-visible:ring-primary"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || !isActive || isEmpty}
              size="icon"
              className="h-10 w-10 rounded-full bg-gradient-gold hover:shadow-glow transition-all disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
