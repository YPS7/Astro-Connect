import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles, Loader2, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { KundaliData } from './KundaliForm';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  kundaliData?: KundaliData;
  onBack: () => void;
}

export const AIChat = ({ kundaliData, onBack }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: kundaliData
        ? `Namaste ${kundaliData.name}! 🙏 I have studied your birth chart based on your details. Ask me anything about your Kundali, planetary positions, doshas, marriage compatibility, career prospects, or any other astrological queries.`
        : `Namaste! 🙏 I am your AI astrology guide. You can ask me about zodiac signs, planetary influences, Kundali matching, auspicious timings, and more. How may I help you today?`,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const simulateAIResponse = async (userMessage: string) => {
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const responses = [
      "The planetary alignments suggest a period of transformation for you. It's a good time to focus on personal growth.",
      "Based on the cosmic energy, I see new opportunities coming your way. Stay open to unexpected changes.",
      "Your chart indicates a strong influence of Jupiter, bringing wisdom and expansion to your current situation.",
      "Saturn's presence might bring some challenges, but they are tests of your resilience and will lead to long-term success.",
      "In matters of relationships, Venus favors harmony right now. Communication will be key to resolving any conflicts.",
      "The Moon's phase affects your emotional state. Take some time for self-reflection and meditation.",
      "Mars gives you the energy to pursue your goals, but be wary of impulsive decisions. Channel your energy wisely.",
      "Mercury is direct, which is great for clear thinking and making important decisions regarding your career.",
    ];

    // Simple keyword matching for better simulation
    const lowerMsg = userMessage.toLowerCase();
    let response = responses[Math.floor(Math.random() * responses.length)];

    if (lowerMsg.includes('love') || lowerMsg.includes('relationship') || lowerMsg.includes('marriage')) {
      response = "Venus is shining brightly in your sector of relationships. Deep connections are favoring you, but patience is required for long-term stability.";
    } else if (lowerMsg.includes('career') || lowerMsg.includes('job') || lowerMsg.includes('money')) {
      response = "The 10th house of career shows activity. Hard work puts you in favor, and financial gains are likely if you remain disciplined.";
    } else if (lowerMsg.includes('health')) {
      response = "Your 6th house suggests paying attention to daily routines. minor adjustments to diet and sleep will bring significant energy improvements.";
    }

    return response;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Try to call Supabase function first
      const { data, error } = await supabase.functions.invoke('astro-ai', {
        body: {
          type: 'chat',
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          kundaliData,
        },
      });

      if (error || !data) {
        throw new Error(error?.message || "Function returned no data");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('Backend unavailable, switching to simulation mode:', err);
      // Fallback to simulation if backend fails
      const simulatedResponse = await simulateAIResponse(userMessage.content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: simulatedResponse,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-cosmic">
      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-3 bg-card/80 backdrop-blur-sm border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-9 w-9 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
            <Moon className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-serif font-semibold text-foreground">AI Astrologer</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              Online • Powered by DeepSeek
            </p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
        <div className="py-4 space-y-4 max-w-2xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex animate-fade-in',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[85%] px-4 py-3 rounded-2xl shadow-sm',
                  message.role === 'user'
                    ? 'bg-gradient-gold text-primary-foreground rounded-br-md'
                    : 'bg-card border border-border rounded-bl-md'
                )}
              >
                {message.role === 'assistant' ? (
                  <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Consulting the stars...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="px-4 py-3 bg-card/80 backdrop-blur-sm border-t border-border">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your horoscope, Kundali, planets..."
            disabled={isLoading}
            className="flex-1 rounded-full bg-secondary/50 border-border"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="h-10 w-10 rounded-full bg-gradient-gold hover:shadow-glow"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
