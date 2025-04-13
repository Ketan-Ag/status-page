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
import { MaintenanceStatus } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MaintenanceFormProps {
  maintenance?: {
    id: string;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    status: MaintenanceStatus;
    services?: { id: string }[];
  };
  onSuccess: () => void;
}

export function MaintenanceForm({ maintenance, onSuccess }: MaintenanceFormProps) {
  const [title, setTitle] = useState(maintenance?.title ?? "");
  const [description, setDescription] = useState(maintenance?.description ?? "");
  const [status, setStatus] = useState<MaintenanceStatus>(maintenance?.status ?? MaintenanceStatus.SCHEDULED);
  const [startTime, setStartTime] = useState<Date>(maintenance?.startTime ?? new Date());
  const [endTime, setEndTime] = useState<Date>(maintenance?.endTime ?? new Date());
  const [selectedServices, setSelectedServices] = useState<string[]>(maintenance?.services?.map(s => s.id) ?? []);

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

  const createMaintenance = trpc.maintenances.create.useMutation({
    onSuccess: () => {
      toast.success("Maintenance scheduled successfully");
      utils.maintenances.getAll.invalidate();
      onSuccess();
    },
  });

  const updateMaintenance = trpc.maintenances.update.useMutation({
    onSuccess: () => {
      toast.success("Maintenance updated successfully");
      utils.maintenances.getAll.invalidate();
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (maintenance) {
      updateMaintenance.mutate({
        id: maintenance.id,
        title,
        description,
        status,
        startTime,
        endTime,
        services: selectedServices,
      });
    } else {
      createMaintenance.mutate({
        title,
        description,
        status,
        startTime,
        endTime,
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Time</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startTime && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startTime ? format(startTime, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startTime}
                onSelect={(date) => date && setStartTime(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>End Time</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endTime && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endTime ? format(endTime, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endTime}
                onSelect={(date) => date && setEndTime(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as MaintenanceStatus)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(MaintenanceStatus).map((status) => (
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
          {filteredServices?.map((service) => (
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
        {!isLoading && !filteredServices?.length && (
          <p className="text-sm text-muted-foreground">No services found</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={createMaintenance.isPending || updateMaintenance.isPending}
      >
        {maintenance ? "Update" : "Schedule"} Maintenance
      </Button>
    </form>
  );
} 