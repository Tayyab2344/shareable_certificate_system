import { Pool } from 'pg'

export type CertTemplate = 'classic' | 'modern' | 'elegant' | 'tech' | 'custom'

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
  certificateImageUrl?: string
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

let isInitialized = false

async function initDb(): Promise<void> {
  if (isInitialized) return
  
  try {
    // 1. Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id VARCHAR(50) PRIMARY KEY,
        recipient_name VARCHAR(255) NOT NULL,
        recipient_email VARCHAR(255),
        course_name VARCHAR(255) NOT NULL,
        description TEXT,
        issuer_name VARCHAR(255),
        issuer_title VARCHAR(255),
        org_name VARCHAR(255) NOT NULL,
        issued_date VARCHAR(50) NOT NULL,
        expiry_date VARCHAR(50),
        template VARCHAR(50) NOT NULL,
        skills TEXT[],
        grade VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        logo_url TEXT,
        signature_url TEXT,
        primary_color VARCHAR(50),
        certificate_image_url TEXT
      );
    `)
    // Ensure column exists for already existing tables
    await pool.query(`
      ALTER TABLE certificates ADD COLUMN IF NOT EXISTS certificate_image_url TEXT;
    `)
    isInitialized = true
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
}

function mapRowToCert(row: any): Certificate {
  return {
    id: row.id,
    recipientName: row.recipient_name,
    recipientEmail: row.recipient_email || '',
    courseName: row.course_name,
    description: row.description || '',
    issuerName: row.issuer_name || '',
    issuerTitle: row.issuer_title || '',
    orgName: row.org_name,
    issuedDate: row.issued_date,
    expiryDate: row.expiry_date || undefined,
    template: row.template as CertTemplate,
    skills: row.skills || [],
    grade: row.grade || undefined,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    logoUrl: row.logo_url || undefined,
    signatureUrl: row.signature_url || undefined,
    primaryColor: row.primary_color || undefined,
    certificateImageUrl: row.certificate_image_url || undefined,
  }
}

export async function getAllCerts(): Promise<Certificate[]> {
  await initDb()
  try {
    const res = await pool.query('SELECT * FROM certificates ORDER BY created_at DESC')
    return res.rows.map(mapRowToCert)
  } catch (error) {
    console.error('Error fetching all certificates:', error)
    return []
  }
}

export async function saveCert(cert: Certificate): Promise<void> {
  await initDb()
  try {
    const query = `
      INSERT INTO certificates (
        id, recipient_name, recipient_email, course_name, description, 
        issuer_name, issuer_title, org_name, issued_date, expiry_date, 
        template, skills, grade, logo_url, signature_url, primary_color,
        certificate_image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      ON CONFLICT (id) DO UPDATE SET
        recipient_name = EXCLUDED.recipient_name,
        recipient_email = EXCLUDED.recipient_email,
        course_name = EXCLUDED.course_name,
        description = EXCLUDED.description,
        issuer_name = EXCLUDED.issuer_name,
        issuer_title = EXCLUDED.issuer_title,
        org_name = EXCLUDED.org_name,
        issued_date = EXCLUDED.issued_date,
        expiry_date = EXCLUDED.expiry_date,
        template = EXCLUDED.template,
        skills = EXCLUDED.skills,
        grade = EXCLUDED.grade,
        logo_url = EXCLUDED.logo_url,
        signature_url = EXCLUDED.signature_url,
        primary_color = EXCLUDED.primary_color,
        certificate_image_url = EXCLUDED.certificate_image_url
    `
    await pool.query(query, [
      cert.id,
      cert.recipientName,
      cert.recipientEmail || null,
      cert.courseName,
      cert.description,
      cert.issuerName || null,
      cert.issuerTitle || null,
      cert.orgName,
      cert.issuedDate,
      cert.expiryDate || null,
      cert.template,
      cert.skills || [],
      cert.grade || null,
      cert.logoUrl || null,
      cert.signatureUrl || null,
      cert.primaryColor || null,
      cert.certificateImageUrl || null,
    ])
  } catch (error) {
    console.error(`Error saving certificate ${cert.id}:`, error)
    throw error
  }
}

export async function getCertById(id: string): Promise<Certificate | null> {
  await initDb()
  try {
    const res = await pool.query('SELECT * FROM certificates WHERE UPPER(id) = $1', [id.toUpperCase()])
    if (res.rows.length === 0) return null
    return mapRowToCert(res.rows[0])
  } catch (error) {
    console.error(`Error fetching certificate by ID ${id}:`, error)
    return null
  }
}

export async function deleteCert(id: string): Promise<void> {
  await initDb()
  try {
    await pool.query('DELETE FROM certificates WHERE UPPER(id) = $1', [id.toUpperCase()])
  } catch (error) {
    console.error(`Error deleting certificate ${id}:`, error)
    throw error
  }
}

export function generateId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'CP-'
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}
