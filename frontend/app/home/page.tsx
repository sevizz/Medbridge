'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PhoneShell from '@/components/PhoneShell'
import BottomNav from '@/components/BottomNav'
import { getProfile } from '@/lib/auth'
import { getReminders } from '@/lib/api'

export default function HomePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [nextMed, setNextMed] = useState<any>(null)

  useEffect(() => {
    getProfile().then(p => { if (!p) { router.push('/login'); return } setProfile(p) }).catch(() => router.push('/login'))
    getReminders().then(r => setNextMed(r.find((x:any)=>!x.is_done)||null)).catch(()=>{})
  }, [router])

  return (
    <PhoneShell>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{flex:1,overflowY:'auto'}}>

          {/* Dark home header */}
          <div style={{padding:'20px 24px 16px',background:'var(--ink)',color:'var(--paper)'}}>
            <div style={{fontSize:'0.72rem',fontFamily:'DM Mono,monospace',color:'rgba(245,240,232,0.4)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'4px'}}>Welcome back</div>
            <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.6rem',fontWeight:700,marginBottom:'2px'}}>{profile?.fname||'—'}</div>
            <div style={{fontSize:'0.75rem',color:'rgba(245,240,232,0.4)'}}>{profile?.diagnosis||'Post-discharge care'}</div>
            <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'rgba(192,57,43,0.2)',border:'1px solid rgba(192,57,43,0.3)',padding:'4px 10px',borderRadius:'20px',marginTop:'10px',fontFamily:'DM Mono,monospace',fontSize:'0.6rem',color:'#e74c3c'}}>🫀 Recovery mode</div>
          </div>

          <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:'12px'}}>
            {/* Reminder strip */}
            <div onClick={()=>router.push('/reminders')} style={{background:'var(--ink)',color:'var(--paper)',borderRadius:'16px',padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <span style={{fontSize:'1.2rem'}}>🔔</span>
                <div>
                  <div style={{fontSize:'0.78rem',fontWeight:500}}>Next medication due</div>
                  <div style={{fontSize:'0.65rem',color:'rgba(245,240,232,0.4)',marginTop:'2px'}}>{nextMed?nextMed.drug_name:'No reminders yet'}</div>
                </div>
              </div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.72rem',color:'rgba(245,240,232,0.5)'}}>{nextMed?nextMed.time_of_day?.slice(0,5):'—'}</div>
            </div>

            {[
              {icon:'📋',title:'Discharge Explainer',desc:'Upload your discharge summary and get a plain-language explanation in your language.',bg:'rgba(192,57,43,0.1)',path:'/discharge'},
              {icon:'💊',title:'Drug Info Lookup',desc:'Tap any drug on your prescription to learn what it does and how to take it safely.',bg:'rgba(26,107,90,0.1)',path:'/drugs'},
              {icon:'🩺',title:'Symptom Checker',desc:'Feeling something unusual? Describe it and find out whether to wait or act fast.',bg:'rgba(125,60,152,0.1)',path:'/symptom'},
            ].map(c => (
              <div key={c.path} onClick={()=>router.push(c.path)} style={{background:'white',borderRadius:'16px',padding:'18px',boxShadow:'0 2px 12px rgba(14,17,23,0.08)',cursor:'pointer',border:'1px solid var(--border)'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{width:'40px',height:'40px',borderRadius:'10px',background:c.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem'}}>{c.icon}</div>
                  <span style={{color:'var(--muted)',fontSize:'0.8rem'}}>→</span>
                </div>
                <div style={{fontFamily:'Playfair Display,serif',fontSize:'0.95rem',fontWeight:700,margin:'10px 0 4px',color:'var(--ink)'}}>{c.title}</div>
                <div style={{fontSize:'0.75rem',color:'var(--muted)',lineHeight:1.5}}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    </PhoneShell>
  )
}