import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { CrestModern, IconUser, IconMail } from '@/components/Icons'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    
    if (!username.trim() || !password.trim()) {
      setError('Please fill in both fields.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        // Redirect to dashboard index
        router.push('/')
      } else {
        const data = await res.json()
        setError(data.error || 'Authentication failed. Please check credentials.')
      }
    } catch (err) {
      console.error(err)
      setError('Failed to connect to authentication server.')
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Administrative Login | CertifyPro</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans">
        
        <main className="flex-1 flex items-center justify-center p-6 relative">
          {/* Neon glow effect */}
          <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[100px] pointer-events-none" />

          <div className="w-full max-w-md relative z-10">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                <CrestModern size={34} color="#3B82F6" />
              </div>
              <h1 className="font-display text-2xl font-bold text-white tracking-tight uppercase">
                CertifyPro Portal
              </h1>
              <p className="text-xs text-gray-500 mt-1 font-mono tracking-widest">ADMINISTRATOR AUTHENTICATION</p>
            </div>

            {/* Login Glass Card */}
            <form onSubmit={handleLogin} className="glass-panel border border-gray-800 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col gap-5">
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Username</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <IconUser size={14} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/60 border border-gray-800 rounded-xl text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500/80 transition-all font-sans"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter security password"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/60 border border-gray-800 rounded-xl text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500/80 transition-all font-mono"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-900/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(59,130,246,0.15)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>
          </div>
        </main>

        <footer className="py-6 text-center text-[10px] text-gray-600 font-mono tracking-wider border-t border-gray-900/60 glass-panel">
          SECURE ADMINISTRATIVE AUTHORIZATION &copy; {new Date().getFullYear()} CERTIFYPRO
        </footer>
      </div>
    </>
  )
}
