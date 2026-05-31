import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import type { Certificate, CertTemplate } from '@/lib/db'
import CertificateView from '@/components/CertificateView'
import { format } from 'date-fns'
import {
  CrestModern,
  IconSearch,
  IconIssue,
  IconAll,
  IconAnalytics,
  IconCopy,
  IconDownload,
  IconPrint,
  IconDelete,
  IconBook,
  IconGrade,
  IconCalendar,
  IconGlobe,
  IconFileText,
  IconUser,
  IconMail,
  IconClose
} from '@/components/Icons'

const TABS = [
  { id: 0, label: 'Issue Certificate', icon: IconIssue },
  { id: 1, label: 'All Certificates', icon: IconAll },
  { id: 2, label: 'Analytics & Management', icon: IconAnalytics },
]

const TEMPLATE_OPTIONS: { id: CertTemplate; label: string; desc: string; accent: string }[] = [
  { id: 'classic', label: 'Classic Luxury', desc: 'Deep Navy & Ornate Gold Crest', accent: '#D4A843' },
  { id: 'modern', label: 'Modern Corporate', desc: 'Minimalist Slate & Tech Indigo', accent: '#3B82F6' },
  { id: 'elegant', label: 'Elegant Academic', desc: 'Ivory Parchment & Rosewood Sepia', accent: '#8B5E3C' },
  { id: 'tech', label: 'Developer / Cyber', desc: 'Dark Matrix Grid & Neon Terminal', accent: '#10B981' },
  { id: 'custom', label: 'Custom Upload', desc: 'Upload pre-designed PNG/JPG design', accent: '#EC4899' },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState(0)
  const [certs, setCerts] = useState<Certificate[]>([])
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false)
  const [batchCsv, setBatchCsv] = useState('')
  const [batchError, setBatchError] = useState('')

  // Single Form State
  const [form, setForm] = useState({
    recipientName: '',
    recipientEmail: '',
    courseName: '',
    description: '',
    issuerName: '',
    issuerTitle: '',
    orgName: '',
    issuedDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    template: 'modern' as CertTemplate,
    skills: '',
    grade: '',
    logoUrl: '',
    signatureUrl: '',
    primaryColor: '',
    certificateImageUrl: '',
  })

  // Load certificates from Server API on mount
  useEffect(() => {
    fetchCerts()
  }, [])

  async function fetchCerts() {
    setLoading(true)
    try {
      const res = await fetch('/api/certificates')
      if (res.ok) {
        const data = await res.json()
        setCerts(data)
      }
    } catch (e) {
      console.error('Failed to load certificates:', e)
      showToast('Could not sync certificates with server.')
    }
    setLoading(false)
  }

  const setField = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const [uploading, setUploading] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const reader = new FileReader()
    reader.onloadend = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: reader.result }),
        })
        if (res.ok) {
          const data = await res.json()
          setField('certificateImageUrl', data.url)
          showToast('Certificate layout template uploaded successfully!')
        } else {
          const err = await res.json()
          showToast(`Upload failed: ${err.error || 'Unknown error'}`)
        }
      } catch (error) {
        console.error(error)
        showToast('Failed to connect to upload serverless API.')
      }
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  // Compute Live Preview Cert
  const previewCert: Certificate = {
    id: 'CP-PREVIEW',
    recipientName: form.recipientName || 'Recipient Name',
    recipientEmail: form.recipientEmail,
    courseName: form.courseName || 'Course / Certification Title',
    description: form.description || 'For demonstrating exceptional mastery of standard program guidelines and completing all practical projects with verified excellence.',
    issuerName: form.issuerName || 'Authorized Signatory',
    issuerTitle: form.issuerTitle || 'Title / Organization',
    orgName: form.orgName || 'Academic Institution',
    issuedDate: form.issuedDate,
    expiryDate: form.expiryDate || undefined,
    template: form.template,
    skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
    grade: form.grade || undefined,
    createdAt: new Date().toISOString(),
    logoUrl: form.logoUrl || undefined,
    signatureUrl: form.signatureUrl || undefined,
    primaryColor: form.primaryColor || undefined,
    certificateImageUrl: form.certificateImageUrl || undefined,
  }

  // Handle single certificate issuance via server API
  async function handleIssue() {
    if (!form.recipientName.trim() || !form.courseName.trim() || !form.orgName.trim()) {
      showToast('Please fill in Recipient Name, Course Name, and Organization.')
      return
    }

    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        }),
      })

      if (res.ok) {
        const newCert = await res.json()
        showToast(`Certificate issued for ${newCert.recipientName}! ID: ${newCert.id}`)
        // Reset name and email, keep templates & details for subsequent issues
        setForm(f => ({ ...f, recipientName: '', recipientEmail: '' }))
        fetchCerts()
        setActiveTab(1) // Move to list
      } else {
        const err = await res.json()
        showToast(`Error: ${err.error || 'Failed to issue certificate'}`)
      }
    } catch (e) {
      console.error(e)
      showToast('API issue failed. Check network.')
    }
  }

  // Handle batch CSV issuance
  async function handleBatchIssue() {
    setBatchError('')
    if (!batchCsv.trim()) {
      setBatchError('Please paste some CSV data.')
      return
    }

    const lines = batchCsv.split('\n').map(l => l.trim()).filter(Boolean)
    if (lines.length < 2) {
      setBatchError('CSV must include a header row and at least one data row.')
      return
    }

    // Simple CSV parser
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const nameIndex = headers.indexOf('recipientname')
    const emailIndex = headers.indexOf('recipientemail')
    const courseIndex = headers.indexOf('coursename')
    const gradeIndex = headers.indexOf('grade')
    const skillsIndex = headers.indexOf('skills')

    if (nameIndex === -1 || courseIndex === -1) {
      setBatchError('CSV must contain at least "recipientName" and "courseName" columns.')
      return
    }

    const batchData = []
    for (let i = 1; i < lines.length; i++) {
      // Regex handling commas inside quotes
      const values = (lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(','))
        .map(v => v.replace(/^"|"$/g, '').trim())

      if (values.length < headers.length) continue // Skip incomplete rows

      const skillsVal = skillsIndex !== -1 && values[skillsIndex] 
        ? values[skillsIndex].split(';').map(s => s.trim()).filter(Boolean) 
        : (form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [])

      batchData.push({
        recipientName: values[nameIndex],
        recipientEmail: emailIndex !== -1 ? values[emailIndex] : '',
        courseName: values[courseIndex],
        description: form.description,
        issuerName: form.issuerName,
        issuerTitle: form.issuerTitle,
        orgName: form.orgName,
        issuedDate: form.issuedDate,
        expiryDate: form.expiryDate,
        template: form.template,
        grade: gradeIndex !== -1 ? values[gradeIndex] : (form.grade || ''),
        skills: skillsVal,
        logoUrl: form.logoUrl || undefined,
        signatureUrl: form.signatureUrl || undefined,
        primaryColor: form.primaryColor || undefined,
        certificateImageUrl: form.certificateImageUrl || undefined,
      })
    }

    if (batchData.length === 0) {
      setBatchError('No valid rows found to parse.')
      return
    }

    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchData),
      })

      if (res.ok) {
        const created = await res.json()
        showToast(`Successfully batch issued ${created.length} certificates!`)
        setIsBatchModalOpen(false)
        setBatchCsv('')
        fetchCerts()
        setActiveTab(1)
      } else {
        const err = await res.json()
        setBatchError(err.error || 'Server rejected batch data')
      }
    } catch (e) {
      console.error(e)
      setBatchError('Network error issuing batch data')
    }
  }

  // Handle revocation
  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast(`Certificate ${id} revoked.`)
        setDeleteConfirm(null)
        fetchCerts()
      } else {
        showToast('Failed to revoke certificate.')
      }
    } catch (e) {
      console.error(e)
      showToast('Network error on revoke.')
    }
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  function copyLink(id: string) {
    const url = `${window.location.origin}/verify/${id}`
    navigator.clipboard.writeText(url)
      .then(() => showToast('Verification link copied to clipboard!'))
      .catch(() => showToast('Failed to copy link.'))
  }

  // Export CSV Action
  function handleExportCsv() {
    if (certs.length === 0) {
      showToast('No certificates to export.')
      return
    }
    const headers = 'ID,Recipient Name,Recipient Email,Course Name,Issued Date,Grade,Skills,Template\n'
    const rows = certs.map(c => 
      `"${c.id}","${c.recipientName}","${c.recipientEmail}","${c.courseName}","${c.issuedDate}","${c.grade || ''}","${(c.skills || []).join(';')}","${c.template}"`
    ).join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `certifypro_issued_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
  }

  async function handleLogout() {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.ok) {
        window.location.href = '/login'
      } else {
        showToast('Logout failed.')
      }
    } catch (e) {
      console.error(e)
      showToast('Network error on logout.')
    }
  }

  const filtered = certs.filter(c =>
    !search || [c.recipientName, c.courseName, c.id, c.recipientEmail]
      .some(f => f.toLowerCase().includes(search.toLowerCase()))
  )

  const totalThisMonth = certs.filter(c => {
    const d = new Date(c.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const courses = [...new Set(certs.map(c => c.courseName))].length

  return (
    <>
      <Head>
        <title>CertifyPro — Verifiable Credentials Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans">
        
        {/* TOPBAR */}
        <header className="glass-panel border-b border-gray-800 sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CrestModern size={32} color="#3B82F6" className="animate-pulse" />
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight uppercase bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                CertifyPro
              </span>
              <span className="text-[10px] block text-gray-500 font-mono tracking-widest leading-none mt-0.5">VERIFIABLE CREDENTIALS</span>
            </div>
          </div>

          <nav className="flex gap-1 h-full items-center">
            {TABS.map(t => {
              const Icon = t.icon
              const isActive = activeTab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-5 h-12 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 border border-transparent'
                  }`}
                >
                  <Icon size={16} />
                  {t.label}
                </button>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/verify"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-700 transition-all"
            >
              <IconSearch size={14} />
              Verify Link
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-950/20 border border-red-900/30 hover:border-red-700 hover:bg-red-900/20 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 transition-all"
            >
              Logout
            </button>
          </div>
        </header>

        {/* CONTAINER */}
        <main className="max-w-7xl mx-auto w-full p-6 flex-1 flex flex-col gap-6">

          {/* STATS PANEL */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Credentials Issued', value: loading ? '...' : certs.length, icon: IconFileText, color: '#3B82F6', bg: 'rgba(59,130,246,0.06)' },
              { label: 'Issued This Month', value: loading ? '...' : totalThisMonth, icon: IconCalendar, color: '#10B981', bg: 'rgba(16,185,129,0.06)' },
              { label: 'Verified Courses/Programs', value: loading ? '...' : courses, icon: IconBook, color: '#8B5E3C', bg: 'rgba(139,94,60,0.06)' },
              { label: 'Revocation Rate', value: '0.0%', icon: IconGrade, color: '#EF4444', bg: 'rgba(239,68,68,0.06)' },
            ].map((s, idx) => {
              const Icon = s.icon
              return (
                <div key={idx} className="glass-card rounded-xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg, color: s.color }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white tracking-tight">{s.value}</div>
                    <div className="text-xs text-gray-400 mt-1 font-medium">{s.label}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* TAB 0: ISSUE CERTIFICATE */}
          {activeTab === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Input Form */}
              <div className="lg:col-span-6 flex flex-col gap-5">
                
                {/* Style / Template picker */}
                <div className="glass-card rounded-xl p-5">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">1. Choose Template Style</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {TEMPLATE_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setField('template', opt.id)
                          // Clear custom color if switching to default
                          setField('primaryColor', '')
                        }}
                        className={`flex flex-col text-left p-3 rounded-lg border transition-all duration-200 ${
                          form.template === opt.id
                            ? 'bg-blue-600/10 border-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                            : 'bg-gray-900/60 border-gray-800 hover:border-gray-700 hover:bg-gray-900/90'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs font-bold text-white">{opt.label}</span>
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.accent }} />
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipient Details */}
                <FormCard title="2. Recipient Information">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Recipient Full Name"
                      value={form.recipientName}
                      onChange={v => setField('recipientName', v)}
                      placeholder="e.g. Alexander Mercer"
                      icon={IconUser}
                    />
                    <FormField
                      label="Recipient Email"
                      value={form.recipientEmail}
                      onChange={v => setField('recipientEmail', v)}
                      placeholder="e.g. alex@mercer.com"
                      type="email"
                      icon={IconMail}
                    />
                  </div>
                </FormCard>

                {/* Course details */}
                <FormCard title="3. Certification Metadata">
                  <div className="flex flex-col gap-4">
                    <FormField
                      label="Issuing Organization Name"
                      value={form.orgName}
                      onChange={v => setField('orgName', v)}
                      placeholder="e.g. Stanford Computer Science"
                      icon={IconGlobe}
                    />
                    <FormField
                      label="Course or Program Title"
                      value={form.courseName}
                      onChange={v => setField('courseName', v)}
                      placeholder="e.g. Cryptographic Engineering & Protocols"
                      icon={IconBook}
                    />
                    <FormField
                      label="Detailed Description"
                      value={form.description}
                      onChange={v => setField('description', v)}
                      placeholder="Describe what the student accomplished to earn this credential..."
                      multiline
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Skills / Tags (Comma separated)"
                        value={form.skills}
                        onChange={v => setField('skills', v)}
                        placeholder="e.g. Rust, Cryptography, Blockchain"
                        icon={IconFileText}
                      />
                      <FormField
                        label="Final Grade / Distinction"
                        value={form.grade}
                        onChange={v => setField('grade', v)}
                        placeholder="e.g. Honors (Top 5%)"
                        icon={IconGrade}
                      />
                    </div>
                  </div>
                </FormCard>

                {/* Custom Branding or Custom Upload File Card */}
                {form.template === 'custom' ? (
                  <FormCard title="4. Upload Custom Certificate Design">
                    <div className="flex flex-col gap-4">
                      <div className="border-2 border-dashed border-gray-800 hover:border-blue-500/50 rounded-xl p-8 text-center bg-gray-950/40 transition-all relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={uploading}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                            <IconDownload size={18} className="transform rotate-180" />
                          </div>
                          {uploading ? (
                            <div>
                              <div className="text-xs font-bold text-white mb-1">Uploading Design to Cloudinary...</div>
                              <div className="text-[10px] text-gray-500 font-mono">Syncing asset with secure CDN</div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-xs font-bold text-gray-300 hover:text-white transition-colors mb-1">
                                Click or drag custom certificate design here
                              </div>
                              <div className="text-[10px] text-gray-500 font-mono">PNG, JPG or WEBP up to 10MB</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {form.certificateImageUrl && (
                        <div className="bg-gray-950/80 p-3 border border-gray-800 rounded-lg flex items-center gap-3">
                          <img
                            src={form.certificateImageUrl}
                            alt="Preview thumbnail"
                            className="w-16 h-12 object-contain bg-black border border-gray-800 rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-white truncate font-sans">Certificate Layout Saved</div>
                            <div className="text-[9px] text-gray-500 font-mono truncate">{form.certificateImageUrl}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setField('certificateImageUrl', '')}
                            className="text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      )}

                      {/* Date details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <FormField
                          label="Issue Date"
                          value={form.issuedDate}
                          onChange={v => setField('issuedDate', v)}
                          type="date"
                          icon={IconCalendar}
                        />
                        <FormField
                          label="Expiration Date"
                          value={form.expiryDate}
                          onChange={v => setField('expiryDate', v)}
                          type="date"
                          icon={IconCalendar}
                        />
                      </div>
                    </div>
                  </FormCard>
                ) : (
                  <FormCard title="4. Advanced Branding & Signatures (Optional)">
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Custom Logo Image URL"
                          value={form.logoUrl}
                          onChange={v => setField('logoUrl', v)}
                          placeholder="https://domain.com/logo.png"
                        />
                        <FormField
                          label="Custom Signature Image URL"
                          value={form.signatureUrl}
                          onChange={v => setField('signatureUrl', v)}
                          placeholder="https://domain.com/sig.png"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Issuer / Signatory Name"
                          value={form.issuerName}
                          onChange={v => setField('issuerName', v)}
                          placeholder="Dr. Sarah Jenkins"
                        />
                        <FormField
                          label="Issuer Title"
                          value={form.issuerTitle}
                          onChange={v => setField('issuerTitle', v)}
                          placeholder="Dean of Computing Science"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Issue Date"
                          value={form.issuedDate}
                          onChange={v => setField('issuedDate', v)}
                          type="date"
                          icon={IconCalendar}
                        />
                        <FormField
                          label="Expiration Date"
                          value={form.expiryDate}
                          onChange={v => setField('expiryDate', v)}
                          type="date"
                          icon={IconCalendar}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Custom Theme Primary Color</label>
                        <div className="flex gap-3 items-center">
                          <input
                            type="color"
                            value={form.primaryColor || TEMPLATE_OPTIONS.find(o => o.id === form.template)?.accent || '#3B82F6'}
                            onChange={e => setField('primaryColor', e.target.value)}
                            className="w-10 h-10 border border-gray-800 rounded bg-transparent cursor-pointer"
                          />
                          <span className="text-xs text-gray-400 font-mono">
                            {form.primaryColor || 'Using template defaults'}
                          </span>
                          {form.primaryColor && (
                            <button
                              onClick={() => setField('primaryColor', '')}
                              className="text-[10px] font-bold text-red-400 hover:text-red-300 ml-auto"
                            >
                              Reset to Default
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </FormCard>
                )}

                {/* Operations buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleIssue}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(59,130,246,0.15)] flex items-center justify-center gap-2"
                  >
                    <IconIssue size={18} />
                    Issue & Sync Certificate
                  </button>
                  <button
                    onClick={() => setIsBatchModalOpen(true)}
                    className="px-6 py-4 bg-gray-900 border border-gray-800 hover:bg-gray-800 hover:border-gray-700 text-gray-300 hover:text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <IconFileText size={18} />
                    Batch CSV Issue
                  </button>
                </div>
              </div>

              {/* Right Column: Sticky Live Preview */}
              <div className="lg:col-span-6 sticky top-24">
                <div className="glass-panel border border-gray-800 rounded-xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Real-time Layout Preview</h2>
                    <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 border border-blue-500/20 rounded">
                      WYSIWYG
                    </span>
                  </div>
                  <CertificateView cert={previewCert} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: ALL CERTIFICATES */}
          {activeTab === 1 && (
            <div className="glass-card rounded-xl overflow-hidden">
              
              {/* Search & Filter Bar */}
              <div className="p-5 border-b border-gray-800 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-900/40">
                <div className="relative w-full md:max-w-md">
                  <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by student name, course title, email, or ID..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900/90 border border-gray-800 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500/80 transition-all font-sans"
                  />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <span className="text-xs text-gray-400 font-medium self-center">{filtered.length} of {certs.length} certificates found</span>
                  <button
                    onClick={handleExportCsv}
                    className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-all"
                  >
                    <IconDownload size={14} />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Table list */}
              {loading ? (
                <div className="p-20 text-center text-gray-500 font-medium">Synchronizing credentials database...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-900/60 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800">
                        <th className="py-4 px-6">Recipient Name</th>
                        <th className="py-4 px-6">Course & Program</th>
                        <th className="py-4 px-6">Issued Date</th>
                        <th className="py-4 px-6">Unique ID</th>
                        <th className="py-4 px-6">Template</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {filtered.map(cert => (
                        <tr key={cert.id} className="hover:bg-gray-800/10 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-white text-sm">{cert.recipientName}</div>
                            <div className="text-xs text-gray-500 mt-0.5 font-mono">{cert.recipientEmail || 'No email registered'}</div>
                          </td>
                          <td className="py-4 px-6 max-w-xs">
                            <div className="font-semibold text-gray-200 text-sm truncate">{cert.courseName}</div>
                            {cert.grade && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-mono font-bold rounded uppercase">
                                {cert.grade}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-400">
                            {(() => {
                              try {
                                return format(new Date(cert.issuedDate + 'T12:00:00'), 'MMM dd, yyyy')
                              } catch {
                                return cert.issuedDate
                              }
                            })()}
                          </td>
                          <td className="py-4 px-6">
                            <code className="text-xs font-mono bg-gray-900 text-gray-300 px-2 py-1 border border-gray-800 rounded">
                              {cert.id}
                            </code>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                              style={{
                                color: TEMPLATE_OPTIONS.find(o => o.id === cert.template)?.accent || '#ccc',
                                borderColor: `${TEMPLATE_OPTIONS.find(o => o.id === cert.template)?.accent}40` || '#ccc',
                                backgroundColor: `${TEMPLATE_OPTIONS.find(o => o.id === cert.template)?.accent}08` || '#ccc',
                              }}
                            >
                              {cert.template.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex gap-2 justify-end items-center">
                              <Link
                                href={`/verify/${cert.id}`}
                                target="_blank"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-all"
                              >
                                View page
                              </Link>
                              <button
                                onClick={() => copyLink(cert.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg text-xs font-semibold transition-all"
                              >
                                <IconCopy size={13} />
                                Copy link
                              </button>
                              
                              {deleteConfirm === cert.id ? (
                                <div className="flex gap-1.5 items-center">
                                  <button
                                    onClick={() => handleDelete(cert.id)}
                                    className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-2 py-1.5 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded-lg text-xs transition-all"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirm(cert.id)}
                                  className="p-2 bg-gray-950 border border-gray-900 text-gray-600 hover:text-red-400 hover:border-red-500/30 rounded-lg transition-all"
                                  title="Revoke certificate"
                                >
                                  <IconDelete size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-20 text-center text-gray-500 text-sm font-medium">
                            No certificates matched your search queries.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ANALYTICS & MANAGEMENT */}
          {activeTab === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Distribution by Template style */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-sm font-bold text-gray-200 mb-5">Issued Template Distribution</h3>
                <div className="flex flex-col gap-4">
                  {TEMPLATE_OPTIONS.map(tmpl => {
                    const count = certs.filter(c => c.template === tmpl.id).length
                    const pct = certs.length ? Math.round((count / certs.length) * 100) : 0
                    return (
                      <div key={tmpl.id}>
                        <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                          <span className="text-gray-300">{tmpl.label}</span>
                          <span className="text-gray-400 font-mono">{count} certs ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800/40">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: tmpl.accent,
                              boxShadow: `0 0 10px ${tmpl.accent}50`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Popular courses */}
              <div className="glass-card rounded-xl p-6 flex flex-col">
                <h3 className="text-sm font-bold text-gray-200 mb-4">Top Programs & Certifications</h3>
                <div className="flex-1 flex flex-col divide-y divide-gray-800">
                  {(() => {
                    const counts = certs.reduce((acc, c) => {
                      acc.set(c.courseName, (acc.get(c.courseName) || 0) + 1)
                      return acc
                    }, new Map<string, number>())
                    
                    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
                    
                    if (sorted.length === 0) {
                      return (
                        <div className="flex-1 flex items-center justify-center text-gray-500 text-xs">
                          No active credential programs.
                        </div>
                      )
                    }
                    
                    return sorted.map(([name, count]) => (
                      <div key={name} className="flex justify-between items-center py-3">
                        <span className="text-xs text-gray-300 font-medium truncate max-w-[280px]">{name}</span>
                        <span className="text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                          {count} issued
                        </span>
                      </div>
                    ))
                  })()}
                </div>
              </div>

              {/* Admin Guide */}
              <div className="glass-card rounded-xl p-6 md:col-span-2">
                <h3 className="text-sm font-bold text-gray-200 mb-2">Cryptographic Verification & Sharing</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">
                  CertifyPro generates verifiable links for each issued credential. A unique, cryptographic-like hash and ID are mapped to each recipient, matching standard practices of academic organizations (like Coursera and edX). Links are shared securely via our server database, enabling instant public authentication, printing, and automated adding to LinkedIn profile sections.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { step: '1', title: 'Issue Credential', desc: 'Single issue or batch CSV upload on our secure administration dashboard.', icon: IconIssue },
                    { step: '2', title: 'Share URL', desc: 'Students receive direct links mapping to their verifiable record.', icon: IconCopy },
                    { step: '3', title: 'LinkedIn Integration', desc: 'Recipients display and verify certification on their official profiles.', icon: CrestModern },
                    { step: '4', title: 'Export / Audit', desc: 'Securely audit records by exporting structural data to CSV anytime.', icon: IconDownload },
                  ].map(step => {
                    const Icon = step.icon
                    return (
                      <div key={step.step} className="p-4 bg-gray-900/60 border border-gray-800 rounded-lg flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-3">
                          <Icon size={18} />
                        </div>
                        <div className="text-xs font-bold text-white mb-1.5">{step.title}</div>
                        <div className="text-[10px] text-gray-500 leading-normal">{step.desc}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
        
        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 bg-blue-600 border border-blue-500 text-white px-5 py-3 rounded-xl shadow-2xl z-50 text-xs font-semibold animate-[slideUp_0.2s_ease] flex items-center gap-2">
            <CrestModern size={16} color="white" />
            {toast}
          </div>
        )}
      </div>

      {/* BATCH CSV MODAL */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel border border-gray-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-[slideUp_0.15s_ease]">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
              <h3 className="text-sm font-bold text-white">Batch Issue Certificates via CSV</h3>
              <button onClick={() => setIsBatchModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <IconClose size={20} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <p className="text-xs text-gray-400 leading-relaxed">
                Paste your CSV content below. The first row must contain column headers. 
                Required columns: <code className="text-blue-400 font-mono bg-blue-500/5 px-1.5 py-0.5 border border-blue-500/10 rounded">recipientName</code> and <code className="text-blue-400 font-mono bg-blue-500/5 px-1.5 py-0.5 border border-blue-500/10 rounded">courseName</code>.
                Optional columns: <code className="text-gray-300 font-mono">recipientEmail</code>, <code className="text-gray-300 font-mono">grade</code>, <code className="text-gray-300 font-mono">skills</code> (semicolon separated).
              </p>
              
              <div className="bg-gray-950 p-3 rounded-lg border border-gray-800 text-[10px] text-gray-500 font-mono">
                <span className="text-gray-400 block mb-1">Example Template Format:</span>
                recipientName,recipientEmail,courseName,grade,skills<br/>
                Jane Doe,jane@domain.com,AI Foundations,A+,"Python;PyTorch"<br/>
                Richard Roe,richard@domain.com,Cloud Architecture,Pass,"AWS;Kubernetes"
              </div>

              <textarea
                value={batchCsv}
                onChange={e => setBatchCsv(e.target.value)}
                placeholder='recipientName,recipientEmail,courseName,grade,skills&#10;John Smith,john@smith.com,UX Design,High Pass,"Figma;Wireframing"'
                rows={8}
                className="w-full p-4 bg-gray-950 border border-gray-800 rounded-lg text-xs font-mono text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />

              {batchError && (
                <div className="p-3 bg-red-900/15 border border-red-500/20 text-red-400 rounded-lg text-xs font-medium">
                  {batchError}
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-800 flex justify-end gap-3 bg-gray-900/40">
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="px-4 py-2 bg-gray-950 border border-gray-900 text-gray-400 hover:text-white rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleBatchIssue}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold"
              >
                Issue Batch
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}

function FormCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{title}</h2>
      {children}
    </div>
  )
}

interface FormFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  multiline?: boolean
  icon?: React.ComponentType<any>
}

function FormField({ label, value, onChange, placeholder, type = 'text', multiline = false, icon: Icon }: FormFieldProps) {
  return (
    <div className="w-full">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">{label}</label>
      <div className="relative">
        {Icon && !multiline && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
            <Icon size={14} />
          </div>
        )}
        {multiline ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-800 rounded-lg text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500/80 transition-all font-sans resize-none"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full py-3 bg-gray-900/60 border border-gray-800 rounded-lg text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500/80 transition-all font-sans ${
              Icon ? 'pl-9 pr-4' : 'px-4'
            }`}
          />
        )}
      </div>
    </div>
  )
}
