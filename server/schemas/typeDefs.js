const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    authors: [String]
    title: String
    description: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: saveBookInput!): User
    removeBook(bookId: ID!): User
  }

  input saveBookInput {
    authors: [String]
    description: String!
    title: String!
    bookId: ID!
    image: String
    link: String
  }
`;

module.exports = typeDefs;
