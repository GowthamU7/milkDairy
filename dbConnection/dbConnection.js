var mongoose = require("mongoose")

mongoose.connect("mongodb://srikar:srikar7@cluster0-shard-00-00.1zjpo.mongodb.net:27017,cluster0-shard-00-01.1zjpo.mongodb.net:27017,cluster0-shard-00-02.1zjpo.mongodb.net:27017/milkDairy?ssl=true&replicaSet=atlas-109bee-shard-0&authSource=admin&retryWrites=true&w=majority").
then((vl)=>console.log("Connected to Database")).
catch((reason)=>{console.log(reason)})