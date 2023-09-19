const { User, Thought } = require('../models');
const { signToken, AuthenticationError } = require('./utils/auth');  

const resolvers = {
    Query: {
        thoughts: async () => {
          return Thought.find().sort({ createdAt: -1 }); //sort descending
        },
        thought: async (parent, { thoughtId }) => {
          return Thought.findById(thoughtId);
        },
        // authentication to get the logged-in user
        me: async (parent, args, context) => {
          if (context.user) {
            return User.findOne({ _id: context.user._id });
          }
          throw new Error('You are not authenticated!');
        }
      },

  Mutation: {
    addThought: async (parent, args, context) => {
      if (context.user) {
        const thought = new Thought({ ...args, username: context.user.username });
        await thought.save();
        return thought;
      }
      throw new AuthenticationError('You need to be logged in to add a thought.'); 
    },
    addUser: async (parent, args) => {
      const user = new User(args);
      await user.save();

      const token = signToken(user);  // Generating token
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address.');  
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password.'); 
      }

      const token = signToken(user);  // Generating token
      return { token, user };
    }
  }
};

module.exports = resolvers;
