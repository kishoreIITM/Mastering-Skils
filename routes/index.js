var express = require('express');
const passport = require('passport');
var router = express.Router();
var users = require('../models/user');
var jwt = require('jsonwebtoken')

/* GET home page. */
router.get('/',function(req,res,next){
  if(req.cookies.token){
    next()
  }
  else{
    res.render('index', {token:false,username:''});
    res.end()
  }
},passport.authenticate('jwt',{session:false}),function(req, res, next) {
  if(req.cookies){
      res.render('index',{token:true, username:req.user.username});
}}
);

module.exports = router;
