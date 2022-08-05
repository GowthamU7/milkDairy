var fileSystem = require('fs')

const baseDir=__dirname+"/"

const dateObj = new Date()

var takeIn = (quantity,callback)=>{
    var quant=parseInt(fileSystem.readFileSync(baseDir+`../milkDetails/${dateObj.getDay()}-${dateObj.getMonth()}-${dateObj.getFullYear()}.txt`,"utf-8"))
    fileSystem.writeFileSync(baseDir+`../milkDetails/${dateObj.getDay()}-${dateObj.getMonth()}-${dateObj.getFullYear()}`,`${quant+quantity}.txt`)
}

var takeOut = (quantity,callback)=>{
    var dayToDayFiles = fileSystem.readdirSync(baseDir+"../milkDetails/")
    if(!dayToDayFiles.includes(`${dateObj.getDay()}-${dateObj.getMonth()}-${dateObj.getFullYear()}.txt`)){
        fileSystem.open(baseDir+`../milkDetails/${dateObj.getDay()}-${dateObj.getMonth()}-${dateObj.getFullYear()}.txt`,'w',(err,fd)=>{
            fileSystem.write(fd,"10000",(err,wt)=>{
                if(err){
                    callback({"mesaage":"Error while creating file"})
                }else{
                    fileSystem.close(fd)
                }
            })
        })
    }
    setTimeout(()=>{
        var quant=parseInt(fileSystem.readFileSync(baseDir+`../milkDetails/${dateObj.getDay()}-${dateObj.getMonth()}-${dateObj.getFullYear()}.txt`,"utf-8"))
        if(quant-quantity >= 0){
            fileSystem.writeFileSync(baseDir+`../milkDetails/${dateObj.getDay()}-${dateObj.getMonth()}-${dateObj.getFullYear()}.txt`,`${quant-quantity}`)
            callback({"mesaage":true})
        }else{
            callback({"message":false})
        }
    },1000)
}

var getQuantityOfDate = (date,callback)=>{
    var dayToDayFiles = fileSystem.readdirSync(baseDir+"../milkDetails/")
    var leftOutQuantity = {quantity:10000}
    console.log(date)
    if(date && /^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[012])\-\d{4}$/.test(date)){
        if(dayToDayFiles.includes(date+".txt")){
            leftOutQuantity.quantity = parseInt(fileSystem.readFileSync(baseDir+`../milkDetails/${date}.txt`,"utf-8"))
            callback(leftOutQuantity)
        }else{
            callback(leftOutQuantity)
        }
    }else{
        callback("Not proper date formated should be dd-mm-yyyy")
    }
}

// takeOut(20,(d)=>{
//     console.log(d)
// })



module.exports={takeIn,takeOut,getQuantityOfDate}