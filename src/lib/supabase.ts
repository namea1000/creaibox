import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // 🌟 로그인 상태를 브라우저에 저장해라!
    autoRefreshToken: true, // 🌟 토큰이 만료되면 알아서 갱신해라!
    detectSessionInUrl: true,
  },
});