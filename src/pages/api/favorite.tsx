import { type NextApiRequest, type NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const favoriteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const prisma = new PrismaClient();
};

export default favoriteHandler;
