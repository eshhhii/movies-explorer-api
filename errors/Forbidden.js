const { ERROR_CODE_403 } = require("../utils/constants");

class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_403;
  }
}

module.exports = Forbidden;
