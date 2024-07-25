interface UserStatsProps {
  title: string;
  count: number;
  className?: string;
}

function UserStats({ title, count, className }: UserStatsProps) {
  return (
    <p className={className}>
      {title}: <span className="font-semibold">{count}</span>
    </p>
  );
}
export default UserStats;
