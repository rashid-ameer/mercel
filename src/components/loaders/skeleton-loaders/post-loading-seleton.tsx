import { Skeleton } from "@/components/ui/skeleton";

function PostLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-[40%]" />
          <Skeleton className="h-4 w-[30%]" />
        </div>
      </div>
      <Skeleton className="h-16" />
    </div>
  );
}
export default PostLoadingSkeleton;
