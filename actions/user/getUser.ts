"use server"

import { getUserPreferences } from "@/lib/preferences/getUserPreferences";
import prisma from "@/lib/prisma";

export const getUser = async (userId: string) => {

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found.")
  }

  const prefs = getUserPreferences(user);

}
