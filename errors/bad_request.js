const CustomError = require("../errors/custom_error");
const { StatusCodes } = require("http-status-codes");
class BadRequest extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

module.exports = BadRequest;
