'use client'
import { useState, useEffect } from 'react'
import BottomNav from '@/components/BottomNav'
import ScreenHeader from '@/components/ScreenHeader'
import { getPrescriptions, deletePrescription } from '@/lib/api'
import { supabase } from '@/lib/supabase'

type Prescription = {
  id: string
  drug_name: string
  dosage: string | null
  frequency: string | null
  duration: string | null
  notes: string | null
  created_at: string
}

const GLS: React.CSSProperties = {
  width: '100%', padding: '10px 13px',
  border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px',
  fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem',
  outline: 'none', background: 'rgba(255,255,255,0.06)',
  color: 'rgba(255,255,255,0.9)',
}
const LBL: React.CSSProperties = {
  fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
  textTransform: 'uppercase', letterSpacing: '0.08em',
  color: 'rgba(255,255,255,0.35)', marginBottom: '6px', display: 'block',
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [drug, setDrug] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function load() {
    setLoading(true)
    getPrescriptions()
      .then(setPrescriptions)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deletePrescription(id)
      setPrescriptions(prev => prev.filter(p => p.id !== id))
    } catch { }
    setDeletingId(null)
  }

  async function handleAdd() {
    if (!drug.trim()) return
    setAdding(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('prescriptions').insert({
        user_id: user!.id,
        drug_name: drug.trim(),
        dosage: dosage.trim() || null,
        frequency: frequency.trim() || null,
        duration: duration.trim() || null,
        notes: notes.trim() || null,
      })
      setDrug(''); setDosage(''); setFrequency(''); setDuration(''); setNotes('')
      setShowForm(false)
      load()
    } catch { }
    setAdding(false)
  }

  const grouped = prescriptions.reduce<Record<string, Prescription[]>>((acc, p) => {
    const date = new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    if (!acc[date]) acc[date] = []
    acc[date].push(p)
    return acc
  }, {})

  return (
    <div style={{ width: '430px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Prescription History" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '96px' }}>

        {/* Inline Add Prescription button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #00C9A7, #00A88E)',
              color: '#fff', border: 'none', borderRadius: '14px',
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.92rem', fontWeight: 700,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 0 20px rgba(0,201,167,0.3)',
              margin: '16px 0 8px',
            }}
          >
            + Add Prescription
          </button>
        )}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <span style={{ width: '24px', height: '24px', border: '2px solid rgba(255,255,255,0.15)', borderTopColor: '#00C9A7', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            Failed to load prescriptions.
          </div>
        )}

        {!loading && !error && prescriptions.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '2.5rem' }}>💊</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>No prescriptions yet</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', maxWidth: '200px', lineHeight: 1.6 }}>
              Analyse a discharge summary to extract medications, or add one manually below.
            </div>
          </div>
        )}

        {!loading && Object.entries(grouped).map(([date, items]) => (
          <div key={date} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.3)', paddingLeft: '4px',
            }}>{date}</div>

            <div style={{
              background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden',
            }}>
              {items.map((p, i) => (
                <div key={p.id} style={{
                  padding: '14px 16px',
                  borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  borderLeft: '3px solid #00C9A7',
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  opacity: deletingId === p.id ? 0.4 : 1,
                  transition: 'opacity 0.2s',
                }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                      {p.drug_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {p.dosage && <span>{p.dosage}</span>}
                      {p.frequency && <span>· {p.frequency}</span>}
                      {p.duration && <span>· {p.duration}</span>}
                    </div>
                    {p.notes && (
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                        {p.notes}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    style={{
                      flexShrink: 0, width: '24px', height: '24px',
                      background: 'rgba(255,90,95,0.12)',
                      border: '1px solid rgba(255,90,95,0.25)',
                      borderRadius: '50%', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'rgba(255,90,95,0.8)', fontSize: '0.7rem', lineHeight: 1,
                      marginTop: '2px',
                    }}
                  >✕</button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Add Prescription Form */}
        {showForm && (
          <div className="fade-in" style={{
            background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '18px',
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.35)', marginBottom: '16px',
            }}>Add Prescription</div>

            <div style={{ marginBottom: '12px' }}>
              <label style={LBL}>Medicine Name *</label>
              <input style={GLS} placeholder="e.g. Metformin 500mg" value={drug} onChange={e => setDrug(e.target.value)} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={LBL}>Dosage</label>
              <input style={GLS} placeholder="e.g. 500mg" value={dosage} onChange={e => setDosage(e.target.value)} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={LBL}>Frequency</label>
              <input style={GLS} placeholder="e.g. Twice daily" value={frequency} onChange={e => setFrequency(e.target.value)} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={LBL}>Duration</label>
              <input style={GLS} placeholder="e.g. 30 days" value={duration} onChange={e => setDuration(e.target.value)} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={LBL}>Notes</label>
              <input style={GLS} placeholder="e.g. Take with food" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  flex: 1, padding: '12px',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '10px', cursor: 'pointer',
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', fontWeight: 600,
                }}
              >Cancel</button>
              <button
                onClick={handleAdd}
                disabled={adding || !drug.trim()}
                style={{
                  flex: 2, padding: '12px',
                  background: !drug.trim() ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#00C9A7,#00A88E)',
                  color: '#fff', border: 'none', borderRadius: '10px',
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', fontWeight: 700,
                  cursor: adding || !drug.trim() ? 'not-allowed' : 'pointer',
                  boxShadow: !drug.trim() ? 'none' : '0 0 16px rgba(0,201,167,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  opacity: !drug.trim() ? 0.5 : 1,
                }}
              >
                {adding
                  ? <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  : '+ Save Prescription'}
              </button>
            </div>
          </div>
        )}

      </div>

      <BottomNav />
    </div>
  )
}





