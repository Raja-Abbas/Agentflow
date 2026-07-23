import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const agents = await prisma.agent.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } })
  return NextResponse.json(agents)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { name, description, model, status, systemPrompt } = await req.json()
  const agent = await prisma.agent.create({
    data: { name, description, model, status: status || "Active", systemPrompt, userId: session.user.id },
  })
  return NextResponse.json(agent)
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, name, description, model, status, systemPrompt } = await req.json()
  const agent = await prisma.agent.findFirst({ where: { id, userId: session.user.id } })
  if (!agent) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const updated = await prisma.agent.update({
    where: { id },
    data: { name, description, model, status, systemPrompt },
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await req.json()
  const agent = await prisma.agent.findFirst({ where: { id, userId: session.user.id } })
  if (!agent) return NextResponse.json({ error: "Not found" }, { status: 404 })
  await prisma.agent.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
