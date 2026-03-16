import { setRequestLocale } from 'next-intl/server';
import WishlistPage from '@/components/shop/WishlistPage';

export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const p = await params;
  const locale = p.locale;
  
  setRequestLocale(locale);

  return <WishlistPage />;
}
