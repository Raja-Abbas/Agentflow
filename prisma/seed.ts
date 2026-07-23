import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding AgentFlow!");

  const password = await bcrypt.hash("demo123456", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@agentflow.app" },
    update: { password },
    create: {
      email: "demo@agentflow.app",
      name: "Demo User",
      password,
    },
  });

  console.log("User created:", user.email);
  console.log("  Email:    demo@agentflow.app");
  console.log("  Password: demo123456");
  console.log("Seed complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
