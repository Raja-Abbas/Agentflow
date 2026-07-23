import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const { content, role } = await req.json()

  const conv = await prisma.conversation.findFirst({
    where: { id, agent: { userId: session.user.id } },
  })
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const message = await prisma.message.create({
    data: { content, role: role || "user", conversationId: id },
  })
  return NextResponse.json(message)
}
