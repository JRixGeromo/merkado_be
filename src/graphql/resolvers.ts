import { PrismaClient } from '@prisma/client';
import { VendorProfile } from '@prisma/client';
import { getOrSetCache, invalidateCache } from '../services/cacheService';  // Import caching service

interface Context {
  prisma: PrismaClient;
}

const PRODUCT_CACHE_KEY_PREFIX = 'product_'; // Prefix for product cache keys
const CACHE_TTL = 3600; // 1 hour in seconds

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

    // Add caching to the products resolver
    products: async (_: any, __: any, { prisma }: Context) => {
      const cacheKey = `${PRODUCT_CACHE_KEY_PREFIX}all`;  // Cache key for all products
      return getOrSetCache(cacheKey, async () => {
        try {
          const products = await prisma.product.findMany({
            include: { vendor: true },  // Include vendor directly in the query
          });
          return products;
        } catch (error) {
          throw new Error('Failed to fetch products');
        }
      }, CACHE_TTL);  // 1 hour TTL for cache
    },

    // Add caching for fetching a product by ID if needed
    productById: async (_: any, { id }: { id: string }, { prisma }: Context) => {
      const cacheKey = `${PRODUCT_CACHE_KEY_PREFIX}${id}`;  // Cache key for individual product
      return getOrSetCache(cacheKey, async () => {
        try {
          const product = await prisma.product.findUnique({
            where: { id: parseInt(id, 10) },
            include: { vendor: true },  // Include vendor in the query
          });
          if (!product) throw new Error(`Product with ID ${id} not found`);
          return product;
        } catch (error) {
          throw new Error('Failed to fetch product');
        }
      }, CACHE_TTL);  // Cache this product for 1 hour
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

  Mutation: {
    createProduct: async (_: any, args: any, { prisma }: Context) => {
      const newProduct = await prisma.product.create({
        data: {
          name: args.name,           // Ensure name is provided
          price: args.price,         // Ensure price is provided
          category: {
            connect: { id: args.categoryId },  // Connect existing category by ID
          },
          vendor: {
            connect: { id: args.vendorId },    // Connect existing vendor by ID
          },
          unit: {
            connect: { id: args.unitId },      // Connect existing unit by ID
          },
          // Add more fields here if needed, such as description, images, etc.
        },
      });
  
      // Invalidate cache for all products since new data is added
      invalidateCache(`${PRODUCT_CACHE_KEY_PREFIX}all`);
  
      return newProduct;
    },

    updateProduct: async (_: any, { id, ...args }: any, { prisma }: Context) => {
      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(id, 10) },
        data: args,
      });

      // Invalidate cache for this product and the products list
      invalidateCache(`${PRODUCT_CACHE_KEY_PREFIX}${id}`);
      invalidateCache(`${PRODUCT_CACHE_KEY_PREFIX}all`);

      return updatedProduct;
    },

    deleteProduct: async (_: any, { id }: { id: string }, { prisma }: Context) => {
      await prisma.product.delete({
        where: { id: parseInt(id, 10) },
      });

      // Invalidate cache for this product and the products list
      invalidateCache(`${PRODUCT_CACHE_KEY_PREFIX}${id}`);
      invalidateCache(`${PRODUCT_CACHE_KEY_PREFIX}all`);

      return true;
    },
  },
};
