var express = require("express")
var app = express()
require("../dbConnection/dbConnection")
var cors=require('cors')
var orderModel = require("../orderModel/orderModel")

var manageMilk = require("../manageMilkQuantity/manageMilk")

var PORT = process.env.PORT || 5050

app.use(express.json(['application/json','text']))
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.post("/add",async(req,res)=>{
    try{
        manageMilk.takeOut(req.body.quantity,async(st)=>{
            if(st){
                var newOrder = new orderModel({name:req.body.name,quantity:req.body.quantity,status:'placed'})
                
                await newOrder.save((err,result)=>{if(err){
                        return res.json({"message":"order not in a proper format"})
                    }
                    return res.json({"message":`Your purchase of ${req.body.quantity}L milk is successful!`})
                })
            }else{
                res.send("Out of milk for Today please try Tomorrow")
            }
        })

    }catch(e){
        return res.status(404).json({"error":"Error at servers end"})
    }
})

app.get("/orders",async(req,res)=>{
    try{
        var orders = await orderModel.find({})
        res.json(orders)
    }catch(e){ 

    }
})

app.patch("/update/:id",async(req,res)=>{
    try{
        var {quantity,name,status}=req.body
        var previousOrder=await orderModel.findById({_id:req.params.id})
        if( previousOrder.quantity > quantity){
            manageMilk.takeIn(previousOrder.quantity-quantity)
        }else{
            manageMilk.takeOut(quantity-previousOrder.quantity,()=>{})
        }
        orderModel.findByIdAndUpdate({_id:req.params.id},{name,quantity,status}).then((vl)=>{
            return res.send("Order updated successfully!")
        }).catch((e)=>{
            return res.send("something went wrong with the update")
        })
    }catch(e){
        return res.send("Problem at our end")
    }
})
app.patch("/updateStatus/:id",async(req,res)=>{
    try{
        var allowedStatus = ["placed","packed","dispatched","delivered"]
        
        if(allowedStatus.includes(req.body.status)){
            var oldOrder = await orderModel.findById({_id:req.params.id})
            oldOrder.status = req.body.status
            await orderModel.findByIdAndUpdate({_id:req.params.id},oldOrder)
            return res.send("Status updated")
        }else{
            return res.send("got Improper status to update")
        }
    }catch(e){
        return res.send("Problem at our end")
    }
})
app.delete("/delete/:id",async(req,res)=>{
    try{
        await orderModel.findByIdAndDelete({_id:req.params.id})
        return res.send("........order deleted.........")
    }catch(e){
        return res.send("Problem at our end")
    }
})


app.get("/checkCapacity/:date",async(req,res)=>{
    try{
        manageMilk.getQuantityOfDate(req.params.date,(qt)=>{
            if(qt.quantity){
                res.send(qt.quantity+" liters of milk Left on "+req.params.date)
            }else{
                res.send(qt)
            }
        })
    }catch(e){
    }
})
app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})