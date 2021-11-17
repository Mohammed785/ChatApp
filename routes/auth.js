const router = require('express').Router();
const {login,register,logout} = require('../controllers/auth');


router.post('login/').post('register/').post('logout/')


module.exports = router