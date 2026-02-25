'use client'

import { useRef, useState } from "react"
import { LuMessageSquarePlus, LuImage, LuMic, LuMicOff, LuX, LuMessageCircle } from "react-icons/lu"
import { createNote } from "@/actions/notes/createNote"
import { addNoteAttachment } from "@/actions/notes/addNoteAttachment"
import { useRouter } from "next/navigation"

type Props = {
  orderId?: string
  orderItemId?: string
  packageId?: string
}

const AddNoteDialog = ({ orderId, orderItemId, packageId }: Props) => {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const [content, setContent] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reset = () => {
    setContent("")
    setImages([])
    setAudioBlob(null)
    setIsRecording(false)
    setIsSubmitting(false)
    mediaRecorderRef.current = null
  }

  const handleOpen = () => {
    dialogRef.current?.showModal()
  }

  const handleClose = () => {
    if (isRecording) stopRecording()
    dialogRef.current?.close()
    reset()
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(prev => [...prev, ...Array.from(e.target.files!)])
    }
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType })
        setAudioBlob(blob)
        stream.getTracks().forEach(t => t.stop())
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
    } catch {
      // user denied microphone access
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0 && !audioBlob) return

    setIsSubmitting(true)
    try {
      const note = await createNote({ orderId, orderItemId, packageId, content: content.trim() || undefined })

      for (const image of images) {
        const fd = new FormData()
        fd.append("file", image)
        await addNoteAttachment(note.id, fd)
      }

      if (audioBlob) {
        const fd = new FormData()
        fd.append("file", new File([audioBlob], "voice-note.webm", { type: audioBlob.type }))
        await addNoteAttachment(note.id, fd)
      }

      handleClose()
    } catch {
      setIsSubmitting(false)
    } finally {
      router.refresh()
    }
  }

  return (
    <>
      <button className="btn btn-outline btn-secondary" onClick={handleOpen}>
        <LuMessageCircle className="size-6" />
        Add Note
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box flex flex-col gap-4">
          <h3 className="font-bold text-lg">Add Note</h3>

          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Write a note..."
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {(images.length > 0 || audioBlob) && (
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt=""
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    className="btn btn-circle btn-xs absolute -top-1 -right-1"
                    onClick={() => removeImage(i)}
                  >
                    <LuX className="size-3" />
                  </button>
                </div>
              ))}
              {audioBlob && (
                <div className="flex items-center gap-2">
                  <audio src={URL.createObjectURL(audioBlob)} controls className="h-10" />
                  <button
                    className="btn btn-circle btn-xs"
                    onClick={() => setAudioBlob(null)}
                  >
                    <LuX className="size-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageSelect}
            />
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => fileInputRef.current?.click()}
            >
              <LuImage className="size-5" />
            </button>
            <button
              className={`btn btn-sm ${isRecording ? 'btn-error' : 'btn-ghost'}`}
              onClick={toggleRecording}
            >
              {isRecording ? <LuMicOff className="size-5" /> : <LuMic className="size-5" />}
            </button>
          </div>

          <div className="modal-action">
            <button className="btn" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting || (!content.trim() && images.length === 0 && !audioBlob)}
            >
              {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : "Submit"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleClose}>close</button>
        </form>
      </dialog>
    </>
  )
}

export default AddNoteDialog
