const mongoose = require('mongoose');
const schema = mongoose.Schema;

const chem = new schema({
    question:{
        type: String,
        require: true,
        unique: true
    },
    option1:{
        type: String
    },
    option2:{
        type: String
    },
    option3:{
        type: String
    },
    option4:{
        type: String
    },
    answer:{
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
},{
    timestamps:true
})

const chemquestion = mongoose.model('chem',chem);

module.exports = chemquestion;