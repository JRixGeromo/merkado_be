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
  
        // Handle nullable values appropriately
        return {
          ...profile,
          businessEmail: profile.businessEmail || "No email provided",
          businessLicense: profile.businessLicense || "No license provided",
          website: profile.website || "No website provided",
        };
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
    // Register a new user
    registerUser: async (_: any, { email, password }: { email: string; password: string }, { prisma }: Context) => {
      try {
        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          throw new Error('Email is already registered');
        }
    
        // Hash the password
        console.log('Hashing password for:', email);
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create the user in the database
        console.log('Creating new user with email:', email);
        const newUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
          },
        });
    
        // Generate the JWT token
        console.log('Generating JWT token for user:', newUser.id);
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    
        // Return the token and user
        console.log('User registration successful for:', newUser.email);
        return {
          token,
          user: {
            id: newUser.id,
            email: newUser.email,
          },
        };
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error during user registration:', error.message); // Log the actual error
        } else {
          console.error('Unknown error during user registration:', error);
        }
        throw new Error('User registration failed');
      }
    },
    
    // Login a user
    loginUser: async (_: any, args: { email: string, password: string }, { prisma }: Context) => {
      const { email, password } = args;
      try {
        // Find the user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        // Ensure the password is a string before comparing
        if (typeof user.password !== 'string') {
          throw new Error('Invalid credentials');
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

        // Return user data and token
        return {
          token,
          user: {
            ...user,
            password: undefined, // Exclude password from response
          },
        };
      } catch (error) {
        console.error('Login Error:', error);
        throw new Error('Login failed');
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

    // Wish and Favorite Mutations
    addWish: async (_: any, args: { productId: number }, { prisma, user }: Context) => {
      return await prisma.wish.create({
        data: {
          product: { connect: { id: args.productId } },
          user: { connect: { id: user.id } },
        },
      });
    },

    removeWish: async (_: any, args: { productId: number }, { prisma, user }: Context) => {
      return await prisma.wish.deleteMany({
        where: {
          productId: args.productId,
          userId: user.id,
        },
      });
    },

    // New Mutation to update Vendor Profile
    updateVendorProfile: async (_: any, args: { businessName: string, businessType: string, businessPhone: string }, { prisma, user }: Context) => {
      try {
        const updatedProfile = await prisma.vendorProfile.update({
          where: {
            userId: user.id, // Ensure it updates the profile tied to the logged-in user
          },
          data: {
            businessName: args.businessName,
            businessType: args.businessType,
            businessPhone: args.businessPhone,
          },
        });

        return updatedProfile;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to update vendor profile: ${error.message}`);
        } else {
          throw new Error('Failed to update vendor profile due to an unknown error.');
        }
      }
    },

    // New Mutation to create Vendor Profile (if needed)
    createVendorProfile: async (_: any, args: { businessName: string, businessType: string, businessPhone: string, location: string }, { prisma, user }: Context) => {
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
