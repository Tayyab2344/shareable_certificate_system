import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllCerts, saveCert, generateId, Certificate } from '@/lib/db'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const certs = getAllCerts()
    return res.status(200).json(certs)
  }
  
  if (req.method === 'POST') {
    const data = req.body
    
    // Check if batch issuance (array of certificates)
    if (Array.isArray(data)) {
      const createdCerts: Certificate[] = []
      
      for (const item of data) {
        if (!item.recipientName || !item.courseName || !item.orgName) {
          return res.status(400).json({ error: 'Missing required fields in batch item' })
        }
        
        const newCert: Certificate = {
          id: item.id || generateId(),
          recipientName: item.recipientName,
          recipientEmail: item.recipientEmail || '',
          courseName: item.courseName,
          description: item.description || 'Successfully completed all course requirements.',
          issuerName: item.issuerName || '',
          issuerTitle: item.issuerTitle || '',
          orgName: item.orgName,
          issuedDate: item.issuedDate || new Date().toISOString().split('T')[0],
          expiryDate: item.expiryDate || undefined,
          template: item.template || 'classic',
          skills: Array.isArray(item.skills) ? item.skills : [],
          grade: item.grade || '',
          createdAt: new Date().toISOString(),
          logoUrl: item.logoUrl || undefined,
          signatureUrl: item.signatureUrl || undefined,
          primaryColor: item.primaryColor || undefined,
        }
        
        saveCert(newCert)
        createdCerts.push(newCert)
      }
      
      return res.status(201).json(createdCerts)
    } else {
      // Single certificate issuance
      const {
        recipientName,
        recipientEmail,
        courseName,
        description,
        issuerName,
        issuerTitle,
        orgName,
        issuedDate,
        expiryDate,
        template,
        skills,
        grade,
        logoUrl,
        signatureUrl,
        primaryColor,
      } = data
      
      if (!recipientName || !courseName || !orgName) {
        return res.status(400).json({ error: 'Recipient Name, Course Name, and Organization Name are required.' })
      }
      
      const newCert: Certificate = {
        id: generateId(),
        recipientName,
        recipientEmail: recipientEmail || '',
        courseName,
        description: description || 'Successfully completed all course requirements.',
        issuerName: issuerName || '',
        issuerTitle: issuerTitle || '',
        orgName,
        issuedDate: issuedDate || new Date().toISOString().split('T')[0],
        expiryDate: expiryDate || undefined,
        template: template || 'classic',
        skills: Array.isArray(skills) ? skills : [],
        grade: grade || '',
        createdAt: new Date().toISOString(),
        logoUrl: logoUrl || undefined,
        signatureUrl: signatureUrl || undefined,
        primaryColor: primaryColor || undefined,
      }
      
      saveCert(newCert)
      return res.status(201).json(newCert)
    }
  }
  
  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
}
