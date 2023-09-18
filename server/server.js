const express = require('express');
const path = require('path');
const db = require('./config/connection');
require('dotenv').config(); // import .env variables
//const routes = require('./routes');   // original

// Import Apollo Server
const { ApolloServer } = require('apollo-server-express');

//Import typeDefs and resolvers
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./schemas/resolvers');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize new Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => req // allows each request to pass through context
});

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Integrate Apollo Server with Express application as middleware
server.applyMiddleware({ app });

// app.use(routes); // original

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
