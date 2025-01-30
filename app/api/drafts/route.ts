import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const data = await request.json()
  
  try {
    const draft = await prisma.draftSubmission.upsert({
      where: {
        userId_examType: {
          userId: data.userId,
          examType: data.examType
        }
      },
      update: {
        formData: data.formData,
        status: data.status || 'draft',
        updatedAt: new Date(),
      },
      create: {
        userId: data.userId,
        examType: data.examType,
        formData: data.formData,
        status: data.status || 'draft',
      },
    })
    return NextResponse.json(draft)
  } catch (error) {
    console.error('Failed to save draft:', error)
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const examType = searchParams.get('examType')
  
  if (!userId || !examType) {
    return NextResponse.json(
      { error: 'Missing required parameters: userId and examType' },
      { status: 400 }
    )
  }

  try {
    const draft = await prisma.draftSubmission.findUnique({
      where: {
        userId_examType: {
          userId,
          examType,
        }
      },
    })
    return NextResponse.json(draft)
  } catch (error) {
    console.error('Failed to fetch draft:', error)
    return NextResponse.json({ error: 'Failed to fetch draft' }, { status: 500 })
  }
}
