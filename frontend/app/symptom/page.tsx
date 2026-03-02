'use client'
import { useEffect, useState } from 'react'
import PhoneShell from '@/components/PhoneShell'
import BottomNav from '@/components/BottomNav'
import ScreenHeader from '@/components/ScreenHeader'
import { checkSymptom, notifyDoctor, getDrugs } from '@/lib/api'
import { getProfile } from '@/lib/auth'

const SUGGESTIONS = ['Feeling dizzy when I stand up','Chest tightness and mild pain','Swollen ankles and feet','Short of breath climbing stairs','Nausea after taking medications','Fatigue and weakness all day']
const CLS: Record<string,{bg:string,border:string,badgeBg:string,badgeColor:string}> = {
  safe:    {bg:'rgba(39,174,96,0.08)',   border:'rgba(39,174,96,0.25)',   badgeBg:'rgba(39,174,96,0.15)',   badgeColor:'#27ae60'},
  monitor: {bg:'rgba(183,134,13,0.08)',  border:'rgba(183,134,13,0.25)',  badgeBg:'rgba(183,134,13,0.15)',  badgeColor:'#b7860d'},
  urgent:  {bg:'rgba(192,57,43,0.08)',   border:'rgba(192,57,43,0.35)',   badgeBg:'rgba(192,57,43,0.15)',   badgeColor:'#e74c3c'},
}

