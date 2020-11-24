require('@tensorflow/tfjs-node');
const path = require('path');
const tf = require('@tensorflow/tfjs');
const { getFeatureFromRawHttpRequest } = require('./utils');

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
    console.log(prediction.print());
    const labels = prediction.dataSync();
    console.log(labels);
    const isAbnormal = labels[1] === 1;
    if (isAbnormal) {
      console.log('Abnormal request!');
    }
  } catch (err) {
    console.error(`Something went wrong: ${err.message}`);
  }
};

const aiHttpAnalyzer = () => (req, res, next) => {
  next();
  req.socket.on('data', (rawBuffer) => {
    const rawHttpRequest = rawBuffer.toString();
    console.log(rawHttpRequest);
    const features = getFeatureFromRawHttpRequest(rawHttpRequest);
    console.log(features);
    predictAbnormalHttpRequest(features);
  });
};

module.exports = {
  aiHttpAnalyzer,
};
