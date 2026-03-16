import { setRequestLocale, getTranslations } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import BrandCarousel from '@/components/home/BrandCarousel';
import ProductSlider from '@/components/home/ProductSlider';
import PromoSlider from '@/components/home/PromoSlider';
import CategorySlider from '@/components/home/CategorySlider';
import React, { Suspense } from 'react';
import lightsBanner from "../../../public/images/lights.png";
import { Metadata } from 'next';
import { CategorySliderSkeleton } from '@/components/home/CategorySlider';
import { ProductSliderSkeleton } from '@/components/home/ProductSlider';
import { PromoSliderSkeleton } from '@/components/home/PromoSlider';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  
  const siteTitle = t('title');
  const siteDesc = t('site_description');
  
  return {
    title: {
      absolute: `${siteTitle} | Smart Electronics & Home Automation`
    },
    description: siteDesc,
    openGraph: {
      title: `${siteTitle} | Smart Electronics & Home Automation`,
      description: siteDesc,
      locale: locale === 'ar' ? 'ar_JO' : 'en_US',
    },
    twitter: {
      title: `${siteTitle} | Smart Electronics & Home Automation`,
      description: siteDesc,
    }
  };
}

// Static Category Image Imports
import outdoor_wifi_camera from "../../../public/images/categories/outdoor_wifi_camera.jpeg";
import solar_smart_cameras from "../../../public/images/categories/solar_smart_cameras.png";
import robot_vacuum from "../../../public/images/categories/robot_vacuum.jpeg";
import smart_intercom from "../../../public/images/categories/smart_intercom.jpeg";
import smart_locks from "../../../public/images/categories/smart_locks.jpeg";
import zigbee_products from "../../../public/images/categories/zigbee_products.jpg";
import cameras_4g from "../../../public/images/categories/4g_cameras.jpeg";
import battery_cameras from "../../../public/images/categories/battery_cameras.png";
import indoor_wifi_camera from "../../../public/images/categories/indoor_wifi_camera.jpeg";
import nvr from "../../../public/images/categories/nvr.png";

import smart_ac_control from "../../../public/images/categories/smart_ac_control.jpg";
import gateway_bridge from "../../../public/images/categories/gateway_bridge.jpeg";
import smart_lighting from "../../../public/images/categories/smart_lighting.jpeg";
import central_control_panel from "../../../public/images/categories/central_control_panel.png";
import diy_smart_switches from "../../../public/images/categories/diy_smart_switches.jpg";
import sensors from "../../../public/images/categories/sensors.jpeg";
import accessories from "../../../public/images/categories/accessories.jpeg";
import wifi_wall_switches from "../../../public/images/categories/wifi_wall_switches.png";
import water_level_meter from "../../../public/images/categories/water_level_meter.jpeg";
import smart_curtains from "../../../public/images/categories/smart_curtains.jpeg";
import smart_plugs from "../../../public/images/categories/smart_plugs.jpeg";

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
        <Suspense fallback={<CategorySliderSkeleton />}>
          <CategorySlider categories={[
            { id: 'outdoor_wifi_camera', img: outdoor_wifi_camera, slug: 'outdoor-wifi-camera-2' },
            { id: 'solar_smart_cameras', img: solar_smart_cameras, slug: 'solar-smart-camera' },
            { id: 'robot_vacuum', img: robot_vacuum, slug: 'robot-vacuum' },
            { id: 'smart_intercom', img: smart_intercom, slug: 'smart-intercom' },
            { id: 'smart_locks', img: smart_locks, slug: 'smart-lock-2' },
            { id: 'zigbee_products', img: zigbee_products, slug: 'zigbee-smart-products' },
            { id: '4g_cameras', img: cameras_4g, slug: '4g-security-camera' },
            { id: 'battery_cameras', img: battery_cameras, slug: 'battery-wifi-camera' },
            { id: 'indoor_wifi_camera', img: indoor_wifi_camera, slug: 'indoor-wifi-camera-2' },
            { id: 'nvr', img: nvr, slug: 'nvr' }
          ]} />
        </Suspense>
        <Suspense fallback={<CategorySliderSkeleton />}>
          <CategorySlider categories={[
            { id: 'smart_ac_control', img: smart_ac_control, slug: 'ac-control-smart' },
            { id: 'gateway_bridge', img: gateway_bridge, slug: 'gateway-bridge' },
            { id: 'smart_lighting', img: smart_lighting, slug: 'smart-lighting' },
            { id: 'central_control_panel', img: central_control_panel, slug: 'central-control-panel' },
            { id: 'diy_smart_switches', img: diy_smart_switches, slug: 'smart-switches' },
            { id: 'sensors', img: sensors, slug: 'sensor' },
            { id: 'accessories', img: accessories, slug: 'accessories' },
            { id: 'wifi_wall_switches', img: wifi_wall_switches, slug: 'smart-wall-switches' },
            { id: 'water_level_meter', img: water_level_meter, slug: 'smart-water-level' },
            { id: 'smart_curtains', img: smart_curtains, slug: 'smart-motorized-curtain-track' },
            { id: 'smart_plugs', img: smart_plugs, slug: 'smart-plugs' }
          ]} />
        </Suspense>
      </div>

      <div className="space-y-4 md:space-y-8">
        <Suspense fallback={<ProductSliderSkeleton />}>
          <ProductSlider
            categorySlug="amazon-alexa"
            title={t('alexa_title')}
            locale={locale}
          />
        </Suspense>

        <Suspense fallback={<ProductSliderSkeleton />}>
          <ProductSlider
            categorySlug="smart-lock-2"
            title={t('locks_title')}
            locale={locale}
          />
        </Suspense>

        <Suspense fallback={<ProductSliderSkeleton />}>
          <ProductSlider
            brandSlug="sonoff"
            title={t('sonoff_title')}
            locale={locale}
          />
        </Suspense>

        <Suspense fallback={<PromoSliderSkeleton />}>
          <PromoSlider
            categorySlug="smart-lighting"
            title={t('promo_title')}
            bannerTitle={t('banner_title')}
            bannerSubtitle={t('banner_subtitle')}
            bannerImage={lightsBanner}
            locale={locale}
          />
        </Suspense>
      </div>
    </section>
  );
}
