import type { NoteWithDetails } from "@/actions/notes/getOrderNotes"
import AttachmentPreview from "./AttachmentPreview"

interface NoteAttachmentsProps {
  attachments: NoteWithDetails['attachments']
}

export default function NoteAttachments({ attachments }: NoteAttachmentsProps) {
  if (!attachments.length) return null

  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((att) => (
        <AttachmentPreview
          key={att.id}
          url={att.url}
          mediaType={att.mediaType}
          fileName={att.fileName}
        />
      ))}
    </div>
  )
}
