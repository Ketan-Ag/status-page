import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
            <CardDescription>
              Manage your organization settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Organization Name</label>
              <input
                type="text"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Enter organization name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Organization Slug</label>
              <input
                type="text"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Enter organization slug"
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Manage team members and their roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Invite Team Member</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure notification settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium">Email Notifications</label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for incidents and updates
                </p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 