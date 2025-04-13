import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const usersRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        teamId: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        teamId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: input,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          teamId: true,
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }),
}); 