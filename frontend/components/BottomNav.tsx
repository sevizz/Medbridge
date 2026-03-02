'use client'
import { usePathname, useRouter } from 'next/navigation'
const NAV = [
  {icon:'🏠',label:'Home',path:'/home'},
  {icon:'📋',label:'Discharge',path:'/discharge'},
  {icon:'🩺',label:'Symptoms',path:'/symptom'},
  {icon:'🔔',label:'Reminders',path:'/reminders'},
  {icon:'👤',label:'Profile',path:'/profile'},
]
export default function BottomNav() {
  const pathname = usePathname(); const router = useRouter()
  return (
    <div style={{padding:'12px 8px 16px',display:'flex',justifyContent:'space-around',background:'var(--paper)',borderTop:'1px solid var(--border)',flexShrink:0,zIndex:10}}>
      {NAV.map(item => {
        const active = pathname === item.path
        return (
          <div key={item.path} onClick={() => router.push(item.path)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',cursor:'pointer',padding:'6px 12px',borderRadius:'12px',flex:1,background:active?'var(--ink)':'transparent',transition:'background 0.2s'}}>
            <span style={{fontSize:'1.1rem'}}>{item.icon}</span>
            <span style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase',color:active?'var(--paper)':'var(--muted)'}}>{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}