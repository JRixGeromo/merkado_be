// prisma/seed.ts
import process from 'process';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Define the main categories and subcategories structure
  const categories = [
    {
      name: 'Electronics & Appliances',
      description: 'Explore a wide range of electronic devices and home appliances, from smartphones to smart home systems.',
      subcategories: [
        { name: 'Mobile Phones' },
        { name: 'Computers & Laptops' },
        { name: 'Tablets & Accessories' },
        { name: 'Cameras & Photography' },
        { name: 'Home Appliances' },
        { name: 'Audio & Sound Systems' },
        { name: 'Wearable Technology' },
        { name: 'Smart Home Devices' },
      ],
    },
    {
      name: 'Fashion & Apparel',
      description: 'Stylish and trendy clothing and accessories for men, women, and children, including jewelry and watches.',
      subcategories: [
        { name: 'Men’s Clothing' },
        { name: 'Women’s Clothing' },
        { name: 'Kids’ Clothing' },
        { name: 'Shoes' },
        { name: 'Accessories' },
        { name: 'Jewelry' },
        { name: 'Watches' },
      ],
    },
    {
      name: 'Health & Wellness',
      description: 'Health, beauty, personal care, and medical supplies to support a healthy lifestyle.',
      subcategories: [
        { name: 'Skincare' },
        { name: 'Haircare' },
        { name: 'Makeup & Cosmetics' },
        { name: 'Personal Care' },
        { name: 'Health Supplements' },
        { name: 'Medical Equipment' },
        { name: 'Fitness & Wellness' },
      ],
    },
    {
      name: 'Home & Living',
      description: 'Enhance your living spaces with quality furniture, decor, and household essentials.',
      subcategories: [
        { name: 'Furniture' },
        { name: 'Home Decor' },
        { name: 'Kitchen & Dining' },
        { name: 'Bedding & Bath' },
        { name: 'Lighting' },
        { name: 'Storage Solutions' },
        { name: 'Garden & Outdoor' },
      ],
    },
    {
      name: 'Food & Beverages',
      description: 'A diverse selection of food and beverages, including fresh produce, meats, seafood, packaged and frozen foods, snacks, and drinks. From raw ingredients for cooking to ready-to-eat meals and indulgent treats, this category offers options to satisfy every craving and culinary need.',
      subcategories: [
        { name: 'Fresh Produce' }, // Fresh fruits, vegetables, and herbs, Chicken Eggs, Duck Eggs, Quail Eggs
        { name: 'Packaged Foods' },
        { name: 'Frozen Foods' },
        { name: 'Beverages' },
        { name: 'Snacks & Confectionery' },
        { name: 'Meats & Poultry' }, // Fresh and frozen meats and poultry products.
        { name: 'Seafood' },
      ],
    },
    {
      name: 'Dining & Restaurants',
       description: 'Explore a variety of dining options, from quick service to fine dining, catering to all tastes and occasions. Whether you\'re looking for a casual meal, a luxurious dining experience, or specialized catering services, this category has it all.',
      subcategories: [
        { name: 'Fast Food & Quick Service' },
        { name: 'Casual Dining' },
        { name: 'Fine Dining' },
        { name: 'Cafes & Bakeries' },
        { name: 'Catering Services' },
      ],
    },
    {
      name: 'Books & Stationery',
      description: 'Books for every reader and a wide selection of stationery for school or office needs.',
      subcategories: [
        { name: 'Fiction & Non-fiction Books' },
        { name: 'School Supplies' },
        { name: 'Art Supplies' },
        { name: 'Notebooks & Journals' },
        { name: 'Office Supplies' },
      ],
    },
    {
      name: 'Sports & Outdoor',
      description: 'Gear and apparel for fitness, sports, and outdoor adventures.',
      subcategories: [
        { name: 'Exercise & Fitness Equipment' },
        { name: 'Camping & Hiking Gear' },
        { name: 'Sports Apparel' },
        { name: 'Bicycles & Accessories' },
        { name: 'Fishing Gear' },
        { name: 'Water Sports Gear' },
      ],
    },
    {
      name: 'Automotive & Motorcycles',
      description: 'Products for car and motorcycle enthusiasts, including accessories and maintenance tools.',
      subcategories: [
        { name: 'Car Accessories' },
        { name: 'Motorcycle Accessories' },
        { name: 'Car Care & Maintenance' },
        { name: 'Tires & Wheels' },
        { name: 'Car Electronics' },
      ],
    },
    {
      name: 'Office & Supplies',
      description: 'Office essentials, from furniture to organization tools, to keep your workspace efficient.',
      subcategories: [
        { name: 'Office Furniture' },
        { name: 'Office Electronics' },
        { name: 'Printers & Scanners' },
        { name: 'Ink & Toner' },
        { name: 'Filing & Organization' },
      ],
    },
    {
      name: 'Pet Supplies',
      description: 'Essential products for pet care, including food, toys, grooming, and health items for all pet types.',
      subcategories: [
        { name: 'Pet Food' },
        { name: 'Pet Toys' },
        { name: 'Pet Grooming' },
        { name: 'Pet Health & Wellness' },
        { name: 'Aquarium Supplies' },
      ],
    },
    {
      name: 'Gifts & Party Supplies',
      description: 'Find everything for celebrations, including gift wrap, decor, party favors, and more.',
      subcategories: [
        { name: 'Gift Wrapping' },
        { name: 'Greeting Cards' },
        { name: 'Party Decor' },
        { name: 'Balloons' },
        { name: 'Candles' },
        { name: 'Party Games' },
      ],
    },
    {
      name: 'Industrial & Scientific',
      description: 'Equipment, tools, and supplies for industrial, scientific, and agricultural needs.',
      subcategories: [
        { name: 'Lab Equipment' },
        { name: 'Industrial Tools' },
        { name: 'Safety Supplies' },
        { name: 'Construction Equipment' },
      ],
    },
    {
      name: 'Eco-Friendly & Sustainable',
      description: 'Environmentally friendly products that promote sustainability and eco-conscious choices.',
      subcategories: [
        { name: 'Recycled Products' },
        { name: 'Organic Food' },
        { name: 'Natural Beauty Products' },
        { name: 'Solar Products' },
      ],
    },
    {
      name: 'Vintage & Collectibles',
      description: 'Unique and rare items, including antiques, collectibles, and memorabilia for enthusiasts and collectors.',
      subcategories: [
        { name: 'Vintage Clothing' },
        { name: 'Antiques & Furniture' },
        { name: 'Collectible Toys' },
        { name: 'Memorabilia' },
        { name: 'Vinyl Records & Music Memorabilia' },
        { name: 'Vintage Jewelry & Watches' },
        { name: 'Art & Prints' },
        { name: 'Books & Magazines' },
      ],
    },
    // New category: Digital Downloads
    {
      name: 'Digital Downloads',
      description: 'A variety of digital products that can be instantly downloaded, from software to creative assets.',
      subcategories: [
        { name: 'E-books & Audiobooks' },
        { name: 'Software & Applications' },
        { name: 'Digital Art & Illustrations' },
        { name: 'Music & Sound Effects' },
        { name: 'Photos & Stock Images' },
        { name: 'Templates & Themes' },
        { name: 'Courses & Tutorials' },
        { name: '3D Models & CAD Files' },
        { name: 'Video Clips & Animations' },
      ],
    },
  ];
  
  for (const category of categories) {
    // Attempt to find the existing category
    const existingCategory = await prisma.productCategory.findUnique({
      where: { name: category.name },
    });

    if (existingCategory) {
      // If the category exists, update it
      await prisma.productCategory.update({
        where: { id: existingCategory.id },
        data: {
          description: category.description,
          subcategories: {
            deleteMany: {}, // Optional: Remove old subcategories
            create: category.subcategories.map((sub) => ({
              name: sub.name,
              description: `${sub.name} in ${category.name}`,
            })),
          },
        },
      });
      console.log(`Updated category: ${category.name}`);
    } else {
      // If it does not exist, create it
      const createdCategory = await prisma.productCategory.create({
        data: {
          name: category.name,
          description: category.description,
          subcategories: {
            create: category.subcategories.map((sub) => ({
              name: sub.name,
              description: `${sub.name} in ${category.name}`,
            })),
          },
        },
      });
      console.log(`Created category: ${createdCategory.name}`);
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });