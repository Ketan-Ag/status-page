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
import { IncidentForm } from "./IncidentForm";
import { Plus } from "lucide-react";
import { ExamplePopover } from "@/components/ExamplePopover"
import { IncidentStatus } from "@prisma/client";

interface IncidentDialogProps {
  incident?: {
    id: string;
    title: string;
    description: string;
    status: IncidentStatus;
    services?: { id: string }[];
  };
}

export function IncidentDialog({ incident }: IncidentDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {incident ? "Edit Incident" : "Create Incident"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {incident ? "Edit Incident" : "Create Incident"}
          </DialogTitle>
          <DialogDescription>
            {incident
              ? "Update the incident details below."
              : "Fill in the incident details below."}
          </DialogDescription>
        </DialogHeader>
        <IncidentForm incident={incident} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

// In your page or component:
<ExamplePopover /> 