// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_URL;
const supabaseAnonKey = process.env.ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);