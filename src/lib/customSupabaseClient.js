import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wdibupgznqtgvsblovyh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkaWJ1cGd6bnF0Z3ZzYmxvdnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDQ1OTEsImV4cCI6MjA3NDI4MDU5MX0.n83hic-j5YWIa5PYq3WuOLS6E-bGbPods75h7e4gfYo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);