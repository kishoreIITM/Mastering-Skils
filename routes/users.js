var express = require('express');
const passport = require('passport')
var router = express.Router();
const jwt = require('jsonwebtoken');
const users = require('../models/user');

/* GET users listing. */
router.route('/registeredusers')
.get(passport.authenticate('jwt',{session:false}),(req,res,next)=>{
  users.find({})
    .then((user)=>{
      res.statusCode=200;
      res.render('registeredusers',{user:user,token:true});
    })
    .catch((err)=>{
      next(err)
    })
})


router.route('/signup')
.get( (req, res, next) => {
    res.render('signup');
  })
.post(passport.authenticate('signup',{session:false}),(req,res,next)=>{
  users.findOne({_id:req.user._id})
  .then((user)=>{
    if (req.body.firstname){
      user.firstname = req.body.firstname;
    }
    if (req.body.lastname){
      user.lastname = req.body.lastname;
    }
    if (req.body.admin=='admin'){
      user.admin=true;
      console.log(user.admin);
    }
    user.save()
    .then((user)=>{
      const tok = jwt.sign({_id :req.user._id,username:req.user.username},'TOP_SECRET',{expiresIn:'2h'});
      res.statusCode=200;
      res.cookie('token',tok,{httpOnly:true,secure:true});
      res.redirect('/');
    })
  })
  .catch((err)=>{
    return next(err)
  });
});

router.route("/auth/facebook")
.get(passport.authenticate("facebook",{session:false}));

router.route("/auth/facebook/callback")
.get(
  passport.authenticate("facebook", {
    session:false
  }),(req,res,next)=>{
    console.log("hi",req.user);
    const tok = jwt.sign({_id :req.user.id,username:req.user.name.givenName},'TOP_SECRET',{expiresIn:'2h'});
      res.statusCode=200;
      res.cookie('token',tok,{httpOnly:true,secure:true});
      res.redirect('/');
  }
);

router.route('/delete')
.get(passport.authenticate('jwt',{session:false}),(req,res,next)=>{
  users.findOne({username:req.user.username})
  .then((user)=>{
    console.log(user);
    console.log(user.admin)
    if (user.admin){
      users.deleteMany({admin:false})
      .then((resp)=>{
        console.log(resp)
        res.statusCode=200;
        res.redirect('/');
      })
      .catch((err)=>{
        return next(err)
      })
    }
    else{
      res.statusCode=401;
      res.send('<h1>YOU ARE NOT Teacher TO DELETE</h1>')
    }
  })
  .catch((err)=>{
    return next(err);
  })
  
})


router.route('/login')
.get((req,res,next)=>{
  res.render('login')
})
.post(passport.authenticate('login',{session: false}),(req,res,next)=>{
  if(req.user){
    const tok = jwt.sign({_id :req.user._id,username:req.user.username},'TOP_SECRET',{expiresIn:'2h'});
    res.statusCode=200;
    res.cookie('token',tok,{httpOnly:true,secure:true});
    res.redirect('/');
  }
  else{
    const err = new Error(req.message);
    err.statusCode=400
    return next(err);
  }
})


router.route('/logout')
.get((req,res,next)=>{
  res.clearCookie('token');
  res.redirect('/');
})


module.exports = router;
