const { appInfo } = require('./app-info');

const resolvers = {
  Query: {
    appInfo,
  },
};

module.exports = { resolvers };