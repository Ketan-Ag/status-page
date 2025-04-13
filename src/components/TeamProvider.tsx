"use client";

import { createContext, useContext, useState } from "react";

interface TeamContextType {
  selectedTeamId: string | null;
  setSelectedTeamId: (teamId: string | null) => void;
}

export const TeamContext = createContext<TeamContextType>({
  selectedTeamId: null,
  setSelectedTeamId: () => {},
});

export function useTeam() {
  return useContext(TeamContext);
}

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  return (
    <TeamContext.Provider value={{ selectedTeamId, setSelectedTeamId }}>
      {children}
    </TeamContext.Provider>
  );
} 