import { type NextApiRequest, type NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const playlistHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const prisma = new PrismaClient();
  if (req.method === "GET") {
    //filter duplicate track names in the database
    // const tracks = await prisma.track.findMany({
    //   where: { playlistId: "clidn7f0f00009anc5b7u3uxp" },
    //   distinct: ["title"],
    // });
    const playlist = await prisma.playlist.findUnique({
      where: { id: "clidn7f0f00009anc5b7u3uxp" },
      include: { tracks: true },
    });

    res.status(200).json(playlist?.tracks ?? []);
  } else if (req.method === "POST") {
    const userId = req.query.userId as string;
    const tracks = JSON.parse(req.body);

    const formattedTracks = tracks.map((track: { title: string; src: string }) => ({
      title: track.title,
      src: track.src,
    }));
    await prisma.track.deleteMany({
      where: { id: "clidn7f0f00009anc5b7u3uxp" },
    });
    const playlist = await prisma.playlist.upsert({
      where: { id: "clidn7f0f00009anc5b7u3uxp" },
      update: {
        tracks: { create: formattedTracks },
      },
      create: {
        id: "clidn7f0f00009anc5b7u3uxp",
        name: "My Playlist",
        user: { connect: { id: "clidn7f0f00009anc5b7u3uxp" } },
        tracks: { create: formattedTracks },
      },
    });

    res.status(200).json(playlist.tracks);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default playlistHandler;
