"use client";

import { useState, useEffect, useMemo } from "react";
import { useCartStore } from "@/store/cartStore";
import { useTranslations } from "next-intl";
import { createOrder } from "@/app/actions/order";
import { motion } from "framer-motion";
import { ShoppingBag, CheckCircle2, ArrowLeft, Phone, MapPin, CreditCard, ChevronDown } from "lucide-react";
import { Link } from "@/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

const JORDAN_CITIES = [
  { en: "Amman", ar: "عمان" },
  { en: "Zarqa", ar: "الزرقاء" },
  { en: "Irbid", ar: "إربد" },
  { en: "Aqaba", ar: "العقبة" },
  { en: "Salt", ar: "السلط" },
  { en: "Madaba", ar: "مأدبا" },
  { en: "Jerash", ar: "جرش" },
  { en: "Ajloun", ar: "عجلون" },
  { en: "Karak", ar: "الكرك" },
  { en: "Ma'an", ar: "معان" },
  { en: "Tafilah", ar: "الطفيلة" },
  { en: "Mafraq", ar: "المفرق" },
  { en: "Russeifa", ar: "الرصيفة" },
  { en: "Sahab", ar: "سحاب" },
  { en: "Ramtha", ar: "الرمثا" },
];

interface CheckoutPageProps {
  locale: string;
  initialShippingMethods?: any[];
  initialPaymentGateways?: any[];
}

