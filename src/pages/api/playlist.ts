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
    const tracks = req.body as { title: string; src: string }[];
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default playlistHandler;
