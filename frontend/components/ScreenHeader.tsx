'use client'
import { useRouter } from 'next/navigation'
export default function ScreenHeader({title,sub,back='/home'}:{title:string;sub?:string;back?:string}) {
  const router = useRouter()
  return (
    <div style={{padding:'16px 20px 14px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:'12px',background:'var(--paper)',flexShrink:0}}>
      <button onClick={() => router.push(back)} style={{width:'32px',height:'32px',borderRadius:'50%',background:'var(--cream)',border:'none',cursor:'pointer',fontSize:'0.85rem',display:'flex',alignItems:'center',justifyContent:'center'}}>←</button>
      <div>
        <div style={{fontFamily:'Playfair Display,serif',fontSize:'1rem',fontWeight:700,color:'var(--ink)'}}>{title}</div>
        {sub && <div style={{fontSize:'0.65rem',color:'var(--muted)',marginTop:'1px'}}>{sub}</div>}
      </div>
    </div>
  )
}