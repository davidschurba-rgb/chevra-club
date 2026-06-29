'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    setSent(true)
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
          <p className="text-2xl mb-2">📧</p>
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Reset link sent</h2>
          <p className="text-sm text-blue-700">Check your email for a password reset link.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reset your password</h1>
      <form onSubmit={handleReset} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
        <p className="text-sm text-center"><Link href="/login" className="text-indigo-600 hover:underline">Back to login</Link></p>
      </form>
    </div>
  )
}
