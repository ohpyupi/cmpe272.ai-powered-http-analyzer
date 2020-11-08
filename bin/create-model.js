require('@tensorflow/tfjs-node');
const path = require('path');
const fs = require('fs');
const datasetJson = require('../data/dataset.json');
const tf = require('@tensorflow/tfjs');

const createDataset = ({
    jsonData,
    testSize,
    batchSize,
}) => {
    const dataSize = jsonData.length;
    const oneHot = outcome => Array.from(tf.oneHot(outcome, 2).dataSync());
    const x = datasetJson.map(({
        requestLength,
        argumentLength,
        argumentNumber,
        pathLength,
        specialCharNumberInPath,
    }) => ([
        requestLength,
        argumentLength,
        argumentNumber,
        pathLength,
        specialCharNumberInPath,
    ]));
    const y = datasetJson.map(({ label }) => oneHot(label === 'normal' ? 0 : 1));
    const dataset = tf.data
        .zip({ xs: tf.data.array(x), ys: tf.data.array(y) })
        .shuffle(dataSize, 42);
    const splitIdx = parseInt((1 - testSize) * dataSize, 10);
    return [
        dataset.take(splitIdx).batch(batchSize),
        dataset.skip(splitIdx + 1).batch(batchSize),
        tf.tensor(x.slice(splitIdx)),
        tf.tensor(y.slice(splitIdx))
    ]; 
};

const trainLogisticRegression = async ({
    featureCount,
    learningRate,
    trainDs,
    validDs,
}) => {
    const trainLogs = [];
    const optimizer = tf.train.adam(learningRate);
    const model = tf.sequential();
    model.add(tf.layers.dense({
        units: 2,
        activation: 'softmax',
        inputShape: [featureCount],
    }))
    model.compile({
        optimizer,
        loss: 'binaryCrossentropy',
        metrics: ['accuracy'],
    });
   await model.fitDataset(trainDs, {
        epochs: 100,
        validationData: validDs,
        callbacks: {
            onEpochEnd(epoch, logs) {
                trainLogs.push(logs);
            },
        },
    });
    const json = JSON.stringify(trainLogs, null, 2);
    fs.writeFile(path.resolve(__dirname, '../data/trainLogs.json'), json, (err) => {
        if (err) {
            throw err;
        }
    });
    await model.save(`file:///${path.resolve(__dirname, '../mlModels')}`);
};

const main = async () => {
    const [trainDs, validDs, xTest, yTest] = createDataset({
        jsonData: datasetJson,
        testSize: 0.1,
        batchSize: 16,
    });
    await trainLogisticRegression({
        featureCount: 5,
        learningRate: 0.001,
        trainDs,
        validDs,
    });
};

main();