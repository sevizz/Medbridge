'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PhoneShell from '@/components/PhoneShell'
import BottomNav from '@/components/BottomNav'
import { getProfile, signOut } from '@/lib/auth'
import { env } from 'process'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  useEffect(() => { getProfile().then(setProfile).catch(()=>{}) }, [])

  async function logout() { await signOut(); router.push('/login') }

  const row: React.CSSProperties = {background:'white',borderRadius:'12px',padding:'14px 16px',marginBottom:'8px',display:'flex',alignItems:'center',justifyContent:'space-between',border:'1px solid var(--border)'}
  const sec: React.CSSProperties = {fontFamily:'DM Mono,monospace',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--muted)',marginBottom:'10px',marginTop:'16px'}

  return (
    <PhoneShell>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{flex:1,overflowY:'auto'}}>

          {/* Dark profile header */}
          <div style={{background:'var(--ink)',padding:'20px 24px 28px',color:'var(--paper)',textAlign:'center'}}>
            <div style={{fontSize:'3rem',marginBottom:'8px'}}>👤</div>
            <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.3rem',fontWeight:700}}>{profile?.fname||'—'}</div>
            <div style={{fontSize:'0.72rem',color:'rgba(245,240,232,0.4)',marginTop:'4px'}}>
              {[profile?.age&&`${profile.age} years`,profile?.diagnosis].filter(Boolean).join(' · ')||'Patient'}
            </div>
          </div>

          <div style={{padding:'0 20px 20px'}}>
            <div style={sec}>Account</div>
            <div style={row}><span style={{fontSize:'0.82rem',color:'var(--ink)',fontWeight:500}}>Name</span><span style={{fontSize:'0.78rem',color:'var(--muted)',fontFamily:'DM Mono,monospace'}}>{profile?.fname||'—'}</span></div>
            <div style={row}><span style={{fontSize:'0.82rem',color:'var(--ink)',fontWeight:500}}>Age</span><span style={{fontSize:'0.78rem',color:'var(--muted)',fontFamily:'DM Mono,monospace'}}>{profile?.age||'—'}</span></div>
            <div style={row}><span style={{fontSize:'0.82rem',color:'var(--ink)',fontWeight:500}}>Condition</span><span style={{fontSize:'0.78rem',color:'var(--muted)',fontFamily:'DM Mono,monospace'}}>{profile?.diagnosis||'—'}</span></div>

            <div style={sec}>Doctor on Record</div>
            <div style={{borderRadius:'12px',padding:'14px 16px',marginBottom:'8px',background:'rgba(37,211,102,0.06)',border:'1px solid rgba(37,211,102,0.2)'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--teal)',marginBottom:'4px'}}>WhatsApp Alerts</div>
              <div style={{fontSize:'0.88rem',fontWeight:600,color:'var(--ink)'}}>{profile?.doctor_name||'No doctor added'}</div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.72rem',color:'var(--muted)',marginTop:'2px'}}>{profile?.doctor_whatsapp||'—'}</div>
              <div style={{fontSize:'0.68rem',color:'#25D366',marginTop:'4px'}}>{profile?.doctor_whatsapp?'✓ WhatsApp notifications active':'Add a doctor to enable alerts'}</div>
            </div>

            <div style={sec}>App</div>
            <div style={row}><span style={{fontSize:'0.82rem',color:'var(--ink)',fontWeight:500}}>Version</span><span style={{fontSize:'0.78rem',color:'var(--muted)',fontFamily:'DM Mono,monospace'}}>1.0.0-beta</span></div>
            <div style={row}><span style={{fontSize:'0.82rem',color:'var(--ink)',fontWeight:500}}>Storage</span><span style={{fontSize:'0.78rem',color:'var(--muted)',fontFamily:'DM Mono,monospace'}}>Supabase</span></div>

            <button onClick={logout} style={{width:'100%',padding:'14px',background:'transparent',color:'var(--red)',border:'1px solid rgba(192,57,43,0.3)',borderRadius:'12px',fontFamily:'DM Sans,sans-serif',fontSize:'0.88rem',fontWeight:600,cursor:'pointer',marginTop:'4px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
              🚪 Sign Out
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    </PhoneShell>
  )
}
