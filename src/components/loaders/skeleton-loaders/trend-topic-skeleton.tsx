import { Skeleton } from "@/components/ui/skeleton";

function TrendTopicSkeleton() {
  return (
    <div className="space-y-1">
      <Skeleton className="h-4 w-[40%]" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
}
export default TrendTopicSkeleton;
