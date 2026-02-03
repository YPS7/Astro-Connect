import { useState } from 'react';
import { ArrowLeft, Star, Sparkles, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import cosmicHero from '@/assets/cosmic-hero.jpg';

interface DailyPredictionsProps {
    onBack: () => void;
}

const ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const PREDICTIONS = [
    "Today is a day of great potential. The stars align to bring you unexpected opportunities in your career.",
    "Your emotional depth will be your strength today. Connect with loved ones and share your feelings.",
    "Financial gains are foreseen. Be wise with your investments and trust your intuition.",
    "A new connection could blossom into something significant. Keep your heart open to new possibilities.",
    "Challenge yourself to step out of your comfort zone. Growth happens when you embrace the unknown.",
    "Patience is key today. Do not rush into decisions; let the universe guide you at the right pace.",
    "Your creativity is at an all-time high. Use this energy to start a new project or hobby.",
    "Focus on your health and well-being. A balanced mind leads to a balanced life.",
    "Travel is on the horizon. Whether physical or spiritual, a journey awaits you.",
    "Conflict may arise, but your diplomatic skills will help resolve it peacefully."
];

export const DailyPredictions = ({ onBack }: DailyPredictionsProps) => {
    const [selectedSign, setSelectedSign] = useState<string>("");
    const [prediction, setPrediction] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGetPrediction = () => {
        if (!selectedSign) return;

        setIsLoading(true);
        // Simulate API call/processing
        setTimeout(() => {
            const randomPrediction = PREDICTIONS[Math.floor(Math.random() * PREDICTIONS.length)];
            setPrediction(randomPrediction);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-cosmic relative overflow-hidden flex flex-col">
            {/* Background Image */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `url(${cosmicHero})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Header */}
            <header className="flex items-center gap-4 px-4 py-3 bg-card/80 backdrop-blur-sm border-b border-border z-10 w-full">
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
                        <Sun className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h2 className="font-serif font-semibold text-foreground">Daily Predictions</h2>
                        <p className="text-xs text-muted-foreground">Cosmic insights for today</p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center z-10">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-serif font-bold text-gradient-gold">Horoscope</h1>
                        <p className="text-muted-foreground">Select your zodiac sign to reveal your destiny.</p>
                    </div>

                    <Card className="p-6 bg-card/60 backdrop-blur-md border-border shadow-glow">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Zodiac Sign
                                </label>
                                <Select onValueChange={setSelectedSign} value={selectedSign}>
                                    <SelectTrigger className="bg-secondary/50 border-border">
                                        <SelectValue placeholder="Select your sign" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ZODIAC_SIGNS.map((sign) => (
                                            <SelectItem key={sign} value={sign}>
                                                {sign}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                onClick={handleGetPrediction}
                                disabled={!selectedSign || isLoading}
                                className="w-full bg-gradient-gold hover:shadow-glow transition-all"
                                size="lg"
                            >
                                {isLoading ? (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                        Consulting the Stars...
                                    </>
                                ) : (
                                    <>
                                        <Moon className="mr-2 h-4 w-4" />
                                        Reveal Prediction
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>

                    {prediction && !isLoading && (
                        <div className="animate-fade-in space-y-4">
                            <div className="relative p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 text-center">
                                <Star className="absolute top-4 left-4 h-6 w-6 text-primary/40" />
                                <Star className="absolute bottom-4 right-4 h-6 w-6 text-primary/40" />

                                <h3 className="font-serif text-xl font-semibold mb-3 text-primary">
                                    {selectedSign}'s Forecast
                                </h3>
                                <p className="text-lg leading-relaxed italic text-foreground/90">
                                    "{prediction}"
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
