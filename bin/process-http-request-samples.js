const fs = require('fs');
const path = require('path');
const httpStringParser = require('http-string-parser');
const _ = require('lodash');
const cookieParser = require('cookie');
const { REGEX } = require('../config/variables');

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

const analyzeBodyParams = (parsedHttp) => {
    const contentType = _.get(parsedHttp, `headers['Content-Type']`, '');
    if (contentType.includes('application/json')) {
        const parsedJson = JSON.parse(parsedHttp.body);
        const bodyParamsNumber = Object.keys(parsedJson).length;
        const bodyParamsLength = parsedHttp.body.length;
        return {
            bodyParamsNumber,
            bodyParamsLength,
        };

    }
    const bodyParams = new URLSearchParams(parsedHttp.body || '');
    const bodyParamsNumber = Array.from(bodyParams).length;
    const bodyParamsLength = bodyParams.toString().length;
    return {
        bodyParamsLength,
        bodyParamsNumber,
    };
};

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
        const httpRequest = fileContent.toString();
        const parsedHttp = httpStringParser.parseRequest(httpRequest);
        // HTTP Argument: [1] Body Parameter
       const {
            bodyParamsNumber,
            bodyParamsLength,
        } = analyzeBodyParams(parsedHttp);
        // HTTP Argument: [2] URL Parameter
        const urlObj = new URL(parsedHttp.uri, 'https://www.example.com');
        const urlParamsLength = urlObj.search.length;
        const urlParamsNumber = Array.from(urlObj.searchParams).length;
        const urlPath = urlObj.pathname + urlObj.search;
        // HTTP Argument: [3] Cookie
        const cookieString = _.get(parsedHttp, 'headers.Cookie', '');
        const cookieObj = cookieParser.parse(cookieString);
        const cookieNumber = Object.keys(cookieObj).length;
        const cookieLength = cookieString.length;

        data.argumentLength = bodyParamsLength + urlParamsLength + cookieLength;
        data.requestLength = httpRequest.length;
        data.argumentNumber = bodyParamsNumber + urlParamsNumber + cookieNumber;
        data.requestLength = httpRequest.length;
        data.pathLength = urlPath.length;
        data.specialCharNumberInPath = urlPath.match(REGEX.SPECIAL_CHARACTERS).length;
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