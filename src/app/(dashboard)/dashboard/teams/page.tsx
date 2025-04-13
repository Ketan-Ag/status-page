"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

export default function TeamsPage() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const { data: teams, isLoading } = trpc.teams.getAll.useQuery();

  const createTeam = trpc.teams.create.useMutation({
    onSuccess: () => {
      toast.success("Team created successfully");
      utils.teams.getAll.invalidate();
      setOpen(false);
      setName("");
      setDescription("");
    },
  });

  const deleteTeam = trpc.teams.delete.useMutation({
    onSuccess: () => {
      toast.success("Team deleted successfully");
      utils.teams.getAll.invalidate();
      setTeamToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message);
      setTeamToDelete(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTeam.mutate({ name, description });
  };

  const handleDelete = (teamId: string) => {
    deleteTeam.mutate({ id: teamId });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teams</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Team</DialogTitle>
              <DialogDescription>
                Create a new team to organize services and manage incidents.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter team name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter team description"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={createTeam.isPending}
              >
                Create Team
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div>Loading teams...</div>
      ) : teams?.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No teams found. Create your first team to get started.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams?.map((team) => (
            <div
              key={team.id}
              className="rounded-lg border p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">{team.name}</h2>
                  {team.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {team.description}
                    </p>
                  )}
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setTeamToDelete(team.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the team
                        "{team.name}" and all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(team.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 