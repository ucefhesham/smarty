"use client";

import React from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { motion } from 'framer-motion';

// Static Image Imports
import alexaLogo from '../../../public/images/brands/alexa.webp';
import ezvizLogo from '../../../public/images/brands/ezviz.webp';
import googleLogo from '../../../public/images/brands/google.png';
import imouLogo from '../../../public/images/brands/imou.webp';
import tisLogo from '../../../public/images/brands/tis.png';
import sonoffLogo from '../../../public/images/brands/sonoff.webp';
import tuyaLogo from '../../../public/images/brands/tuya.webp';

const brands = [
  { name: 'Alexa', logo: alexaLogo, slug: 'alexa-amazon' },
  { name: 'Ezviz', logo: ezvizLogo, slug: 'ezviz' },
  { name: 'Google', logo: googleLogo, slug: 'google-home' },
  { name: 'Imou', logo: imouLogo, slug: 'imou' },
  { name: 'TIS', logo: tisLogo, slug: 'tis' },
  { name: 'Sonoff', logo: sonoffLogo, slug: 'sonoff' },
  { name: 'Tuya', logo: tuyaLogo, slug: 'tuya' },
];

// Duplicate the brands array once for a mathematically perfect seamless loop
const brandLoop = [...brands, ...brands];

export default function BrandCarousel() {
  return (
    <div className="w-full bg-white py-4 md:py-12 border-b border-slate-50 relative overflow-hidden" dir="ltr">
      <div className="mx-auto overflow-hidden">
        <motion.div
          className="flex items-center gap-8 md:gap-24 w-max px-8"
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {brandLoop.map((brand, index) => (
            <Link 
              key={`${brand.name}-${index}`} 
              href={`/shop/brand/${brand.slug}`}
              className="flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer px-4"
            >
              <div className="relative h-10 w-20 md:h-16 md:w-32 flex items-center justify-center">
                <Image 
                  src={brand.logo} 
                  alt={brand.name} 
                  fill
                  sizes="128px"
                  className="object-contain"
                />
              </div>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Gradient fades for a luxury look */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
    </div>
  );
}
