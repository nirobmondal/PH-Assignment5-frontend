import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/types/auth.types";

interface IStatusBadgeCellProps {
  status: UserStatus;
}

const StatusBadgeCell = ({ status }: IStatusBadgeCellProps) => {
  return (
    <Badge
      variant={
        status === UserStatus.ACTIVE
          ? "default"
          : status === UserStatus.BANNED
            ? "destructive"
            : "secondary"
      }
      // className="px-2 py-1"
    >
      <span className="text-sm capitalize">{status.toLowerCase()}</span>
    </Badge>
  );
};

export default StatusBadgeCell;
