"use client";

import Image from "next/image";
import heroBg from "../../../public/images/hero/hero-lifestyle.png";
import { useLocale } from 'next-intl';

export default function HeroImage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <Image 
      src={heroBg} 
      alt="Smarty Hero"
      fill
      priority
      style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }}
      className="object-cover object-center transition-transform duration-[10000ms] ease-out opacity-90"
    />
  );
}
