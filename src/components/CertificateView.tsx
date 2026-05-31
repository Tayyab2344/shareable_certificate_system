import React from 'react'
import { Certificate } from '@/lib/db'
import { format } from 'date-fns'
import { CrestClassic, CrestModern, CrestElegant, CrestTech } from '@/components/Icons'

interface Props {
  cert: Certificate
  forPrint?: boolean
}

const TEMPLATES = {
  classic: {
    bg: 'linear-gradient(135deg, #09152a 0%, #112552 50%, #09152a 100%)',
    border: '#D4A843',
    accent: '#D4A843',
    titleColor: '#D4A843',
    textColor: '#F3F4F6',
    subColor: 'rgba(243,244,246,0.7)',
    sealBg: 'rgba(212,168,67,0.1)',
    crestComponent: CrestClassic,
    pattern: 'radial-gradient(circle at 10% 90%, rgba(212,168,67,0.06) 0%, transparent 60%), radial-gradient(circle at 90% 10%, rgba(212,168,67,0.06) 0%, transparent 60%)',
    frameStyle: { border: '2px solid #D4A843', borderRadius: '4px' },
  },
  modern: {
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    border: '#3B82F6',
    accent: '#3B82F6',
    titleColor: '#F8FAFC',
    textColor: '#E2E8F0',
    subColor: '#94A3B8',
    sealBg: 'rgba(59,130,246,0.1)',
    crestComponent: CrestModern,
    pattern: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)',
    patternSize: '24px 24px',
    frameStyle: { border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px' },
  },
  elegant: {
    bg: 'linear-gradient(135deg, #faf6f0 0%, #f4eae0 100%)',
    border: '#8B5E3C',
    accent: '#8B5E3C',
    titleColor: '#4A2E1B',
    textColor: '#2D1E13',
    subColor: '#7D5C45',
    sealBg: 'rgba(139,94,60,0.06)',
    crestComponent: CrestElegant,
    pattern: 'radial-gradient(circle at 50% 50%, rgba(139,94,60,0.03) 0%, transparent 70%)',
    frameStyle: { border: '1.5px solid #8B5E3C', borderRadius: '6px' },
  },
  tech: {
    bg: 'linear-gradient(135deg, #090d16 0%, #0d1527 100%)',
    border: '#10B981',
    accent: '#10B981',
    titleColor: '#10B981',
    textColor: '#ECFDF5',
    subColor: '#6EE7B7',
    sealBg: 'rgba(16,185,129,0.08)',
    crestComponent: CrestTech,
    pattern: 'linear-gradient(rgba(16,185,129,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.02) 1px, transparent 1px)',
    patternSize: '16px 16px',
    frameStyle: { border: '1px solid rgba(16,185,129,0.4)', borderRadius: '0px' },
  },
  custom: {
    bg: '#0a0d14',
    border: '#4B5563',
    accent: '#3B82F6',
    titleColor: '#F3F4F6',
    textColor: '#F3F4F6',
    subColor: '#9CA3AF',
    sealBg: 'rgba(255,255,255,0.05)',
    crestComponent: CrestModern,
    pattern: 'none',
    frameStyle: { border: 'none', borderRadius: '16px' },
  },
}

