import { useState, useEffect, useCallback } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { KundaliForm, KundaliData } from '@/components/KundaliForm';
import { KundaliDisplay } from '@/components/KundaliDisplay';
import { AIChat } from '@/components/AIChat';
import { Marketplace } from '@/components/Marketplace';
import { ChatInterface } from '@/components/ChatInterface';
import { AddFundsModal } from '@/components/AddFundsModal';
import { useWallet } from '@/hooks/useWallet';
import { useRealTimeChat } from '@/hooks/useRealTimeChat';
import { Astrologer } from '@/lib/supabase';

import { DailyPredictions } from '@/components/DailyPredictions';

type ViewType = 'welcome' | 'kundali-form' | 'kundali-display' | 'ai-chat' | 'marketplace' | 'live-chat' | 'daily-predictions';

// Simple UUID generator for session IDs
const generateSessionId = () => {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('welcome');
  const [selectedAstrologer, setSelectedAstrologer] = useState<Astrologer | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [kundaliData, setKundaliData] = useState<KundaliData | null>(null);

  const {
    balance,
    isLow,
    isEmpty,
    startDeduction,
    stopDeduction,
    addBalance,
  } = useWallet();

  const {
    messages,
    sendMessage,
    simulateAstrologerResponse,
    clearMessages,
  } = useRealTimeChat(sessionId);

  // Handle session end when balance hits zero
  const handleBalanceZero = useCallback(() => {
    setIsSessionActive(false);
    stopDeduction();
  }, [stopDeduction]);

  // Start a chat session with an astrologer
  const handleStartChat = useCallback((astrologer: Astrologer) => {
    if (isEmpty) {
      setShowAddFundsModal(true);
      return;
    }

    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    setSelectedAstrologer(astrologer);
    setIsSessionActive(true);
    setCurrentView('live-chat');
    clearMessages();

    startDeduction(astrologer.price_per_min, handleBalanceZero);
  }, [isEmpty, startDeduction, handleBalanceZero, clearMessages]);

  // End chat and return to marketplace
  const handleEndChat = useCallback(() => {
    stopDeduction();
    setIsSessionActive(false);
    setCurrentView('marketplace');
    setSelectedAstrologer(null);
    setSessionId(null);
  }, [stopDeduction]);

  // Send message and trigger astrologer response
  const handleSendMessage = useCallback(async (content: string) => {
    const success = await sendMessage(content, 'user');
    if (success) {
      simulateAstrologerResponse();
    }
  }, [sendMessage, simulateAstrologerResponse]);

  // Add funds
  const handleAddFunds = useCallback((amount: number) => {
    addBalance(amount);
  }, [addBalance]);

  // Handle kundali form submission
  const handleKundaliSubmit = useCallback((data: KundaliData) => {
    setKundaliData(data);
    setCurrentView('kundali-display');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDeduction();
    };
  }, [stopDeduction]);

  return (
    <>
      {currentView === 'welcome' && (
        <WelcomeScreen
          onNavigate={(view) => setCurrentView(view as ViewType)}
        />
      )}

      {currentView === 'kundali-form' && (
        <KundaliForm
          onSubmit={handleKundaliSubmit}
          onBack={() => setCurrentView('welcome')}
        />
      )}

      {currentView === 'kundali-display' && kundaliData && (
        <KundaliDisplay
          data={kundaliData}
          onBack={() => setCurrentView('kundali-form')}
          onChat={() => setCurrentView('ai-chat')}
        />
      )}

      {currentView === 'ai-chat' && (
        <AIChat
          kundaliData={kundaliData || undefined}
          onBack={() => kundaliData ? setCurrentView('kundali-display') : setCurrentView('marketplace')}
        />
      )}

      {currentView === 'marketplace' && (
        <Marketplace
          balance={balance}
          isLow={isLow}
          isEmpty={isEmpty}
          onAddFunds={() => setShowAddFundsModal(true)}
          onStartChat={handleStartChat}
          onHome={() => setCurrentView('welcome')}
        />
      )}

      {currentView === 'live-chat' && selectedAstrologer && (
        <ChatInterface
          astrologer={selectedAstrologer}
          messages={messages}
          balance={balance}
          isLow={isLow}
          isEmpty={isEmpty}
          isActive={isSessionActive}
          onSendMessage={handleSendMessage}
          onEndChat={handleEndChat}
          onAddFunds={() => setShowAddFundsModal(true)}
        />
      )}

      {currentView === 'daily-predictions' && (
        <DailyPredictions
          onBack={() => setCurrentView('welcome')}
        />
      )}

      <AddFundsModal
        isOpen={showAddFundsModal}
        onClose={() => setShowAddFundsModal(false)}
        onAddFunds={handleAddFunds}
        currentBalance={balance}
      />
    </>
  );
};

export default Index;
