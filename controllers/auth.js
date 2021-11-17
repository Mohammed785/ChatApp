const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const { createTokenUser, createJWT } = require("../utils/jwt");

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequest("Please Enter All Fields");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError.NotAuthenticated("Wrong Credentials");
    }
    if (!await user.comparePasswords(password)) {
        throw new CustomError.NotAuthenticated("Wrong Credentials");
    }
    const tokenUser = createTokenUser(user);
    const token = createJWT({payload:tokenUser});
    req.headers.authorization = token;
    return res.status(StatusCodes.ACCEPTED).json({ ...tokenUser });
};

const register = async (req, res) => {
    const { username, email, password } = req.body;
    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
        throw new CustomError.BadRequest("Email Already Exists!!!");
    }
    const user = await User.create({ username, email, password });
    res.status(StatusCodes.CREATED).json({ username, email });
};

const logout = async (req, res) => {
    // check if user is not logged and send different msg
    req.headers.authorization = null;
    res.status(StatusCodes.OK).json({ msg: "User Logged Out Successfully" });
};

module.exports = {
    login,
    register,
    logout,
};
