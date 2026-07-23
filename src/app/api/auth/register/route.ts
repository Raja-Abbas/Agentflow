import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 400 })

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { email, name: name || email.split("@")[0], password: hashedPassword },
    })

    return NextResponse.json({ id: user.id, email: user.email, name: user.name })
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
