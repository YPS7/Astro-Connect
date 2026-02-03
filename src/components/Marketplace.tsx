import { useState, useEffect } from 'react';
import { supabase, Astrologer } from '@/lib/supabase';
import { AstrologerCard } from '@/components/AstrologerCard';
import { WalletDisplay } from '@/components/WalletDisplay';
import { Input } from '@/components/ui/input';
import cosmicHero from '@/assets/cosmic-hero.jpg';
import { Search, Sparkles, Star, Users, MessageCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarketplaceProps {
  balance: number;
  isLow: boolean;
  isEmpty: boolean;
  onAddFunds: () => void;
  onStartChat: (astrologer: Astrologer) => void;
  onHome: () => void;
}

// Fallback astrologers for demo
const fallbackAstrologers: Astrologer[] = [
  {
    id: '1',
    name: 'Pandit Rajesh Sharma',
    price_per_min: 25,
    is_online: true,
  },
  {
    id: '2',
    name: 'Dr. Maya Devi',
    price_per_min: 35,
    is_online: true,
  },
  {
    id: '3',
    name: 'Guruji Anand',
    price_per_min: 20,
    is_online: false,
  },
  {
    id: '4',
    name: 'Acharya Priya',
    price_per_min: 30,
    is_online: true,
  },
];

export const Marketplace = ({
  balance,
  isLow,
  isEmpty,
  onAddFunds,
  onStartChat,
  onHome,
}: MarketplaceProps) => {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        const { data, error } = await supabase
          .from('astrologers')
          .select('*')
          .order('is_online', { ascending: false });

        if (error) {
          console.error('Error fetching astrologers:', error);
          setAstrologers(fallbackAstrologers);
        } else {
          setAstrologers(data?.length ? data : fallbackAstrologers);
        }
      } catch (error) {
        console.error('Error:', error);
        setAstrologers(fallbackAstrologers);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAstrologers();
  }, []);

  const filteredAstrologers = astrologers.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    online: astrologers.filter((a) => a.is_online).length,
    total: astrologers.length,
    consultations: '15K+',
  };

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${cosmicHero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative container mx-auto px-4 py-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-glow">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-2xl font-bold text-gradient-gold">
                AstroConnect
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onHome}
                className="rounded-full hover:bg-white/10"
              >
                <Home className="h-5 w-5 text-primary-foreground" />
              </Button>
              <WalletDisplay
                balance={balance}
                isLow={isLow}
                isEmpty={isEmpty}
                onAddFunds={onAddFunds}
              />
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 animate-slide-up">
              Discover Your{' '}
              <span className="text-gradient-gold">Cosmic Path</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Connect with expert astrologers for personalized guidance.
              Get instant insights into your life, love, and destiny.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-card/60 backdrop-blur-sm rounded-full border border-border">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium">{stats.online} Online Now</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card/60 backdrop-blur-sm rounded-full border border-border">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{stats.total} Astrologers</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card/60 backdrop-blur-sm rounded-full border border-border">
              <MessageCircle className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">{stats.consultations} Consultations</span>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search astrologers..."
              className="pl-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border-border focus-visible:ring-primary shadow-gold"
            />
          </div>
        </div>
      </header>

      {/* Astrologer Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-semibold">
            Available Astrologers
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span>Top Rated</span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-64 bg-card/50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredAstrologers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No astrologers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAstrologers.map((astrologer, index) => (
              <div key={astrologer.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <AstrologerCard
                  astrologer={astrologer}
                  onStartChat={onStartChat}
                  disabled={isEmpty}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 AstroConnect. Your cosmic journey awaits.
          </p>
        </div>
      </footer>
    </div>
  );
};
