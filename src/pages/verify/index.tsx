import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { CrestModern, IconSearch } from '@/components/Icons'

export default function VerifyLanding() {
  const router = useRouter()
  const [input, setInput] = useState('')

  function handleVerify() {
    const trimmed = input.trim()
    if (!trimmed) return
    // Extract ID if full URL pasted
    const match = trimmed.match(/CP-[A-Z0-9]{8}/i)
    const id = match ? match[0].toUpperCase() : trimmed.toUpperCase()
    router.push(`/verify/${id}`)
  }

  return (
    <>
      <Head>
        <title>Verify Certificate authenticity | CertifyPro</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans">
        
        {/* HEADER */}
        <header className="glass-panel border-b border-gray-800 px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <CrestModern size={30} color="#3B82F6" />
            <div>
              <span className="font-extrabold text-base text-white tracking-tight uppercase bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                CertifyPro
              </span>
              <span className="text-[9px] block text-gray-500 font-mono tracking-widest leading-none mt-0.5">VERIFIABLE CREDENTIALS</span>
            </div>
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            &larr; Back to Dashboard
          </Link>
        </header>

        {/* MAIN SEARCH WRAPPER */}
        <main className="flex-1 flex items-center justify-center p-6 relative">
          
          {/* Subtle background glow */}
          <div className="absolute w-[450px] h-[450px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
          
          <div className="w-full max-w-lg relative z-10">

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <CrestModern size={40} color="#3B82F6" />
              </div>
              <h1 className="font-display text-3xl font-bold text-white tracking-tight mb-2">
                Verify Credential Authenticity
              </h1>
              <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                Confirm the credentials issued by academies and universities. Enter the certificate ID or paste the complete verification URL below.
              </p>
            </div>

            {/* Input Card */}
            <div className="glass-card rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2.5">
                Certificate Verification ID or URL
              </label>
              
              <div className="relative mb-4">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <IconSearch size={18} />
                </div>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleVerify()}
                  placeholder="e.g. CP-DEMO0001 or verification URL"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500/80 transition-all font-mono"
                />
              </div>

              <button
                onClick={handleVerify}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(59,130,246,0.15)] flex items-center justify-center gap-2"
              >
                Validate Credential &rarr;
              </button>
            </div>

            {/* Demos */}
            <div className="mt-8 text-center text-xs text-gray-500">
              Try verifying a sample credential:
              <div className="flex gap-2 justify-center mt-2">
                {['CP-DEMO0001', 'CP-DEMO0002', 'CP-DEMO0003'].map(demo => (
                  <button
                    key={demo}
                    onClick={() => router.push(`/verify/${demo}`)}
                    className="px-3 py-1 bg-gray-900 border border-gray-800/80 rounded-full font-mono text-[11px] text-blue-400 hover:text-blue-300 hover:bg-gray-800 transition-all"
                  >
                    {demo}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </main>

        <footer className="py-6 text-center text-[10px] text-gray-600 font-mono tracking-wider border-t border-gray-900/60 glass-panel">
          SECURE BLOCKCHAIN & DB LEDGER VERIFICATION &copy; {new Date().getFullYear()} CERTIFYPRO
        </footer>
      </div>
    </>
  )
}
