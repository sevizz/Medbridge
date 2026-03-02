'use client'
import { useEffect, useState } from 'react'
import PhoneShell from '@/components/PhoneShell'
import BottomNav from '@/components/BottomNav'
import ScreenHeader from '@/components/ScreenHeader'
import { getReminders, addReminder, toggleReminder } from '@/lib/api'
import { getProfile } from '@/lib/auth'

export default function RemindersPage() {
  const [reminders, setReminders] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [drug, setDrug] = useState('')
  const [time, setTime] = useState('08:00')
  const [dose, setDose] = useState('')

  useEffect(() => { load(); getProfile().then(setProfile).catch(()=>{}) }, [])

  async function load() { getReminders().then(setReminders).catch(()=>{}) }

  async function toggle(id:string, done:boolean) {
    await toggleReminder(id, !done).catch(()=>{}); load()
  }

  async function add() {
    if (!drug||!time) return
    await addReminder(drug, dose||'1 dose', time).catch(()=>{})
    setDrug(''); setDose(''); load()
  }

  const fi: React.CSSProperties = {width:'100%',padding:'10px 12px',border:'1px solid var(--border)',borderRadius:'8px',fontFamily:'DM Sans,sans-serif',fontSize:'0.82rem',outline:'none',background:'var(--cream)',color:'var(--ink)'}
  const fl: React.CSSProperties = {fontFamily:'DM Mono,monospace',fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--muted)',marginBottom:'6px',display:'block'}
  const sl: React.CSSProperties = {fontFamily:'DM Mono,monospace',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--muted)',marginBottom:'10px',marginTop:'16px'}

  return (
    <PhoneShell>
      <ScreenHeader title="Reminders & History" sub="Feature 04 — Prescriptions & follow-ups" />
      <div style={{flex:1,overflowY:'auto',padding:'0 20px 16px'}}>

        <div style={sl}>Today's Medications</div>
        {reminders.length===0 && <div style={{fontSize:'0.78rem',color:'var(--muted)',padding:'8px 0 16px'}}>No reminders yet — add one below.</div>}
        {reminders.map(r=>(
          <div key={r.id} style={{background:'white',borderRadius:'14px',padding:'14px 16px',marginBottom:'8px',display:'flex',alignItems:'center',gap:'12px',border:'1px solid var(--border)'}}>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.72rem',fontWeight:500,color:'var(--ink)',background:'var(--cream)',padding:'6px 10px',borderRadius:'8px',whiteSpace:'nowrap',flexShrink:0}}>{r.time_of_day?.slice(0,5)}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:'0.85rem',fontWeight:600,color:'var(--ink)'}}>{r.drug_name}</div>
              <div style={{fontSize:'0.7rem',color:'var(--muted)',marginTop:'2px'}}>{r.dose}</div>
            </div>
            <div onClick={()=>toggle(r.id,r.is_done)} style={{marginLeft:'auto',width:'22px',height:'22px',borderRadius:'50%',border:`2px solid ${r.is_done?'var(--teal-l)':'var(--border)'}`,background:r.is_done?'var(--teal-l)':'white',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',color:'white',flexShrink:0}}>
              {r.is_done?'✓':''}
            </div>
          </div>
        ))}

        <div style={sl}>Upcoming Appointments</div>
        <div style={{background:'var(--ink)',color:'var(--paper)',borderRadius:'14px',padding:'16px',marginBottom:'8px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.6rem',color:'rgba(245,240,232,0.4)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'4px'}}>Your Doctor</div>
            <div style={{fontFamily:'Playfair Display,serif',fontSize:'0.9rem',fontWeight:700}}>{profile?.doctor_name||'—'}</div>
            <div style={{fontSize:'0.72rem',color:'rgba(245,240,232,0.5)',marginTop:'4px'}}>Tuesday, March 11 · 10:30 AM</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{background:'rgba(192,57,43,0.3)',border:'1px solid rgba(192,57,43,0.4)',color:'#e74c3c',fontFamily:'DM Mono,monospace',fontSize:'0.6rem',padding:'4px 8px',borderRadius:'6px'}}>Upcoming</div>
            <div style={{fontSize:'0.72rem',color:'rgba(245,240,232,0.35)',marginTop:'2px'}}>in 11 days</div>
          </div>
        </div>

        <div style={sl}>Add Reminder</div>
        <div style={{background:'white',borderRadius:'14px',padding:'16px',border:'1px solid var(--border)'}}>
          <div style={{marginBottom:'12px'}}><label style={fl}>Medicine Name</label><input style={fi} placeholder="e.g. Metformin 500mg" value={drug} onChange={e=>setDrug(e.target.value)} /></div>
          <div style={{marginBottom:'12px'}}><label style={fl}>Time</label><input style={fi} type="time" value={time} onChange={e=>setTime(e.target.value)} /></div>
          <div style={{marginBottom:'12px'}}><label style={fl}>Dose</label><input style={fi} placeholder="e.g. 1 tablet with food" value={dose} onChange={e=>setDose(e.target.value)} /></div>
          <button onClick={add} style={{width:'100%',padding:'12px',background:'var(--gold)',color:'white',border:'none',borderRadius:'10px',fontSize:'0.82rem',fontWeight:600,cursor:'pointer'}}>+ Add Reminder</button>
        </div>
      </div>
      <BottomNav />
    </PhoneShell>
  )
}