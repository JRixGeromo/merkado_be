import { PrismaClient } from '@prisma/client';
import prisma from '../prisma';

interface Context {
  prisma: PrismaClient;
}

export const resolvers = {
  Query: {
    users: async (_: any, __: any, { prisma }: Context) => {
      return await prisma.user.findMany({
        include: { vendorProfile: true },
      });
    },
    products: async (_: any, __: any, { prisma }: Context) => {
      return await prisma.product.findMany({
        include: { vendor: true },
      });
    },
  },
  User: {
    vendorProfile: async (parent: any, _: any, { prisma }: Context) => {
      return await prisma.vendorProfile.findUnique({
        where: { id: parent.vendorProfileId },
      });
    },
  },
  Product: {
    vendor: async (parent: any, _: any, { prisma }: Context) => {
      return await prisma.vendorProfile.findUnique({
        where: { id: parent.vendorId },
      });
    },
  },
};
