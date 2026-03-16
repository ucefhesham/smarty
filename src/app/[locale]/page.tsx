import { setRequestLocale, getTranslations } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import BrandCarousel from '@/components/home/BrandCarousel';
import ProductSlider from '@/components/home/ProductSlider';
import PromoSlider from '@/components/home/PromoSlider';
import CategorySlider from '@/components/home/CategorySlider';
import React from 'react';
import lightsBanner from "../../../public/images/lights.png";

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const p = await params;
  const locale = p.locale;

  // Enable static rendering
  setRequestLocale(locale);
  const t = await getTranslations('home');

  return (
    <section className="bg-white min-h-screen pt-1 md:pt-4">
      {/* Immersive Hero Section */}
      <Hero />

      {/* Auto-scrolling Brand Partners */}
      <BrandCarousel />

      <div className="mb-2 mt-2 md:mt-8 space-y-1 md:space-y-2">
        <CategorySlider categories={[
          { id: 'outdoor_wifi_camera', img: 'https://smartyjo.com/wp-content/uploads/2025/02/OIP-13.jpeg', slug: 'outdoor-wifi-camera-2' },
          { id: 'solar_smart_cameras', img: 'https://smartyjo.com/wp-content/uploads/2025/02/7acf702f9e6a0ecba0401559e67590ca.png', slug: 'solar-smart-camera' },
          { id: 'robot_vacuum', img: 'https://smartyjo.com/wp-content/uploads/2025/02/a5540e070170389029e6cd4bc7d2c559.jpeg', slug: 'robot-vacuum' },
          { id: 'smart_intercom', img: 'https://smartyjo.com/wp-content/uploads/2025/02/96cb807a71ec04780d58620f17270cec.jpeg', slug: 'smart-intercom' },
          { id: 'smart_locks', img: 'https://smartyjo.com/wp-content/uploads/2025/02/OIP-17.jpeg', slug: 'smart-lock-2' },
          { id: 'zigbee_products', img: 'https://smartyjo.com/wp-content/uploads/2025/02/sonoff-snzb-02p.jpg', slug: 'zigbee-smart-products' },
          { id: '4g_cameras', img: 'https://smartyjo.com/wp-content/uploads/2025/02/cs-eb8-4g.jpeg', slug: '4g-security-camera' },
          { id: 'battery_cameras', img: 'https://smartyjo.com/wp-content/uploads/2025/02/5a48948c26519afe012428167af08c08-1024x1024.png', slug: 'battery-wifi-camera' },
          { id: 'indoor_wifi_camera', img: 'https://smartyjo.com/wp-content/uploads/2025/02/OIP-24.jpeg', slug: 'indoor-wifi-camera-2' },
          { id: 'nvr', img: 'https://smartyjo.com/wp-content/uploads/2025/02/96ec8d758e29083be45b249e012d99c7.png', slug: 'nvr' }
        ]} />
        <CategorySlider categories={[
          { id: 'smart_ac_control', img: 'https://smartyjo.com/wp-content/uploads/2025/03/1973002989-e1741897298697.jpg', slug: 'ac-control-smart' },
          { id: 'gateway_bridge', img: 'https://smartyjo.com/wp-content/uploads/2025/02/b97ca14a85b0a7b0dd0ba24a5ce61fce.jpeg', slug: 'gateway-bridge' },
          { id: 'smart_lighting', img: 'https://smartyjo.com/wp-content/uploads/2025/02/b6c92a27c7f310b609503c85922c65d4.jpeg', slug: 'smart-lighting' },
          { id: 'central_control_panel', img: 'https://smartyjo.com/wp-content/uploads/2025/03/Central-Icon.png', slug: 'central-control-panel' },
          { id: 'diy_smart_switches', img: 'https://smartyjo.com/wp-content/uploads/2025/02/sonoff-mini-r4-extreme-matter.jpg', slug: 'smart-switches' },
          { id: 'sensors', img: 'https://smartyjo.com/wp-content/uploads/2025/02/bd474b7001dd900015cbec187061521b.jpeg', slug: 'sensor' },
          { id: 'accessories', img: 'https://smartyjo.com/wp-content/uploads/2025/02/OIP-2.jpeg', slug: 'accessories' },
          { id: 'wifi_wall_switches', img: 'https://smartyjo.com/wp-content/uploads/2025/02/fc42d8a2a44b90a7ecc867231dbb8858.png', slug: 'smart-wall-switches' },
          { id: 'water_level_meter', img: 'https://smartyjo.com/wp-content/uploads/2025/02/swp-nh.jpeg', slug: 'smart-water-level' },
          { id: 'smart_curtains', img: 'https://smartyjo.com/wp-content/uploads/2025/06/WhatsApp-Image-2025-06-09-at-6.17.37-PM-1-1024x1024.jpeg', slug: 'smart-motorized-curtain-track' },
          { id: 'smart_plugs', img: 'https://smartyjo.com/wp-content/uploads/2025/02/OIP-2-1.jpeg', slug: 'smart-plugs' }
        ]} />
      </div>

      <div className="space-y-4 md:space-y-8">
        <ProductSlider
          categorySlug="amazon-alexa"
          title={t('alexa_title')}
          locale={locale}
        />

        <ProductSlider
          categorySlug="smart-lock-2"
          title={t('locks_title')}
          locale={locale}
        />

        <ProductSlider
          brandSlug="sonoff"
          title={t('sonoff_title')}
          locale={locale}
        />

        <PromoSlider
          categorySlug="smart-lighting"
          title={t('promo_title')}
          bannerTitle={t('banner_title')}
          bannerSubtitle={t('banner_subtitle')}
          bannerImage={lightsBanner}
          locale={locale}
        />
      </div>
    </section>
  );
}
