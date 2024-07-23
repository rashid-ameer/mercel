import { useInView } from "react-intersection-observer";

interface InfiniteScrollProps {
  children: React.ReactNode;
  className?: string;
  onBottomReached: () => void;
}

function InfiniteScroll({
  children,
  className,
  onBottomReached,
}: InfiniteScrollProps) {
  const { ref } = useInView({
    rootMargin: "200px",
    onChange: (inView) => {
      if (inView) {
        onBottomReached();
      }
    },
  });

  return (
    <section className={className}>
      {children}
      <div ref={ref} />
    </section>
  );
}
export default InfiniteScroll;
