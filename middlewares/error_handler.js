const { StatusCodes } = require("http-status-codes");

const ErrorHandlerMiddleware = (err, req, res, next) => {
    let CustomError = {
        statusCode: err.statusCode || StatusCodes.BAD_REQUEST,
        msg: err.message || "Something Went Wrong Try Again Later",
    };
    if (err.name === "ValidationError") {
        CustomError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(",");
        CustomError.statusCode = StatusCodes.BAD_REQUEST;
    }
    if (err.code && err.code === 11000) {
        CustomError.msg = `Duplicate value for  ${Object.keys(
            err.keyValue
        )} fields enter different values`;
        CustomError.statusCode = StatusCodes.BAD_REQUEST;
    }
    if (err.name === "CastError") {
        CustomError.msg = `No Item Found With Id : ${err.value}`;
        CustomError.statusCode = StatusCodes.NOT_FOUND;
    }
    return res.status(CustomError.statusCode).json({ msg: CustomError.msg });
};

module.exports = ErrorHandlerMiddleware;
