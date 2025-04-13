"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MaintenanceForm } from "./MaintenanceForm";
import { Plus } from "lucide-react";
import { MaintenanceStatus } from "@prisma/client";

interface MaintenanceDialogProps {
  maintenance?: {
    id: string;
    title: string;
    description: string;
    startTime: string | Date;
    endTime: string | Date;
    status: MaintenanceStatus;
    services?: { id: string; name: string }[];
  };
}

export function MaintenanceDialog({ maintenance }: MaintenanceDialogProps) {
  const [open, setOpen] = useState(false);

  const formattedMaintenance = maintenance ? {
    ...maintenance,
    startTime: new Date(maintenance.startTime),
    endTime: new Date(maintenance.endTime),
  } : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {maintenance ? "Edit Maintenance" : "Schedule Maintenance"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {maintenance ? "Edit Maintenance" : "Schedule Maintenance"}
          </DialogTitle>
          <DialogDescription>
            {maintenance
              ? "Update the maintenance details below."
              : "Fill in the maintenance details below."}
          </DialogDescription>
        </DialogHeader>
        <MaintenanceForm maintenance={formattedMaintenance} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
} 