// app/api/test/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json({ 
    message: 'POST is working!',
    received: body,
    timestamp: new Date().toISOString()
  })
}