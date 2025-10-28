'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({
  size = 124,
  className,
  alt = 'Awn',
}: {
  size?: number;
  className?: string;
  alt?: string;
}) {
  return (
    <span className={cn('inline-block', className)} aria-label={alt}>
      {/* Light mode logo */}
      <Image
        src="/brand:logo-light.png"
        alt={alt}
        width={size}
        height={Math.round(size * 0.28)}
        className="block dark:hidden"
        priority
      />
      {/* Dark mode logo */}
      <Image
        src="/brand:logo-dark.png"
        alt={alt}
        width={size}
        height={Math.round(size * 0.28)}
        className="hidden dark:block"
        priority
      />
    </span>
  );
}