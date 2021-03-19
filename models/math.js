const mongoose = require('mongoose');
const schema = mongoose.Schema;

const math = new schema({
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

const mathquestion = mongoose.model('math',math);

module.exports = mathquestion;