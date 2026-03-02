'use client'
import { useState } from 'react'
import PhoneShell from '@/components/PhoneShell'
import BottomNav from '@/components/BottomNav'
import ScreenHeader from '@/components/ScreenHeader'
import { analyseDischarge } from '@/lib/api'

const DEMO = 'Pt: Male, 62y. Admitted with NSTEMI. Echo: EF 45%, mild LV dysfunction. Discharged on dual antiplatelet therapy (Aspirin 75mg + Clopidogrel 75mg), ACE inhibitor (Ramipril 2.5mg OD), beta-blocker (Metoprolol 25mg BD), Metformin 500mg BD. Dietary restrictions: low sodium, low fat. F/U cardiology OPD 2 weeks. Avoid strenuous activity for 4 weeks.'
const SECTIONS = [
  {key:'what_happened',label:'What Happened',      color:'#e74c3c',bg:'rgba(192,57,43,0.08)'},
  {key:'home_care',    label:'What To Do At Home', color:'#27ae60',bg:'rgba(39,174,96,0.08)'},
  {key:'warning_signs',label:'Warning Signs',      color:'#d4a017',bg:'rgba(183,134,13,0.08)'},
  {key:'follow_up',   label:'Follow-Up Needed',    color:'#3498db',bg:'rgba(41,128,185,0.08)'},
]

export default function DischargePage() {
  const [text, setText] = useState('')
  const [lang, setLang] = useState('en')
  const [hasFile, setHasFile] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function analyse() {
    if (!text.trim()) return
    setLoading(true); setResult(null)
    try { setResult(await analyseDischarge(text, lang)) } catch {}
    setLoading(false)
  }

  return (
    <PhoneShell>
      <ScreenHeader title="Discharge Explainer" sub="Feature 01 — OCR + LLM" />
      <div style={{flex:1,overflowY:'auto',padding:'16px 20px',display:'flex',flexDirection:'column',gap:'12px'}}>

        {/* Upload zone */}
        <div onClick={()=>{setHasFile(true);setText(DEMO)}} style={{border:`2px ${hasFile?'solid':'dashed'} ${hasFile?'var(--teal)':'var(--border)'}`,borderRadius:'16px',padding:'32px 20px',textAlign:'center',cursor:'pointer',background:hasFile?'rgba(26,107,90,0.03)':'white'}}>
          <div style={{fontSize:'2.2rem',marginBottom:'10px'}}>{hasFile?'✅':'📄'}</div>
          <div style={{fontFamily:'Playfair Display,serif',fontSize:'0.95rem',fontWeight:700,marginBottom:'6px',color:'var(--ink)'}}>{hasFile?'discharge_summary.pdf':'Upload Discharge Summary'}</div>
          <div style={{fontSize:'0.72rem',color:'var(--muted)'}}>{hasFile?'Apollo Hospitals · Feb 24 2026':'Tap to load a demo document'}</div>
        </div>

        {/* Language selector */}
        <div style={{display:'flex',gap:'8px'}}>
          {[['en','English'],['ta','தமிழ்'],['hi','हिंदी']].map(([code,label])=>(
            <button key={code} onClick={()=>setLang(code)} style={{flex:1,padding:'10px',border:`1px solid ${lang===code?'var(--ink)':'var(--border)'}`,borderRadius:'10px',background:lang===code?'var(--ink)':'white',color:lang===code?'var(--paper)':'var(--ink)',fontSize:'0.75rem',fontWeight:500,cursor:'pointer'}}>{label}</button>
          ))}
        </div>

        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Or paste discharge summary text here…" style={{width:'100%',padding:'12px 14px',border:'1px solid var(--border)',borderRadius:'12px',fontFamily:'DM Sans,sans-serif',fontSize:'0.8rem',height:'80px',resize:'none',outline:'none',background:'white',lineHeight:1.5,color:'var(--ink)'}} />

        <button onClick={analyse} disabled={loading||!text.trim()} style={{width:'100%',padding:'16px',background:loading?'var(--muted)':'var(--ink)',color:'var(--paper)',border:'none',borderRadius:'12px',fontFamily:'DM Sans,sans-serif',fontSize:'0.88rem',fontWeight:600,cursor:loading?'not-allowed':'pointer',opacity:!text.trim()?0.5:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
          {loading ? <><span style={{width:'18px',height:'18px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.8s linear infinite',display:'inline-block'}} /></> : 'Analyse Summary'}
        </button>

        {result && (
          <div style={{background:'white',borderRadius:'16px',overflow:'hidden',boxShadow:'0 2px 12px rgba(14,17,23,0.08)',border:'1px solid var(--border)'}}>
            {SECTIONS.map((s,i)=>(
              <div key={s.key} style={{padding:'14px 16px',borderBottom:i<3?'1px solid rgba(14,17,23,0.08)':'none'}}>
                <span style={{display:'inline-block',fontFamily:'DM Mono,monospace',fontSize:'0.58rem',textTransform:'uppercase',letterSpacing:'0.08em',padding:'3px 8px',borderRadius:'4px',marginBottom:'8px',background:s.bg,color:s.color}}>{s.label}</span>
                <div style={{fontSize:'0.82rem',lineHeight:1.65,color:'var(--ink)'}}>{result[s.key]}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </PhoneShell>
  )
}