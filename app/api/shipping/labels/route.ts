import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const orderIds = request.nextUrl.searchParams.get('orders')?.split(',').filter(Boolean)
  if (!orderIds?.length) {
    return NextResponse.json({ error: 'Missing orders parameter' }, { status: 400 })
  }

  const labels = await prisma.shippingLabel.findMany({
    where: {
      orderId: { in: orderIds },
      status: 'active',
      labelDownloadPdf: { not: null },
    },
    select: { labelDownloadPdf: true },
  })

  if (labels.length === 0) {
    return NextResponse.json({ error: 'No labels found' }, { status: 404 })
  }

  const merged = await PDFDocument.create()

  for (const label of labels) {
    const res = await fetch(label.labelDownloadPdf!)
    if (!res.ok) continue
    const pdfBytes = await res.arrayBuffer()
    const source = await PDFDocument.load(pdfBytes)
    const pages = await merged.copyPages(source, source.getPageIndices())
    for (const page of pages) {
      merged.addPage(page)
    }
  }

  const pdfBytes = await merged.save()

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="shipping-labels.pdf"',
    },
  })
}
