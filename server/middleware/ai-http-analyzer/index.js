const aiHttpAnalyzer = () => (req, res, next) => {
  next();
  req.socket.on('data', (rawBuffer) => {
    const rawHttpRequest = rawBuffer.toString();
    console.log('------- Start -------');
    console.log(rawHttpRequest);
    console.log('-------  End  -------');
  });
};

module.exports = {
    aiHttpAnalyzer,
};