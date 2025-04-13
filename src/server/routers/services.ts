import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { ServiceStatus } from "@prisma/client";

const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.nativeEnum(ServiceStatus),
  teamId: z.string().nullable(),
});

const serviceUpdateSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(ServiceStatus).optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  teamId: z.string().nullable().optional(),
});

export const servicesRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
      select: { 
        organizationId: true,
        teams: {
          select: {
            teamId: true,
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Get all team IDs the user belongs to
    const userTeamIds = user.teams.map(tm => tm.teamId);

    // If user has teams, fetch services for those teams
    // If not, fetch all services in the organization
    return ctx.prisma.service.findMany({
      where: {
        organizationId: user.organizationId,
        ...(userTeamIds.length > 0 ? { teamId: { in: userTeamIds } } : {}),
      },
      include: {
        team: {
          select: {
            name: true,
          },
        },
      },
    });
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { 
          organizationId: true,
          teams: {
            select: {
              teamId: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Get all team IDs the user belongs to
      const userTeamIds = user.teams.map(tm => tm.teamId);

      return ctx.prisma.service.findFirst({
        where: {
          id: input,
          organizationId: user.organizationId,
          ...(userTeamIds.length > 0 ? { teamId: { in: userTeamIds } } : {}),
        },
        include: {
          team: {
            select: {
              name: true,
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(serviceSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { 
          organizationId: true,
          teams: {
            select: {
              teamId: true,
              role: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Get all team IDs the user belongs to
      const userTeamIds = user.teams.map(tm => tm.teamId);

      // Check if user has permission to create services for the specified team
      if (!userTeamIds.includes(input.teamId)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to create services for this team",
        });
      }

      return ctx.prisma.service.create({
        data: {
          ...input,
          organizationId: user.organizationId,
        },
        include: {
          team: {
            select: {
              name: true,
            },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(serviceUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { 
          organizationId: true,
          teams: {
            select: {
              teamId: true,
              role: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Get the service to check its team
      const service = await ctx.prisma.service.findUnique({
        where: { id: input.id },
        select: { teamId: true },
      });

      if (!service) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service not found",
        });
      }

      // Get all team IDs the user belongs to
      const userTeamIds = user.teams.map(tm => tm.teamId);

      // Check if user has permission to update services for this team
      if (!userTeamIds.includes(service.teamId)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to update services for this team",
        });
      }

      const { id, ...updateData } = input;

      return ctx.prisma.service.update({
        where: {
          id: input.id,
          organizationId: user.organizationId,
        },
        data: updateData,
        include: {
          team: {
            select: {
              name: true,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { 
          organizationId: true,
          teams: {
            select: {
              teamId: true,
              role: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Get the service to check its team
      const service = await ctx.prisma.service.findUnique({
        where: { id: input },
        select: { teamId: true },
      });

      if (!service) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service not found",
        });
      }

      // Get all team IDs the user belongs to
      const userTeamIds = user.teams.map(tm => tm.teamId);

      // Check if user has permission to delete services for this team
      if (!userTeamIds.includes(service.teamId)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to delete services for this team",
        });
      }

      return ctx.prisma.service.delete({
        where: {
          id: input,
          organizationId: user.organizationId,
        },
      });
    }),
}); 