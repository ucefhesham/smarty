import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "../globals.css";
import { locales } from "@/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import StickyCategoryNav from "@/components/layout/StickyCategoryNav";
import PageLoader from "@/components/layout/PageLoader";
import { Suspense } from "react";
import QuickViewModal from "@/components/product/QuickViewModal";
import CompareBar from "@/components/product/CompareBar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import MobileMenu from "@/components/layout/MobileMenu";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "Smarty | Smart Electronics & Home Automation"
  },
  description: "Experience the future of smart living with Smarty. High-quality electronics and home automation solutions in Jordan.",
  keywords: ["Smart Home", "Home Automation", "Electronics", "Jordan", "Smarty", "IoT", "Security Cameras"],
  authors: [{ name: "Smarty" }],
  metadataBase: new URL('https://smartyjo.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'ar-JO': '/ar',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://smartyjo.com',
    siteName: 'Smarty',
    title: 'Smarty | Smart Electronics & Home Automation',
    description: 'Experience the future of smart living with Smarty. High-quality electronics and home automation solutions in Jordan.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Smarty Smart Home Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smarty | Smart Electronics & Home Automation',
    description: 'Experience the future of smart living with Smarty. High-quality electronics and home automation solutions in Jordan.',
    images: ['/images/twitter-image.jpg'],
  },
  icons: {
    icon: "/favicon.ico",
  }
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const p = await params;
  const locale = p.locale;

  // Enable static rendering
  setRequestLocale(locale);

  console.log(`[LocaleLayout] Received locale param: "${locale}"`);

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    console.error(`[LocaleLayout] Invalid locale "${locale}", returning notFound()`);
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // Fetch WordPress Data for menus
  let categories = [];
  let brands = [];
  try {
    const [wpCategories, wpBrands] = await Promise.all([
      import("@/lib/wordpress").then(m => m.getCategories(locale)),
      import("@/lib/wordpress").then(m => m.getBrands(locale))
    ]);
    categories = Array.isArray(wpCategories) ? wpCategories : [];
    brands = Array.isArray(wpBrands) ? wpBrands : [];
  } catch (error) {
    console.error("[LocaleLayout] Failed to fetch WordPress menus:", error);
  }

  return (
    <html lang={locale} dir={dir}>
      <body className={`${inter.variable} ${cairo.variable} antialiased font-sans`}>
        <div className="flex min-h-screen flex-col">
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header brands={brands} />
            <div className="hidden md:block">
              <StickyCategoryNav initialCategories={categories} />
            </div>
            <main className="flex-grow pl-0 md:pl-[70px] pt-[70px] md:pt-[118px] pb-20 md:pb-0">
              <Suspense fallback={null}>
                <PageLoader />
              </Suspense>
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <QuickViewModal />
            <CompareBar />
            <WhatsAppButton />
            <MobileBottomNav />
            <MobileMenu categories={categories} brands={brands} />
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
