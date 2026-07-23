import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const conversations = await prisma.conversation.findMany({
    where: { agent: { userId: session.user.id } },
    include: { messages: { orderBy: { createdAt: "asc" } }, agent: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(conversations)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { title, agentId } = await req.json()
  const agent = await prisma.agent.findFirst({ where: { id: agentId, userId: session.user.id } })
  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 })
  const conversation = await prisma.conversation.create({
    data: { title, agentId, status: "active" },
    include: { messages: true, agent: { select: { name: true } } },
  })
  return NextResponse.json(conversation)
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await req.json()
  const conv = await prisma.conversation.findFirst({
    where: { id, agent: { userId: session.user.id } },
  })
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 })
  await prisma.conversation.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
