'use client'
import { useEffect, useState } from 'react'
import PhoneShell from '@/components/PhoneShell'
import BottomNav from '@/components/BottomNav'
import ScreenHeader from '@/components/ScreenHeader'
import { lookupDrug, getDrugs, saveDrug } from '@/lib/api'

export default function DrugsPage() {
  const [drugs, setDrugs] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [selected, setSelected] = useState<string|null>(null)
  const [detail, setDetail] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { getDrugs().then(d=>setDrugs(d.map((x:any)=>x.drug_name))).catch(()=>{}) }, [])

  async function addDrug() {
    const v = input.trim(); if (!v) return
    if (!drugs.includes(v)) { await saveDrug(v).catch(()=>{}); setDrugs(p=>[...p,v]) }
    setInput(''); lookup(v)
  }

  async function lookup(name: string) {
    setSelected(name); setDetail(null); setLoading(true)
    try { setDetail(await lookupDrug(name)) } catch {}
    setLoading(false)
  }

  return (
    <PhoneShell>
      <ScreenHeader title="Drug Info Lookup" sub="Feature 02 — RAG + OpenFDA" />
      <div style={{flex:1,overflowY:'auto',padding:'16px 20px'}}>

        <div style={{display:'flex',gap:'8px',marginBottom:'16px'}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addDrug()} placeholder="Add a drug (e.g. Ramipril)…" style={{flex:1,padding:'12px 14px',border:'1px solid var(--border)',borderRadius:'10px',fontFamily:'DM Sans,sans-serif',fontSize:'0.82rem',outline:'none',background:'white',color:'var(--ink)'}} />
          <button onClick={addDrug} style={{padding:'12px 16px',background:'var(--teal)',color:'white',border:'none',borderRadius:'10px',fontSize:'0.8rem',fontWeight:600,cursor:'pointer'}}>+ Add</button>
        </div>

        <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--muted)',marginBottom:'10px'}}>Your Prescription</div>

        {drugs.length===0 && <div style={{fontSize:'0.78rem',color:'var(--muted)',padding:'8px 0 16px'}}>No drugs added yet — type one above and press + Add.</div>}

        <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginBottom:'20px'}}>
          {drugs.map(d=>(
            <div key={d} onClick={()=>lookup(d)} style={{padding:'8px 14px',borderRadius:'20px',fontSize:'0.75rem',fontFamily:'DM Mono,monospace',cursor:'pointer',fontWeight:500,border:`1px solid ${selected===d?'var(--teal)':'var(--border)'}`,background:selected===d?'var(--teal)':'white',color:selected===d?'white':'var(--ink)',transition:'all 0.2s'}}>{d}</div>
          ))}
        </div>

        {(loading||detail) && (
          <div style={{background:'white',borderRadius:'16px',padding:'18px',boxShadow:'0 2px 12px rgba(14,17,23,0.08)',border:'1px solid var(--border)'}}>
            {loading ? (
              <div style={{display:'flex',justifyContent:'center',padding:'20px'}}><div style={{width:'20px',height:'20px',border:'2px solid rgba(14,17,23,0.2)',borderTopColor:'var(--ink)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} /></div>
            ) : detail && <>
              <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.2rem',fontWeight:700,marginBottom:'2px',color:'var(--ink)'}}>{selected?.split(' ')[0]}</div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.62rem',color:'var(--muted)',marginBottom:'16px'}}>{detail.generic_name}</div>
              {[['What for',detail.what_for],['How to take',detail.how_to_take],['Side effects',detail.side_effects],['Avoid',detail.avoid]].map(([lbl,val])=>(
                <div key={lbl} style={{display:'flex',gap:'10px',marginBottom:'12px'}}>
                  <div style={{fontFamily:'DM Mono,monospace',fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'0.06em',color:'var(--muted)',width:'70px',flexShrink:0,paddingTop:'2px'}}>{lbl}</div>
                  <div style={{fontSize:'0.8rem',color:'var(--ink)',lineHeight:1.55,flex:1}}>{val}</div>
                </div>
              ))}
              <div style={{display:'inline-flex',alignItems:'center',gap:'5px',background:'rgba(26,107,90,0.08)',border:'1px solid rgba(26,107,90,0.2)',padding:'4px 10px',borderRadius:'20px',fontFamily:'DM Mono,monospace',fontSize:'0.58rem',color:'var(--teal)',marginTop:'8px'}}>✓ Sourced from OpenFDA via RAG</div>
            </>}
          </div>
        )}
      </div>
      <BottomNav />
    </PhoneShell>
  )
}