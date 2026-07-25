import prisma from "../src/lib/db";

async function main() {
  console.log("Connecting to Neon DB...");
  const issues = await prisma.issue.findMany({
    include: { articles: true },
  });
  console.log("Fetched issues from Neon DB:", JSON.stringify(issues, null, 2));
}

main().catch((e) => {
  console.error("DB connection error:", e);
  process.exit(1);
});
