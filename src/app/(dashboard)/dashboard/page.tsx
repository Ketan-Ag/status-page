"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceStatusComponent } from "@/components/ServiceStatus";
import { IncidentList } from "@/components/IncidentList";
import { trpc } from "@/utils/trpc";
import { useTeam } from "@/components/TeamProvider";
import { useEffect } from "react";

export default function DashboardPage() {
  const { selectedTeamId } = useTeam();
  const { data: services } = trpc.services.getAll.useQuery();
  const { data: incidents } = trpc.incidents.getAll.useQuery();

  useEffect(() => {
    console.log("Selected Team ID:", selectedTeamId);
    console.log("All Services:", services);
  }, [selectedTeamId, services]);

  // Filter services and incidents by selected team
  const teamServices = services?.filter(service => 
    selectedTeamId ? service.teamId === selectedTeamId : true
  );
  const teamIncidents = incidents?.filter(incident => 
    selectedTeamId 
      ? incident.services.some(service => service.teamId === selectedTeamId)
      : true
  );

  // Count active incidents (excluding RESOLVED)
  const activeIncidents = teamIncidents?.filter(
    incident => incident.status !== "RESOLVED"
  ).length;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamServices?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamIncidents?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIncidents || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold mb-4">Services Status</h2>
          <ServiceStatusComponent />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Incidents</h2>
          <IncidentList />
        </div>
      </div>
    </div>
  );
} 