"use client";

import { trpc } from "@/utils/trpc";
import { MaintenanceDialog } from "./MaintenanceDialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MaintenanceStatus } from "@prisma/client";

function getMaintenanceStatusColor(status: MaintenanceStatus) {
  switch (status) {
    case "SCHEDULED":
      return "bg-blue-500";
    case "IN_PROGRESS":
      return "bg-yellow-500";
    case "COMPLETED":
      return "bg-green-500";
    case "CANCELLED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

export function MaintenanceList() {
  const { data: maintenances, isLoading } = trpc.maintenances.getAll.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!maintenances?.length) {
    return (
      <div className="text-center">
        <p className="text-sm text-muted-foreground">No scheduled maintenances</p>
        <div className="mt-4">
          <MaintenanceDialog />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scheduled Maintenances</h2>
        <MaintenanceDialog />
      </div>
      <div className="grid gap-4">
        {maintenances.map((maintenance) => (
          <div
            key={maintenance.id}
            className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{maintenance.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {maintenance.description}
                </p>
              </div>
              <Badge className={getMaintenanceStatusColor(maintenance.status)}>
                {maintenance.status}
              </Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="text-sm">
                <span className="font-medium">Start:</span>{" "}
                {format(new Date(maintenance.startTime), "PPp")}
              </div>
              <div className="text-sm">
                <span className="font-medium">End:</span>{" "}
                {format(new Date(maintenance.endTime), "PPp")}
              </div>
            </div>
            {maintenance.services?.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Affected Services:</div>
                <div className="flex flex-wrap gap-2">
                  {maintenance.services.map((service) => (
                    <Badge key={service.id} variant="outline">
                      {service.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <MaintenanceDialog maintenance={maintenance} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 