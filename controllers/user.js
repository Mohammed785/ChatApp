const { StatusCodes } = require("http-status-codes");
const User = require('../models/user');
const {createTokenUser} = require('../utils/jwt');
const CustomError = require('../errors/index')

const userInfo = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(StatusCodes.FORBIDDEN).json({ msg: "Please Login" });
    }
    return res.status(StatusCodes.ACCEPTED).json(user);
};
const userSearch = async(req,res)=>{
    const userEmail = req.params.email;
    const user = await User.findOne({ email:userEmail });
    if (!user) {
        throw new CustomError.NotFound("No User Found With This Email");
    }
    res.status(StatusCodes.OK).json(createTokenUser(user))
}
module.exports = { userInfo,userSearch};
