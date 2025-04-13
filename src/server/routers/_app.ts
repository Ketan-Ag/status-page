import { router } from "../trpc";
import { servicesRouter } from "./services";
import { incidentsRouter } from "./incidents";
import { teamsRouter } from "./teams";
import { usersRouter } from "./users";
import { maintenancesRouter } from "./maintenances";

export const appRouter = router({
  services: servicesRouter,
  incidents: incidentsRouter,
  teams: teamsRouter,
  users: usersRouter,
  maintenances: maintenancesRouter,
});

export type AppRouter = typeof appRouter; 