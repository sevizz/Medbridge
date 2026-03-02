import { supabase } from './supabase'
const B = process.env.NEXT_PUBLIC_BACKEND_URL
async function h() {
  const { data } = await supabase.auth.getSession()
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session?.access_token}` }
}
export async function analyseDischarge(text: string, language: string) {
  const res = await fetch(`${B}/analyse`, { method:'POST', headers: await h(), body: JSON.stringify({ text, language }) })
  if (!res.ok) throw new Error(await res.text()); return res.json()
}
export async function lookupDrug(drug_name: string) {
  const res = await fetch(`${B}/drug`, { method:'POST', headers: await h(), body: JSON.stringify({ drug_name }) })
  if (!res.ok) throw new Error(await res.text()); return res.json()
}
export async function checkSymptom(symptom: string, patient_context: string) {
  const res = await fetch(`${B}/symptom`, { method:'POST', headers: await h(), body: JSON.stringify({ symptom, patient_context }) })
  if (!res.ok) throw new Error(await res.text()); return res.json()
}
export async function notifyDoctor(p: {symptom_text:string;classification:string;patient_name:string;patient_age:string;patient_diagnosis:string;doctor_name:string;doctor_whatsapp:string;medications:string[]}) {
  const res = await fetch(`${B}/notify`, { method:'POST', headers: await h(), body: JSON.stringify(p) })
  if (!res.ok) throw new Error(await res.text()); return res.json()
}
export async function getReminders() {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase.from('reminders').select('*').eq('date', today).order('time_of_day')
  if (error) throw error; return data || []
}
export async function addReminder(drug_name: string, dose: string, time_of_day: string) {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('reminders').insert({ user_id: user!.id, drug_name, dose, time_of_day })
  if (error) throw error
}
export async function toggleReminder(id: string, is_done: boolean) {
  const { error } = await supabase.from('reminders').update({ is_done }).eq('id', id)
  if (error) throw error
}
export async function getDrugs() {
  const { data, error } = await supabase.from('drugs').select('*').order('created_at')
  if (error) throw error; return data || []
}
export async function saveDrug(drug_name: string) {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('drugs').insert({ user_id: user!.id, drug_name })
  if (error) throw error
}