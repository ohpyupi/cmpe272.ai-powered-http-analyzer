const _ = require('lodash');
const httpStringParser = require('http-string-parser');
const cookieParser = require('cookie');
const { REGEX } = require('../../../config/variables');

const analyzeBodyParams = (parsedHttp) => {
  const contentType = _.get(parsedHttp, "headers['Content-Type']", '');
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

const getFeatureFromRawHttpRequest = (rawHttpRequest) => {
  const parsedHttp = httpStringParser.parseRequest(rawHttpRequest);
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
  return {
    requestLength: rawHttpRequest.length,
    argumentLength: bodyParamsLength + urlParamsLength + cookieLength,
    argumentNumber: bodyParamsNumber + urlParamsNumber + cookieNumber,
    pathLength: urlPath.length,
    specialCharNumberInPath: urlPath.match(REGEX.SPECIAL_CHARACTERS).length,
  };
};

module.exports = {
  analyzeBodyParams,
  getFeatureFromRawHttpRequest,
};
