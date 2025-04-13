"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeam } from "./TeamProvider";
import { IncidentStatus } from "@prisma/client";
import { Label } from "@/components/ui/label";

interface IncidentFormProps {
  incident?: {
    id: string;
    title: string;
    description: string;
    status: IncidentStatus;
    services?: { id: string }[];
  };
  onSubmit: (data: {
    title: string;
    description: string;
    status: IncidentStatus;
    serviceIds: string[];
  }) => void;
}

export function IncidentForm({ incident, onSubmit }: IncidentFormProps) {
  const [title, setTitle] = useState(incident?.title ?? "");
  const [description, setDescription] = useState(incident?.description ?? "");
  const [status, setStatus] = useState<IncidentStatus>(incident?.status ?? IncidentStatus.INVESTIGATING);
  const [selectedServices, setSelectedServices] = useState<string[]>(incident?.services?.map(s => s.id) ?? []);

  const { selectedTeamId } = useTeam();
  const utils = trpc.useUtils();

  const { data: teamServices, isLoading } = trpc.services.getAll.useQuery(
    undefined,
    {
      enabled: !!selectedTeamId,
    }
  );

  const filteredServices = teamServices?.filter(
    (service) => service.teamId === selectedTeamId
  );
  
  const createIncident = trpc.incidents.create.useMutation({
    onSuccess: () => {
      toast.success("Incident created successfully");
      utils.incidents.getAll.invalidate();
      onSubmit({
        title,
        description,
        status,
        serviceIds: selectedServices,
      });
    },
  });

  const updateIncident = trpc.incidents.update.useMutation({
    onSuccess: () => {
      toast.success("Incident updated successfully");
      utils.incidents.getAll.invalidate();
      onSubmit({
        title,
        description,
        status,
        serviceIds: selectedServices,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (incident) {
      updateIncident.mutate({
        id: incident.id,
        title,
        description,
        status,
        services: selectedServices,
      });
    } else {
      createIncident.mutate({
        title,
        description,
        status,
        services: selectedServices,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as IncidentStatus)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(IncidentStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Affected Services</Label>
        <div className="flex flex-wrap gap-2">
          {teamServices?.map((service) => (
            <Button
              key={service.id}
              type="button"
              variant={selectedServices.includes(service.id) ? "default" : "outline"}
              onClick={() => {
                setSelectedServices((prev) =>
                  prev.includes(service.id)
                    ? prev.filter((id) => id !== service.id)
                    : [...prev, service.id]
                );
              }}
            >
              {service.name}
            </Button>
          ))}
        </div>
        {isLoading && <p className="text-sm text-muted-foreground">Loading services...</p>}
        {!isLoading && !teamServices?.length && (
          <p className="text-sm text-muted-foreground">No services found</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={createIncident.isPending || updateIncident.isPending}
      >
        {incident ? "Update" : "Create"} Incident
      </Button>
    </form>
  );
} 