const jwt = require('jsonwebtoken');

const createTokenUser = (user)=>{
    return {userId:user._id,name:user.username,email:user.email}
}

const createJWT = ({payload})=>{
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME});
    return token
}

const isTokenValid = ({token})=>jwt.verify(token,process.env.JWT_SECRET);

module.exports = {
    createTokenUser,
    createJWT,
    isTokenValid
}