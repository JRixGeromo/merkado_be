import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    vendorProfile: VendorProfile
  }

  type VendorProfile {
    id: ID!
    location: String
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
  }

  type Mutation {
    createProduct(name: String!, price: Float!, categoryId: Int!, vendorId: Int!, unitId: Int!): Product
    updateProduct(id: Int!, name: String, price: Float): Product
    deleteProduct(id: Int!): Boolean

    # Add the missing addReaction and removeReaction mutations
    addReaction(productId: ID!, type: ReactionType!): Reaction
    removeReaction(productId: ID!): Boolean

    # Add Favorite and Wish mutations
    addFavorite(productId: ID!): Favorite
    removeFavorite(productId: ID!): Boolean
    addWish(productId: ID!): Wish
    removeWish(productId: ID!): Boolean
  }
`;
