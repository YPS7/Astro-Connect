import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qzqgrljkruuaiimywcpy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cWdybGprcnV1YWlpbXl3Y3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTcyNzgsImV4cCI6MjA4NTY3MzI3OH0.XaLys-4n8x4_N1HiKm_IcBjjGcbsmJI9qkEG-sIUURk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Astrologer {
  id: string;
  name: string;
  price_per_min: number;
  is_online: boolean;
  specialty?: string;
  rating?: number;
  avatar_url?: string;
}

export interface Message {
  id: string;
  session_id: string;
  sender: 'user' | 'astrologer';
  content: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  astrologer_id: string;
  user_id: string;
  is_active: boolean;
  started_at: string;
  ended_at?: string;
}
