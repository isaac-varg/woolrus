'use client'

import { useRef, useState } from "react"
import { LuShieldAlert, LuImage, LuMic, LuMicOff, LuX } from "react-icons/lu"
import { createQualityIssue } from "@/actions/quality/createQualityIssue"
import { createNote } from "@/actions/notes/createNote"
import { addNoteAttachment } from "@/actions/notes/addNoteAttachment"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { QualityIssueType, QualityIssueSeverity, WorkflowStatus } from "@/prisma/generated/enums"

type Props = {
  orderId: string
  orderItemId?: string
  packageId?: string
  stageDiscovered: WorkflowStatus
  isCustomerReported?: boolean
  className?: string
}

const ISSUE_TYPES = Object.values(QualityIssueType)
const SEVERITIES = Object.values(QualityIssueSeverity)
const STAGES: WorkflowStatus[] = ['PENDING', 'PICKING', 'PACKING', 'QA', 'READY', 'COMPLETED']

const ReportIssueDialog = ({ orderId, orderItemId, packageId, stageDiscovered, isCustomerReported, className }: Props) => {
  const router = useRouter()
  const t = useTranslations('qualityIssue')
  const tStatus = useTranslations('orderDetail.status')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const [type, setType] = useState<QualityIssueType | ''>('')
  const [severity, setSeverity] = useState<QualityIssueSeverity | ''>('')
  const [description, setDescription] = useState('')
  const [stageOriginated, setStageOriginated] = useState<WorkflowStatus | ''>('')
  const [images, setImages] = useState<File[]>([])
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reset = () => {
    setType('')
    setSeverity('')
    setDescription('')
    setStageOriginated('')
    setImages([])
    setAudioBlob(null)
    setIsRecording(false)
    setIsSubmitting(false)
    mediaRecorderRef.current = null
  }

  const handleOpen = () => dialogRef.current?.showModal()
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
    if (!type || !severity) return

    setIsSubmitting(true)
    try {
      const issue = await createQualityIssue({
        orderId,
        orderItemId,
        packageId,
        type,
        severity,
        description: description.trim() || undefined,
        stageDiscovered,
        stageOriginated: stageOriginated || undefined,
        isCustomerReported: isCustomerReported ?? false,
      })

      if (images.length > 0 || audioBlob) {
        const note = await createNote({ qualityIssueId: issue.id })
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
      <button className={className ?? "btn btn-outline btn-warning"} onClick={handleOpen}>
        <LuShieldAlert className="size-5" />
        {isCustomerReported ? t('reportCustomerIssue') : t('reportIssue')}
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box flex flex-col gap-4">
          <h3 className="font-bold text-lg">{isCustomerReported ? t('reportCustomerIssue') : t('reportIssue')}</h3>

          <select
            className="select select-bordered w-full"
            value={type}
            onChange={(e) => setType(e.target.value as QualityIssueType)}
          >
            <option value="" disabled>{t('selectType')}</option>
            {ISSUE_TYPES.map((t_) => (
              <option key={t_} value={t_}>{t(`types.${t_}`)}</option>
            ))}
          </select>

          <select
            className="select select-bordered w-full"
            value={severity}
            onChange={(e) => setSeverity(e.target.value as QualityIssueSeverity)}
          >
            <option value="" disabled>{t('selectSeverity')}</option>
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>{t(`severities.${s}`)}</option>
            ))}
          </select>

          <textarea
            className="textarea textarea-bordered w-full"
            placeholder={t('descriptionPlaceholder')}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="select select-bordered w-full"
            value={stageOriginated}
            onChange={(e) => setStageOriginated(e.target.value as WorkflowStatus)}
          >
            <option value="">{t('selectStage')}</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>{tStatus(s)}</option>
            ))}
          </select>

          {(images.length > 0 || audioBlob) && (
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={URL.createObjectURL(img)} alt="" className="w-20 h-20 object-cover rounded" />
                  <button className="btn btn-circle btn-xs absolute -top-1 -right-1" onClick={() => removeImage(i)}>
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
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
            <button className="btn btn-sm btn-ghost" onClick={() => fileInputRef.current?.click()}>
              <LuImage className="size-5" />
              {t('evidence')}
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
              {t('cancel')}
            </button>
            <button
              className="btn btn-warning"
              onClick={handleSubmit}
              disabled={isSubmitting || !type || !severity}
            >
              {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : t('submit')}
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

export default ReportIssueDialog
