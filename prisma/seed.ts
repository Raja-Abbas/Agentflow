import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding AgentFlow!");

  const user = await prisma.user.upsert({
    where: { email: "demo@agentflow.app" },
    update: {},
    create: {
      email: "demo@agentflow.app",
      name: "Demo User",
    },
  });

  console.log("User created:", user.email);
  console.log("Seed complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
