import type { NextApiRequest, NextApiResponse } from 'next'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// Configure Next.js body parser to allow base64 image strings up to 10MB
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  try {
    const { file } = req.body

    if (!file) {
      return res.status(400).json({ error: 'Missing file payload. Please provide a base64 image string.' })
    }

    // Upload base64 image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: 'certifypro_certificates',
      resource_type: 'auto',
    })

    return res.status(200).json({
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      format: uploadResponse.format,
      bytes: uploadResponse.bytes,
    })
  } catch (error: any) {
    console.error('Cloudinary upload error:', error)
    return res.status(500).json({ error: error.message || 'Failed to upload asset to Cloudinary.' })
  }
}
