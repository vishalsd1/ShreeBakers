const app = require('../backend/app.cjs');

module.exports = (req, res) => {
  return app(req, res);
};
