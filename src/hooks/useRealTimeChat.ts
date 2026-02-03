import { useState, useEffect, useCallback } from 'react';
import { supabase, Message } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useRealTimeChat = (sessionId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Fetch existing messages
  const fetchMessages = useCallback(async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!sessionId) return;

    fetchMessages();

    const newChannel = supabase
      .channel(`messages:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === newMessage.id)) {
              return prev;
            }
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    setChannel(newChannel);

    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel);
      }
    };
  }, [sessionId, fetchMessages]);

  // Send a message
  const sendMessage = useCallback(
    async (content: string, sender: 'user' | 'astrologer' = 'user') => {
      // Allow sending even without session ID for simulation
      const currentSessionId = sessionId || 'simulated-session';

      const newMessage: Message = {
        id: Date.now().toString(),
        session_id: currentSessionId,
        sender,
        content: content.trim(),
        created_at: new Date().toISOString(),
      };

      // If we are in a purely simulated session (no real backend session), update immediately
      if (!sessionId) {
        setMessages((prev) => [...prev, newMessage]);
        return true;
      }

      if (!content.trim()) return false;

      try {
        const { error } = await supabase.from('messages').insert({
          session_id: sessionId,
          sender,
          content: content.trim(),
        });

        if (error) {
          console.warn('Backend unavailable, continuing in simulation mode:', error);
          // Backend failed, so we manually add the message to simulation
          setMessages((prev) => [...prev, newMessage]);
          return true;
        }

        // Check if we are simulating an astrologer response in a "connected" state
        // If this message is from the 'astrologer' (simulated) and we successfully sent it to DB,
        // we rely on the Realtime subscription to show it.
        // HOWEVER, if Realtime is invalid or slow, we might miss it. 
        // But adding it here causes duplicates if Realtime works.
        // We trust the subscription for the "Happy Path".

        return true;
      } catch (error) {
        console.warn('Backend unavailable, continuing in simulation mode:', error);
        // Backend failed, so we manually add the message to simulation
        setMessages((prev) => [...prev, newMessage]);
        return true;
      }
    },
    [sessionId]
  );

  // Simulate astrologer response
  const simulateAstrologerResponse = useCallback(async () => {
    if (!sessionId) return;

    const responses = [
      "The stars are aligning in your favor. I sense great energy around you.",
      "Your birth chart shows a strong connection to Venus. Love and beauty guide your path.",
      "Mercury is in retrograde, so communication may feel challenging. Take time to reflect.",
      "I see Jupiter's blessing upon you. Expansion and growth await in your near future.",
      "The moon's phases suggest this is a time for new beginnings. Trust your intuition.",
      "Saturn teaches patience. The challenges you face now will shape your strength.",
      "Your aura radiates positive energy. The universe is conspiring in your favor.",
      "Mars gives you courage. Now is the time to take bold action towards your dreams.",
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // Delay to simulate typing
    setTimeout(async () => {
      await sendMessage(randomResponse, 'astrologer');
    }, 1500 + Math.random() * 2000);
  }, [sessionId, sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    simulateAstrologerResponse,
    clearMessages,
  };
};
