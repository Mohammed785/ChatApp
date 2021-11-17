const { isTokenValid } = require("../utils/jwt");
const CustomError = require("../errors/index");

const authMiddleware = async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    }
    if (!token) {
        throw new CustomError.NotAuthenticated("Please Login First");
    }
    try {
        const payload = isTokenValid(token);
        req.user = {
            userId: payload.user.userId,
            username: payload.user.username,
            email: payload.user.email,
        };
        next();
    } catch (error) {
        throw new CustomError.NotAuthenticated("Authentication Invalid");
    }
};

module.exports = authMiddleware;
