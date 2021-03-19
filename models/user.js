const mongoose= require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const user = new schema({
    firstname:{
        type: String
    },
    lastname:{
        type: String
    },
    admin:{
        type: Boolean,
        default: false
    },
    username:{
        type: String,
        requires: true,
        unique: true,
    },
    password:{
        type: String,
        required: true
    }
},{
    timestamps: true
})

// HASHING FUNCTION
user.pre('save',async function(next){
    const user= this;
    if(user.isModified('password')){
        hash= await bcrypt.hash(this.password,10,null);
    console.log("hi   ",hash);
    user.password = hash;
    next()
    }
})
user.methods.isValidPassword= async function(password){
    const user = this;
    console.log(password);
    console.log(user.password);
    const compare = await bcrypt.compare(password,user.password);
    console.log(compare);
    return compare;
}

//MODEL INITIALISING
Users = mongoose.model('user',user);
module.exports = Users
