"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";

type ServiceStatus = "OPERATIONAL" | "DEGRADED_PERFORMANCE" | "PARTIAL_OUTAGE" | "MAJOR_OUTAGE";

interface ServiceFormProps {
  service?: {
    id: string;
    name: string;
    description: string | null;
    status: ServiceStatus;
    teamId: string | null;
  };
  selectedTeamId?: string;
  onSuccess?: () => void;
}

export function ServiceForm({ service, selectedTeamId, onSuccess }: ServiceFormProps) {
  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [status, setStatus] = useState<ServiceStatus>(service?.status ?? "OPERATIONAL");
  const [teamId, setTeamId] = useState(service?.teamId ?? selectedTeamId ?? "");

  const utils = trpc.useUtils();
  const { data: teams } = trpc.teams.getAll.useQuery();

  // Update teamId when selectedTeamId changes
  useEffect(() => {
    if (selectedTeamId && !service) {
      setTeamId(selectedTeamId);
    }
  }, [selectedTeamId, service]);

  const createService = trpc.services.create.useMutation({
    onSuccess: () => {
      toast.success("Service created successfully");
      utils.services.getAll.invalidate();
      onSuccess?.();
    },
  });

  const updateService = trpc.services.update.useMutation({
    onSuccess: () => {
      toast.success("Service updated successfully");
      utils.services.getAll.invalidate();
      onSuccess?.();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamId) {
      toast.error("Please select a team");
      return;
    }

    const serviceData = {
      name,
      description: description || undefined,
      status,
      teamId,
    };

    if (service) {
      updateService.mutate({
        id: service.id,
        data: serviceData,
      });
    } else {
      createService.mutate(serviceData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="team" className="text-sm font-medium">
          Team
        </label>
        <select
          id="team"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          required
          disabled={!!service}
        >
          <option value="">Select a team</option>
          {teams?.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ServiceStatus)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="OPERATIONAL">Operational</option>
          <option value="DEGRADED_PERFORMANCE">Degraded Performance</option>
          <option value="PARTIAL_OUTAGE">Partial Outage</option>
          <option value="MAJOR_OUTAGE">Major Outage</option>
        </select>
      </div>

      <Button type="submit" disabled={createService.isPending || updateService.isPending}>
        {service ? "Update Service" : "Create Service"}
      </Button>
    </form>
  );
} 