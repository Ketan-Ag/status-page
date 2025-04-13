import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { MaintenanceStatus } from "@prisma/client";

const maintenanceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  startTime: z.date(),
  endTime: z.date(),
  status: z.nativeEnum(MaintenanceStatus),
  services: z.array(z.string()).optional(),
});

export const maintenancesRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
      select: { organizationId: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return ctx.prisma.maintenance.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: {
        services: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return ctx.prisma.maintenance.findUnique({
        where: {
          id: input,
          organizationId: user.organizationId,
        },
        include: {
          services: true,
        },
      });
    }),

  create: protectedProcedure
    .input(maintenanceSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const { services, ...maintenanceData } = input;

      return ctx.prisma.maintenance.create({
        data: {
          ...maintenanceData,
          organizationId: user.organizationId,
          services: services ? {
            connect: services.map(id => ({ id })),
          } : undefined,
        },
        include: {
          services: true,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      ...maintenanceSchema.shape,
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const { id, services, ...maintenanceData } = input;

      return ctx.prisma.maintenance.update({
        where: {
          id,
          organizationId: user.organizationId,
        },
        data: {
          ...maintenanceData,
          services: services ? {
            set: services.map(id => ({ id })),
          } : undefined,
        },
        include: {
          services: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return ctx.prisma.maintenance.delete({
        where: {
          id: input,
          organizationId: user.organizationId,
        },
      });
    }),
}); 