import React from 'react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

// 1. Academic Crest - Classic (navy/gold ornate laurel wreath and shield)
export function CrestClassic({ size = 70, color = '#D4A843', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="1.5" strokeDasharray="4 2" />
      <circle cx="50" cy="50" r="41" stroke={color} strokeWidth="1" />
      {/* Laurel leaves left */}
      <path d="M28 50 C28 35, 38 25, 45 22 C43 28, 38 35, 33 46 M29 42 C30 35, 36 30, 40 28 M30 55 C33 48, 39 44, 44 42" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      {/* Laurel leaves right */}
      <path d="M72 50 C72 35, 62 25, 55 22 C57 28, 62 35, 67 46 M71 42 C70 35, 64 30, 60 28 M70 55 C67 48, 61 44, 56 42" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      {/* Shield in center */}
      <path d="M42 36 H58 V48 C58 56, 50 64, 50 64 C50 64, 42 56, 42 48 V36 Z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {/* Book inside shield */}
      <path d="M46 44 H54 M46 48 H54 M46 52 H52" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Stars on top */}
      <path d="M50 15 L51.5 18.5 L55 18.5 L52 20.5 L53.5 24 L50 22 L46.5 24 L48 20.5 L45 18.5 L48.5 18.5 Z" fill={color} />
    </svg>
  )
}

// 2. Academic Crest - Modern (clean geometric diamond and crosshair star)
export function CrestModern({ size = 70, color = '#2255C4', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="15" y="15" width="70" height="70" rx="35" stroke={color} strokeWidth="1.5" />
      <rect x="21" y="21" width="58" height="58" rx="29" stroke={color} strokeWidth="0.8" strokeDasharray="3 3" />
      {/* Dynamic Star/Compass in center */}
      <path d="M50 28 L53 43 L68 40 L56 49 L65 62 L50 53 L35 62 L44 49 L32 40 L47 43 Z" fill={color} />
      {/* Orbit ring */}
      <ellipse cx="50" cy="50" rx="30" ry="8" stroke={color} strokeWidth="1.5" transform="rotate(-30 50 50)" />
    </svg>
  )
}

// 3. Academic Crest - Elegant (circular botanical luxury emblem)
export function CrestElegant({ size = 70, color = '#8B5E3C', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="43" stroke={color} strokeWidth="1" />
      <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="1.5" />
      {/* Central botanical motif (lily / fleur-de-lis styled leaf) */}
      <path d="M50 26 C50 26, 45 42, 35 48 C47 48, 48 60, 50 72 C52 60, 53 48, 65 48 C55 42, 50 26, 50 26 Z" fill="none" stroke={color} strokeWidth="1.5" />
      <path d="M38 58 C42 58, 48 54, 50 72 C52 54, 58 58, 62 58" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="50" cy="46" r="3" fill={color} />
    </svg>
  )
}

// 4. Academic Crest - Tech (hexagonal cryptography / coding grid seal)
export function CrestTech({ size = 70, color = '#10B981', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Hexagon */}
      <path d="M50 12 L83 31 V69 L50 88 L17 69 V31 Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M50 18 L78 34 V66 L50 82 L22 66 V34 Z" stroke={color} strokeWidth="1" strokeDasharray="4 2" />
      {/* Code nodes inside */}
      <circle cx="50" cy="30" r="4" fill={color} />
      <circle cx="33" cy="42" r="4" fill={color} />
      <circle cx="67" cy="42" r="4" fill={color} />
      <circle cx="33" cy="62" r="4" fill={color} />
      <circle cx="67" cy="62" r="4" fill={color} />
      <circle cx="50" cy="72" r="4" fill={color} />
      {/* Connection lines */}
      <path d="M50 30 L33 42 V62 L50 72 L67 62 V42 L50 30" stroke={color} strokeWidth="1.5" />
      <path d="M50 30 V72 M33 42 L67 62 M33 62 L67 42" stroke={color} strokeWidth="0.8" />
    </svg>
  )
}

// 5. Verification Badge - Checkmark
export function IconVerify({ size = 20, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M9 11L11 13L15 9" />
    </svg>
  )
}

// 6. Search Icon
export function IconSearch({ size = 18, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21L16.65 16.65" />
    </svg>
  )
}

// 7. Issue Certificate Icon
export function IconIssue({ size = 18, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z" />
      <path d="M14 2V8H20" />
      <path d="M12 18V12 M9 15H15" />
    </svg>
  )
}

// 8. All Certificates List Icon
export function IconAll({ size = 18, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9H21 M9 21V9" />
    </svg>
  )
}

// 9. Analytics Icon
export function IconAnalytics({ size = 18, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

// 10. Copy / Link Icon
export function IconCopy({ size = 16, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4A2 2 0 0 1 2 13V4A2 2 0 0 1 4 2H13A2 2 0 0 1 15 4V5" />
    </svg>
  )
}

// 11. Download Icon
export function IconDownload({ size = 16, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

// 12. LinkedIn Icon
export function IconLinkedIn({ size = 16, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

// 13. Twitter/X Icon
export function IconTwitter({ size = 16, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

// 14. Print Icon
export function IconPrint({ size = 16, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4A2 2 0 0 1 2 16V12A2 2 0 0 1 4 10H20A2 2 0 0 1 22 12V16A2 2 0 0 1 20 18H18" />
      <rect x="6" y="14" width="12" height="8" rx="1" />
    </svg>
  )
}

// 15. Delete / Trash Icon
export function IconDelete({ size = 16, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}

// 16. Award / Grade Badge
export function IconGrade({ size = 18, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="7" fill="currentColor" fillOpacity="0.1" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  )
}

// 17. Calendar Icon
export function IconCalendar({ size = 16, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

// 18. Book / Course Icon
export function IconBook({ size = 16, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5V4.5z" fill="currentColor" fillOpacity="0.1" />
    </svg>
  )
}

// 19. Globe / Organization Icon
export function IconGlobe({ size = 16, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

// 20. Mail Icon
export function IconMail({ size = 16, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

// 21. User Icon
export function IconUser({ size = 16, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" fill="currentColor" fillOpacity="0.1" />
    </svg>
  )
}

// 22. Close Icon
export function IconClose({ size = 16, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// 23. File / Text Icon
export function IconFileText({ size = 16, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}
