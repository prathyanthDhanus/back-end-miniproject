const mongoose = require("mongoose");
const adminschema = new mongoose.Schema({
    username:String,
    password:Number
});
const admin = mongoose.model("admin",adminschema)
module.exports = admin

