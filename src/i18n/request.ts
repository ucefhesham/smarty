import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, defaultLocale } from '../navigation';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  console.log(`[i18n Request] Initializing config for locale: "${locale}"`);
  
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as any)) {
      console.error(`[i18n Request] Invalid locale "${locale}" detected. Falling back to default: ${defaultLocale}`);
      locale = defaultLocale;
  }

  try {
      const messages = (await import(`../../messages/${locale}.json`)).default;
      console.log(`[i18n Request] Successfully loaded messages for "${locale}"`);
      return {
        locale,
        messages
      };
  } catch (error) {
      console.error(`[i18n Request] Error loading messages for "${locale}":`, error);
      throw error; 
  }
});
