import { getServerSession } from "next-auth";
import { prisma } from "./db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export interface Context {
  userId: string | null;
  prisma: typeof prisma;
}

export async function createContext(): Promise<Context> {
  const session = await getServerSession(authOptions);

  return {
    userId: session?.user?.id ?? null,
    prisma,
  };
} 