// supabase.js
import { createClient } from '@supabase/supabase-js'

// from your Supabase dashboard
const SUPABASE_URL = 'https://ouwcnfdhwujtrvzgfidk.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91d2NuZmRod3VqdHJ2emdmaWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MDY5NzcsImV4cCI6MjA3NjQ4Mjk3N30.P4UXdZLo5ZZFe69yX_Jc7IGnWByiXag2BGwuGAfkFeg'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
