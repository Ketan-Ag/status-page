"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ServiceForm } from "./ServiceForm";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

type ServiceStatus = "OPERATIONAL" | "DEGRADED_PERFORMANCE" | "PARTIAL_OUTAGE" | "MAJOR_OUTAGE";

interface Service {
  id: string;
  name: string;
  description: string | null;
  status: ServiceStatus;
  teamId: string | null;
}

interface ServiceDialogProps {
  service?: Service;
  selectedTeamId: string;
}

export function ServiceDialog({ service, selectedTeamId }: ServiceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const utils = trpc.useUtils();
  
  const deleteService = trpc.services.delete.useMutation({
    onSuccess: () => {
      toast.success("Service deleted successfully");
      utils.services.getAll.invalidate();
      setIsDeleteDialogOpen(false);
    },
  });

  const handleDelete = () => {
    if (service) {
      deleteService.mutate(service.id);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            {service ? (
              <PencilIcon className="h-4 w-4" />
            ) : (
              <>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Service
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {service ? "Edit Service" : "Add Service"}
            </DialogTitle>
          </DialogHeader>
          <ServiceForm 
            service={service} 
            selectedTeamId={selectedTeamId} 
            onSuccess={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {service && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="ml-2">
              <TrashIcon className="h-4 w-4 text-red-500" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Service</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to delete the service "{service.name}"?</p>
              <p className="text-sm text-muted-foreground mt-2">
                This action cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleteService.isPending}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
} 