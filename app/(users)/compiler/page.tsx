'use client'

import type { Metadata } from "next";
import Compiler from '@/components/Compiler';
import MobileCompiler from '@/components/MobileCompiler';
import { useState, useEffect } from 'react';

export default function CompilerPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window width is less than 768px (md breakpoint)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? <MobileCompiler /> : <Compiler />;
}
