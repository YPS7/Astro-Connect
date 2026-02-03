import { Star, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Astrologer } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface AstrologerCardProps {
  astrologer: Astrologer;
  onStartChat: (astrologer: Astrologer) => void;
  disabled?: boolean;
}

// Avatar images for astrologers
const avatarImages: Record<string, string> = {
  'Pandit Rajesh Sharma': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'Dr. Maya Devi': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  'Guruji Anand': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'Acharya Priya': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
};

const specialties: Record<string, string> = {
  'Pandit Rajesh Sharma': 'Vedic Astrology',
  'Dr. Maya Devi': 'Numerology',
  'Guruji Anand': 'Tarot Reading',
  'Acharya Priya': 'Palmistry',
};

export const AstrologerCard = ({
  astrologer,
  onStartChat,
  disabled = false,
}: AstrologerCardProps) => {
  const avatarUrl = astrologer.avatar_url || avatarImages[astrologer.name] || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(astrologer.name)}&background=f59e0b&color=fff&size=150`;
  
  const specialty = astrologer.specialty || specialties[astrologer.name] || 'Astrology';
  const rating = astrologer.rating || (4 + Math.random()).toFixed(1);

  return (
    <Card className="card-cosmic overflow-hidden group hover:shadow-gold transition-all duration-300 animate-slide-up">
      <CardContent className="p-0">
        {/* Status Banner */}
        <div className={cn(
          'h-1.5 w-full transition-all duration-300',
          astrologer.is_online 
            ? 'bg-gradient-to-r from-success via-success/80 to-success' 
            : 'bg-muted'
        )} />
        
        <div className="p-5">
          {/* Header with Avatar */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <div className={cn(
                'w-16 h-16 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-background transition-all duration-300',
                astrologer.is_online ? 'ring-success' : 'ring-muted'
              )}>
                <img
                  src={avatarUrl}
                  alt={astrologer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online indicator */}
              <div className={cn(
                'absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center',
                astrologer.is_online ? 'status-online' : 'status-offline'
              )}>
                {astrologer.is_online && (
                  <span className="w-2 h-2 bg-success-foreground rounded-full" />
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-serif font-semibold text-lg text-foreground truncate">
                {astrologer.name}
              </h3>
              <p className="text-sm text-muted-foreground">{specialty}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-medium">{rating}</span>
                <span className="text-xs text-muted-foreground">(1.2k reviews)</span>
              </div>
            </div>
          </div>

          {/* Price and Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-bold text-gradient-gold">
                ₹{astrologer.price_per_min}/min
              </span>
            </div>
            <Badge
              variant={astrologer.is_online ? 'default' : 'secondary'}
              className={cn(
                'font-medium',
                astrologer.is_online 
                  ? 'bg-success/10 text-success border-success/30 hover:bg-success/20' 
                  : ''
              )}
            >
              {astrologer.is_online ? 'Online' : 'Offline'}
            </Badge>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => onStartChat(astrologer)}
            disabled={!astrologer.is_online || disabled}
            className={cn(
              'w-full gap-2 font-medium transition-all duration-300',
              astrologer.is_online 
                ? 'bg-gradient-gold hover:shadow-glow hover:scale-[1.02]' 
                : ''
            )}
          >
            <MessageCircle className="h-4 w-4" />
            {astrologer.is_online ? 'Start Chat' : 'Notify Me'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
