import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isPlaceholder = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder.supabase.co');

export const supabase = !isPlaceholder
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({}, {
      get(target, prop) {
        return () => {
          throw new Error("Supabase is using placeholder URL. Please configure environment variables in Vercel.");
        };
      }
    });

