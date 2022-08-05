var mongoose = require("mongoose")


var orderSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true
    },
    status:{
        type:String,
    }
})



module.exports = mongoose.model('order',orderSchema)