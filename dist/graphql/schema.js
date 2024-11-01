'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.typeDefs = void 0;
const graphql_tag_1 = require('graphql-tag');
exports.typeDefs = (0, graphql_tag_1.gql)`
  # Define User type with additional fields
  type User {
    id: ID!
    email: String!
    firstName: String 
    lastName: String  
    birthdate: String 
    gender: Gender    
    vendorProfile: VendorProfile
  }

  # Define Gender enum
  enum Gender {
    MALE
    FEMALE
    OTHER
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type VendorProfile {
    id: ID!
    businessName: String! 
    businessType: String! 
    businessPhone: String!
    businessEmail: String 
    location: String      
    user: User!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    vendor: VendorProfile!
    reactions: [Reaction!]
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
    users: [User!] 
    products: [Product!]
    productById(id: ID!): Product 
    vendorProfileByUserId(userId: ID!): VendorProfile  
  }

  type Mutation {
    registerUser(
      email: String!,
      password: String!,
      firstName: String,
      lastName: String, 
      birthdate: String,
      gender: Gender,   
      location: String  
    ): AuthPayload!

    loginUser(email: String!, password: String!): AuthPayload!  
    
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
