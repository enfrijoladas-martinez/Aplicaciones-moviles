import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://ivfprelaxelnooopjabf.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2ZnByZWxheGVsbm9vb3BqYWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNTA2OTksImV4cCI6MjEwODcyNjY5OX0.BBa5DvLfN07EucH2yPQIVflDCaAVBe2St-SCv6HPG1o';

export const hayCredenciales =
  SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY.length > 40;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
