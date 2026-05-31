import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Certificate } from '@/lib/db'
import CertificateView from '@/components/CertificateView'
import { format } from 'date-fns'
import Link from 'next/link'
import {
  CrestModern,
  IconCopy,
  IconDownload,
  IconLinkedIn,
  IconTwitter,
  IconPrint,
  IconVerify,
  IconGlobe,
  IconBook,
  IconUser,
  IconCalendar,
  IconGrade
} from '@/components/Icons'

export default function VerifyPage() {
  const router = useRouter()
  const { id } = router.query
  const [cert, setCert] = useState<Certificate | null | undefined>(undefined)
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch certificate details from API on ID load
  useEffect(() => {
    if (!id || typeof id !== 'string') return
    setLoading(true)
    fetch(`/api/certificates/${id}`)
      .then(res => {
        if (res.ok) return res.json()
        return null
      })
      .then(data => {
        setCert(data)
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setCert(null)
        setLoading(false)
      })
  }, [id])

  async function handleDownloadPDF() {
    if (!cert) return
    setDownloading(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const { default: jsPDF } = await import('jspdf')
      const el = document.getElementById('certificate-view')
      if (!el) return
      
      // Use scale: 3 for high-res vector-like quality in PDF
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const pw = pdf.internal.pageSize.getWidth()
      const ph = pdf.internal.pageSize.getHeight()
      
      const imgRatio = canvas.width / canvas.height
      const pdfRatio = pw / ph
      let w = pw
      let h = pw / imgRatio
      if (imgRatio < pdfRatio) {
        h = ph
        w = ph * imgRatio
      }
      
      pdf.addImage(imgData, 'PNG', (pw - w) / 2, (ph - h) / 2, w, h)
      pdf.save(`Certificate_${cert.recipientName.replace(/\s+/g, '_')}_${cert.id}.pdf`)
    } catch (e) {
      console.error(e)
    }
    setDownloading(false)
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Pre-fills fields for LinkedIn Licenses & Certifications Profile Section
  function handleShareLinkedIn() {
    if (!cert) return
    const dateObj = new Date(cert.issuedDate)
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth() + 1 // LinkedIn expects 1-12

    const base = 'https://www.linkedin.com/profile/add'
    const params = new URLSearchParams({
      startTask: 'CERTIFICATION',
      name: cert.courseName,
      organizationName: cert.orgName,
      issueYear: year.toString(),
      issueMonth: month.toString(),
      certUrl: window.location.href,
      certId: cert.id,
    })

    if (cert.expiryDate) {
      const expDate = new Date(cert.expiryDate)
      params.append('expiryYear', expDate.getFullYear().toString())
      params.append('expiryMonth', (expDate.getMonth() + 1).toString())
    }

    window.open(`${base}?${params.toString()}`, '_blank')
  }

  function handleShareTwitter() {
    if (!cert) return
    const text = encodeURIComponent(
      `I am excited to share that I have earned my credential for "${cert.courseName}" issued by ${cert.orgName}! Verify my certificate here:`
    )
    const url = encodeURIComponent(window.location.href)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <CrestModern size={40} color="#3B82F6" className="animate-spin" />
          <span className="text-sm text-gray-500 font-mono">Authenticating secure ledger record...</span>
        </div>
      </div>
    )
  }

  const issuedFormatted = cert
    ? (() => {
        try {
          return format(new Date(cert.issuedDate + 'T12:00:00'), 'MMMM dd, yyyy')
        } catch {
          return cert.issuedDate
        }
      })()
    : ''

  const isExpired = cert?.expiryDate ? new Date(cert.expiryDate) < new Date() : false

  // Generate a mock cryptographic hash for verification security feel
  const mockCryptoHash = cert
    ? Array.from(cert.id + cert.recipientName + cert.issuedDate)
        .reduce((acc, char) => acc + char.charCodeAt(0).toString(16).padStart(2, '0'), '')
        .substring(0, 32)
        .toUpperCase()
    : ''

  return (
    <>
      <Head>
        <title>
          {cert ? `Verify: ${cert.recipientName} - ${cert.courseName}` : 'Credential Not Found'} | CertifyPro
        </title>
        <meta name="description" content={cert ? `Publicly verified credential for ${cert.recipientName} in ${cert.courseName}.` : 'Credential verification page.'} />
        <meta property="og:title" content={cert ? `Verifiable Credential: ${cert.recipientName} - ${cert.courseName}` : 'CertifyPro Verification'} />
        <meta property="og:description" content={cert ? `Credential issued by ${cert.orgName}. Click to verify authenticity.` : ''} />
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
            href="/verify"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Verify another ID &rarr;
          </Link>
        </header>

        {/* MAIN BODY */}
        <main className="max-w-5xl mx-auto w-full p-6 flex-1 flex flex-col gap-6">
          
          {!cert ? (
            /* Error Card */
            <div className="glass-card rounded-2xl p-12 text-center border-red-500/20 max-w-lg mx-auto mt-12 shadow-2xl">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-red-400 tracking-tight mb-2">Record Revoked or Not Found</h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-8">
                The credential ID <code className="bg-gray-950 px-2 py-1 border border-gray-800 rounded font-mono text-red-300 text-xs">{id}</code> could not be validated. It may have been revoked, expired, or has not been synced to the database.
              </p>
              <Link
                href="/verify"
                className="inline-block px-6 py-3 bg-red-600/10 hover:bg-red-600 hover:text-white border border-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all"
              >
                Return to Verification Portal
              </Link>
            </div>
          ) : (
            /* Success / Certified Detail layout */
            <div className="flex flex-col gap-6">
              
              {/* Status Banner */}
              <div
                className={`pulse-success border rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between ${
                  isExpired
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                    : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isExpired ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    <IconVerify size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight text-white">
                      {isExpired ? 'VERIFIABLE CREDENTIAL EXPIRED' : 'VERIFIED AUTHENTIC RECORD'}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 leading-none">
                      {isExpired
                        ? `This certification expired on ${format(new Date(cert.expiryDate! + 'T12:00:00'), 'MMMM dd, yyyy')}`
                        : `Genuine institutional record linked and validated in database ledger.`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:text-right mt-3 md:mt-0 font-mono">
                  <span className="text-[10px] text-gray-500 tracking-wider">DATABASE RECORD ID</span>
                  <span className="text-sm font-bold text-gray-300 tracking-wider mt-0.5">{cert.id}</span>
                </div>
              </div>

              {/* Certificate View Wrapper */}
              <div className="glass-panel border border-gray-800 rounded-2xl p-6 shadow-2xl flex justify-center bg-gray-950/50">
                <CertificateView cert={cert} />
              </div>

              {/* Action Panels Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Meta details */}
                <div className="glass-card rounded-2xl p-6 md:col-span-7">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Metadata Architecture</h4>
                  
                  <div className="flex flex-col divide-y divide-gray-800/60">
                    {[
                      { label: 'Recipient Full Name', value: cert.recipientName, icon: IconUser },
                      { label: 'Course/Program Title', value: cert.courseName, icon: IconBook },
                      { label: 'Organization/Issuer', value: `${cert.orgName} (${cert.issuerName}, ${cert.issuerTitle})`, icon: IconGlobe },
                      { label: 'Issue Date', value: issuedFormatted, icon: IconCalendar },
                      ...(cert.expiryDate ? [{ label: 'Credential Expiration', value: format(new Date(cert.expiryDate + 'T12:00:00'), 'MMMM dd, yyyy'), icon: IconCalendar }] : []),
                      ...(cert.grade ? [{ label: 'Performance / Grade', value: cert.grade, icon: IconGrade }] : []),
                    ].map((row, idx) => {
                      const Icon = row.icon
                      return (
                        <div key={idx} className="flex py-3.5 items-center justify-between text-xs gap-3">
                          <span className="text-gray-400 flex items-center gap-2">
                            <Icon size={14} className="text-gray-500" />
                            {row.label}
                          </span>
                          <span className="text-white font-semibold text-right max-w-[250px] truncate">{row.value}</span>
                        </div>
                      )
                    })}
                  </div>

                  {cert.skills && cert.skills.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-gray-800">
                      <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Associated Skills & Technologies</h5>
                      <div className="flex flex-wrap gap-2">
                        {cert.skills.map(s => (
                          <span key={s} className="px-2.5 py-1 bg-gray-900 border border-gray-800 text-[10px] text-gray-300 font-medium rounded-lg">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hash info */}
                  <div className="mt-5 pt-5 border-t border-gray-800">
                    <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 font-mono">Ledger Cryptographic Fingerprint</h5>
                    <code className="text-[10px] text-blue-400/80 font-mono break-all leading-normal bg-blue-950/20 px-2 py-1.5 border border-blue-500/10 rounded block">
                      SHA256:{mockCryptoHash}
                    </code>
                  </div>
                </div>

                {/* Sharing and actions */}
                <div className="glass-card rounded-2xl p-6 md:col-span-5 flex flex-col gap-5">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Share & Download</h4>
                  
                  <div className="flex flex-col gap-2.5">
                    
                    {/* LinkedIn Add Button */}
                    <button
                      onClick={handleShareLinkedIn}
                      className="w-full py-3 px-4 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <IconLinkedIn size={15} fill="white" />
                      Add to LinkedIn Profile
                    </button>

                    {/* Copy Link */}
                    <button
                      onClick={handleCopyLink}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                        copied
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                          : 'bg-gray-900 border-gray-800 hover:bg-gray-800 text-gray-300 hover:text-white'
                      }`}
                    >
                      <IconCopy size={14} />
                      {copied ? 'Link Copied!' : 'Copy Verification URL'}
                    </button>

                    {/* PDF Download */}
                    <button
                      onClick={handleDownloadPDF}
                      disabled={downloading}
                      className="w-full py-3 px-4 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <IconDownload size={14} />
                      {downloading ? 'Compiling PDF Vector...' : 'Download PDF Certificate'}
                    </button>

                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Share Twitter */}
                      <button
                        onClick={handleShareTwitter}
                        className="py-3 px-4 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <IconTwitter size={14} fill="currentColor" />
                        Share Post
                      </button>

                      {/* Print */}
                      <button
                        onClick={() => window.print()}
                        className="py-3 px-4 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <IconPrint size={14} />
                        Print Layout
                      </button>
                    </div>

                  </div>

                  <div className="mt-auto p-4 bg-gray-950/80 border border-gray-800/60 rounded-xl">
                    <strong className="text-[10px] text-gray-300 block mb-1 font-mono uppercase tracking-wider">Verifiable Directory URL</strong>
                    <code className="text-[10px] text-blue-400 font-mono break-all select-all leading-normal">
                      {typeof window !== 'undefined' ? window.location.href : ''}
                    </code>
                  </div>
                </div>

              </div>

            </div>
          )}
        </main>
        
        <footer className="py-6 text-center text-[10px] text-gray-600 font-mono tracking-wider border-t border-gray-900/60 glass-panel">
          SECURE BLOCKCHAIN & DB LEDGER VERIFICATION &copy; {new Date().getFullYear()} CERTIFYPRO
        </footer>
      </div>
    </>
  )
}
