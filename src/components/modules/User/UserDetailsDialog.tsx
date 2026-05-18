"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import { IUserResponse } from "@/types/user.types";

type UserDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: IUserResponse | null;
};

const UserDetailsDialog = ({
  open,
  onOpenChange,
  user,
}: UserDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>User details</DialogTitle>
        </DialogHeader>

        {user ? (
          <div className="grid gap-4 text-sm">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Name</Label>
              <p className="font-medium text-foreground">{user.name}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <p className="font-medium text-foreground">{user.email}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Role</Label>
                <p className="font-medium text-foreground">
                  {user?.role?.toLowerCase() || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <StatusBadgeCell status={user?.status || "ACTIVE"} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Phone</Label>
              <p className="font-medium text-foreground">{user.phone || "-"}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No user selected.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
