'use client'

import { useState } from "react"
import { NoteMediaType } from "@/prisma/generated/enums"
import { LuImage, LuMic } from "react-icons/lu"

interface AttachmentPreviewProps {
  url: string
  mediaType: NoteMediaType
  fileName: string | null
}

export default function AttachmentPreview({ url, mediaType, fileName }: AttachmentPreviewProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-base-300 bg-base-200 px-3 py-2 text-sm text-base-content/60">
        {mediaType === NoteMediaType.IMAGE ? <LuImage className="size-4" /> : <LuMic className="size-4" />}
        <span>Failed to load {fileName ?? "attachment"}</span>
      </div>
    )
  }

  if (mediaType === NoteMediaType.IMAGE) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={fileName ?? "Attachment"}
        loading="lazy"
        className="max-h-64 rounded-lg border border-base-300 object-contain"
        onError={() => setError(true)}
      />
    )
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-base-300 bg-base-200 px-3 py-2">
      <LuMic className="size-4 shrink-0 text-base-content/60" />
      <audio controls src={url} onError={() => setError(true)} className="h-8">
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}
