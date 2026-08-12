import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://leaifcptyahjaytjpdyr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlYWlmY3B0eWFoamF5dGpwZHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMzAzODcsImV4cCI6MjEwMTcwNjM4N30.u0ue2jgzZ1fw6EKd_uGk_LeMPiRWHGwcoAtvcquekE0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('obras_state').select('*');
  if (error) {
    console.error("ERRO SUPABASE:", error.message);
  } else {
    console.log("SUCESSO SUPABASE! Linhas encontradas:", data.length);
    console.log("Dados:", JSON.stringify(data, null, 2));
  }
}

test();
