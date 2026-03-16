"use server";

import { fetchFromWP } from "@/lib/wordpress";

export async function createOrder(formData: any, items: any[], locale: string) {
  try {
    const line_items = items.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      variation_id: item.variation_id || 0
    }));

    const orderData = {
      payment_method: formData.payment_method || "cod",
      payment_method_title: formData.payment_method_title || (locale === 'ar' ? "الدفع عند الاستلام" : "Cash on Delivery"),
      set_paid: false,
      billing: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        address_1: formData.address,
        city: formData.city,
        email: formData.email,
        phone: formData.phone,
        country: "JO"
      },
      shipping: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        address_1: formData.address,
        city: formData.city,
        country: "JO"
      },
      line_items,
      shipping_lines: formData.shipping_method ? [
        {
          method_id: formData.shipping_method,
          method_title: formData.shipping_method_title,
          total: "0" // Shipping is free as per requirements
        }
      ] : [],
      customer_note: formData.notes || "",
      meta_data: [
        { key: "_locale", value: locale }
      ]
    };

    const res = await fetchFromWP("/wc/v3/orders", {
      method: "POST",
      body: JSON.stringify(orderData)
    });

    if (res.error || res.code) {
      throw new Error(res.message || "Failed to create order");
    }

    return { success: true, order: res };
  } catch (error: any) {
    console.error("[createOrder] Error:", error);
    return { success: false, error: error.message };
  }
}
