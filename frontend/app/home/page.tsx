'use client'
import { supabase } from '../../lib/supabase'
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
  const [loading, setLoading] = useState(true)   // ← ADD THIS

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        getProfile().then(p => setProfile(p)).finally(() => setLoading(false))
      } else if (event === 'INITIAL_SESSION' && !session) {
        router.push('/login')
      }
    })
    return () => subscription.unsubscribe()
  }, [router])

  // ← ADD THIS: don't render (or redirect) until auth check is done
  if (loading) return null

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
              {icon:'📋',title:'Discharge Explainer',desc:'Upload your discharge summary and get a plain-language explanation in your language.',path:'/discharge'},
              {icon:'🩺',title:'Symptom Checker',desc:'Describe how you\'re feeling and get guidance on what to do next.',path:'/symptom'},
              {icon:'💊',title:'Drug Info',desc:'Look up any medication for plain-language dosage and interaction info.',path:'/drugs'},
            ].map(card => (
              <div key={card.path} onClick={()=>router.push(card.path)} style={{background:'var(--paper)',borderRadius:'16px',padding:'16px',cursor:'pointer',border:'1px solid var(--border)'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:'12px'}}>
                  <span style={{fontSize:'1.4rem'}}>{card.icon}</span>
                  <div>
                    <div style={{fontSize:'0.85rem',fontWeight:600,marginBottom:'3px'}}>{card.title}</div>
                    <div style={{fontSize:'0.72rem',color:'var(--muted)',lineHeight:1.4}}>{card.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    </PhoneShell>
  )
}
