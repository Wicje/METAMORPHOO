'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface EditorialImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  monogramWatermark?: boolean;
}

const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop';

export default function EditorialImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  monogramWatermark = true,
  className = '',
  fill,
  ...props
}: EditorialImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const activeSrc = error || !src ? fallbackSrc : src;

  return (
    <div className={`relative w-full h-full overflow-hidden ${fill ? '' : 'inline-block'}`}>
      {/* Texture shimmer placeholder while loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-surface)] via-[var(--bg-elevated)] to-[var(--bg-surface)] animate-pulse z-0" />
      )}

      <Image
        src={activeSrc}
        alt={alt || 'Metamorphoo Editorial'}
        fill={fill}
        className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        referrerPolicy="no-referrer"
        {...props}
      />

      {/* Discrete watermark fallback if error occurred */}
      {error && monogramWatermark && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-canvas)]/80 text-[var(--color-sand)] pointer-events-none p-4 text-center">
          <span className="font-cormorant text-2xl tracking-[0.3em] font-light">MΦ</span>
          <span className="font-montserrat text-[8px] uppercase tracking-[0.2em] mt-1 text-[var(--text-muted)]">
            NATURAL FIBRE ARCHIVE
          </span>
        </div>
      )}
    </div>
  );
}
