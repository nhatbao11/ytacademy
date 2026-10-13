import React from 'react'

interface BrandLogoProps {
  className?: string
  showDomain?: boolean
  variant?: 'default' | 'white'
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = 'h-10',
  showDomain = false,
  variant = 'default',
}) => {
  const isWhite = variant === 'white'

  return (
    <div className="flex items-center gap-2 select-none group">
      {/* Modern Picture element with SVG & WebP & PNG fallback for optimal resolution & performance */}
      <picture className="flex items-center">
        {/* Vector SVG first (Infinite sharpness, zero compression artifact) */}
        <source
          type="image/svg+xml"
          srcSet={isWhite ? '/logo-white.svg' : '/logo.svg'}
        />
        {/* Next-gen transparent WebP */}
        <source
          type="image/webp"
          srcSet={isWhite ? '/logo-white.svg' : '/logo.webp'}
        />
        {/* Standard PNG Fallback */}
        <img
          src={isWhite ? '/logo-white.svg' : '/logo.png'}
          alt="YT Academy - ytacademy.com.vn"
          className={`${className} w-auto object-contain transition-transform duration-300 group-hover:scale-102`}
          loading="eager"
          decoding="async"
        />
      </picture>

      {showDomain && (
        <span
          className={`hidden xl:inline-block text-xs font-semibold px-2.5 py-0.5 border rounded-none transition-colors ${
            isWhite
              ? 'bg-white/10 text-amber-300 border-white/20'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          ytacademy.com.vn
        </span>
      )}
    </div>
  )
}
