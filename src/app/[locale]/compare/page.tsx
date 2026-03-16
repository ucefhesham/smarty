import { setRequestLocale } from 'next-intl/server';
import ComparePage from '@/components/shop/ComparePage';

export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const p = await params;
  const locale = p.locale;
  
  setRequestLocale(locale);

  return <ComparePage />;
}
