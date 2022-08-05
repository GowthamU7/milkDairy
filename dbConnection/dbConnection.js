var mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/milkOrderDb").
then((vl)=>console.log("Connected to Database")).
catch((reason)=>{console.log(reason)})