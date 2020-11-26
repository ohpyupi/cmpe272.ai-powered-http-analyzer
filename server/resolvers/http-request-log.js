const { memoryStoreGet } = require('../services/memory-storage');

const httpRequestLog = () => ({
  abnormal: memoryStoreGet('abnormal'),
  normal: memoryStoreGet('normal'),
});

module.exports = { httpRequestLog };
