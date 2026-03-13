import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      
      {/* Image */}
      <Skeleton className="aspect-[4/3] w-full" />

      <div className="p-4 space-y-3">

        {/* Title */}
        <Skeleton className="h-5 w-3/4" />

        {/* Location */}
        <Skeleton className="h-4 w-1/2" />

        {/* Amenities */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-12 rounded-md" />
          <Skeleton className="h-5 w-12 rounded-md" />
          <Skeleton className="h-5 w-12 rounded-md" />
        </div>

        {/* Price */}
        <Skeleton className="h-6 w-24" />

      </div>

    </div>
  );
};

export default SkeletonCard;