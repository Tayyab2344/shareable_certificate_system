export type CertTemplate = 'classic' | 'modern' | 'elegant'

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
}

const STORAGE_KEY = 'certifypro_certificates'

export function getAllCerts(): Certificate[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : getDefaultCerts()
  } catch {
    return getDefaultCerts()
  }
}

export function saveCert(cert: Certificate): void {
  const all = getAllCerts()
  all.unshift(cert)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function getCertById(id: string): Certificate | null {
  const all = getAllCerts()
  return all.find(c => c.id === id) || null
}

export function deleteCert(id: string): void {
  const all = getAllCerts().filter(c => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function generateId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'CP-'
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

function getDefaultCerts(): Certificate[] {
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
  return defaults
}
