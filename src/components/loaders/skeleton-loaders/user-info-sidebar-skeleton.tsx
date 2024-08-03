import { Skeleton } from "@/components/ui/skeleton";

function UserInfoSidebarSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-2">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-[40%]" />
          <Skeleton className="h-4 w-[25%]" />
        </div>
      </div>

      <div className="space-y-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <Skeleton className="h-10 w-20 rounded-full" />
    </div>
  );
}
export default UserInfoSidebarSkeleton;