export default function SymptomPage() {
  const [symptom, setSymptom] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [drugs, setDrugs] = useState<string[]>([])
  const [modal, setModal] = useState(false)
  const [sent, setSent] = useState(false)
  const [sentTime, setSentTime] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    getProfile().then(setProfile).catch(()=>{})
    getDrugs().then(d=>setDrugs(d.map((x:any)=>x.drug_name))).catch(()=>{})
  }, [])

  async function classify() {
    if (!symptom.trim()) return
    setLoading(true); setResult(null); setSent(false)
    const ctx = profile ? `Patient: ${profile.fname}, age ${profile.age||'unknown'}. Condition: ${profile.diagnosis||'unknown'}.` : ''
    try { setResult(await checkSymptom(symptom, ctx)) } catch {}
    setLoading(false)
  }

  async function sendNotify() {
    if (!profile?.doctor_whatsapp) return
    setSending(true)
    try {
      await notifyDoctor({symptom_text:symptom,classification:result.classification,patient_name:profile.fname,patient_age:String(profile.age),patient_diagnosis:profile.diagnosis,doctor_name:profile.doctor_name,doctor_whatsapp:profile.doctor_whatsapp,medications:drugs})
      const now = new Date()
      setSentTime('Today '+now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0'))
      setSent(true); setModal(false)
    } catch {}
    setSending(false)
  }

  const cls = result?.classification?.toLowerCase()||'safe'
  const cs = CLS[cls]||CLS.safe
  const docLast = profile?.doctor_name?.split(' ').pop()||'doctor'
  const now = new Date()
  const t = now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0')

  return (
    <PhoneShell>
      <ScreenHeader title="Symptom Checker" sub="Feature 03 — Not a diagnosis tool" />
      <div style={{flex:1,overflowY:'auto',padding:'16px 20px',position:'relative'}}>

        <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--muted)',marginBottom:'8px'}}>Describe your symptom</div>
        <textarea value={symptom} onChange={e=>setSymptom(e.target.value)} placeholder="e.g. I've been feeling dizzy when I stand up…" style={{width:'100%',padding:'14px 16px',border:'1px solid var(--border)',borderRadius:'12px',fontFamily:'DM Sans,sans-serif',fontSize:'0.88rem',outline:'none',background:'white',resize:'none',height:'90px',lineHeight:1.5,color:'var(--ink)',marginBottom:'12px'}} />

        <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--muted)',marginBottom:'8px'}}>Common post-discharge symptoms</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'16px'}}>
          {SUGGESTIONS.map(s=>(
            <span key={s} onClick={()=>setSymptom(s)} style={{padding:'6px 12px',border:'1px solid var(--border)',borderRadius:'20px',fontSize:'0.72rem',color:'var(--muted)',cursor:'pointer',background:'white'}}>
              {s.split(' ').slice(0,2).join(' ')}…
            </span>
          ))}
        </div>

        <button onClick={classify} disabled={loading||!symptom.trim()} style={{width:'100%',padding:'16px',background:loading?'var(--muted)':'var(--purple)',color:'white',border:'none',borderRadius:'12px',fontFamily:'DM Sans,sans-serif',fontSize:'0.88rem',fontWeight:600,cursor:loading?'not-allowed':'pointer',opacity:!symptom.trim()?0.5:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'4px'}}>
          {loading ? <><span style={{width:'18px',height:'18px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.8s linear infinite',display:'inline-block'}} /></> : 'Check Symptom'}
        </button>

        {result && !sent && (
          <div className="fade-in" style={{borderRadius:'16px',padding:'18px',marginTop:'16px',border:`2px solid ${cs.border}`,background:cs.bg}}>
            <span style={{fontFamily:'DM Mono,monospace',fontSize:'0.65rem',letterSpacing:'0.1em',textTransform:'uppercase',padding:'5px 12px',borderRadius:'20px',fontWeight:500,marginBottom:'10px',display:'inline-block',background:cs.badgeBg,color:cs.badgeColor}}>
              {cls==='safe'?'✅ Safe':cls==='monitor'?'⚠️ Monitor':'🚨 Urgent'}
            </span>
            <div style={{fontSize:'0.82rem',lineHeight:1.65,color:'var(--ink)',marginBottom:'12px'}}>{result.explanation} {result.action}</div>
            <div style={{fontSize:'0.72rem',color:'var(--muted)',lineHeight:1.5,paddingTop:'10px',borderTop:'1px solid var(--border)'}}>⚠️ This is not a medical diagnosis. Always contact your doctor if you are unsure or your condition worsens.</div>
            {profile?.doctor_whatsapp && (
              <button onClick={()=>setModal(true)} style={{width:'100%',padding:'14px',marginTop:'12px',borderRadius:'10px',fontFamily:'DM Sans,sans-serif',fontSize:'0.82rem',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',transition:'all 0.2s',border:cls==='urgent'?'none':'1px solid var(--border)',background:cls==='urgent'?'var(--red)':'white',color:cls==='urgent'?'white':'var(--ink)'}}>
                {cls==='urgent'?`📲 Alert Dr. ${docLast} now`:`📲 Notify Dr. ${docLast}`}
              </button>
            )}
          </div>
        )}

        {sent && (
          <div className="fade-in" style={{background:'rgba(37,211,102,0.08)',border:'1px solid rgba(37,211,102,0.25)',borderRadius:'12px',padding:'14px',marginTop:'12px',fontSize:'0.78rem',color:'var(--ink)',lineHeight:1.6}}>
            ✅ <strong>Message sent to {profile?.doctor_name||'your doctor'}</strong> via WhatsApp.<br/>Your doctor has been notified and will follow up when convenient.
            <div style={{marginTop:'8px',fontFamily:'DM Mono,monospace',fontSize:'0.6rem',color:'var(--muted)'}}>Logged · {sentTime}</div>
          </div>
        )}

        {/* WhatsApp modal — positioned inside screen */}
        {modal && (
          <div style={{position:'absolute',inset:0,background:'rgba(14,17,23,0.6)',display:'flex',alignItems:'flex-end',zIndex:50,backdropFilter:'blur(4px)'}} onClick={e=>e.target===e.currentTarget&&setModal(false)}>
            <div style={{width:'100%',background:'var(--paper)',borderRadius:'24px 24px 0 0',padding:'20px 20px 32px',animation:'slideUp 0.3s ease'}}>
              <div style={{width:'36px',height:'4px',background:'var(--border)',borderRadius:'2px',margin:'0 auto 20px'}} />
              <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.1rem',fontWeight:700,marginBottom:'6px',color:'var(--ink)'}}>Notify your doctor?</div>
              <div style={{fontSize:'0.78rem',color:'var(--muted)',marginBottom:'16px',lineHeight:1.5}}>This is the exact message that will be sent to their WhatsApp:</div>
              <div style={{background:'#dcf8c6',borderRadius:'12px 12px 0 12px',padding:'12px 14px',fontSize:'0.76rem',lineHeight:1.6,color:'#1a1a1a',marginBottom:'4px',boxShadow:'0 1px 4px rgba(0,0,0,0.1)'}}
                dangerouslySetInnerHTML={{__html:`<strong>Hi Dr. ${docLast},</strong><br><br>Your patient <strong>${profile?.fname} (${profile?.age}, ${profile?.diagnosis})</strong> has reported a symptom via MedBridge.<br><br><strong>Symptom:</strong> "${symptom}"<br><strong>Classification:</strong> ${result?.classification}${drugs.length?`<br><strong>Medications:</strong> ${drugs.join(', ')}`:''}  <br><br>Please follow up when convenient.<br><br>— MedBridge`}} />
              <div style={{fontSize:'0.6rem',color:'var(--muted)',textAlign:'right',marginBottom:'14px',fontFamily:'DM Mono,monospace'}}>MedBridge · {t}</div>
              <button onClick={sendNotify} disabled={sending} style={{width:'100%',padding:'14px',background:'#25D366',color:'white',border:'none',borderRadius:'10px',fontSize:'0.88rem',fontWeight:600,cursor:sending?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'8px',opacity:sending?0.7:1}}>
                {sending?'Sending…':'📲 Send via WhatsApp'}
              </button>
              <button onClick={()=>setModal(false)} style={{width:'100%',padding:'12px',background:'white',color:'var(--muted)',border:'1px solid var(--border)',borderRadius:'10px',fontSize:'0.82rem',cursor:'pointer'}}>Not now</button>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </PhoneShell>
  )
}