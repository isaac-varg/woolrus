'use server'

import prisma from "@/lib/prisma"

export const updateNote = async (noteId: string, content: string) => {
  const note = await prisma.note.update({
    where: { id: noteId },
    data: { content },
  })

  return note
}
