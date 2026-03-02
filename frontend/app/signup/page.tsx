'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth'

const inp: React.CSSProperties = {width:'100%',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'12px 14px',fontFamily:'DM Sans,sans-serif',fontSize:'0.85rem',color:'var(--paper)',outline:'none'}
const lbl: React.CSSProperties = {display:'block',fontFamily:'DM Mono,monospace',fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'0.1em',color:'rgba(245,240,232,0.35)',marginBottom:'6px'}

export default function SignupPage() {
  const router = useRouter()
  const [f, setF] = useState({fname:'',age:'',email:'',password:'',diagnosis:'',doctorName:'',doctorNum:''})
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k:string, v:string) => setF(p=>({...p,[k]:v}))

  async function handleSignup() {
    setErr(''); setOk('')
    if (!f.fname) { setErr('Please enter your first name.'); return }
    if (!f.email||!f.email.includes('@')) { setErr('Please enter a valid email address.'); return }
    if (f.password.length<6) { setErr('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      await signUp(f.email, f.password, f)
      setOk(`Account created! Welcome, ${f.fname}. Signing you in…`)
      setTimeout(() => router.push('/home'), 900)
    } catch (e:any) { setErr(e.message||'Signup failed. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{width:'390px',minHeight:'780px',background:'var(--ink)',borderRadius:'48px',padding:'14px',boxShadow:'0 0 0 1px rgba(255,255,255,0.08),0 60px 120px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.1)',flexShrink:0,display:'flex',flexDirection:'column'}}>
      <div style={{width:'120px',height:'30px',background:'var(--ink)',borderRadius:'0 0 20px 20px',margin:'0 auto'}} />
      <div style={{flex:1,background:'var(--ink)',borderRadius:'36px',display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{padding:'12px 24px 8px',display:'flex',justifyContent:'space-between'}}>
          <span style={{fontFamily:'DM Mono,monospace',fontSize:'0.72rem',color:'rgba(245,240,232,0.6)'}}>11:32</span>
          <span style={{fontSize:'0.65rem',color:'rgba(245,240,232,0.5)',letterSpacing:'2px'}}>▲ ● ●●●</span>
        </div>
        <div style={{padding:'28px 28px 16px',textAlign:'center',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'-40px',left:'50%',transform:'translateX(-50%)',width:'240px',height:'240px',borderRadius:'50%',background:'radial-gradient(circle,rgba(192,57,43,0.15) 0%,transparent 70%)'}} />
          <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.8rem',fontWeight:900,color:'var(--paper)',position:'relative',zIndex:1}}>Med<span style={{color:'var(--red-l)'}}>Bridge</span></div>
          <div style={{fontSize:'0.65rem',color:'rgba(245,240,232,0.35)',marginTop:'4px',fontFamily:'DM Mono,monospace',letterSpacing:'0.1em',textTransform:'uppercase',position:'relative',zIndex:1}}>Post-Discharge Care</div>
        </div>

        <div style={{padding:'4px 24px 36px',flex:1,overflowY:'auto'}}>
          <div style={{display:'flex',background:'rgba(255,255,255,0.07)',borderRadius:'12px',padding:'4px',marginBottom:'18px'}}>
            <div onClick={() => router.push('/login')} style={{flex:1,padding:'10px',textAlign:'center',borderRadius:'8px',cursor:'pointer',fontSize:'0.82rem',fontWeight:600,color:'rgba(245,240,232,0.35)'}}>Sign In</div>
            <div style={{flex:1,padding:'10px',textAlign:'center',borderRadius:'8px',background:'var(--paper)',color:'var(--ink)',fontSize:'0.82rem',fontWeight:600}}>Create Account</div>
          </div>

          {err && <div style={{background:'rgba(192,57,43,0.15)',border:'1px solid rgba(192,57,43,0.3)',borderRadius:'8px',padding:'10px 12px',fontSize:'0.78rem',color:'#e74c3c',marginBottom:'12px'}}>{err}</div>}
          {ok  && <div style={{background:'rgba(39,174,96,0.12)',border:'1px solid rgba(39,174,96,0.25)',borderRadius:'8px',padding:'10px 12px',fontSize:'0.78rem',color:'#27ae60',marginBottom:'12px'}}>{ok}</div>}

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'13px'}}>
            <div><label style={lbl}>First name</label><input style={inp} placeholder="Your name" value={f.fname} onChange={e=>set('fname',e.target.value)} /></div>
            <div><label style={lbl}>Age</label><input style={inp} type="number" placeholder="45" value={f.age} onChange={e=>set('age',e.target.value)} /></div>
          </div>
          {[{k:'email',t:'email',l:'Email',ph:'you@example.com'},{k:'password',t:'password',l:'Password (min 6 chars)',ph:'••••••••'},{k:'diagnosis',t:'text',l:'Condition / Diagnosis',ph:'e.g. Post-cardiac, Diabetic…'},{k:'doctorName',t:'text',l:"Doctor's name",ph:'Dr. Suresh Kumar'},{k:'doctorNum',t:'tel',l:"Doctor's WhatsApp number",ph:'+91 98765 43210'}].map(({k,t,l,ph}) => (
            <div key={k} style={{marginBottom:'13px'}}><label style={lbl}>{l}</label><input style={inp} type={t} placeholder={ph} value={(f as any)[k]} onChange={e=>set(k,e.target.value)} /></div>
          ))}

          <button onClick={handleSignup} disabled={loading} style={{width:'100%',padding:'15px',background:'var(--red)',color:'white',border:'none',borderRadius:'12px',fontFamily:'DM Sans,sans-serif',fontSize:'0.92rem',fontWeight:600,cursor:loading?'not-allowed':'pointer',opacity:loading?0.5:1,marginTop:'6px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
          <div style={{textAlign:'center',fontSize:'0.7rem',color:'rgba(245,240,232,0.22)',marginTop:'14px',lineHeight:1.5}}>Your data stays on this device only.</div>
        </div>
      </div>
    </div>
  )
}