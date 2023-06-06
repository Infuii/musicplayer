import { type Playlist, type Track } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const playlistRouter = createTRPCRouter({
  getAllPlaylists: protectedProcedure.query(async ({ ctx }) => {
    interface PlaylistWithTracks extends Playlist {
      tracks: Track[];
    }

    const playlists = (await ctx.prisma.playlist.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: { tracks: true },
    })) as PlaylistWithTracks[];

    return playlists;
  }),

  getPlaylist: protectedProcedure
    .input(z.object({ playlistId: z.string() }))
    .query(async ({ input, ctx }) => {
      const playlist = await ctx.prisma.playlist.findUnique({
        where: { id: input.playlistId },
        include: { tracks: true },
      });

      return playlist;
    }),

  createPlaylist: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const playlistCount = await ctx.prisma.playlist.count({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (playlistCount >= 3) throw new Error("You can only have 3 playlists");

      const playlist = await ctx.prisma.playlist.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });

      return playlist;
    }),

  deletePlaylist: protectedProcedure
    .input(z.object({ playlistId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const playlist = await ctx.prisma.playlist.delete({
        where: { id: input.playlistId },
      });

      return playlist;
    }),

  addTrack: protectedProcedure
    .input(z.object({ playlistId: z.string(), trackId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const playlist = await ctx.prisma.playlist.update({
        where: { id: input.playlistId },
        data: {
          tracks: {
            connect: {
              id: input.trackId,
            },
          },
        },
      });

      return playlist;
    }),
  getAllTracks: protectedProcedure.query(async ({ ctx }) => {
    const tracks = await ctx.prisma.track.findMany({});

    return tracks;
  }),
});
