import { Skeleton } from "@/components/ui/skeleton";

function FollowUserSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-[60%]" />
        <Skeleton className="h-4 w-[40%]" />
      </div>

      <Skeleton className="h-10 w-20 rounded-full" />
    </div>
  );
}
export default FollowUserSkeleton;
