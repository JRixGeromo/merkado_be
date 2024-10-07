import { PrismaClient } from '@prisma/client';
import { VendorProfile } from '@prisma/client';
import { getOrSetCache, invalidateCache } from '../services/cacheService';  // Import caching service

interface Context {
  prisma: PrismaClient;
  user: { id: number }; // Assuming `user` contains at least `id`
}

const PRODUCT_CACHE_KEY_PREFIX = 'product_'; // Prefix for product cache keys
const CACHE_TTL = 3600; // 1 hour in seconds

export const resolvers = {
  Query: {
    users: async (_: any, __: any, { prisma }: Context) => {
      return prisma.user.findMany({
        include: { vendorProfile: true },
      });
    },

    // Cache the products query
    products: async (_: any, __: any, { prisma }: Context) => {
      const cacheKey = `${PRODUCT_CACHE_KEY_PREFIX}all`;

      return getOrSetCache(cacheKey, async () => {
        return prisma.product.findMany({
          include: { vendor: true },
        });
      }, CACHE_TTL);
    },

    // Cache individual product by ID query
    productById: async (_: any, args: { id: string }, { prisma }: Context) => {
      const cacheKey = `${PRODUCT_CACHE_KEY_PREFIX}${args.id}`;

      return getOrSetCache(cacheKey, async () => {
        return prisma.product.findUnique({
          where: { id: Number(args.id) }, // Assuming `id` is numeric
          include: { vendor: true },
        });
      }, CACHE_TTL);
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
      try {
        const newProduct = await prisma.product.create({
          data: {
            name: args.name,
            price: args.price,
            category: { connect: { id: args.categoryId } },
            vendor: { connect: { id: args.vendorId } },
            unit: { connect: { id: args.unitId } },
          },
        });

        invalidateCache(`${PRODUCT_CACHE_KEY_PREFIX}all`);
        return newProduct;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to create product: ${error.message}`);
        } else {
          throw new Error('Failed to create product due to an unknown error.');
        }
      }
    },

    updateProduct: async (_: any, { id, ...args }: any, { prisma }: Context) => {
      try {
        const updatedProduct = await prisma.product.update({
          where: { id: parseInt(id, 10) },
          data: args,
        });

        invalidateCache(`${PRODUCT_CACHE_KEY_PREFIX}${id}`);
        invalidateCache(`${PRODUCT_CACHE_KEY_PREFIX}all`);
        return updatedProduct;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to update product: ${error.message}`);
        } else {
          throw new Error('Failed to update product due to an unknown error.');
        }
      }
    },

    deleteProduct: async (_: any, { id }: { id: string }, { prisma }: Context) => {
      try {
        await prisma.product.delete({ where: { id: parseInt(id, 10) } });
        invalidateCache(`${PRODUCT_CACHE_KEY_PREFIX}${id}`);
        invalidateCache(`${PRODUCT_CACHE_KEY_PREFIX}all`);
        return true;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to delete product: ${error.message}`);
        } else {
          throw new Error('Failed to delete product due to an unknown error.');
        }
        
      }
    },

    // Wish and Favorite Mutations
    addWish: async (_: any, args: { productId: number }, { prisma, user }: Context) => {
      try {
        return await prisma.wish.create({
          data: {
            product: { connect: { id: args.productId } },
            user: { connect: { id: user.id } },
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to add wish: ${error.message}`);
        } else {
          throw new Error('Failed to add wish due to an unknown error.');
        }
      }
    },

    removeWish: async (_: any, args: { productId: number }, { prisma, user }: Context) => {
      try {
        const result = await prisma.wish.deleteMany({
          where: {
            productId: args.productId,
            userId: user.id,
          },
        });

        return result.count > 0;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to remove wish: ${error.message}`);
        } else {
          throw new Error('Failed to remove wish due to an unknown error.');
        }
      }
    },

    addFavorite: async (_: any, args: { productId: number }, { prisma, user }: Context) => {
      try {
        return await prisma.favorite.create({
          data: {
            product: { connect: { id: args.productId } },
            user: { connect: { id: user.id } },
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to add favorite: ${error.message}`);
        } else {
          throw new Error('Failed to add favorite due to an unknown error.');
        }
      }
    },

    removeFavorite: async (_: any, args: { productId: number }, { prisma, user }: Context) => {
      try {
        const result = await prisma.favorite.deleteMany({
          where: {
            productId: args.productId,
            userId: user.id,
          },
        });

        return result.count > 0;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to remove favorite: ${error.message}`);
        } else {
          throw new Error('Failed to remove favorite due to an unknown error.');
        }

      }
    },

    addReaction: async (_: any, args: { productId: number, type: 'LIKE' | 'DISLIKE' }, { prisma, user }: Context) => {
    return await prisma.reaction.create({
      data: {
        type: args.type,
        product: { connect: { id: args.productId } },
        user: { connect: { id: user.id } },
      },
    });
  },

  removeReaction: async (_: any, args: { productId: number }, { prisma, user }: Context) => {
    const result = await prisma.reaction.deleteMany({
      where: {
        productId: args.productId,
        userId: user.id,
      },
    });

    return result.count > 0;
  },
  },
};
