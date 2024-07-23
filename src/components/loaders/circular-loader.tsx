import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CircularLoaderProps {
  size?: number;
  className?: string;
}

function CircularLoader({ size, className }: CircularLoaderProps) {
  return (
    <Loader2 size={size} className={cn("mx-auto animate-spin", className)} />
  );
}
export default CircularLoader;
