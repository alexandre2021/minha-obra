import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://leaifcptyahjaytjpdyr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlYWlmY3B0eWFoamF5dGpwZHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMzAzODcsImV4cCI6MjEwMTcwNjM4N30.u0ue2jgzZ1fw6EKd_uGk_LeMPiRWHGwcoAtvcquekE0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
  const { data: obras } = await supabase.from('obras').select('*');
  const { data: etapas } = await supabase.from('etapas').select('*');
  const { data: despesas } = await supabase.from('despesas').select('*');
  const { data: materiais } = await supabase.from('materiais').select('*');
  const { data: diario } = await supabase.from('diario_obra').select('*');
  const { data: equipe } = await supabase.from('equipe').select('*');

  console.log("STATUS DAS TABELAS RELACIONAIS NO SUPABASE:");
  console.log("- Obras:", obras?.length || 0);
  console.log("- Etapas:", etapas?.length || 0);
  console.log("- Despesas:", despesas?.length || 0);
  console.log("- Materiais:", materiais?.length || 0);
  console.log("- Diário:", diario?.length || 0);
  console.log("- Equipe:", equipe?.length || 0);
}

verify();
