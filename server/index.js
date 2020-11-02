const express = require('express');
const es6Renderer = require('express-es6-template-engine');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const VAR = require('../config/variables');
const { apolloServer } = require('./graphql');
const { aiHttpAnalyzer } = require('./middleware/ai-http-analyzer');

const app = express();

app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../dist')));
app.use(aiHttpAnalyzer());

apolloServer.applyMiddleware({ app });

/* eslint no-unused-vars: "off" */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
  });
});

app.get('/tfjs-vis', (req, res) => res.render('tfjs-vis'));
app.get('*', (req, res) => res.render('index'));

const server = app.listen(VAR.PORT, () => {
  const { address, port } = server.address();
  /* eslint no-console: "off" */
  console.log(`Server running on ${address}:${port}`);
});