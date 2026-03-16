import React from 'react';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { fetchFromWP, getProducts, getProductBySlug, getCategoryWPC } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import { redirect } from '@/navigation';
import ProductGallery from '@/components/product/ProductGallery';
import ProductCard from '@/components/product/ProductCard';
import SectionHeader from '@/components/ui/SectionHeader';
import AddToCartButton from '@/components/product/AddToCartButton';
import CustomProductOptions from '@/components/product/CustomProductOptions';
import ProductPurchaseActions from '@/components/product/ProductPurchaseActions';
import ProductAttributes from '@/components/product/ProductAttributes';
import { ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw, Star, Share2, Facebook, Twitter, Instagram as InstagramIcon, Linkedin, Grid, ChevronLeft, ChevronRight, Tags, MessageCircle, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';

async function getProduct(idOrSlug: string, lang = 'en') {
  if (/^\d+$/.test(idOrSlug)) {
    try {
      return await fetchFromWP(`/wc/v3/products/${idOrSlug}?lang=${lang}`);
    } catch (e) {
      return await getProductBySlug(idOrSlug, lang);
    }
  } else {
    return await getProductBySlug(idOrSlug, lang);
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string, locale: string }> }): Promise<Metadata> {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  const product = await getProduct(id, locale);
  
  if (!product) return { title: t('shop_no_products') };

  const productName = product.name.includes('%') ? decodeURIComponent(product.name) : product.name;
  const description = product.short_description 
    ? product.short_description.replace(/<[^>]*>?/gm, '').substring(0, 160).trim()
    : productName;
  const siteName = t('title');

  return {
    title: `${productName} | ${siteName}`,
    description: description,
    openGraph: {
      title: `${productName} | ${siteName}`,
      description: description,
      type: 'article',
      images: product.images?.[0] ? [
        {
          url: product.images[0].src,
          width: 800,
          height: 800,
          alt: productName,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${productName} | ${siteName}`,
      description: description,
      images: product.images?.[0] ? [product.images[0].src] : [],
    },
  };
}

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ id: string, locale: string }> 
}) {
  const p = await params;
  const { id: idOrSlug, locale } = p;
  
  // Enable static rendering
  setRequestLocale(locale);
  const isRtl = locale === 'ar';

  // 1. Fetch main product
  let product = await getProduct(idOrSlug, locale);

  // Automatic Translation Switching Logic for Product
  if (!product) {
    const otherLocale = locale === 'en' ? 'ar' : 'en';
    const otherProduct = await getProduct(idOrSlug, otherLocale);
    
    if (otherProduct && otherProduct.translations && otherProduct.translations[locale]) {
      const targetId = otherProduct.translations[locale];
      const targetProduct = await getProduct(String(targetId), locale);
      if (targetProduct) {
        redirect({ href: `/product/${targetProduct.slug || targetProduct.id}`, locale });
      }
    }
  }

  if (!product) {
    notFound();
  }

  // 2. Fetch everything else in parallel
  const [translations, relatedData, wpcData, variations] = await Promise.all([
    getTranslations('common'),
    (async () => {
      const relatedIds = product.related_ids?.slice(0, 4) || [];
      return relatedIds.length > 0 
        ? getProducts(`include=${relatedIds.join(',')}`, locale)
        : { products: [] };
    })(),
    (async () => {
      if (!product.categories || product.categories.length === 0) return null;
      // Fetch WPC options for all categories in parallel and take the first one that returns results
      const results = await Promise.all(
        product.categories.map((cat: any) => getCategoryWPC(cat.name, locale))
      );
      return results.filter(res => res !== null)[0] || null;
    })(),
    (async () => {
      if (product.type === 'variable') {
        const { getProductVariations } = await import('@/lib/wordpress');
        return getProductVariations(product.id, locale);
      }
      return [];
    })()
  ]);

  const t = translations;
  const { products: relatedProducts } = relatedData;
  const categoryOptions = wpcData;

  const isOutOfStock = product.stock_status === 'outofstock';

  return (
    <div className="bg-white pt-2 md:pt-4">
      {/* Top Navigation Bar: Breadcrumbs and Prev/Next */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-[13px] text-slate-400 font-medium list-none">
            <li><Link href="/" className="hover:text-primary transition-colors">{t('home')}</Link></li>
              <li>
                <div className="flex items-center gap-2">
                  <ChevronRight size={14} className={cn("text-slate-300", isRtl && "rotate-180")} />
                  <Link href="/shop" className="hover:text-primary transition-colors">{t('all_products')}</Link>
                </div>
              </li>
              {product.categories?.[0] && (
                <li>
                  <div className="flex items-center gap-2">
                    <ChevronRight size={14} className={cn("text-slate-300", isRtl && "rotate-180")} />
                    <Link href={`/shop/${product.categories[0].slug}`} className="hover:text-primary transition-colors line-clamp-1">
                      {product.categories[0].name.includes('%') ? decodeURIComponent(product.categories[0].name) : product.categories[0].name}
                    </Link>
                  </div>
                </li>
              )}
              <li>
                <div className="flex items-center gap-2">
                  <ChevronRight size={14} className={cn("text-slate-300", isRtl && "rotate-180")} />
                  <span className="text-slate-900 font-bold line-clamp-1">
                    {product.name.includes('%') ? decodeURIComponent(product.name) : product.name}
                  </span>
                </div>
              </li>
          </nav>
         
         <div className="flex items-center gap-3">
            <button className="text-slate-300 hover:text-primary transition-colors"><ChevronLeft size={20} /></button>
            <button className="text-slate-300 hover:text-primary transition-colors"><Grid size={18} /></button>
            <button className="text-slate-300 hover:text-primary transition-colors"><ChevronRight size={20} /></button>
         </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Gallery (5/12 cols) */}
          <div className="lg:col-span-5">
            <ProductGallery images={product.images} />
          </div>

          {/* Right: Info (7/12 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
               <div className="flex items-center gap-2 group cursor-pointer border-r border-slate-100 pr-4 rtl:pr-0 rtl:pl-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('sku')}:</span>
                  <span className="text-[11px] font-black text-slate-900 group-hover:text-primary transition-colors">{product.sku || 'N/A'}</span>
               </div>
               
               <div className="flex items-center gap-2">
                  <div className="relative flex h-2 w-2">
                     <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isOutOfStock ? "bg-red-400" : "bg-green-400")}></span>
                     <span className={cn("relative inline-flex rounded-full h-2 w-2", isOutOfStock ? "bg-red-500" : "bg-green-500")}></span>
                  </div>
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                     {isOutOfStock ? t('out_of_stock') : t('stock_ready')}
                  </span>
               </div>
               <div className="flex text-amber-400 gap-0.5">
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
               </div>
            </div>

            {/* Short Description */}
            <div 
               className="text-sm text-slate-600 leading-relaxed font-medium mb-8 prose prose-sm prose-slate" 
               dangerouslySetInnerHTML={{ __html: product.short_description || "" }} 
            />

            <ProductPurchaseActions 
              product={product} 
              categoryOptions={categoryOptions} 
              variations={variations}
              locale={locale} 
            />

            {/* Footer Links */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-50 mt-auto">
               <div className="flex items-center gap-8 py-6 border-y border-slate-50">
               <button className="flex items-center gap-2.5 text-[11px] font-black text-slate-900 uppercase tracking-widest hover:text-primary transition-all group">
                  <ArrowLeftRight size={16} className="text-slate-300 group-hover:text-primary group-hover:rotate-12 transition-all" />
                  {t('compare')}
               </button>
               <button className="flex items-center gap-2.5 text-[11px] font-black text-slate-900 uppercase tracking-widest hover:text-primary transition-all group">
                  <Heart size={16} className="text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all" />
                  {t('wishlist')}
               </button>
               <div className="ms-auto flex items-center gap-4">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('share')}:</span>
                  <div className="flex items-center gap-2">
                  {[Facebook, Twitter, InstagramIcon, Linkedin].map((Icon, i) => (
                     <button key={i} className="text-slate-300 hover:text-slate-600 transition-colors">
                        <Icon size={18} />
                     </button>
                  ))}
                  </div>
               </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Content Tabs */}
      <div className="bg-[#f9f9f9] border-y border-slate-100">
         <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-20">
            <div className="flex flex-col md:flex-row gap-20">
               <div className="md:w-1/3 xl:w-1/4">
                  <div className="flex flex-col gap-6 sticky top-32">
                     {[
                        { id: 'description', label: t('tab_description') },
                        { id: 'info', label: t('tab_info') },
                        { id: 'reviews', label: t('tab_reviews') },
                        { id: 'shipping', label: t('tab_shipping') }
                     ].map((tab) => (
                        <button 
                           key={tab.id}
                           className={cn(
                              "text-left rtl:text-right text-xl py-2 pl-6 rtl:pl-0 rtl:pr-6 transition-all",
                              tab.id === 'description' 
                                 ? "font-black text-slate-900 border-l-4 rtl:border-l-0 rtl:border-r-4 border-primary" 
                                 : "font-bold text-slate-400 hover:text-slate-600"
                           )}
                        >
                           {tab.label}
                        </button>
                     ))}
                  </div>
               </div>
               <div className="flex-grow">
                  <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-p:text-slate-600 prose-p:leading-loose">
                     <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Related Products */}
      <div className="bg-slate-50 py-24">
         <div className="max-w-[1440px] mx-auto px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">{t('related_products')}</h2>
               <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
