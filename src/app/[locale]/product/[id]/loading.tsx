import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductLoading() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Gallery Skeleton */}
          <div className="flex-grow max-w-2xl">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-12">
               <Skeleton className="w-full h-full" />
            </div>
            {/* Thumbnails Skeleton */}
            <div className="flex gap-4 mt-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="w-full lg:w-[450px] space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-1/4" />
            </div>

            <div className="space-y-4 pt-8 border-t border-slate-100">
               <Skeleton className="h-12 w-full rounded-xl" />
               <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            <div className="space-y-6 pt-8">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className="space-y-2">
                   <Skeleton className="h-4 w-1/3" />
                   <Skeleton className="h-20 w-full rounded-xl" />
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
