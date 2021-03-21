const passport = require('passport');
const localstrategy = require('passport-local');
const users = require('./models/user');
const jwtstrategy= require('passport-jwt').Strategy;
const extractjwt=require('passport-jwt').ExtractJwt;
const strategy = require('passport-facebook');
const facebookStrategy = strategy.Strategy

//HANDLING SIGN UO AUTHENTICATION 
passport.use('signup', new localstrategy(
async (username,password,done)=>{
    await users.create({username,password})
    .then((user)=>{
        return done(null,user);
    })
    .catch((err)=>{
        return done(err,false);
    })

    }
));

//HANNDLING LOG IN AUTHENTICATION
passport.use('login', new localstrategy((username,password,done)=>{
    users.findOne({username})
    .then(async (user)=>{
        if(!user){
            const err = new Error('User not found')
            return done(err);
        }
        const validate = await user.isValidPassword(password);
        if(!validate){
            const err = new Error('wrong Password')
            return done(err,false);
        }
        return done(null,user,{message:"Log In Successful"});
    })
    .catch((err)=>{
        return done(err);
    })
}))

//JWT TOKEN CHECKING
passport.use(new jwtstrategy({
    secretOrKey:'TOP_SECRET',
    jwtFromRequest: (req)=>req.cookies['token']
},(token,done)=>{
    return done(null,token)
}))

passport.use(new facebookStrategy({
    clientID:"795987001125649",
    clientSecret:"0b382ed54d67f4a9c82c6999ddf2d114",
    callbackURL:"https://masteringskills.herokuapp.com/users/auth/facebook/callback",
    profileFields:["email","name"]
},function(accessToken,refreshToken,profile,done){
    console.log(profile)
    done(null,profile);
}))