import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    vendorProfile: VendorProfile
  }

  type VendorProfile {
    id: ID!
    businessName: String!   # New field for the business name
    businessType: String!   # New field for the business type
    businessPhone: String!  # New field for the business phone
    businessEmail: String   # Existing or optional business email
    location: String        # Google Maps location
    user: User!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    vendor: VendorProfile!
    reactions: [Reaction!]  # Include reactions for products
  }

  enum ReactionType {
    LIKE
    DISLIKE
  }

  type Reaction {
    id: ID!
    type: ReactionType!
    product: Product!
    user: User!
  }

  # Define Favorite type
  type Favorite {
    id: ID!
    product: Product!
    user: User!
    createdAt: String!
  }

  # Define Wish type
  type Wish {
    id: ID!
    product: Product!
    user: User!
    createdAt: String!
  }

  type Query {
    users: [User!]  # Query to fetch all users
    products: [Product!]  # Query to fetch all products
    productById(id: ID!): Product  # Query to fetch product by ID
    vendorProfileByUserId(userId: ID!): VendorProfile  # Query to fetch vendor profile by user ID
  }

  type Mutation {
    # Product mutations
    createProduct(name: String!, price: Float!, categoryId: Int!, vendorId: Int!, unitId: Int!): Product
    updateProduct(id: Int!, name: String, price: Float): Product
    deleteProduct(id: Int!): Boolean

    # Reaction mutations
    addReaction(productId: ID!, type: ReactionType!): Reaction
    removeReaction(productId: ID!): Boolean

    # Favorite and Wish mutations
    addFavorite(productId: ID!): Favorite
    removeFavorite(productId: ID!): Boolean
    addWish(productId: ID!): Wish
    removeWish(productId: ID!): Boolean

    # VendorProfile mutations
    updateVendorProfile(businessName: String!, businessType: String!, businessPhone: String!): VendorProfile
    createVendorProfile(businessName: String!, businessType: String!, businessPhone: String!, location: String): VendorProfile
  }
`;
