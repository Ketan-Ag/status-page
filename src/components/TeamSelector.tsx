"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/utils/trpc";
import { ChevronDown } from "lucide-react";

interface TeamSelectorProps {
  onTeamChange?: (teamId: string) => void;
}

export function TeamSelector({ onTeamChange }: TeamSelectorProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const { data: teams, isLoading } = trpc.teams.getAll.useQuery();

  // Set the first team as selected by default when teams are loaded
  useEffect(() => {
    if (teams && teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
      if (onTeamChange) {
        onTeamChange(teams[0].id);
      }
    }
  }, [teams, selectedTeamId, onTeamChange]);

  const handleTeamChange = (teamId: string) => {
    setSelectedTeamId(teamId);
    if (onTeamChange) {
      onTeamChange(teamId);
    }
  };

  if (isLoading) {
    return <div>Loading teams...</div>;
  }

  if (!teams || teams.length === 0) {
    return <div>No teams available</div>;
  }

  const selectedTeam = teams.find((team) => team.id === selectedTeamId);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Team:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            {selectedTeam?.name || "Select Team"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {teams.map((team) => (
            <DropdownMenuItem
              key={team.id}
              onClick={() => handleTeamChange(team.id)}
            >
              {team.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 