// src/seed.ts
import prisma from './prisma';

async function seed() {
  await prisma.unitOfMeasure.createMany({
    data: [
      { name: 'KG' },
      { name: 'LITER' },
      { name: 'PIECE' },
      { name: 'BOX' },
      { name: 'METER' },
      { name: 'SACK' },
      { name: 'BUNDLE' },
      { name: 'SERVE' },  // Already added earlier, keeping it here
      { name: 'BUDGET' },  // Newly added
      { name: 'BUCKET' },  // Newly added
      { name: 'COMBO' },   // Newly added
      { name: 'DOZEN' },
      { name: 'PACK' },
      { name: 'GRAM' },
      { name: 'GALLON' },
      { name: 'OTHER' }    // Last item
    ],
    skipDuplicates: true,  // Prevents adding duplicates
  });
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
