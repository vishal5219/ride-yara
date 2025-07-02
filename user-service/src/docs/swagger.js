const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Place your OpenAPI spec here

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}; 