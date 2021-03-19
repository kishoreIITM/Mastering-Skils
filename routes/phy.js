var express = require('express');
const { NotExtended } = require('http-errors');
const passport = require('passport');
var router = express.Router();
var questmodel = require('../models/physics');
var users = require('../models/user');

router.route('/')
.get(passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    console.log(req.user)
    users.findOne({_id:req.user._id})
        .then((user)=>{
            questmodel.find({})
            .populate('author')
            .then((questions)=>{
                res.statusCode=200;
                res.render('question',{subject:'physics',username:user.username,admin:user.admin,questions :questions,token:true});
                })
            .catch((err)=>{
                return next(err);
            })
        })
        .catch((err)=>{
            return next(err);
        })
})
.post(passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    const data = req.body;
    data.author = req.user._id;
    questmodel.create(data)
    .then((quest)=>{
        users.findOne({_id:req.user._id})
        .then((user)=>{
            questmodel.find({})
            .populate('author')
            .then((questions)=>{
                res.statusCode=200;
                res.render('question',{subject:'physics',username:user.username,admin:user.admin,questions :questions,token:true});
                })
            .catch((err)=>{
                return next(err);
            })
        })
        .catch((err)=>{
            return next(err);
    })
    })
    .catch((err)=>{
        return next(err)
    })
})
router.route('/delete/:id')
.post(passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    questmodel.findOne({_id:req.params.id})
    .populate('author')
    .then((q)=>{
        if(q.author._id==req.user._id){
            questmodel.remove({_id:req.params.id})
            .then((resp)=>{
                res.redirect('https://masteringskills.herokuapp.com/physics')
            })
            .catch((err)=>{
                return next(err)
            })
        }
        else{
            var err = new Error("Tou cant delete others question");
            err.statusCode=401;
            return next(err)
        }
    })
    .catch((err)=>{
        return next(err)
    })
})

module.exports=router;