export default function CheckoutPage({ 
  locale, 
  initialShippingMethods = [],
  initialPaymentGateways = []
}: CheckoutPageProps) {
  const t = useTranslations('common');
  const { items, totalPrice, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gatewaysById = useMemo(() => new Map(initialPaymentGateways.map(g => [g.id, g])), [initialPaymentGateways]);
  const defaultGateway = gatewaysById.get('cod') || initialPaymentGateways[0];

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "+962 ",
    email: "",
    city: "Amman",
    address: "",
    notes: "",
    payment_method: defaultGateway?.id || "cod",
    payment_method_title: defaultGateway?.title || t('cash_on_delivery'),
    shipping_method: initialShippingMethods[0]?.id || "free_shipping",
    shipping_method_title: initialShippingMethods[0]?.title || t('free_shipping')
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Keep prefix
      if (!value.startsWith("+962 ")) return;
      
      // Clean up extra spaces/chars
      const digits = value.slice(5).replace(/\D/g, '').slice(0, 9);
      let formatted = "+962 ";
      if (digits.length > 0) formatted += digits.slice(0, 1);
      if (digits.length > 1) formatted += " " + digits.slice(1, 4);
      if (digits.length > 4) formatted += " " + digits.slice(4, 9);
      
      setFormData(prev => ({ ...prev, phone: formatted }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGatewaySelect = (gateway: any) => {
    setFormData(prev => ({
      ...prev,
      payment_method: gateway.id,
      payment_method_title: gateway.title
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    // Validate phone length
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 12) {
      setError(t('error_phone'));
      setIsProcessing(false);
      return;
    }

    const result = await createOrder(formData, items, locale);

    if (result.success) {
      setIsSuccess(true);
      clearCart();
    } else {
      setError(result.error || t('error_general'));
    }
    setIsProcessing(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8 bg-white p-12 rounded-[3rem] shadow-luxury"
        >
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
            <CheckCircle2 size={60} strokeWidth={1.5} />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-900">{t('order_success_title')}</h1>
            <p className="text-slate-500 font-medium leading-relaxed">{t('order_success_desc')}</p>
          </div>
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 px-12 py-5 bg-primary text-white rounded-2xl font-black hover:bg-slate-900 transition-all shadow-xl shadow-primary/20"
          >
            {t('back_to_home')}
          </Link>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-8 p-6">
         <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
            <ShoppingBag size={48} />
         </div>
         <h1 className="text-2xl font-black text-slate-900">{t('cart_empty')}</h1>
         <Link href="/shop" className="px-10 py-4 bg-primary text-white rounded-xl font-black">{t('start_shopping')}</Link>
      </div>
    );
  }

   return (
     <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16 lg:py-24 bg-background">
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Checkout Form */}
        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-4">
             <Link href="/shop" className="text-slate-400 font-bold flex items-center gap-2 hover:text-primary transition-colors text-sm">
                <ArrowLeft size={16} />
                {t('continue_shopping')}
             </Link>
             <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{t('checkout_title')}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                 <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">01</span>
                 {t('billing_details')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ps-1">{t('first_name')}</label>
                  <input required name="first_name" value={formData.first_name} onChange={handleInputChange} className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 font-black focus:border-primary transition-colors focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ps-1">{t('last_name')}</label>
                  <input required name="last_name" value={formData.last_name} onChange={handleInputChange} className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 font-black focus:border-primary transition-colors focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ps-1">{t('phone')}</label>
                  <div className="relative">
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 font-black focus:border-primary transition-colors focus:outline-none" />
                    <Phone size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ps-1">{t('email')}</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 font-black focus:border-primary transition-colors focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ps-1">{t('city')}</label>
                  <div className="relative">
                    <select 
                      required 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange} 
                      className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 font-black focus:border-primary transition-colors focus:outline-none appearance-none"
                    >
                      <option value="">{t('select_options')}</option>
                      {JORDAN_CITIES.map(c => (
                        <option key={c.en} value={c.en}>{locale === 'ar' ? c.ar : c.en}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ps-1">{t('address')}</label>
                  <div className="relative">
                    <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 font-black focus:border-primary transition-colors focus:outline-none" />
                    <MapPin size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ps-1">{t('order_notes')}</label>
                 <textarea name="notes" rows={4} value={formData.notes} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 font-black focus:border-primary transition-colors focus:outline-none resize-none" />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                 <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">02</span>
                 {t('payment_method')}
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                {initialPaymentGateways.map((gateway) => (
                  <label 
                    key={gateway.id}
                    onClick={() => handleGatewaySelect(gateway)}
                    className={cn(
                      "p-6 border-2 rounded-[2rem] flex items-center justify-between cursor-pointer transition-all duration-300",
                      formData.payment_method === gateway.id 
                        ? "bg-primary/5 border-primary shadow-luxury" 
                        : "bg-slate-50 border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-6">
                       <div className={cn(
                         "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                         formData.payment_method === gateway.id ? "bg-primary text-white" : "bg-white text-slate-400"
                       )}>
                          <CreditCard size={20} />
                       </div>
                       <div>
                          <p className="font-black text-slate-900">{gateway.title}</p>
                          <p className="text-xs font-bold text-slate-400 mt-1">{gateway.description}</p>
                       </div>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      formData.payment_method === gateway.id ? "border-primary bg-primary" : "border-slate-200"
                    )}>
                       {formData.payment_method === gateway.id && <div className="w-2.5 h-2.5 rounded-full bg-white animate-scale-in" />}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-6 bg-red-50 text-red-500 rounded-[2rem] text-sm font-black border border-red-100 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            <button 
              disabled={isProcessing}
              className="w-full h-20 bg-primary text-white rounded-[2rem] font-black text-xl hover:bg-slate-900 transition-all shadow-luxury-primary disabled:opacity-50 disabled:cursor-wait active:scale-[0.98]"
            >
              {isProcessing ? t('processing') : t('place_order')}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
           <div className="bg-slate-50 rounded-[4rem] p-10 lg:p-12 space-y-10 sticky top-32">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{t('order_summary')}</h2>
              
              <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="relative w-24 h-24 bg-white rounded-3xl overflow-hidden flex-shrink-0 border border-slate-100 group-hover:border-primary/20 transition-colors">
                      {item.image && <Image src={item.image} alt={item.name} fill className="object-contain p-2" />}
                    </div>
                    <div className="flex-grow flex flex-col justify-center space-y-2">
                       <h4 className="font-black text-slate-900 text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">{item.name}</h4>
                       <div className="flex items-center justify-between">
                          <span className="inline-flex items-center px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('qty')}: {item.quantity}</span>
                          <span className="font-black text-primary">{(item.price * item.quantity).toFixed(2)} {t('currency')}</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-10 border-t-2 border-dashed border-slate-200">
                 <div className="flex justify-between text-slate-400 font-black text-sm uppercase tracking-widest">
                    <span>{t('subtotal')}</span>
                    <span className="text-slate-900">{totalPrice().toFixed(2)} {t('currency')}</span>
                 </div>
                 <div className="flex justify-between text-slate-400 font-black text-sm uppercase tracking-widest">
                    <span>{t('shipping')}</span>
                    <div className="flex items-center gap-3">
                       {initialShippingMethods.length > 0 && (
                         <span className="text-[10px] bg-green-50 text-green-600 px-3 py-1 rounded-full">{initialShippingMethods[0].title}</span>
                       )}
                       <span className="text-green-600 font-black">{t('free_shipping')}</span>
                    </div>
                 </div>
                 <div className="flex justify-between pt-8 border-t-2 border-slate-200">
                    <div className="space-y-1">
                       <span className="text-2xl font-black text-slate-900 block tracking-tighter">{t('total')}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('tax_included')}</span>
                    </div>
                    <span className="text-4xl font-black text-primary tracking-tighter">{totalPrice().toFixed(2)} {t('currency')}</span>
                 </div>
              </div>

              <div className="p-6 bg-white/50 rounded-3xl border border-white/50 space-y-3">
                 <div className="flex items-center gap-3 text-slate-400 font-bold text-xs">
                    <CheckCircle2 size={14} className="text-primary" />
                    <span>{t('authorized_partner')}</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-400 font-bold text-xs">
                    <CheckCircle2 size={14} className="text-primary" />
                    <span>{t('secure_checkout')}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
