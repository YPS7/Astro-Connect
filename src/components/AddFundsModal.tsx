import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFunds: (amount: number) => void;
  currentBalance: number;
}

const fundOptions = [
  { amount: 100, label: '₹100', popular: false },
  { amount: 250, label: '₹250', popular: false },
  { amount: 500, label: '₹500', popular: true },
  { amount: 1000, label: '₹1000', popular: false },
];

export const AddFundsModal = ({
  isOpen,
  onClose,
  onAddFunds,
  currentBalance,
}: AddFundsModalProps) => {
  const handleAddFunds = (amount: number) => {
    onAddFunds(amount);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-center">
            Add Funds to Wallet
          </DialogTitle>
          <DialogDescription className="text-center">
            Current Balance:{' '}
            <span className="font-semibold text-primary">₹{currentBalance.toFixed(2)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {fundOptions.map((option) => (
            <Button
              key={option.amount}
              variant="outline"
              onClick={() => handleAddFunds(option.amount)}
              className={cn(
                'h-20 text-xl font-semibold relative transition-all duration-300',
                'hover:border-primary hover:bg-primary/5 hover:shadow-gold',
                option.popular && 'border-primary bg-primary/5'
              )}
            >
              {option.popular && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  Popular
                </span>
              )}
              {option.label}
            </Button>
          ))}
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>This is a simulation. No real payments are processed.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
