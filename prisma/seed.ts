// prisma/seed.ts
import process from 'process';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Define the main categories and subcategories structure
  const categories = [
    {
      name: 'Electronics & Appliances',
      description:
        'Explore a wide range of electronic devices and home appliances, from smartphones to smart home systems.',
      subcategories: [
        { name: 'Mobile Phones' },
        { name: 'Computers & Laptops' },
        { name: 'Tablets & Accessories' },
        { name: 'Cameras & Photography' },
        { name: 'Home Appliances' },
        { name: 'Kitchen Appliances' },
        { name: 'Audio & Sound Systems' },
        { name: 'Wearable Technology' },
        { name: 'Smart Home Devices' },
      ],
    },
    {
      name: 'Fashion & Apparel',
      description:
        'Stylish and trendy clothing and accessories for men, women, and children.',
      subcategories: [
        { name: 'Men’s Clothing' },
        { name: 'Women’s Clothing' },
        { name: 'Kids’ Clothing' },
        { name: 'Shoes' },
        { name: 'Accessories' },
        { name: 'Sportswear' },
        { name: 'Outerwear' },
        { name: 'Intimate Wear' },
      ],
    },
    {
      name: 'Health & Beauty',
      description:
        'Health, beauty, and personal care products to help you look and feel your best.',
      subcategories: [
        { name: 'Skincare' },
        { name: 'Haircare' },
        { name: 'Makeup & Cosmetics' },
        { name: 'Personal Care' },
        { name: 'Health Supplements' },
        { name: 'Medical Equipment' },
        { name: 'Fragrances & Perfumes' },
        { name: 'Grooming Tools' },
      ],
    },
    {
      name: 'Home & Living',
      description:
        'Enhance your living spaces with quality furniture, decor, and household essentials.',
      subcategories: [
        { name: 'Furniture' },
        { name: 'Home Decor' },
        { name: 'Kitchen & Dining' },
        { name: 'Bedding & Bath' },
        { name: 'Lighting' },
        { name: 'Storage Solutions' },
        { name: 'Home Improvement' },
        { name: 'Garden & Outdoor' },
      ],
    },
    {
      name: 'Food & Beverages',
      description:
        'A variety of food and beverages, from fresh produce to ready-to-eat meals.',
      subcategories: [
        { name: 'Fresh Produce' },
        { name: 'Packaged Foods' },
        { name: 'Frozen Foods' },
        { name: 'Beverages' },
        { name: 'Snacks & Confectionery' },
        { name: 'Dairy Products' },
        { name: 'Meat & Seafood' },
        { name: 'Spices & Condiments' },
      ],
    },
    {
      name: 'Baby & Kids',
      description:
        'Essential products for babies and kids, including clothing, toys, and nursery items.',
      subcategories: [
        { name: 'Baby Clothing' },
        { name: 'Baby Care & Health' },
        { name: 'Toys & Games' },
        { name: 'Nursery Furniture' },
        { name: 'Kids’ Books' },
        { name: 'Baby Feeding' },
        { name: 'Strollers & Car Seats' },
        { name: 'Diapers & Wipes' },
      ],
    },
    {
      name: 'Books & Stationery',
      description:
        'Books for every reader and a wide selection of stationery for school or office needs.',
      subcategories: [
        { name: 'Fiction & Non-fiction Books' },
        { name: 'Children’s Books' },
        { name: 'School Supplies' },
        { name: 'Art Supplies' },
        { name: 'Notebooks & Journals' },
        { name: 'Calendars & Planners' },
        { name: 'Office Supplies' },
      ],
    },
    {
      name: 'Sports & Outdoor',
      description:
        'Gear and apparel for fitness, sports, and outdoor adventures.',
      subcategories: [
        { name: 'Exercise & Fitness Equipment' },
        { name: 'Camping & Hiking Gear' },
        { name: 'Sports Apparel' },
        { name: 'Bicycles & Accessories' },
        { name: 'Fishing Gear' },
        { name: 'Sports Shoes' },
        { name: 'Water Sports Gear' },
        { name: 'Team Sports Equipment' },
      ],
    },
    {
      name: 'Automotive & Motorcycles',
      description:
        'Products for car and motorcycle enthusiasts, including accessories and maintenance tools.',
      subcategories: [
        { name: 'Car Accessories' },
        { name: 'Motorcycle Accessories' },
        { name: 'Car Care & Maintenance' },
        { name: 'Tires & Wheels' },
        { name: 'Tools & Equipment' },
        { name: 'Car Electronics' },
        { name: 'Motorcycles & Scooters' },
        { name: 'Car Parts & Accessories' },
      ],
    },
    {
      name: 'Tools & DIY',
      description:
        'Tools, materials, and supplies for DIY projects and home improvement.',
      subcategories: [
        { name: 'Power Tools' },
        { name: 'Hand Tools' },
        { name: 'Construction Materials' },
        { name: 'Electrical Supplies' },
        { name: 'Paint & Wall Treatments' },
        { name: 'Plumbing Supplies' },
        { name: 'Home Improvement' },
        { name: 'Gardening Tools' },
      ],
    },
    {
      name: 'Office & Supplies',
      description:
        'Office essentials, from furniture to organization tools, to keep your workspace efficient.',
      subcategories: [
        { name: 'Office Furniture' },
        { name: 'Office Electronics' },
        { name: 'Printers & Scanners' },
        { name: 'Office Supplies' },
        { name: 'Ink & Toner' },
        { name: 'Filing & Organization' },
        { name: 'Storage Solutions' },
        { name: 'Cleaning Supplies' },
      ],
    },
    {
      name: 'Pet Supplies',
      description:
        'Essential products for pet care, including food, toys, grooming, and health items for all pet types.',
      subcategories: [
        { name: 'Pet Food' },
        { name: 'Pet Toys' },
        { name: 'Pet Grooming' },
        { name: 'Pet Health & Wellness' },
        { name: 'Aquarium Supplies' },
        { name: 'Pet Accessories' },
        { name: 'Pet Bedding' },
        { name: 'Pet Training' },
      ],
    },
    {
      name: 'Entertainment & Media',
      description:
        'Explore a world of entertainment, from movies and music to video games and collectibles.',
      subcategories: [
        { name: 'Movies & TV Shows' },
        { name: 'Music & Audio' },
        { name: 'Video Games' },
        { name: 'Board Games' },
        { name: 'Gaming Consoles' },
        { name: 'Musical Instruments' },
        { name: 'Event Tickets' },
        { name: 'Collectibles' },
      ],
    },
    {
      name: 'Jewelry & Watches',
      description:
        'Elegant and stylish jewelry and watches for every occasion, from luxury to everyday wear.',
      subcategories: [
        { name: 'Rings' },
        { name: 'Necklaces' },
        { name: 'Earrings' },
        { name: 'Bracelets' },
        { name: 'Watches' },
        { name: 'Men’s Jewelry' },
        { name: 'Women’s Jewelry' },
        { name: 'Luxury Jewelry' },
      ],
    },
    {
      name: 'Gifts & Party Supplies',
      description:
        'Find everything for celebrations, including gift wrap, decor, party favors, and more.',
      subcategories: [
        { name: 'Gift Wrapping' },
        { name: 'Greeting Cards' },
        { name: 'Party Decor' },
        { name: 'Balloons' },
        { name: 'Event Favors' },
        { name: 'Candles' },
        { name: 'Party Games' },
        { name: 'Festive Decor' },
      ],
    },
    {
      name: 'Real Estate',
      description:
        'Properties for sale or rent, including residential, commercial, and industrial options.',
      subcategories: [
        { name: 'Residential Properties' },
        { name: 'Commercial Properties' },
        { name: 'Land' },
        { name: 'Rentals' },
        { name: 'Vacation Rentals' },
        { name: 'Industrial Properties' },
        { name: 'Property Management' },
        { name: 'New Developments' },
      ],
    },
    {
      name: 'Travel & Services',
      description:
        'Travel essentials, bookings, and services to make every journey seamless and memorable.',
      subcategories: [
        { name: 'Hotel & Accommodation' },
        { name: 'Flight Tickets' },
        { name: 'Tour Packages' },
        { name: 'Travel Accessories' },
        { name: 'Travel Insurance' },
        { name: 'Visa Services' },
        { name: 'Cruise Packages' },
        { name: 'Car Rentals' },
      ],
    },
    {
      name: 'Education & Courses',
      description:
        'Educational resources, courses, and tools for learners of all ages and interests.',
      subcategories: [
        { name: 'Online Courses' },
        { name: 'Books & eBooks' },
        { name: 'Language Learning' },
        { name: 'Professional Development' },
        { name: 'Certification Programs' },
        { name: "Kids' Learning" },
        { name: 'Arts & Crafts Courses' },
        { name: 'Tutoring Services' },
      ],
    },
    {
      name: 'Business Services',
      description:
        'Professional services to support businesses, including marketing, legal, and IT solutions.',
      subcategories: [
        { name: 'Marketing Services' },
        { name: 'Legal Services' },
        { name: 'Accounting & Finance' },
        { name: 'IT & Software Services' },
        { name: 'Consultancy' },
        { name: 'Printing & Copying' },
        { name: 'Training & Development' },
        { name: 'Staffing & Recruitment' },
      ],
    },
    {
      name: 'Arts & Crafts',
      description:
        'Supplies and tools for creative projects, from painting and drawing to crafting and sewing.',
      subcategories: [
        { name: 'Painting & Drawing Supplies' },
        { name: 'Crafting Tools' },
        { name: 'Knitting & Sewing Supplies' },
        { name: 'Home Art Decor' },
        { name: 'Handmade Gifts' },
        { name: 'Jewelry Making' },
        { name: 'Woodworking Tools' },
        { name: 'Art Prints' },
      ],
    },
    {
      name: 'Industrial & Scientific',
      description:
        'Equipment, tools, and supplies for industrial, scientific, and agricultural needs.',
      subcategories: [
        { name: 'Lab Equipment' },
        { name: 'Industrial Tools' },
        { name: 'Safety Supplies' },
        { name: 'Agricultural Equipment' },
        { name: 'Construction Equipment' },
        { name: 'Scientific Research Equipment' },
        { name: 'Industrial Chemicals' },
        { name: 'Manufacturing Tools' },
      ],
    },
    {
      name: 'Luxury & Designer',
      description:
        'Exclusive luxury items, designer apparel, fine jewelry, and rare collectibles.',
      subcategories: [
        { name: 'Designer Apparel' },
        { name: 'High-End Electronics' },
        { name: 'Luxury Watches' },
        { name: 'Fine Jewelry' },
        { name: 'Art & Collectibles' },
        { name: 'Designer Bags' },
        { name: 'Luxury Home Decor' },
        { name: 'Rare Collectibles' },
      ],
    },
    {
      name: 'Eco-Friendly & Sustainable',
      description:
        'Environmentally friendly products that promote sustainability and eco-conscious choices.',
      subcategories: [
        { name: 'Recycled Products' },
        { name: 'Organic Food' },
        { name: 'Natural Beauty Products' },
        { name: 'Solar Products' },
        { name: 'Sustainable Clothing' },
        { name: 'Eco-Friendly Cleaning Products' },
        { name: 'Bamboo & Biodegradable Items' },
        { name: 'Energy-Efficient Appliances' },
      ],
    },
    {
      name: 'Medical & Healthcare',
      description:
        'Medical supplies, equipment, and services to support health and wellness.',
      subcategories: [
        { name: 'Prescription Medication' },
        { name: 'Medical Equipment' },
        { name: 'Healthcare Services' },
        { name: 'Health Insurance' },
        { name: 'Fitness & Wellness' },
        { name: 'First Aid Supplies' },
        { name: 'Supplements' },
        { name: 'Dental Care' },
      ],
    },
    {
      name: 'Safety & Security',
      description:
        'Products and services for personal and property safety, including home security and cybersecurity.',
      subcategories: [
        { name: 'Home Security' },
        { name: 'Fire Safety' },
        { name: 'Surveillance Equipment' },
        { name: 'Personal Safety Devices' },
        { name: 'Emergency Kits' },
        { name: 'Protective Gear' },
        { name: 'Cybersecurity Services' },
        { name: 'Security Services' },
      ],
    },
    {
      name: 'Agriculture & Farming',
      description:
        'Supplies and tools for farming and agriculture, from seeds to animal feed.',
      subcategories: [
        { name: 'Seeds & Plants' },
        { name: 'Fertilizers & Pesticides' },
        { name: 'Farm Equipment' },
        { name: 'Irrigation Supplies' },
        { name: 'Animal Feed & Supplies' },
        { name: 'Poultry Equipment' },
        { name: 'Greenhouses' },
        { name: 'Agricultural Consulting' },
      ],
    },
    {
      name: 'Software & Digital Services',
      description:
        'Digital solutions for business and personal use, including software, web development, and IT consulting.',
      subcategories: [
        { name: 'Web Development' },
        { name: 'Mobile Apps' },
        { name: 'Software Subscriptions' },
        { name: 'Cloud Services' },
        { name: 'Digital Marketing' },
        { name: 'Graphic Design Services' },
        { name: 'Domain & Hosting' },
        { name: 'IT Consulting' },
      ],
    },
    {
      name: 'Seasonal & Holiday Categories',
      description:
        'Decor and supplies for seasonal celebrations and holidays throughout the year.',
      subcategories: [
        { name: 'Holiday Decor' },
        { name: 'Christmas Decor' },
        { name: 'Halloween Decor' },
        { name: 'Easter Decor' },
        { name: 'New Year Decor' },
        { name: 'Thanksgiving Decor' },
        { name: 'Valentine’s Day Decor' },
        { name: 'Fourth of July Decor' },
        { name: 'Seasonal Lights' },
      ],
    },
    {
      name: 'Back-to-School Supplies',
      description:
        'School essentials for students, including backpacks, supplies, and dorm essentials.',
      subcategories: [
        { name: 'Backpacks & Bags' },
        { name: 'School Supplies' },
        { name: 'Lunch Boxes' },
        { name: 'Study Aids' },
        { name: 'Stationery' },
        { name: 'Electronics for Students' },
        { name: 'School Uniforms' },
        { name: 'Dorm Essentials' },
      ],
    },
    {
      name: 'Outdoor & Adventure Gear',
      description:
        'Gear and accessories for outdoor activities like camping, hiking, and cycling.',
      subcategories: [
        { name: 'Camping Gear' },
        { name: 'Hiking Equipment' },
        { name: 'Beach Supplies' },
        { name: 'Winter Sports Gear' },
        { name: 'Fishing Equipment' },
        { name: 'Swimming Accessories' },
        { name: 'Cycling Gear' },
        { name: 'Adventure Travel' },
      ],
    },
    {
      name: 'Wedding & Bridal',
      description:
        'Everything needed for weddings, from bridal attire to decor and invitations.',
      subcategories: [
        { name: 'Wedding Dresses' },
        { name: 'Bridesmaid Dresses' },
        { name: 'Wedding Decor' },
        { name: 'Rings & Jewelry' },
        { name: 'Invitations & Stationery' },
        { name: 'Party Favors' },
        { name: 'Photography Services' },
        { name: 'Honeymoon Packages' },
      ],
    },
  ];

  // Insert categories into the database
  for (const category of categories) {
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
