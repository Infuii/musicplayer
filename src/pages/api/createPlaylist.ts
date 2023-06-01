import { type NextApiRequest, type NextApiResponse } from "next";
import { object } from "zod";

import { PrismaClient } from "@prisma/client";

const playlist = async (req: NextApiRequest, res: NextApiResponse) => {
    const prisma = new PrismaClient();
    const { id } = req.query;
    
}
export default playlist;