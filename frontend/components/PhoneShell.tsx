'use client'
import { useEffect, useState } from 'react'
export default function PhoneShell({ children }: { children: React.ReactNode }) {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => { const d = new Date(); setTime(d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0')) }
    tick(); const id = setInterval(tick, 30000); return () => clearInterval(id)
  }, [])
  return (
    <div style={{width:'390px',minHeight:'780px',background:'var(--ink)',borderRadius:'48px',padding:'14px',boxShadow:'0 0 0 1px rgba(255,255,255,0.08),0 60px 120px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.1)',flexShrink:0,display:'flex',flexDirection:'column'}}>
      <div style={{width:'120px',height:'30px',background:'var(--ink)',borderRadius:'0 0 20px 20px',margin:'0 auto'}} />
      <div style={{flex:1,background:'var(--screen-bg)',borderRadius:'36px',overflow:'hidden',display:'flex',flexDirection:'column',position:'relative'}}>
        <div style={{padding:'12px 24px 8px',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
          <span style={{fontFamily:'DM Mono,monospace',fontSize:'0.72rem',fontWeight:500,color:'var(--ink)'}}>{time}</span>
          <span style={{fontSize:'0.65rem',color:'var(--ink)',opacity:0.6,letterSpacing:'2px'}}>▲ ● ●●●</span>
        </div>
        {children}
      </div>
    </div>
  )
}