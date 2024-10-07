import { PrismaClient } from '@prisma/client';
import { VendorProfile } from '@prisma/client';

interface Context {
  prisma: PrismaClient;
}

export const resolvers = {
  Query: {
    users: async (_: any, __: any, { prisma }: Context) => {
      try {
        return await prisma.user.findMany({
          include: { vendorProfile: true },  // Include vendorProfile
        });
      } catch (error) {
        throw new Error('Failed to fetch users');
      }
    },
    products: async (_: any, __: any, { prisma }: Context) => {
      try {
        return await prisma.product.findMany({
          include: { vendor: true },  // Include vendor directly in the query
        });
      } catch (error) {
        throw new Error('Failed to fetch products');
      }
    },
  },
  User: {
    vendorProfile: async (parent: any, _: any, { prisma }: Context): Promise<VendorProfile | null> => {
      try {
        const profile = await prisma.vendorProfile.findUnique({
          where: {
            userId: parent.id, // Ensure you are querying by `userId` (the user's ID)
          },
        });
  
        if (!profile) {
          console.log(`No vendor profile found for user ${parent.id}`);
          return null;
        }
  
        return profile;
      } catch (error) {
        console.error(`Error fetching vendor profile for user ${parent.id}:`, error);
        throw new Error('Failed to fetch vendor profile'); // Throw error instead of returning null if a real issue occurs
      }
    },
  },
  
  Product: {
    vendor: async (parent: any, _: any, { prisma }: Context) => {
      try {
        return await prisma.vendorProfile.findUnique({
          where: { id: parent.vendorId },
        });
      } catch (error) {
        throw new Error('Failed to fetch vendor');
      }
    },
  },
};
