const { StatusCodes } = require("http-status-codes");
const CustomError = require("./custom_error");

class NotAuthenticated extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = NotAuthenticated;
