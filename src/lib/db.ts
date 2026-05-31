import fs from 'fs'
import path from 'path'

export type CertTemplate = 'classic' | 'modern' | 'elegant' | 'tech'

export interface Certificate {
  id: string
  recipientName: string
  recipientEmail: string
  courseName: string
  description: string
  issuerName: string
  issuerTitle: string
  orgName: string
  issuedDate: string
  expiryDate?: string
  template: CertTemplate
  skills?: string[]
  grade?: string
  createdAt: string
  logoUrl?: string
  signatureUrl?: string
  primaryColor?: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'certificates.json')

function initDb(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  
  if (!fs.existsSync(DB_FILE)) {
    const defaults: Certificate[] = [
      {
        id: 'CP-DEMO0001',
        recipientName: 'Fatima Al-Hassan',
        recipientEmail: 'fatima@example.com',
        courseName: 'Advanced Data Science & Machine Learning',
        description: 'Successfully completed 120 hours of intensive training covering Python, statistical modeling, neural networks, and real-world ML deployment.',
        issuerName: 'Dr. Omar Siddiqui',
        issuerTitle: 'Director of Training',
        orgName: 'TechLearn Institute',
        issuedDate: '2026-05-01',
        template: 'classic',
        skills: ['Python', 'TensorFlow', 'Data Analysis'],
        grade: 'Distinction',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'CP-DEMO0002',
        recipientName: 'Usman Tariq',
        recipientEmail: 'usman@example.com',
        courseName: 'Project Management Professional',
        description: 'Completed comprehensive PMP training covering Agile, Scrum, risk management, and stakeholder communication.',
        issuerName: 'Sarah Mitchell',
        issuerTitle: 'Head of Programs',
        orgName: 'TechLearn Institute',
        issuedDate: '2026-05-15',
        template: 'modern',
        skills: ['Agile', 'Scrum', 'Risk Management'],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'CP-DEMO0003',
        recipientName: 'Zara Ahmed',
        recipientEmail: 'zara@example.com',
        courseName: 'UI/UX Design Fundamentals',
        description: 'Mastered user research, wireframing, prototyping with Figma, and usability testing methodologies.',
        issuerName: 'Dr. Omar Siddiqui',
        issuerTitle: 'Director of Training',
        orgName: 'TechLearn Institute',
        issuedDate: '2026-05-20',
        template: 'elegant',
        skills: ['Figma', 'User Research', 'Prototyping'],
        grade: 'Merit',
        createdAt: new Date().toISOString(),
      },
    ]
    fs.writeFileSync(DB_FILE, JSON.stringify(defaults, null, 2), 'utf-8')
  }
}

export function getAllCerts(): Certificate[] {
  initDb()
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch (error) {
    console.error('Failed to read certificates db:', error)
    return []
  }
}

export function saveCert(cert: Certificate): void {
  initDb()
  const all = getAllCerts()
  
  // Prevent duplicate IDs
  const index = all.findIndex(c => c.id === cert.id)
  if (index !== -1) {
    all[index] = cert
  } else {
    all.unshift(cert)
  }
  
  fs.writeFileSync(DB_FILE, JSON.stringify(all, null, 2), 'utf-8')
}

export function getCertById(id: string): Certificate | null {
  initDb()
  const all = getAllCerts()
  return all.find(c => c.id.toUpperCase() === id.toUpperCase()) || null
}

export function deleteCert(id: string): void {
  initDb()
  const all = getAllCerts().filter(c => c.id.toUpperCase() !== id.toUpperCase())
  fs.writeFileSync(DB_FILE, JSON.stringify(all, null, 2), 'utf-8')
}

export function generateId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'CP-'
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}
