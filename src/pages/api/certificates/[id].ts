import type { NextApiRequest, NextApiResponse } from 'next'
import { getCertById, deleteCert } from '@/lib/db'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid certificate ID' })
  }
  
  if (req.method === 'GET') {
    const cert = getCertById(id)
    if (!cert) {
      return res.status(404).json({ error: 'Certificate not found' })
    }
    return res.status(200).json(cert)
  }
  
  if (req.method === 'DELETE') {
    const cert = getCertById(id)
    if (!cert) {
      return res.status(404).json({ error: 'Certificate not found' })
    }
    deleteCert(id)
    return res.status(200).json({ message: 'Certificate revoked successfully' })
  }
  
  res.setHeader('Allow', ['GET', 'DELETE'])
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
}
