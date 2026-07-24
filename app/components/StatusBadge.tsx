import { statuses } from "@/lib/site-config";

export function StatusBadge({ status }: { status: string }) {
  const label = statuses[status as keyof typeof statuses] || status;
  return <span className={`status status-${status}`}><span aria-hidden="true" className="status-dot" />{label}</span>;
}
