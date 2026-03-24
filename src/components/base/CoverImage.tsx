import { useState } from 'react';

interface CoverImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function CoverImage({ src, alt, className = '' }: CoverImageProps) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  if (showPlaceholder) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-purple-100 to-amber-50 dark:from-gray-700 dark:to-gray-800 ${className}`}>
        <div className="flex flex-col items-center gap-1 opacity-60">
          <i className="ri-headphone-line text-2xl text-purple-400 dark:text-purple-500"></i>
          <span className="text-[8px] font-semibold text-purple-400 dark:text-purple-500 leading-none tracking-wide uppercase">Audio</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
