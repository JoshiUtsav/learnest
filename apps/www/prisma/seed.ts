import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.betaAccess.createMany({
    data: [
      {
        email: "user1@example.com",
        betaAccess: false,
      },
      {
        email: "user2@example.com",
        betaAccess: true,
      },
      {
        email: "user3@example.com",
        betaAccess: false,
      },
    ],
  });

  console.log("Seed data inserted successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
