import { setRequestLocale } from 'next-intl/server';
import CheckoutPage from '@/components/shop/CheckoutPage';
import { getShippingMethods, getPaymentGateways } from '@/lib/wordpress';

export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const p = await params;
  const locale = p.locale;
  
  setRequestLocale(locale);

  const [shippingMethods, paymentGateways] = await Promise.all([
    getShippingMethods(),
    getPaymentGateways()
  ]);

  return <CheckoutPage 
    locale={locale} 
    initialShippingMethods={shippingMethods}
    initialPaymentGateways={paymentGateways}
  />;
}
