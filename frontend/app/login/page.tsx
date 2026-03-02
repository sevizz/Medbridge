'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'

const inp: React.CSSProperties = {width:'100%',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'12px 14px',fontFamily:'DM Sans,sans-serif',fontSize:'0.88rem',color:'var(--paper)',outline:'none'}
const lbl: React.CSSProperties = {display:'block',fontFamily:'DM Mono,monospace',fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'0.1em',color:'rgba(245,240,232,0.35)',marginBottom:'6px'}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setErr('')
    if (!email || !pass) { setErr('Please enter your email and password.'); return }
    setLoading(true)
    try { await signIn(email, pass); router.push('/home') }
    catch (e: any) { setErr(e.message || 'Login failed. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{width:'390px',minHeight:'780px',background:'var(--ink)',borderRadius:'48px',padding:'14px',boxShadow:'0 0 0 1px rgba(255,255,255,0.08),0 60px 120px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.1)',flexShrink:0,display:'flex',flexDirection:'column'}}>
      <div style={{width:'120px',height:'30px',background:'var(--ink)',borderRadius:'0 0 20px 20px',margin:'0 auto'}} />
      <div style={{flex:1,background:'var(--ink)',borderRadius:'36px',display:'flex',flexDirection:'column',overflow:'hidden'}}>

        {/* Dark status bar */}
        <div style={{padding:'12px 24px 8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontFamily:'DM Mono,monospace',fontSize:'0.72rem',fontWeight:500,color:'rgba(245,240,232,0.6)'}}>11:32</span>
          <span style={{fontSize:'0.65rem',color:'rgba(245,240,232,0.5)',letterSpacing:'2px'}}>▲ ● ●●●</span>
        </div>

        {/* Hero */}
        <div style={{padding:'44px 28px 24px',textAlign:'center',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'-60px',left:'50%',transform:'translateX(-50%)',width:'320px',height:'320px',borderRadius:'50%',background:'radial-gradient(circle,rgba(192,57,43,0.18) 0%,transparent 70%)',pointerEvents:'none'}} />
          <div style={{fontFamily:'Playfair Display,serif',fontSize:'2.2rem',fontWeight:900,color:'var(--paper)',letterSpacing:'-0.03em',position:'relative',zIndex:1}}>Med<span style={{color:'var(--red-l)'}}>Bridge</span></div>
          <div style={{fontSize:'0.7rem',color:'rgba(245,240,232,0.35)',marginTop:'6px',fontFamily:'DM Mono,monospace',letterSpacing:'0.1em',textTransform:'uppercase',position:'relative',zIndex:1}}>Post-Discharge Care</div>
          <div style={{fontSize:'2.8rem',margin:'18px 0 4px',position:'relative',zIndex:1}}>🫀</div>
        </div>

        {/* Body */}
        <div style={{padding:'4px 24px 36px',flex:1,overflowY:'auto'}}>
          {/* Tabs */}
          <div style={{display:'flex',background:'rgba(255,255,255,0.07)',borderRadius:'12px',padding:'4px',marginBottom:'22px'}}>
            <div style={{flex:1,padding:'10px',textAlign:'center',borderRadius:'8px',background:'var(--paper)',color:'var(--ink)',fontSize:'0.82rem',fontWeight:600}}>Sign In</div>
            <div onClick={() => router.push('/signup')} style={{flex:1,padding:'10px',textAlign:'center',borderRadius:'8px',cursor:'pointer',fontSize:'0.82rem',fontWeight:600,color:'rgba(245,240,232,0.35)'}}>Create Account</div>
          </div>

          {err && <div style={{background:'rgba(192,57,43,0.15)',border:'1px solid rgba(192,57,43,0.3)',borderRadius:'8px',padding:'10px 12px',fontSize:'0.78rem',color:'#e74c3c',marginBottom:'14px'}}>{err}</div>}

          <div style={{marginBottom:'13px'}}><label style={lbl}>Email</label><input style={inp} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} /></div>
          <div style={{marginBottom:'13px'}}><label style={lbl}>Password</label><input style={inp} type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} /></div>

          <button onClick={handleLogin} disabled={loading} style={{width:'100%',padding:'15px',background:'var(--red)',color:'white',border:'none',borderRadius:'12px',fontFamily:'DM Sans,sans-serif',fontSize:'0.92rem',fontWeight:600,cursor:loading?'not-allowed':'pointer',opacity:loading?0.5:1,marginTop:'6px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
          <div style={{textAlign:'center',fontSize:'0.7rem',color:'rgba(245,240,232,0.18)',margin:'14px 0',fontFamily:'DM Mono,monospace',letterSpacing:'0.06em'}}>— or —</div>
          <button onClick={() => router.push('/signup')} style={{width:'100%',padding:'15px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'12px',fontFamily:'DM Sans,sans-serif',fontSize:'0.92rem',fontWeight:600,cursor:'pointer',color:'var(--paper)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            Create an Account
          </button>
          <div style={{textAlign:'center',fontSize:'0.7rem',color:'rgba(245,240,232,0.22)',marginTop:'14px',lineHeight:1.5}}>New here? Switch to "Create Account" to register.</div>
        </div>
      </div>
    </div>
  )
}