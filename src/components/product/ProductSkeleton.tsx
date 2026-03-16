import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export default function ProductSkeleton() {
  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden relative rounded-[10px] p-4 transition-all duration-300">
      {/* Image Skeleton */}
      <div className="relative aspect-square overflow-hidden mb-4 rounded-lg">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Title Skeleton */}
      <div className="flex flex-col flex-grow space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        
        {/* Rating Skeleton */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-3.5 h-3.5 rounded-full" />
          ))}
        </div>

        {/* Stock Status */}
        <Skeleton className="h-3 w-1/3" />

        {/* Pricing Skeleton */}
        <div className="mt-auto pt-4 flex gap-2">
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Button Skeleton */}
        <Skeleton className="h-10 w-full mt-4" />

        {/* Brand Skeleton */}
        <Skeleton className="h-3 w-1/4 mt-4" />
      </div>
    </div>
  );
}
