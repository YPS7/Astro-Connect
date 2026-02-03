import { Wallet, Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WalletDisplayProps {
  balance: number;
  isLow: boolean;
  isEmpty: boolean;
  onAddFunds?: () => void;
  className?: string;
  showAddButton?: boolean;
}

export const WalletDisplay = ({
  balance,
  isLow,
  isEmpty,
  onAddFunds,
  className,
  showAddButton = true,
}: WalletDisplayProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300',
        isEmpty
          ? 'bg-destructive/10 border border-destructive/30'
          : isLow
          ? 'bg-primary/10 border border-primary/30'
          : 'bg-secondary border border-border',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {isEmpty ? (
          <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
        ) : (
          <Wallet
            className={cn(
              'h-5 w-5',
              isLow ? 'text-primary' : 'text-accent'
            )}
          />
        )}
        <span
          className={cn(
            'font-semibold text-lg tabular-nums',
            isEmpty
              ? 'text-destructive'
              : isLow
              ? 'text-primary'
              : 'text-foreground'
          )}
        >
          ₹{balance.toFixed(2)}
        </span>
      </div>
      
      {showAddButton && onAddFunds && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onAddFunds}
          className="h-7 w-7 p-0 rounded-full hover:bg-primary/20"
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
