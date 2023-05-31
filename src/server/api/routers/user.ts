import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserById: publicProcedure.input(z.object({
      id: z.string()
  })).query(async ({ctx, input}) => {
      const user = await ctx.prisma.user.findUnique({
          where: {
              id: input.id
          }
      })

      return user
  })
});
