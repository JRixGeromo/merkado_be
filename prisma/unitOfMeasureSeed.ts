// prisma/unitOfMeasureSeed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUnitsOfMeasure() {
  // Define units of measure including logistics and shipping units
  const unitsOfMeasure = [
    { name: 'piece' },
    { name: 'kilogram' },
    { name: 'gram' },
    { name: 'liter' },
    { name: 'milliliter' },
    { name: 'pack' },
    { name: 'dozen' },
    { name: 'bundle' },
    { name: 'box' },
    { name: 'set' },
    { name: 'pair' },
    { name: 'carton' },
    { name: 'sack' },
    { name: 'bottle' },
    { name: 'can' },
    { name: 'pound' },
    { name: 'ounce' },
    { name: 'gallon' },
    { name: 'serve' },
    { name: 'serving' },
    { name: 'order' },
    { name: 'portion' },
    { name: 'meal' },
    { name: 'platter' },
    { name: 'combo' },
    { name: 'roll' },
    { name: 'tablet' },
    { name: 'capsule' },
    { name: 'sheet' },
    { name: 'container' },
    { name: 'jar' },
    { name: 'tube' },
    { name: 'tray' },
    { name: 'bag' },
    { name: 'strip' },
    { name: 'cup' },
    { name: 'glass' },
    { name: 'tablespoon' },
    { name: 'teaspoon' },
    { name: 'drop' },
    { name: 'scoop' },
    { name: 'vial' },
    { name: 'spray' },
    { name: 'stick' },
    { name: 'bar' },
    { name: 'pint' },
    { name: 'quart' },
    { name: 'bucket' },
    { name: 'pallet' },
    { name: 'load' },
    { name: 'cubic meter' },
    { name: 'cubic foot' },
    { name: 'cubic inch' },
    { name: 'barrel' },
    { name: 'drum' },
    { name: 'crate' },
    { name: 'bale' },
    { name: 'ton' },
    { name: 'metric ton' },
    { name: 'skid' },
    { name: 'satchel' },
    { name: 'flat pack' },
    { name: 'machinery' },
    { name: 'full semi load' },
    { name: 'B-Double' },
    { name: 'suitcase/luggage' },
    { name: 'ream' },
    { name: 'slug' },
    
      // Time-Based
    { name: 'minute' },
    { name: 'hour' },
    
    // Session-Based
    { name: 'session' },
    { name: 'visit' },
    { name: 'appointment' },

    // Package or Series
    { name: 'package' },
    { name: 'membership' },
    { name: 'series' },
    
    // Specific Service Types
    { name: 'haircut' },
    { name: 'style' },
    { name: 'massage' },
    { name: 'treatment' },
    { name: 'other' },
  ];

  // Insert units of measure into the database
  for (const unit of unitsOfMeasure) {
    const createdUnit = await prisma.unitOfMeasure.create({
      data: unit,
    });
    console.log(`Created unit of measure: ${createdUnit.name}`);
  }

  console.log('Unit of measure seeding complete.');
}

seedUnitsOfMeasure()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
