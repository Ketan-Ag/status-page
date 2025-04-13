import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { IncidentStatus, ImpactLevel } from "@prisma/client";

const incidentSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.nativeEnum(IncidentStatus),
  impact: z.nativeEnum(ImpactLevel).default("MINOR"),
  services: z.array(z.string()).optional(),
});

export const incidentsRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
      select: { organizationId: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return ctx.prisma.incident.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: {
        services: true,
      },
      orderBy: {
        createdAt: "desc",
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

      return ctx.prisma.incident.findUnique({
        where: {
          id: input,
          organizationId: user.organizationId,
        },
        include: {
          services: true,
          updates: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(incidentSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const { services, ...incidentData } = input;

      return ctx.prisma.incident.create({
        data: {
          ...incidentData,
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
      title: z.string().min(1),
      description: z.string().min(1),
      status: z.nativeEnum(IncidentStatus),
      impact: z.nativeEnum(ImpactLevel).default("MINOR"),
      services: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const { id, services, ...incidentData } = input;

      return ctx.prisma.incident.update({
        where: {
          id,
          organizationId: user.organizationId,
        },
        data: {
          ...incidentData,
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

      return ctx.prisma.incident.delete({
        where: {
          id: input,
          organizationId: user.organizationId,
        },
      });
    }),
}); 