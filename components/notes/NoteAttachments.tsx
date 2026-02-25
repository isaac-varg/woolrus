'use client'

import { useState } from "react"
import { NoteMediaType } from "@/prisma/generated/enums"
import AttachmentPreview from "./AttachmentPreview"
import ImageLightbox from "./ImageLightbox"

interface Attachment {
  id: string
  url: string
  mediaType: NoteMediaType
  fileName: string | null
}

interface NoteAttachmentsProps {
  attachments: Attachment[]
  thumbnail?: boolean
}

export default function NoteAttachments({ attachments, thumbnail }: NoteAttachmentsProps) {
  const [lightbox, setLightbox] = useState<{ url: string; fileName: string | null } | null>(null)

  if (!attachments.length) return null

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {attachments.map((att) => (
          <AttachmentPreview
            key={att.id}
            url={att.url}
            mediaType={att.mediaType}
            fileName={att.fileName}
            thumbnail={thumbnail}
            onClick={
              thumbnail && att.mediaType === NoteMediaType.IMAGE
                ? () => setLightbox({ url: att.url, fileName: att.fileName })
                : undefined
            }
          />
        ))}
      </div>
      {thumbnail && lightbox && (
        <ImageLightbox
          url={lightbox.url}
          fileName={lightbox.fileName}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  )
}
