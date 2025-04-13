"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceStatusComponent } from "@/components/ServiceStatus";
import { IncidentList } from "@/components/IncidentList";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { trpc } from "@/utils/trpc";
import { useTeam } from "../../../components/TeamProvider";

interface Team {
  id: string;
  name: string;
  description: string | null;
}

const TeamSwitcher = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { selectedTeamId, setSelectedTeamId } = useTeam();
  const utils = trpc.useUtils();

  const { data: teams, isLoading, error } = trpc.teams.getAllForPublic.useQuery();

  // Select first team by default when teams are loaded
  useEffect(() => {
    if (teams && teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId, setSelectedTeamId]);

  useEffect(() => {
    console.log("Teams:", teams);
    console.log("Selected Team ID:", selectedTeamId);
    if (error) console.error("Error fetching teams:", error);
  }, [teams, selectedTeamId, error]);

  const currentTeam = teams?.find((team) => team.id === selectedTeamId);

  const filteredTeams = teams?.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (teamId: string) => {
    console.log("Selecting team ID:", teamId);
    setSelectedTeamId(teamId);
    setOpen(false);
  };

  if (isLoading) {
    return (
      <Button variant="outline" className="w-[200px] justify-between" disabled>
        Loading teams...
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {currentTeam?.name || "Select team"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search team..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandGroup>
            {filteredTeams && filteredTeams.length > 0 ? (
              filteredTeams.map((team: Team) => (
                <button
                  key={team.id}
                  onClick={() => handleSelect(team.id)}
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedTeamId === team.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {team.name}
                </button>
              ))
            ) : (
              <CommandEmpty>No team found.</CommandEmpty>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 

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
      ? (incident as any).services?.some((service:any) => service.teamId === selectedTeamId)
      : true
  );

  // Count active incidents (excluding RESOLVED)
  const activeIncidents = teamIncidents?.filter(
    incident => incident.status !== "RESOLVED"
  ).length;



  return (
    <div className="space-y-8 p-5">
      
        <TeamSwitcher/>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold mb-4">Services Status</h2>
          <ServiceStatusComponent />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Incidents</h2>
          <IncidentList showActions={false} />
        </div>
      </div>
    </div>
  );
} 