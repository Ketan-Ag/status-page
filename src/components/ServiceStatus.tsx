"use client";

import { Button } from "./ui/button";
import { WrenchIcon } from "@heroicons/react/24/outline";
import { useTeam } from "./TeamProvider";
import { trpc } from "@/utils/trpc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServiceStatusProps {
  showActions?: boolean;
}

type ServiceStatusType = "OPERATIONAL" | "DEGRADED_PERFORMANCE" | "PARTIAL_OUTAGE" | "MAJOR_OUTAGE";

interface Service {
  id: string;
  name: string;
  description: string | null;
  status: ServiceStatusType;
  teamId: string | null;
}

const serviceStatuses = [
  { value: "OPERATIONAL", label: "Operational" },
  { value: "DEGRADED_PERFORMANCE", label: "Degraded Performance" },
  { value: "PARTIAL_OUTAGE", label: "Partial Outage" },
  { value: "MAJOR_OUTAGE", label: "Major Outage" },
] as const;

export function ServiceStatusComponent({ showActions = false }: ServiceStatusProps) {
  const { selectedTeamId } = useTeam();
  const utils = trpc.useContext();

  const { data: services, isLoading } = trpc.services.getAll.useQuery();
  const { mutate: updateService } = trpc.services.update.useMutation({
    onSuccess: () => {
      utils.services.getAll.invalidate();
    },
  });

  const handleStatusChange = (service: Service, newStatus: ServiceStatusType) => {
    updateService({
      id: service.id,
      status: newStatus,
    });
  };

  const handleMaintenance = (service: Service) => {
    updateService({
      id: service.id,
      status: service.status === "DEGRADED_PERFORMANCE" ? "OPERATIONAL" : "DEGRADED_PERFORMANCE",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!services || services.length === 0) {
    return <div>No services found for the selected team.</div>;
  }

  const filteredServices = selectedTeamId
    ? services.filter((service) => service.teamId === selectedTeamId)
    : services;

  if (filteredServices.length === 0) {
    return <div>No services found for the selected team.</div>;
  }

  return (
    <div className="space-y-4">
      {filteredServices.map((service) => (
        <div
          key={service.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div>
            <h3 className="text-lg font-medium">{service.name}</h3>
            {service.description && (
              <p className="text-sm text-gray-500">{service.description}</p>
            )}
            <div className="mt-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  service.status === "OPERATIONAL"
                    ? "bg-green-100 text-green-800"
                    : service.status === "DEGRADED_PERFORMANCE"
                    ? "bg-yellow-100 text-yellow-800"
                    : service.status === "PARTIAL_OUTAGE"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {service.status}
              </span>
            </div>
          </div>
          {showActions && (
            <div className="flex items-center gap-2">
              <Select
                value={service.status}
                onValueChange={(value) => handleStatusChange(service, value as ServiceStatusType)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {serviceStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => handleMaintenance(service)}
                title="Put under maintenance"
              >
                <WrenchIcon className="h-4 w-4" />
              </Button> */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 