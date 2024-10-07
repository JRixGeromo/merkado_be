import { PrismaClient } from '@prisma/client';
import prisma from '../prisma';

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
    vendorProfile: async (parent: any, _: any, { prisma }: Context) => {
      try {
        return await prisma.vendorProfile.findUnique({
          where: { id: parent.vendorProfileId },
        });
      } catch (error) {
        throw new Error('Failed to fetch vendor profile');
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
