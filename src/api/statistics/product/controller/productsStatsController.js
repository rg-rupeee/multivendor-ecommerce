const Order = require("../../../../models/Order");
const OrgUser = require("../../../../models/OrgUser");
const Product = require("../../../../models/Product");
const VendorOrder = require("../../../../models/VendorOrder");

exports.productWeeklyStats = async function(req,res,next) {
    let date = new Date();

    var lastweek = new Date(date.getFullYear(), date.getMonth(), date.getDate()-7);
    
    let todayDate = date.toLocaleDateString();

    let lastweekDate = lastweek.toLocaleDateString();

    let orders = await Order.find({createdAt : {
        $gt : new Date(lastweekDate) , $lte : new Date(todayDate)
    }})
    
    totalsale = orders.length;
    // console.log(orders.length())
    var productsSold = {};

    for(var i =0; i<orders.length; i++){
        var order = order[i];
        if(order.orderStatus == "Placed"){
            let vendorOrderIds = order.vendorOrders;
            for(var j = 0; j<vendorOrderIds.length; j++){
                let vendorOrderId = vendorOrderIds[j];
                let vendorOrder = await VendorOrder.findById(vendorOrderId);
                let productIds = vendorOrder.products;
                productIds.forEach(productId => {
                    // productId
                    if(isNaN(productsSold.productId)){
                        productsSold.productId = 1;
                    }else{
                        productsSold.productId++;
                    }
                });
            }
        }
    }
    // console.log(results);
    res.json({
        status : "success",
        result : productsSold
    })
}

exports.productMonthlyStats = async function(req,res,next) {
    let date = new Date();

    var lastweek = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
    
    let todayDate = date.toLocaleDateString();

    let lastweekDate = lastweek.toLocaleDateString();

    let orders = await Order.find({createdAt : {
        $gt : new Date(lastweekDate) , $lte : new Date(todayDate)
    }})
    
    totalsale = orders.length;
    // console.log(orders.length())
    var productsSold = {};

    for(var i =0; i<orders.length; i++){
        var order = order[i];
        if(order.orderStatus == "Placed"){
            let vendorOrderIds = order.vendorOrders;
            for(var j = 0; j<vendorOrderIds.length; j++){
                let vendorOrderId = vendorOrderIds[j];
                let vendorOrder = await VendorOrder.findById(vendorOrderId);
                let productIds = vendorOrder.products;
                productIds.forEach(productId => {
                    // productId
                    if(isNaN(productsSold.productId)){
                        productsSold.productId = 1;
                    }else{
                        productsSold.productId++;
                    }
                });
            }
        }
    }
    // console.log(results);
    res.json({
        status : "success",
        result : productsSold
    })
}

exports.productYearlyStats = async function(req,res,next) {
    let date = new Date();

    var lastweek = new Date(date.getFullYear() - 1, date.getMonth() - 1, date.getDate());
    
    let todayDate = date.toLocaleDateString();

    let lastweekDate = lastweek.toLocaleDateString();

    let orders = await Order.find({createdAt : {
        $gt : new Date(lastweekDate) , $lte : new Date(todayDate)
    }})
    
    totalsale = orders.length;
    // console.log(orders.length())
    var productsSold = {};

    for(var i =0; i<orders.length; i++){
        var order = order[i];
        if(order.orderStatus == "Placed"){
            let vendorOrderIds = order.vendorOrders;
            for(var j = 0; j<vendorOrderIds.length; j++){
                let vendorOrderId = vendorOrderIds[j];
                let vendorOrder = await VendorOrder.findById(vendorOrderId);
                let productIds = vendorOrder.products;
                productIds.forEach(productId => {
                    // productId
                    if(isNaN(productsSold.productId)){
                        productsSold.productId = 1;
                    }else{
                        productsSold.productId++;
                    }
                });
            }
        }
    }
    // console.log(results);
    res.json({
        status : "success",
        result : productsSold
    })
}