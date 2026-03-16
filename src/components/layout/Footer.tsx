import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/navigation';
import Image from 'next/image';
import { Facebook, Instagram, Mail, MessageCircle } from 'lucide-react';
import { JordanFlag, USFlag } from '../ui/Flags';
import logo from "../../../public/images/Smarty-Logo.webp";
import { getCategories, getBrands } from '@/lib/wordpress';

export default async function Footer() {
  const t = await getTranslations('common');
  const locale = await getLocale();
  const isRtl = locale === 'ar';

  // Fetch real data for footer links
  const categories = await getCategories(locale);
  const brands = await getBrands(locale);

  // Limit items for display purity matching the image
  const displayCategories = categories.slice(0, 6);
  const displayBrands = brands.slice(0, 6);

  return (
    <footer className="bg-white text-slate-900 pt-20 pb-12 border-t border-slate-100 px-4 md:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24" dir="ltr">
        
        {/* Newsletter & Language */}
        <div className="space-y-8 order-1 lg:order-4 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div>
            <h4 className="text-[13px] font-black uppercase tracking-widest mb-6 opacity-60 font-lexend">
              {t('footer_newsletter_title')}
            </h4>
            <div className="relative w-full max-w-xs flex border-b-2 border-slate-200 py-2 focus-within:border-primary transition-all">
              <input 
                type="email" 
                placeholder={t('footer_newsletter_placeholder')}
                className="bg-transparent border-none w-full text-sm outline-none placeholder:text-slate-300"
              />
              <button className="text-[11px] font-black uppercase tracking-widest hover:text-primary transition-colors bg-slate-100 px-4 py-1.5 rounded ms-2">
                {t('footer_newsletter_btn')}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <Link 
               href="/" 
               locale={locale === 'en' ? 'ar' : 'en'} 
               className="flex items-center gap-3 border border-slate-200 rounded-full px-5 py-2 hover:bg-slate-50 transition-all group bg-white"
             >
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors font-lexend">
                  {locale === 'en' ? t('arabic') : t('english')}
                </span>
                {locale === 'en' ? <JordanFlag className="w-5 h-3.5" /> : <USFlag className="w-5 h-3.5" />}
             </Link>
          </div>
        </div>

        {/* Categories (Real WordPress Categories) */}
        <div className="order-2 lg:order-3 flex flex-col items-center lg:items-start text-center lg:text-left">
          <h4 className="text-[13px] font-black uppercase tracking-widest mb-8 opacity-60 font-lexend">
            {t('footer_categories_title')}
          </h4>
          <ul className="space-y-4">
             {displayCategories.map(cat => (
               <li key={cat.id}>
                 <Link href={`/shop/${cat.slug}`} className="text-[14px] font-medium text-slate-900 hover:text-primary transition-colors opacity-80 hover:opacity-100">
                    {cat.name}
                 </Link>
               </li>
             ))}
          </ul>
        </div>

        {/* Brands + Services */}
        <div className="order-3 lg:order-2 grid grid-cols-2 gap-8 w-full">
           {/* Brands */}
           <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <h4 className="text-[13px] font-black uppercase tracking-widest mb-8 opacity-60 font-lexend">
                {t('footer_brands_title')}
              </h4>
              <ul className="space-y-4">
                 {displayBrands.map(brand => (
                   <li key={brand.id}>
                     <Link href={`/shop/brand/${brand.slug}`} className="text-[14px] font-medium text-slate-900 hover:text-primary transition-colors opacity-80 hover:opacity-100">
                        {brand.name}
                     </Link>
                   </li>
                 ))}
              </ul>
           </div>
           {/* Services */}
           <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <h4 className="text-[13px] font-black uppercase tracking-widest mb-8 opacity-60 font-lexend">
                {t('footer_services_title')}
              </h4>
              <ul className="space-y-2 lg:space-y-4">
                 <li><span className="text-[14px] font-medium text-slate-900 opacity-80">{t('footer_service_1')}</span></li>
                 <li><span className="text-[14px] font-medium text-slate-900 opacity-80">{t('footer_service_2')}</span></li>
              </ul>
           </div>
        </div>

        {/* Brand Identity & Contact */}
        <div className="space-y-8 order-4 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <Link href="/">
            <Image src={logo} alt="Smarty" width={160} height={50} className="h-12 w-auto mb-2 grayscale" />
          </Link>
          
          <div className="space-y-4">
             <a href="mailto:info@smartyjo.com" className="flex items-center lg:justify-start gap-3 group">
                <span className="text-[14px] font-bold text-slate-900">info@smartyjo.com</span>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 font-lexend group-hover:text-primary transition-colors">
                  {isRtl ? 'الإيميل' : 'Email'}
                </span>
             </a>
             <a href="https://wa.me/962795644030" target="_blank" className="flex flex-col lg:items-start">
                <span className="text-[16px] font-black text-slate-900 hover:text-[#25D366] transition-colors">
                  {t('footer_ask_whatsapp')}
                </span>
             </a>
          </div>

          <div className="flex items-center gap-4 lg:justify-start">
             <Link href="https://www.facebook.com/profile.php?id=61575403237089" target="_blank" className="w-10 h-10 rounded-full bg-[#0866FF] text-white flex items-center justify-center hover:scale-110 transition-transform">
                <Facebook size={20} />
             </Link>
             <Link href="https://www.instagram.com/smartyjo_" target="_blank" className="w-10 h-10 rounded-full bg-[#E4405F] text-white flex items-center justify-center hover:scale-110 transition-transform">
                <Instagram size={20} />
             </Link>
             <a href="mailto:info@smartyjo.com" className="w-10 h-10 rounded-full bg-[#EA4335] text-white flex items-center justify-center hover:scale-110 transition-transform">
                <Mail size={20} />
             </a>
             <a href="https://wa.me/962795644030" target="_blank" className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform">
                <MessageCircle size={20} />
             </a>
          </div>
        </div>

      </div>
      
      <div className="max-w-[1600px] mx-auto mt-24 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">© 2026 SmartyJo. All Rights Reserved.</p>
        <div className="flex gap-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
           {/* Payment Icons */}
           <div className="h-6 w-12 bg-slate-100 rounded"></div>
           <div className="h-6 w-12 bg-slate-100 rounded"></div>
           <div className="h-6 w-12 bg-slate-100 rounded"></div>
        </div>
      </div>
    </footer>
  );
}
