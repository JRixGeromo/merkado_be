'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.resolvers = void 0;
const cacheService_1 = require('../services/cacheService');
const bcryptjs_1 = __importDefault(require('bcryptjs'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const PRODUCT_CACHE_KEY_PREFIX = 'product_'; // Prefix for product cache keys
const CACHE_TTL = 3600; // 1 hour in seconds
exports.resolvers = {
  Query: {
    users: (_1, __1, _a) =>
      __awaiter(void 0, [_1, __1, _a], void 0, function* (_, __, { prisma }) {
        return prisma.user.findMany({
          include: { vendorProfile: true },
        });
      }),
    // Cache the products query
    products: (_1, args_1, _a) =>
      __awaiter(
        void 0,
        [_1, args_1, _a],
        void 0,
        function* (_, args, { prisma }) {
          const cacheKey = `${PRODUCT_CACHE_KEY_PREFIX}all`;
          const filters = {};
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
          return (0, cacheService_1.getOrSetCache)(
            cacheKey,
            () =>
              __awaiter(void 0, void 0, void 0, function* () {
                return prisma.product.findMany({
                  where: filters,
                  include: { vendor: true },
                });
              }),
            CACHE_TTL
          );
        }
      ),
    // Cache individual product by ID query
    productById: (_1, args_1, _a) =>
      __awaiter(
        void 0,
        [_1, args_1, _a],
        void 0,
        function* (_, args, { prisma }) {
          const cacheKey = `${PRODUCT_CACHE_KEY_PREFIX}${args.id}`;
          return (0, cacheService_1.getOrSetCache)(
            cacheKey,
            () =>
              __awaiter(void 0, void 0, void 0, function* () {
                return prisma.product.findUnique({
                  where: { id: Number(args.id) },
                  include: { vendor: true },
                });
              }),
            CACHE_TTL
          );
        }
      ),
  },
  User: {
    vendorProfile: (parent_1, _1, _a) =>
      __awaiter(
        void 0,
        [parent_1, _1, _a],
        void 0,
        function* (parent, _, { prisma }) {
          try {
            const profile = yield prisma.vendorProfile.findUnique({
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
            return Object.assign(Object.assign({}, profile), {
              businessEmail: profile.businessEmail || 'No email provided',
              businessLicense: profile.businessLicense || 'No license provided',
              website: profile.website || 'No website provided',
            });
          } catch (error) {
            console.error(
              `Error fetching vendor profile for user ${parent.id}:`,
              error
            );
            throw new Error('Failed to fetch vendor profile');
          }
        }
      ),
  },
  Product: {
    vendor: (parent_1, _1, _a) =>
      __awaiter(
        void 0,
        [parent_1, _1, _a],
        void 0,
        function* (parent, _, { prisma }) {
          try {
            return yield prisma.vendorProfile.findUnique({
              where: { id: parent.vendorId },
            });
          } catch (error) {
            throw new Error('Failed to fetch vendor');
          }
        }
      ),
  },
  Mutation: {
    // Register a new user
    registerUser: (_1, _a, _b) =>
      __awaiter(
        void 0,
        [_1, _a, _b],
        void 0,
        function* (
          _,
          { email, password, firstName, lastName, birthdate, gender },
          { prisma }
        ) {
          try {
            const existingUser = yield prisma.user.findUnique({
              where: { email },
            });
            if (existingUser) throw new Error('Email is already registered');
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const newUser = yield prisma.user.create({
              data: {
                email,
                password: hashedPassword,
                firstName: firstName || null,
                lastName: lastName || null,
                birthdate: birthdate ? new Date(birthdate) : null,
                gender,
              },
            });
            const token = jsonwebtoken_1.default.sign(
              { userId: newUser.id },
              process.env.JWT_SECRET,
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
          } catch (error) {
            if (error instanceof Error) {
              console.error('Registration error:', error);
            }
            throw new Error('User registration failed');
          }
        }
      ),
    // Login a user
    loginUser: (_1, args_1, _a) =>
      __awaiter(
        void 0,
        [_1, args_1, _a],
        void 0,
        function* (_, args, { prisma }) {
          const { email, password } = args;
          try {
            const user = yield prisma.user.findUnique({ where: { email } });
            if (!user || !user.password) throw new Error('Invalid credentials');
            const isPasswordValid = yield bcryptjs_1.default.compare(
              password,
              user.password
            );
            if (!isPasswordValid) throw new Error('Invalid credentials');
            const token = jsonwebtoken_1.default.sign(
              { userId: user.id },
              process.env.JWT_SECRET,
              { expiresIn: '1d' }
            );
            return {
              token,
              user: Object.assign(Object.assign({}, user), {
                password: undefined,
              }),
            };
          } catch (error) {
            if (error instanceof Error) {
              if (error.message === 'Invalid credentials')
                throw new Error('Invalid credentials');
            }
            throw new Error('Login failed due to an internal server error');
          }
        }
      ),
    createProduct: (_1, args_1, _a) =>
      __awaiter(
        void 0,
        [_1, args_1, _a],
        void 0,
        function* (_, args, { prisma }) {
          try {
            const newProduct = yield prisma.product.create({
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
            (0, cacheService_1.invalidateCache)(
              `${PRODUCT_CACHE_KEY_PREFIX}all`
            );
            return newProduct;
          } catch (error) {
            throw new Error(
              `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          }
        }
      ),
    updateProduct: (_, _a, _b) =>
      __awaiter(void 0, void 0, void 0, function* () {
        var { id } = _a,
          args = __rest(_a, ['id']);
        var prisma = _b.prisma;
        try {
          const updatedProduct = yield prisma.product.update({
            where: { id: parseInt(id, 10) },
            data: args,
          });
          (0, cacheService_1.invalidateCache)(
            `${PRODUCT_CACHE_KEY_PREFIX}${id}`
          );
          (0, cacheService_1.invalidateCache)(`${PRODUCT_CACHE_KEY_PREFIX}all`);
          return updatedProduct;
        } catch (error) {
          throw new Error(
            `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }),
    deleteProduct: (_1, _a, _b) =>
      __awaiter(
        void 0,
        [_1, _a, _b],
        void 0,
        function* (_, { id }, { prisma }) {
          try {
            yield prisma.product.delete({ where: { id: parseInt(id, 10) } });
            (0, cacheService_1.invalidateCache)(
              `${PRODUCT_CACHE_KEY_PREFIX}${id}`
            );
            (0, cacheService_1.invalidateCache)(
              `${PRODUCT_CACHE_KEY_PREFIX}all`
            );
            return true;
          } catch (error) {
            throw new Error(
              `Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          }
        }
      ),
    addReaction: (_1, args_1, _a) =>
      __awaiter(
        void 0,
        [_1, args_1, _a],
        void 0,
        function* (_, args, { prisma, user }) {
          return yield prisma.reaction.create({
            data: {
              type: args.type,
              product: { connect: { id: args.productId } },
              user: { connect: { id: user.id } },
            },
          });
        }
      ),
    removeReaction: (_1, args_1, _a) =>
      __awaiter(
        void 0,
        [_1, args_1, _a],
        void 0,
        function* (_, args, { prisma, user }) {
          const result = yield prisma.reaction.deleteMany({
            where: {
              productId: args.productId,
              userId: user.id,
            },
          });
          return result.count > 0;
        }
      ),
    addFavorite: (_1, args_1, _a) =>
      __awaiter(
        void 0,
        [_1, args_1, _a],
        void 0,
        function* (_, args, { prisma, user }) {
          try {
            return yield prisma.favorite.create({
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
        }
      ),
    removeFavorite: (_1, args_1, _a) =>
      __awaiter(
        void 0,
        [_1, args_1, _a],
        void 0,
        function* (_, args, { prisma, user }) {
          try {
            const result = yield prisma.favorite.deleteMany({
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
        }
      ),
    addWish: (_1, args_1, _a) =>
      __awaiter(
        void 0,
        [_1, args_1, _a],
        void 0,
        function* (_, args, { prisma, user }) {
          return yield prisma.wish.create({
            data: {
              product: { connect: { id: args.productId } },
              user: { connect: { id: user.id } },
            },
          });
        }
      ),
    removeWish: (_1, args_1, _a) =>
      __awaiter(
        void 0,
        [_1, args_1, _a],
        void 0,
        function* (_, args, { prisma, user }) {
          return yield prisma.wish.deleteMany({
            where: {
              productId: args.productId,
              userId: user.id,
            },
          });
        }
      ),
    // Vendor Profile Mutations
    updateVendorProfile: (_1, args_1, _a) =>
      __awaiter(
        void 0,
        [_1, args_1, _a],
        void 0,
        function* (_, args, { prisma, user }) {
          try {
            const updatedProfile = yield prisma.vendorProfile.update({
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
        }
      ),
    createVendorProfile: (_1, args_1, _a) =>
      __awaiter(
        void 0,
        [_1, args_1, _a],
        void 0,
        function* (_, args, { prisma, user }) {
          return yield prisma.vendorProfile.create({
            data: {
              user: { connect: { id: user.id } },
              businessName: args.businessName,
              businessType: args.businessType,
              businessPhone: args.businessPhone,
              location: args.location,
            },
          });
        }
      ),
  },
};
