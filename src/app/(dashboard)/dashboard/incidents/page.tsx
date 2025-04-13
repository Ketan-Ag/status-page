import { IncidentList } from "@/components/IncidentList";
import { IncidentDialog } from "@/components/IncidentDialog";

export default function IncidentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Incidents</h1>
        <IncidentDialog />
      </div>

      <IncidentList />
    </div>
  );
} 