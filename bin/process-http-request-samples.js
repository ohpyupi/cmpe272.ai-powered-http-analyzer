const fs = require('fs');
const path = require('path');
const httpStringParser = require('http-string-parser');
const _ = require('lodash');
const cookieParser = require('cookie');
const { REGEX } = require('../config/variables');
const { getFeatureFromRawHttpRequest } = require('../server/middleware/ai-http-analyzer/utils');

const getAllFileInDir = (dirPath) => new Promise((resolve, reject) => {
    fs.readdir(path.resolve(__dirname, dirPath), (err, filenames) => {
        if (err) {
            return reject(err);
        }
        return resolve(filenames);
    });
});

const getFileContent = (filePath) => new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, filePath), (err, fileContent) => {
        if (err) {
            return reject(err);
        }
        return resolve(fileContent);
    });
});

const getFeaturesFromHttpRequests = async (dirPath, label) => {
    const fileNames = await getAllFileInDir(dirPath);
    const dataset = [];
    for await (const fileName of fileNames) {
        const data = {
            requestLength: 0,
            argumentLength: 0,
            argumentNumber: 0,
            pathLength: 0,
            specialCharNumberInPath: 0,
            fileName,
            label,
        };
        const fileContent = await getFileContent(`${dirPath}/${fileName}`);
        const rawHttpRequest = fileContent.toString();
        Object.assign(data, getFeatureFromRawHttpRequest(rawHttpRequest));
        dataset.push(data);
    }
    return dataset;
};

const main = async () => {
    const abnormalDataSet = await getFeaturesFromHttpRequests('../data/abnormal', 'abnormal');
    const normalDataSet = await getFeaturesFromHttpRequests('../data/normal', 'normal');
    const dataset = [
        ...abnormalDataSet,
        ...normalDataSet,
    ];
    const json = JSON.stringify(dataset, null, 2);
    fs.writeFile(path.resolve(__dirname, '../data/dataset.json'), json, (err) => {
        if (err) {
            throw err;
        }
        console.log('done!');
    });
};

main();
