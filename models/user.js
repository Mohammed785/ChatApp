const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please Enter Username"],
        maxlength:20
    },
    email:{
        type:String,
        required:[true,"Please Enter Email"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Check Your Email'],
        unique:true
    },
    password:{
        type:String,
        required: [true, "Please Enter Password"],
    }
},{timestamp:true})


UserSchema.pre('save',async function(){
    if(!this.isModified('password')){
        return
    }
    salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password,salt);
})

UserSchema.methods.comparePasswords = async function(passwordToCompare){
    return await bcrypt.compare(passwordToCompare,this.password)
}

module.exports = mongoose.model('User',UserSchema);