kimport { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ensure environment variables exist
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Attach Supabase to the window for debugging
window.supabase = supabase;
