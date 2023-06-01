import { type NextApiRequest, type NextApiResponse } from "next";
import { object } from "zod";

import { PrismaClient } from "@prisma/client";

const playlist = async (req: NextApiRequest, res: NextApiResponse) => {
    const prisma = new PrismaClient();
    const { id } = req.query;
    const playlist = await prisma.playlist.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            songs: true,
        },
    });
    res.status(200).json(playlist);


};
export default playlist;