export default function CertificateView({ cert, forPrint = false }: Props) {
  if (cert.template === 'custom') {
    return (
      <div
        id={forPrint ? 'certificate-print' : 'certificate-view'}
        style={{
          width: '100%',
          maxWidth: '840px',
          margin: '0 auto',
          aspectRatio: '1.414 / 1',
          background: '#0a0d14',
          borderRadius: forPrint ? 0 : '16px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: forPrint ? 'none' : '0 25px 70px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {cert.certificateImageUrl ? (
          <img
            src={cert.certificateImageUrl}
            alt="Custom Certificate"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              zIndex: 1,
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#94a3b8', zIndex: 1, padding: '20px', fontFamily: "'Outfit', sans-serif" }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🖼️</div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>Custom Certificate Layout</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Please upload your certificate design file</div>
          </div>
        )}
      </div>
    )
  }

  const t = TEMPLATES[cert.template] || TEMPLATES.classic
  const issuedFormatted = (() => {
    try {
      return format(new Date(cert.issuedDate + 'T12:00:00'), 'MMMM d, yyyy')
    } catch {
      return cert.issuedDate
    }
  })()

  // Dynamic customization overrides
  const accentColor = cert.primaryColor || t.accent
  const Crest = t.crestComponent

  return (
    <div
      id={forPrint ? 'certificate-print' : 'certificate-view'}
      style={{
        width: '100%',
        maxWidth: '840px',
        margin: '0 auto',
        aspectRatio: '1.414 / 1',
        background: t.bg,
        borderRadius: forPrint ? 0 : cert.template === 'tech' ? '4px' : '16px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: cert.template === 'tech' ? "'JetBrains Mono', monospace" : "'Outfit', 'DM Sans', sans-serif",
        boxShadow: forPrint ? 'none' : '0 25px 70px rgba(0,0,0,0.5)',
        border: cert.template === 'tech' ? `1px solid ${accentColor}` : `1px solid rgba(255,255,255,0.08)`,
      }}
    >
      {/* Background patterns */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: t.pattern,
          backgroundSize: (t as any).patternSize || 'auto',
          opacity: cert.template === 'tech' ? 0.6 : 1,
        }}
      />

      {/* Tech template scan line simulation (styled static grid highlight) */}
      {cert.template === 'tech' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          opacity: 0.3
        }} />
      )}

      {/* Corner Ornaments */}
      {cert.template !== 'tech' && cert.template !== 'modern' && (
        <>
          <CornerOrnament color={accentColor} position="tl" />
          <CornerOrnament color={accentColor} position="tr" />
          <CornerOrnament color={accentColor} position="bl" />
          <CornerOrnament color={accentColor} position="br" />
        </>
      )}

      {/* Outer borders */}
      <div
        style={{
          position: 'absolute',
          inset: cert.template === 'tech' ? '12px' : '20px',
          border: cert.template === 'tech' ? `1px solid ${accentColor}30` : `1.5px solid ${accentColor}40`,
          borderRadius: t.frameStyle.borderRadius,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: cert.template === 'tech' ? '16px' : '26px',
          border: cert.template === 'tech' ? `1px dashed ${accentColor}15` : `0.5px solid ${accentColor}20`,
          borderRadius: cert.template === 'tech' ? '0' : '4px',
          pointerEvents: 'none',
        }}
      />

      {/* Certificate Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '44px 60px',
          textAlign: 'center',
        }}
      >
        {/* Organization / Header logo */}
        {cert.logoUrl ? (
          <img
            src={cert.logoUrl}
            alt={cert.orgName}
            style={{
              height: '38px',
              maxWidth: '180px',
              objectFit: 'contain',
              marginBottom: '10px',
            }}
          />
        ) : (
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.24em',
              color: accentColor,
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            {cert.orgName}
          </div>
        )}

        {/* Decorative Divider Line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', width: '60%' }}>
          <div style={{ flex: 1, height: '1px', background: accentColor, opacity: 0.25 }} />
          {cert.template === 'tech' ? (
            <div style={{ fontSize: '10px', color: accentColor, opacity: 0.6 }}>[SYS_VERIFIED]</div>
          ) : (
            <div style={{ width: '6px', height: '6px', border: `1.5px solid ${accentColor}`, transform: 'rotate(45deg)', opacity: 0.6 }} />
          )}
          <div style={{ flex: 1, height: '1px', background: accentColor, opacity: 0.25 }} />
        </div>

        {/* Certificate Title */}
        <div
          className="font-display"
          style={{
            fontSize: 'clamp(20px, 3.4vw, 28px)',
            fontWeight: 700,
            color: t.titleColor,
            letterSpacing: '0.04em',
            marginBottom: '12px',
            fontStyle: cert.template === 'elegant' || cert.template === 'classic' ? 'italic' : 'normal',
          }}
        >
          {cert.template === 'tech' ? 'CERTIFICATE OF ACHIEVEMENT' : 'Certificate of Completion'}
        </div>

        <div
          style={{
            fontSize: cert.template === 'tech' ? '10px' : '11px',
            fontWeight: 500,
            color: t.subColor,
            marginBottom: '10px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {cert.template === 'tech' ? 'THIS VERIFICATION CONFIRMS THAT' : 'This is to certify that'}
        </div>

        {/* Recipient Name */}
        <div
          className={cert.template === 'tech' ? 'font-mono' : 'font-display'}
          style={{
            fontSize: 'clamp(24px, 4.4vw, 38px)',
            fontWeight: 700,
            color: cert.template === 'elegant' ? t.titleColor : '#FFF',
            textShadow: cert.template === 'elegant' ? 'none' : `0 2px 10px rgba(0,0,0,0.3)`,
            marginBottom: '10px',
            lineHeight: 1.1,
            letterSpacing: cert.template === 'tech' ? '0.05em' : 'normal',
          }}
        >
          {cert.recipientName}
        </div>

        {/* Mini separator */}
        <div style={{ width: '44px', height: '2px', background: accentColor, marginBottom: '10px' }} />

        <div
          style={{
            fontSize: cert.template === 'tech' ? '10px' : '11px',
            color: t.subColor,
            marginBottom: '8px',
            letterSpacing: '0.05em',
          }}
        >
          {cert.template === 'tech' ? 'HAS RECORDED SUCCESSFUL COMPLETION OF' : 'has successfully completed'}
        </div>

        {/* Course Name */}
        <div
          style={{
            fontSize: 'clamp(14px, 2.2vw, 19px)',
            fontWeight: 600,
            color: cert.template === 'elegant' ? t.titleColor : '#FFF',
            marginBottom: '8px',
            maxWidth: '85%',
            lineHeight: 1.3,
          }}
        >
          {cert.courseName}
        </div>

        {/* Grade Badge */}
        {cert.grade && (
          <div
            style={{
              display: 'inline-block',
              padding: '3px 14px',
              border: `1px solid ${accentColor}70`,
              background: `${accentColor}10`,
              borderRadius: cert.template === 'tech' ? '0' : '20px',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: accentColor,
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            Grade: {cert.grade}
          </div>
        )}

        {/* Description */}
        <div
          style={{
            fontSize: '10px',
            color: t.subColor,
            maxWidth: '78%',
            lineHeight: 1.6,
            marginBottom: '16px',
            fontWeight: 400,
          }}
        >
          {cert.description}
        </div>

        {/* Skills Pills */}
        {cert.skills && cert.skills.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
            {cert.skills.slice(0, 6).map(s => (
              <span
                key={s}
                style={{
                  padding: '2px 10px',
                  background: `${accentColor}12`,
                  border: `1.5px solid ${accentColor}30`,
                  borderRadius: cert.template === 'tech' ? '0' : '12px',
                  fontSize: '9px',
                  fontWeight: 600,
                  color: cert.template === 'elegant' ? t.textColor : '#FFF',
                  letterSpacing: '0.04em',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Metadata & Signatures Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 'auto',
          }}
        >
          {/* Issuer details / Signature */}
          <div style={{ textAlign: 'left', minWidth: '150px' }}>
            <div style={{ minHeight: '34px', display: 'flex', alignItems: 'flex-end', marginBottom: '4px' }}>
              {cert.signatureUrl ? (
                <img
                  src={cert.signatureUrl}
                  alt="Signature"
                  style={{
                    maxHeight: '34px',
                    maxWidth: '120px',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <div
                  className="font-display"
                  style={{
                    fontSize: '14px',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    color: cert.template === 'elegant' ? t.textColor : '#FFF',
                    letterSpacing: '0.05em',
                  }}
                >
                  {cert.issuerName}
                </div>
              )}
            </div>
            <div style={{ width: '100px', height: '1px', background: accentColor, opacity: 0.3, marginBottom: '4px' }} />
            <div style={{ fontSize: '9px', color: t.subColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {cert.issuerTitle || 'Authorized Issuer'}
            </div>
          </div>

          {/* Central Academic Seal / Logo Badge */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: t.sealBg,
              border: `1.5px solid ${accentColor}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 15px ${accentColor}15`,
            }}
          >
            <Crest size={52} color={accentColor} />
          </div>

          {/* Issue Date & ID */}
          <div style={{ textAlign: 'right', minWidth: '150px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: cert.template === 'elegant' ? t.textColor : '#FFF',
                marginBottom: '4px',
              }}
            >
              {issuedFormatted}
            </div>
            <div style={{ width: '100px', height: '1px', background: accentColor, opacity: 0.3, marginBottom: '4px', marginLeft: 'auto' }} />
            <div
              className="font-mono"
              style={{
                fontSize: '9px',
                color: t.subColor,
                letterSpacing: '0.05em',
              }}
            >
              VERIFY ID: {cert.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CornerOrnament({ color, position }: { color: string; position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const size = 30
  const styles: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    opacity: 0.5,
  }
  if (position === 'tl') {
    styles.top = 10
    styles.left = 10
  }
  if (position === 'tr') {
    styles.top = 10
    styles.right = 10
    styles.transform = 'rotate(90deg)'
  }
  if (position === 'bl') {
    styles.bottom = 10
    styles.left = 10
    styles.transform = 'rotate(270deg)'
  }
  if (position === 'br') {
    styles.bottom = 10
    styles.right = 10
    styles.transform = 'rotate(180deg)'
  }

  return (
    <svg style={styles} viewBox="0 0 36 36" fill="none">
      <path d="M2 2 L16 2 L16 4 L4 4 L4 16 L2 16 Z" fill={color} />
      <circle cx="7" cy="7" r="1.5" fill={color} />
    </svg>
  )
}
