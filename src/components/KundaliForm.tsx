import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface KundaliData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  birthPlace: string;
  gender: string;
}

interface KundaliFormProps {
  onSubmit: (data: KundaliData) => void;
  onBack: () => void;
}

export const KundaliForm = ({ onSubmit, onBack }: KundaliFormProps) => {
  const [formData, setFormData] = useState<KundaliData>({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    birthPlace: '',
    gender: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.dateOfBirth && formData.timeOfBirth && formData.birthPlace && formData.gender) {
      onSubmit(formData);
    }
  };

  const isFormValid = formData.name && formData.dateOfBirth && formData.timeOfBirth && formData.birthPlace && formData.gender;

  return (
    <div className="min-h-screen bg-gradient-cosmic py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
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
              Birth Details
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details for Kundali generation
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="bg-secondary/50"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Gender
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dob" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="bg-secondary/50"
              />
            </div>

            {/* Time of Birth */}
            <div className="space-y-2">
              <Label htmlFor="tob" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Time of Birth
              </Label>
              <Input
                id="tob"
                type="time"
                value={formData.timeOfBirth}
                onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
                className="bg-secondary/50"
              />
            </div>

            {/* Birth Place */}
            <div className="space-y-2">
              <Label htmlFor="birthPlace" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Birth Place
              </Label>
              <Input
                id="birthPlace"
                value={formData.birthPlace}
                onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                placeholder="City, State, Country"
                className="bg-secondary/50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-gradient-gold hover:shadow-glow h-12 text-lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Kundali
          </Button>
        </form>

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          Your birth details are used to calculate your personalized Kundali chart.
          All information is kept private and secure.
        </p>
      </div>
    </div>
  );
};
