const { isTokenValid } = require("../utils/jwt");
const CustomError = require("../errors/index");

const authMiddleware = async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    } else if (req.signedCookies.token) {
        token = req.signedCookies.token;
    }
    if (!token) {
        throw new CustomError.NotAuthenticated("Please Login First");
    }
    try {
        const payload = isTokenValid({ token });
        req.user = {
            userId: payload.userId,
            username: payload.name,
            email: payload.email,
        };
        next();
    } catch (error) {
        console.log(error);
        throw new CustomError.NotAuthenticated("Authentication Invalid");
    }
};

module.exports = authMiddleware;
