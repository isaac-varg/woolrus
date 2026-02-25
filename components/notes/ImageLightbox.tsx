'use client'

import { useRef } from "react"

interface ImageLightboxProps {
  url: string | null
  fileName: string | null
  onClose: () => void
}

export default function ImageLightbox({ url, fileName, onClose }: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  if (!url) return null

  // Open the dialog imperatively when url is set
  if (dialogRef.current && !dialogRef.current.open) {
    dialogRef.current.showModal()
  }

  return (
    <dialog
      ref={(el) => {
        (dialogRef as React.MutableRefObject<HTMLDialogElement | null>).current = el
        if (el && !el.open) el.showModal()
      }}
      className="modal"
      onClose={onClose}
    >
      <div className="modal-box max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-2 p-4">
        {fileName && (
          <span className="text-sm text-base-content/60">{fileName}</span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={fileName ?? "Attachment"}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}
