import { ALL_CATEGORIES } from "@orchestra/shared/constants/categories";
import { prisma } from "../src/index.js";

async function main() {
  await Promise.all(
    ALL_CATEGORIES.map((category) =>
      prisma.jobRole.upsert({
        create: { key: category.key, slug: category.slug },
        update: {},
        where: { key: category.key },
      })
    )
  );
}

main().finally(() => prisma.$disconnect());
