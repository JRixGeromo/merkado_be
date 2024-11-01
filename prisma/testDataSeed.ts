// prisma/testDataSeed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed Sample Users
  const users = [
    {
      email: 'john.doe@example.com',
      password: 'password123', // Plain text password for seeding, will be hashed below
      firstName: 'John',
      lastName: 'Doe',
      birthdate: new Date('1990-01-01'),
      gender: "MALE", // Use string value directly
      phoneNo: '1234567890',
    },
    {
      email: 'jane.smith@example.com',
      password: 'password123', // Plain text password for seeding, will be hashed below
      firstName: 'Jane',
      lastName: 'Smith',
      birthdate: new Date('1992-02-02'),
      gender: "FEMALE", // Use string value directly
      phoneNo: '0987654321',
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        firstName: user.firstName,
        lastName: user.lastName,
        birthdate: user.birthdate,
        gender: user.gender as "MALE" | "FEMALE" | "OTHER", // Cast as the allowed enum values
        phoneNo: user.phoneNo,
      },
    });
    console.log(`Created user: ${createdUser.email}`);
  }

  // Seed Sample Vendor Profiles
  const createdUsers = await prisma.user.findMany(); // Retrieve created users dynamically
  const vendorProfiles = [
    {
      businessName: 'Tech Solutions',
      businessType: 'Electronics',
      businessPhone: '5551234567',
      businessEmail: 'contact@techsolutions.com',
      location: '123 Tech Street, Tech City',
      userId: createdUsers[0].id, // Dynamically associate with John Doe
    },
    {
      businessName: 'Fashion Hub',
      businessType: 'Apparel',
      businessPhone: '5557654321',
      businessEmail: 'contact@fashionhub.com',
      location: '456 Fashion Ave, Style City',
      userId: createdUsers[1].id, // Dynamically associate with Jane Smith
    },
  ];

  for (const vendorProfile of vendorProfiles) {
    const createdVendorProfile = await prisma.vendorProfile.create({
      data: vendorProfile,
    });
    console.log(`Created vendor profile: ${createdVendorProfile.businessName}`);
  }

  // Seed Sample Brands
  const brands = [
    { name: 'TechBrand' },
    { name: 'FashionLine' },
  ];

  for (const brand of brands) {
    const createdBrand = await prisma.brand.create({
      data: brand,
    });
    console.log(`Created brand: ${createdBrand.name}`);
  }

  // Retrieve created brands, categories, and units dynamically
  const createdBrands = await prisma.brand.findMany();
  const createdCategories = await prisma.productCategory.findMany(); // Assumes categories have been pre-seeded
  const createdUnits = await prisma.unitOfMeasure.findMany(); // Assumes units of measure are pre-seeded

  // Seed Sample Products
  const products = [
    {
      name: 'Smartphone X',
      stock: 50,
      price: 999.99,
      salePrice: 899.99,
      longDescription: 'The latest Smartphone X with advanced features.',
      categoryId: createdCategories.find((c: { name: string; id: number }) => c.name === 'Electronics')?.id || 1,
      vendorId: 1, // Tech Solutions
      unitId: createdUnits.find((u: { name: string; id: number }) => u.name === 'piece')?.id || 1,
      brandId: createdBrands.find((b: { name: string; id: number }) => b.name === 'TechBrand')?.id || 1,
      isFeatured: true,
    },
    {
      name: "Men's T-Shirt",
      stock: 100,
      price: 19.99,
      longDescription: 'A comfortable cotton t-shirt for men.',
      categoryId: createdCategories.find((c: { name: string; id: number }) => c.name === 'Apparel')?.id || 2,
      vendorId: 2, // Fashion Hub
      unitId: createdUnits.find((u: { name: string; id: number }) => u.name === 'piece')?.id || 1,
      brandId: createdBrands.find((b: { name: string; id: number }) => b.name === 'FashionLine')?.id || 2,
    },
  ];

  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product,
    });
    console.log(`Created product: ${createdProduct.name}`);
  }

  console.log('Test data seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
