/**
 * WARNING: This memory storage is for the testing purpose
 * It needs to be replaced with other persistent database in production env
 */
const cache = {
  normal: 1233,
  abnormal: 223,
};

const memoryStoreSave = (key, value) => {
  cache[key] = value;
};

const memoryStoreGet = (key) => cache[key];

const memoryStorePrint = () => console.log(JSON.stringify(cache));

module.exports = {
  memoryStoreSave,
  memoryStoreGet,
  memoryStorePrint,
};
