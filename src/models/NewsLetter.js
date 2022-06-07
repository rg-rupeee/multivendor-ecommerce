const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    }
});

const NewsLetter = mongoose.model("NewsLetter",newsletterSchema);

module.exports = NewsLetter;