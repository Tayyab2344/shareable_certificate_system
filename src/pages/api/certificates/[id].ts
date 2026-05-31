import type { NextApiRequest, NextApiResponse } from 'next'
import { getCertById, deleteCert } from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid certificate ID' })
  }
  
  if (req.method === 'GET') {
    try {
      const cert = await getCertById(id)
      if (!cert) {
        return res.status(404).json({ error: 'Certificate not found' })
      }
      return res.status(200).json(cert)
    } catch (error) {
      console.error(`API GET error for cert ID ${id}:`, error)
      return res.status(500).json({ error: 'Failed to fetch certificate.' })
    }
  }
  
  if (req.method === 'DELETE') {
    try {
      const cert = await getCertById(id)
      if (!cert) {
        return res.status(404).json({ error: 'Certificate not found' })
      }
      await deleteCert(id)
      return res.status(200).json({ message: 'Certificate revoked successfully' })
    } catch (error) {
      console.error(`API DELETE error for cert ID ${id}:`, error)
      return res.status(500).json({ error: 'Failed to revoke certificate.' })
    }
  }
  
  res.setHeader('Allow', ['GET', 'DELETE'])
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
}
