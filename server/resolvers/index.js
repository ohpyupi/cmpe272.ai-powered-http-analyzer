const { appInfo } = require('./app-info');
const { httpRequestLog } = require('./http-request-log');

const resolvers = {
  Query: {
    appInfo,
    httpRequestLog,
  },
};

module.exports = { resolvers };
