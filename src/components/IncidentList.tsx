"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { trpc } from "@/utils/trpc";
import { useTeam } from "./TeamProvider";
import { Button } from "@/components/ui/button";
import { CalendarClock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const statusColors = {
  INVESTIGATING: "bg-blue-500",
  IDENTIFIED: "bg-yellow-500",
  MONITORING: "bg-orange-500",
  RESOLVED: "bg-green-500",
  SCHEDULED: "bg-purple-500",
};

const impactColors = {
  NONE: "bg-gray-500",
  MINOR: "bg-yellow-500",
  MAJOR: "bg-orange-500",
  CRITICAL: "bg-red-500",
};

interface IncidentListProps {
  showActions?: boolean;
}

export function IncidentList({ showActions = true }: IncidentListProps) {
  const { data: incidents, isLoading } = trpc.incidents.getAll.useQuery();
  const { data: services } = trpc.services.getAll.useQuery();
  const { selectedTeamId } = useTeam();
  const utils = trpc.useUtils();

  const updateIncident = trpc.incidents.update.useMutation({
    onSuccess: () => {
      utils.incidents.getAll.invalidate();
    },
  });

  // Get all service IDs for the selected team
  const teamServiceIds = services
    ?.filter((service) => service.teamId === selectedTeamId)
    .map((service) => service.id);

  // Only filter by team if showActions is true (admin view)
  const displayedIncidents = showActions
    ? incidents?.filter((incident) =>
        incident.services.some((service) => teamServiceIds?.includes(service.id))
      )
    : incidents;

  const handleResolve = (incident: any) => {
    updateIncident.mutate({
      id: incident.id,
      title: incident.title,
      description: incident.description,
      status: "RESOLVED",
      impact: incident.impact,
      services: incident.services.map((s: any) => s.id),
    }, {
      onSuccess: () => {
        toast.success("Incident marked as resolved");
      },
      onError: (error) => {
        toast.error("Failed to resolve incident: " + error.message);
      }
    });
  };

  const handleScheduleMaintenance = (incident: any) => {
    updateIncident.mutate({
      id: incident.id,
      title: incident.title,
      description: incident.description,
      status: "MONITORING",
      impact: incident.impact,
      services: incident.services.map((s: any) => s.id),
    }, {
      onSuccess: () => {
        toast.success("Incident scheduled for maintenance");
      },
      onError: (error) => {
        toast.error("Failed to schedule maintenance: " + error.message);
      }
    });
  };

  if (isLoading) {
    return <div>Loading incidents...</div>;
  }

  if (!displayedIncidents || displayedIncidents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {showActions 
          ? "No incidents found for the selected team. Create your first incident to get started."
          : "No incidents found for the selected team."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayedIncidents.map((incident) => (
        <Card key={incident.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{incident.title}</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <Badge
                    className={`${
                      statusColors[incident.status as keyof typeof statusColors]
                    } text-white`}
                  >
                    {incident.status}
                  </Badge>
                  <Badge
                    className={`${
                      impactColors[incident.impact as keyof typeof impactColors]
                    } text-white`}
                  >
                    {incident.impact}
                  </Badge>
                </div>
                {showActions && incident.status !== "RESOLVED" && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolve(incident)}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Resolve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              {incident.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                Affected Services:{" "}
                {incident.services
                  .filter((service) => teamServiceIds?.includes(service.id))
                  .map((s) => s.name)
                  .join(", ") || "None"}
              </span>
              <span>•</span>
              <span>
                Started: {format(new Date(incident.createdAt), "MMM d, yyyy HH:mm")}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 