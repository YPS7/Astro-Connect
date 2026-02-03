import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Share2, Sparkles, Moon, Sun, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KundaliData } from './KundaliForm';
import { supabase } from '@/integrations/supabase/client';

interface KundaliDisplayProps {
  data: KundaliData;
  onBack: () => void;
  onChat: () => void;
}

interface KundaliResult {
  sunSign: string;
  moonSign: string;
  ascendant: string;
  nakshatra: string;
  rashi: string;
  personality: string;
  strengths: string[];
  challenges: string[];
  luckyElements: {
    number: string;
    color: string;
    day: string;
    gemstone: string;
  };
}

export const KundaliDisplay = ({ data, onBack, onChat }: KundaliDisplayProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [kundali, setKundali] = useState<KundaliResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateKundali = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await supabase.functions.invoke('astro-ai', {
          body: {
            type: 'kundali',
            data,
          },
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        setKundali(response.data.kundali);
      } catch (err) {
        console.error('Error generating kundali:', err);
        setError('Failed to generate Kundali. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    generateKundali();
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-cosmic flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="font-serif text-xl font-semibold mb-2">Generating Your Kundali</h2>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Consulting the stars...
          </p>
        </div>
      </div>
    );
  }

  if (error || !kundali) {
    return (
      <div className="min-h-screen bg-gradient-cosmic flex items-center justify-center p-4">
        <div className="text-center bg-card/60 backdrop-blur-sm rounded-xl p-8 border border-border max-w-md">
          <p className="text-destructive mb-4">{error || 'Something went wrong'}</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-cosmic py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-10 w-10 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                {data.name}'s Kundali
              </h1>
              <p className="text-sm text-muted-foreground">
                Born on {new Date(data.dateOfBirth).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Main Signs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-5 border border-border text-center">
            <Sun className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">Sun Sign</div>
            <div className="font-serif text-xl font-semibold text-gradient-gold">{kundali.sunSign}</div>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-5 border border-border text-center">
            <Moon className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">Moon Sign (Rashi)</div>
            <div className="font-serif text-xl font-semibold text-gradient-gold">{kundali.moonSign}</div>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-5 border border-border text-center">
            <Star className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">Ascendant (Lagna)</div>
            <div className="font-serif text-xl font-semibold text-gradient-gold">{kundali.ascendant}</div>
          </div>
        </div>

        {/* Nakshatra & Rashi */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-5 border border-border">
            <div className="text-sm text-muted-foreground mb-1">Nakshatra</div>
            <div className="font-serif text-lg font-semibold">{kundali.nakshatra}</div>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-5 border border-border">
            <div className="text-sm text-muted-foreground mb-1">Rashi</div>
            <div className="font-serif text-lg font-semibold">{kundali.rashi}</div>
          </div>
        </div>

        {/* Personality */}
        <div className="bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border mb-6">
          <h3 className="font-serif text-lg font-semibold mb-3">Personality Overview</h3>
          <p className="text-muted-foreground leading-relaxed">{kundali.personality}</p>
        </div>

        {/* Strengths & Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-5 border border-border">
            <h3 className="font-serif text-lg font-semibold mb-3 text-success">Strengths</h3>
            <ul className="space-y-2">
              {kundali.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-success">✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-5 border border-border">
            <h3 className="font-serif text-lg font-semibold mb-3 text-warning">Challenges</h3>
            <ul className="space-y-2">
              {kundali.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-warning">•</span>
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lucky Elements */}
        <div className="bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border mb-6">
          <h3 className="font-serif text-lg font-semibold mb-4">Lucky Elements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Number</div>
              <div className="font-semibold text-gradient-gold">{kundali.luckyElements.number}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Color</div>
              <div className="font-semibold text-gradient-gold">{kundali.luckyElements.color}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Day</div>
              <div className="font-semibold text-gradient-gold">{kundali.luckyElements.day}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Gemstone</div>
              <div className="font-semibold text-gradient-gold">{kundali.luckyElements.gemstone}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onChat}
            className="flex-1 bg-gradient-gold hover:shadow-glow h-12"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Chat with AI Astrologer
          </Button>
        </div>
      </div>
    </div>
  );
};
