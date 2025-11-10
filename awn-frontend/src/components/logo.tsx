// src/components/logo.tsx
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <>
      {/* Light mode logo */}
      <Image
        src="/brand/logo-light.svg"
        alt="Awn logo"
        width={140}
        height={32}
        priority
        className={cn('h-6 w-auto dark:hidden', className)}
      />

      {/* Dark mode logo */}
      <Image
        src="/brand/logo-dark.svg"
        alt="Awn logo"
        width={140}
        height={32}
        priority
        className={cn('hidden h-6 w-auto dark:block', className)}
      />
    </>
  );
};

export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <>
     <Image
  src="/brand%3Alogo-light.png"  // URL encode the colon (:)
  alt="Awn icon"
  width={32}
  height={32}
  className="size-8"
/>

// And for the dark logo:
<Image
  src="/brand%3Alogo-dark.png"   // URL encode the colon (:)
  alt="Awn icon"
  width={32}
  height={32}
  className="size-8"
    />
    </>
  );
};