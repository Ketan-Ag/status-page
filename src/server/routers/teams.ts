import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const teamSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const teamMemberSchema = z.object({
  userId: z.string(),
  role: z.enum(["MEMBER", "ADMIN"]).default("MEMBER"),
});

export const teamsRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
      select: { organizationId: true },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return ctx.prisma.team.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const team = await ctx.prisma.team.findFirst({
        where: {
          id: input.id,
          organizationId: user.organizationId,
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      return team;
    }),

  create: protectedProcedure
    .input(teamSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // First create the team
      const team = await ctx.prisma.team.create({
        data: {
          ...input,
          organizationId: user.organizationId,
        },
      });

      // Then create the team member record
      await ctx.prisma.teamMember.create({
        data: {
          teamId: team.id,
          userId: ctx.userId,
          role: "ADMIN",
        },
      });

      // Return the team with members included
      return ctx.prisma.team.findUnique({
        where: { id: team.id },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: teamSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const team = await ctx.prisma.team.findFirst({
        where: {
          id: input.id,
          organizationId: user.organizationId,
          members: {
            some: {
              userId: ctx.userId,
              role: "ADMIN",
            },
          },
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found or you don't have permission to update it",
        });
      }

      return ctx.prisma.team.update({
        where: { id: input.id },
        data: input.data,
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const team = await ctx.prisma.team.findFirst({
        where: {
          id: input.id,
          organizationId: user.organizationId,
          members: {
            some: {
              userId: ctx.userId,
              role: "ADMIN",
            },
          },
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found or you don't have permission to delete it",
        });
      }

      await ctx.prisma.team.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  addMember: protectedProcedure
    .input(z.object({
      teamId: z.string(),
      ...teamMemberSchema.shape,
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const team = await ctx.prisma.team.findFirst({
        where: {
          id: input.teamId,
          organizationId: user.organizationId,
          members: {
            some: {
              userId: ctx.userId,
              role: "ADMIN",
            },
          },
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found or you don't have permission to add members",
        });
      }

      return ctx.prisma.teamMember.create({
        data: {
          teamId: input.teamId,
          userId: input.userId,
          role: input.role,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }),

  removeMember: protectedProcedure
    .input(z.object({
      teamId: z.string(),
      userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const team = await ctx.prisma.team.findFirst({
        where: {
          id: input.teamId,
          organizationId: user.organizationId,
          members: {
            some: {
              userId: ctx.userId,
              role: "ADMIN",
            },
          },
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found or you don't have permission to remove members",
        });
      }

      // Prevent removing the last admin
      const adminCount = await ctx.prisma.teamMember.count({
        where: {
          teamId: input.teamId,
          role: "ADMIN",
        },
      });

      const memberToRemove = await ctx.prisma.teamMember.findFirst({
        where: {
          teamId: input.teamId,
          userId: input.userId,
        },
      });

      if (adminCount === 1 && memberToRemove?.role === "ADMIN") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot remove the last admin from the team",
        });
      }

      await ctx.prisma.teamMember.delete({
        where: {
          teamId_userId: {
            teamId: input.teamId,
            userId: input.userId,
          },
        },
      });

      return { success: true };
    }),

  updateMemberRole: protectedProcedure
    .input(z.object({
      teamId: z.string(),
      userId: z.string(),
      role: z.enum(["MEMBER", "ADMIN"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { organizationId: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const team = await ctx.prisma.team.findFirst({
        where: {
          id: input.teamId,
          organizationId: user.organizationId,
          members: {
            some: {
              userId: ctx.userId,
              role: "ADMIN",
            },
          },
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found or you don't have permission to update member roles",
        });
      }

      // Prevent removing the last admin
      if (input.role === "MEMBER") {
        const adminCount = await ctx.prisma.teamMember.count({
          where: {
            teamId: input.teamId,
            role: "ADMIN",
          },
        });

        const memberToUpdate = await ctx.prisma.teamMember.findFirst({
          where: {
            teamId: input.teamId,
            userId: input.userId,
          },
        });

        if (adminCount === 1 && memberToUpdate?.role === "ADMIN") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot demote the last admin to member",
          });
        }
      }

      return ctx.prisma.teamMember.update({
        where: {
          teamId_userId: {
            teamId: input.teamId,
            userId: input.userId,
          },
        },
        data: {
          role: input.role,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }),

    getAllForPublic: publicProcedure.query(async ({ ctx }) => { 
      return ctx.prisma.team.findMany({
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    }),
}); 