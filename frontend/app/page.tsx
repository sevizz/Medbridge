'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Root() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        router.replace(data.session ? '/home' : '/login')
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return <div>Loading...</div>

  return null
}