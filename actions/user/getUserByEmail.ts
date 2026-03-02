"use server"

import prisma from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {

  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user) {
    throw new Error("User not found.")
  }

  return user;

}
