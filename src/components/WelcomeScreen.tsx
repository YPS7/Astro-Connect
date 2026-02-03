import { Sparkles, Star, Moon, Sun, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import cosmicHero from '@/assets/cosmic-hero.jpg';

interface WelcomeScreenProps {
  onNavigate: (view: string) => void;
}

export const WelcomeScreen = ({ onNavigate }: WelcomeScreenProps) => {
  const features = [
    {
      icon: Moon,
      title: 'Kundali Generation',
      description: 'Get your personalized birth chart based on Vedic astrology',
      action: 'kundali-form'
    },
    {
      icon: Star,
      title: 'AI Astrology Chat',
      description: 'Ask questions and get instant astrological insights',
      action: 'ai-chat'
    },
    {
      icon: Sun,
      title: 'Live Consultations',
      description: 'Connect with expert astrologers in real-time',
      action: 'marketplace'
    },
    {
      icon: Compass,
      title: 'Daily Predictions',
      description: 'Personalized horoscope based on your birth details',
      action: 'daily-predictions'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-cosmic relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${cosmicHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative container mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center shadow-glow">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="font-serif text-4xl font-bold text-gradient-gold">
            AstroConnect
          </span>
        </div>

        {/* Hero Content */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6 animate-slide-up">
            Discover Your{' '}
            <span className="text-gradient-gold">Cosmic Destiny</span>
          </h1>
          <p
            className="text-xl text-muted-foreground mb-8 animate-slide-up leading-relaxed"
            style={{ animationDelay: '0.1s' }}
          >
            Unlock the secrets of the stars with our AI-powered astrology platform.
            Get personalized Kundali charts, consult with expert astrologers,
            and receive divine guidance for your life journey.
          </p>
          <Button
            onClick={() => onNavigate('kundali-form')}
            size="lg"
            className="bg-gradient-gold hover:shadow-glow text-lg px-10 py-6 h-auto animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Begin Your Journey
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              onClick={() => onNavigate(feature.action)}
              className="bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-primary/50 transition-all hover:shadow-glow animate-fade-in cursor-pointer group"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient-gold">10K+</div>
            <div className="text-sm text-muted-foreground">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient-gold">500+</div>
            <div className="text-sm text-muted-foreground">Expert Astrologers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient-gold">50K+</div>
            <div className="text-sm text-muted-foreground">Consultations</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient-gold">98%</div>
            <div className="text-sm text-muted-foreground">Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};
