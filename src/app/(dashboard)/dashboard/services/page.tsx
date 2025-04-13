import { ServiceStatusComponent } from "@/components/ServiceStatus";

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Services</h1>
      </div>

      <ServiceStatusComponent showActions={true} />
    </div>
  );
} 