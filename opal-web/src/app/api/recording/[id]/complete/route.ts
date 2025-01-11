import { client } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json()
  const { id } = params

  console.log('body complete', body,id)

  const completeProcessing = await client.video.update({
    where: {
      userId: id,
      source: body.filename,
    },
    data: {
      processing: false,
    },
  })
  console.log(completeProcessing)
  if (completeProcessing) {
    return NextResponse.json({ status: 200 })
  }

  return NextResponse.json({ status: 400 })
}
