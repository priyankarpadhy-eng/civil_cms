import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://hluevxsggclcsajzylkh.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsdWV2eHNnZ2NsY3Nhanp5bGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNTcwMzgsImV4cCI6MjA4NzgzMzAzOH0.d6beG53y1nsOVZ-R0YF7qLaESQNW_gTpQ8X1JVln4pE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
