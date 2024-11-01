import { PrismaClient } from '@prisma/client';
import { getOrSetCache, invalidateCache } from '../services/cacheService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    products: async (
      _: any,
      args: {
        categoryId?: number;
        brand?: string;
        vendorId?: number;
        isFeatured?: boolean;
        onSale?: boolean;
        newProducts?: boolean;
      },
      { prisma }: Context
    ) => {
      const cacheKey = `${PRODUCT_CACHE_KEY_PREFIX}all`;

      const filters: any = {};

      // Add filters based on the arguments provided
      if (args.categoryId) filters.categoryId = args.categoryId;
      if (args.brand) filters.brand = args.brand;
      if (args.vendorId) filters.vendorId = args.vendorId;
      if (args.isFeatured) filters.isFeatured = true;
      if (args.onSale) filters.salePrice = { not: null };
      if (args.newProducts) {
        // Filter products created in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filters.createdAt = { gte: thirtyDaysAgo };
      }

      return getOrSetCache(
        cacheKey,
        async () => {
          return prisma.product.findMany({
            where: filters,
            include: { vendor: true },
          });
        },
        CACHE_TTL
      );
    },

    // Cache individual product by ID query
    productById: async (_: any, args: { id: string }, { prisma }: Context) => {
      const cacheKey = `${PRODUCT_CACHE_KEY_PREFIX}${args.id}`;

      return getOrSetCache(
        cacheKey,
        async () => {
          return prisma.product.findUnique({
            where: { id: Number(args.id) },
            include: { vendor: true },
          });
        },
        CACHE_TTL
      );
    },
  },

  User: {
    vendorProfile: async (parent: any, _: any, { prisma }: Context) => {
      try {
        const profile = await prisma.vendorProfile.findUnique({
          where: {
            userId: parent.id,
          },
          select: {
            id: true,
            businessName: true,
            businessType: true,
            businessPhone: true,
            businessEmail: true,
            businessLicense: true,
            taxId: true,
            website: true,
            location: true,
            userId: true,
          },
        });

        if (!profile) {
          console.log(`No vendor profile found for user ${parent.id}`);
          return null;
        }

        return {
          ...profile,
          businessEmail: profile.businessEmail || 'No email provided',
          businessLicense: profile.businessLicense || 'No license provided',
          website: profile.website || 'No website provided',
        };
      } catch (error) {
        console.error(
          `Error fetching vendor profile for user ${parent.id}:`,
          error
        );
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
    // Register a new user
    registerUser: async (
      _: any,
      {
        email,
        password,
        firstName,
        lastName,
        birthdate,
        gender,
      }: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
        birthdate?: string;
        gender?: 'MALE' | 'FEMALE' | 'OTHER';
      },
      { prisma }: Context
    ) => {
      try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) throw new Error('Email is already registered');

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            firstName: firstName || null,
            lastName: lastName || null,
            birthdate: birthdate ? new Date(birthdate) : null,
            gender,
          },
        });

        const token = jwt.sign(
          { userId: newUser.id },
          process.env.JWT_SECRET as string,
          { expiresIn: '1d' }
        );

        return {
          token,
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName || null,
            lastName: newUser.lastName || null,
            birthdate: newUser.birthdate
              ? newUser.birthdate.toISOString().split('T')[0]
              : null,
            gender: newUser.gender,
          },
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Registration error:', error);
        }
        throw new Error('User registration failed');
      }
    },

    // Login a user
    loginUser: async (
      _: any,
      args: { email: string; password: string },
      { prisma }: Context
    ) => {
      const { email, password } = args;
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) throw new Error('Invalid credentials');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error('Invalid credentials');

        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET as string,
          { expiresIn: '1d' }
        );

        return {
          token,
          user: {
            ...user,
            password: undefined,
          },
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message === 'Invalid credentials')
            throw new Error('Invalid credentials');
        }
        throw new Error('Login failed due to an internal server error');
      }
    },

    createProduct: async (_: any, args: any, { prisma }: Context) => {
      try {
        const newProduct = await prisma.product.create({
          data: {
            name: args.name,
            price: args.price,
            category: { connect: { id: args.categoryId } },
            vendor: { connect: { id: args.vendorId } },
            unit: { connect: { id: args.unitId } },
            isFeatured: args.isFeatured || false,
            brand: args.brand || null,
          },
        });

        invalidateCache(`${PRODUCT_CACHE_KEY_PREFIX}all`);
        return newProduct;
      } catch (error) {
        throw new Error(
          `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    updateProduct: async (
      _: any,
      { id, ...args }: any,
      { prisma }: Context
    ) => {
      try {
        const updatedProduct = await prisma.product.update({
          where: { id: parseInt(id, 10) },
          data: args,
        });

        invalidateCache(`${PRODUCT_CACHE_KEY_PREFIX}${id}`);
        invalidateCache(`${PRODUCT_CACHE_KEY_PREFIX}all`);
        return updatedProduct;
      } catch (error) {
        throw new Error(
          `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    deleteProduct: async (
      _: any,
      { id }: { id: string },
      { prisma }: Context
    ) => {
      try {
        await prisma.product.delete({ where: { id: parseInt(id, 10) } });
        invalidateCache(`${PRODUCT_CACHE_KEY_PREFIX}${id}`);
        invalidateCache(`${PRODUCT_CACHE_KEY_PREFIX}all`);
        return true;
      } catch (error) {
        throw new Error(
          `Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    addReaction: async (
      _: any,
      args: { productId: number; type: 'LIKE' | 'DISLIKE' },
      { prisma, user }: Context
    ) => {
      return await prisma.reaction.create({
        data: {
          type: args.type,
          product: { connect: { id: args.productId } },
          user: { connect: { id: user.id } },
        },
      });
    },

    removeReaction: async (
      _: any,
      args: { productId: number },
      { prisma, user }: Context
    ) => {
      const result = await prisma.reaction.deleteMany({
        where: {
          productId: args.productId,
          userId: user.id,
        },
      });

      return result.count > 0;
    },

    addFavorite: async (
      _: any,
      args: { productId: number },
      { prisma, user }: Context
    ) => {
      try {
        return await prisma.favorite.create({
          data: {
            product: { connect: { id: args.productId } },
            user: { connect: { id: user.id } },
          },
        });
      } catch (error) {
        throw new Error(
          `Failed to add favorite: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    removeFavorite: async (
      _: any,
      args: { productId: number },
      { prisma, user }: Context
    ) => {
      try {
        const result = await prisma.favorite.deleteMany({
          where: {
            productId: args.productId,
            userId: user.id,
          },
        });

        return result.count > 0;
      } catch (error) {
        throw new Error(
          `Failed to remove favorite: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    addWish: async (
      _: any,
      args: { productId: number },
      { prisma, user }: Context
    ) => {
      return await prisma.wish.create({
        data: {
          product: { connect: { id: args.productId } },
          user: { connect: { id: user.id } },
        },
      });
    },

    removeWish: async (
      _: any,
      args: { productId: number },
      { prisma, user }: Context
    ) => {
      return await prisma.wish.deleteMany({
        where: {
          productId: args.productId,
          userId: user.id,
        },
      });
    },

    // Vendor Profile Mutations
    updateVendorProfile: async (
      _: any,
      args: {
        businessName: string;
        businessType: string;
        businessPhone: string;
      },
      { prisma, user }: Context
    ) => {
      try {
        const updatedProfile = await prisma.vendorProfile.update({
          where: { userId: user.id },
          data: {
            businessName: args.businessName,
            businessType: args.businessType,
            businessPhone: args.businessPhone,
          },
        });

        return updatedProfile;
      } catch (error) {
        throw new Error(
          `Failed to update vendor profile: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },

    createVendorProfile: async (
      _: any,
      args: {
        businessName: string;
        businessType: string;
        businessPhone: string;
        location: string;
      },
      { prisma, user }: Context
    ) => {
      return await prisma.vendorProfile.create({
        data: {
          user: { connect: { id: user.id } },
          businessName: args.businessName,
          businessType: args.businessType,
          businessPhone: args.businessPhone,
          location: args.location,
        },
      });
    },
  },
};
