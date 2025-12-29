// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wdbscwflkkqtdzlushpb.supabase.co';
const supabaseAnonKey = 'sb_publishable_0tVe9ZS917YOS-2i0CXEtw_k9S_iHts';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);