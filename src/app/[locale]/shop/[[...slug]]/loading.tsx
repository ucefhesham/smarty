import { Skeleton } from "@/components/ui/Skeleton";
import ProductSkeleton from "@/components/product/ProductSkeleton";

export default function ShopLoading() {
  return (
    <div className="bg-[#f6f6f6] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-8 py-12 pt-24 md:pt-32">
        {/* Header Skeleton deleted but space kept via pt-32 */}

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Skeleton */}
          <aside className="w-full lg:w-72 shrink-0 space-y-8">
            <div className="bg-transparent rounded-[10px] p-6 border border-slate-100 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <div className="space-y-2 ps-2">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Product Grid Skeleton */}
          <div className="flex-grow">
            {/* Toolbar Skeleton */}
            <div className="flex justify-between items-center mb-8 bg-transparent py-4 px-6 rounded-[10px] border border-slate-100">
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
