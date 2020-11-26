require('@tensorflow/tfjs-node');
const path = require('path');
const tf = require('@tensorflow/tfjs');
const { getFeatureFromRawHttpRequest } = require('./utils');
const { memoryStoreSave, memoryStoreGet, memoryStorePrint } = require('../../services/memory-storage');

const recordHttpRequest = (labels) => {
  if (!labels || labels.length !== 2) {
    return;
  }
  const key = labels[1] === 1 ? 'abnormal' : 'normal';
  const value = memoryStoreGet(key) + 1 || 1;
  console.log(`[INFO] ${key} http request count ==> ${value}`);
  memoryStoreSave(key, value);
};

const predictAbnormalHttpRequest = async ({
  requestLength,
  argumentLength,
  argumentNumber,
  pathLength,
  specialCharNumberInPath,
}) => {
  try {
    const model = await tf.loadLayersModel(`file://${path.resolve(__dirname, '../../../mlModels/model.json')}`);
    const prediction = model.predict(tf.tensor([[
      requestLength,
      argumentLength,
      argumentNumber,
      pathLength,
      specialCharNumberInPath,
    ]]));
    const labels = prediction.dataSync();
    recordHttpRequest(labels);
  } catch (err) {
    console.error(`Something went wrong: ${err.message}`);
  }
};

const aiHttpAnalyzer = () => (req, res, next) => {
  next();
  req.socket.once('data', (rawBuffer) => {
    const rawHttpRequest = rawBuffer.toString();
    const features = getFeatureFromRawHttpRequest(rawHttpRequest);
    predictAbnormalHttpRequest(features);
  });
};

module.exports = {
  aiHttpAnalyzer,
};
