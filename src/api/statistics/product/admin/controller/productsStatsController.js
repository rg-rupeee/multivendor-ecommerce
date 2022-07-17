const Order = require("../../../../../models/Order");
const catchAsync = require("../../../../../utils/catchAsync");

exports.productMonthlyStats = catchAsync(async function(req,res) {
    let year = req.body.year;
    let startDate = "01 Jan " + year + " 00:00:00 GMT";
    let endDate = "01 Jan " + (year+1) + " 00:00:00 GMT";

    console.log(startDate)
    console.log(endDate)

    const pipeline = [
      {
        '$unwind': {
          'path': '$vendorOrders', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$match': {
          'createdAt': {
            '$gte': new Date('Sat, 01 Jan 2022 00:00:00 GMT'), 
            '$lt': new Date('Sun, 01 Jan 2023 00:00:00 GMT')
          }
        }
      }, {
        '$lookup': {
          'from': 'vendororders', 
          'localField': 'vendorOrders', 
          'foreignField': '_id', 
          'as': 'vendorOrders'
        }
      }, {
        '$unwind': {
          'path': '$vendorOrders', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$unwind': {
          'path': '$vendorOrders.products', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$group': {
          '_id': {
            '$month': '$createdAt'
          }, 
          'totalProductsSold': {
            '$count': {}
          }
        }
      }, {
        '$project': {
          '_id': 0, 
          'month': '$_id', 
          'totalProductsSold': 1
        }
      }
    ];

    productsSoldPerMonth = await Order.aggregate(pipeline);

    console.log("result is ",productsSoldPerMonth)

    res.json({
        status : "success",
        result : productsSoldPerMonth
    })
})

exports.productYearlyStats = catchAsync(async function(req,res) {
    
    const pipeline = [
      {
        '$unwind': {
          'path': '$vendorOrders', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$lookup': {
          'from': 'vendororders', 
          'localField': 'vendorOrders', 
          'foreignField': '_id', 
          'as': 'vendorOrders'
        }
      }, {
        '$unwind': {
          'path': '$vendorOrders', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$unwind': {
          'path': '$vendorOrders.products', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$group': {
          '_id': {
            '$year': '$createdAt'
          }, 
          'totalProductsSold': {
            '$count': {}
          }
        }
      }, {
        '$project': {
          '_id': 0, 
          'year': '$_id', 
          'totalProductsSold': 1
        }
      }
    ];

    productsSoldPerYear = await Order.aggregate(pipeline);

    console.log("result is ",productsSoldPerYear)

    res.json({
        status : "success",
        result : productsSoldPerYear
    })
})

exports.productDailyStats = catchAsync(async function(req,res) {
    let year = req.body.year;
    let month = req.body.month;
    
    let startDate = year+"-"+month+"-1 00:00:00 GMT";
    let endDate = year+"-"+(month+1)+"-1 00:00:00 GMT";

    console.log(startDate)
    console.log(endDate)

    const pipeline = [
      {
        '$unwind': {
          'path': '$vendorOrders', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$match': {
          'createdAt': {
            '$gte': new Date(startDate), 
            '$lt': new Date(endDate)
          }
        }
      }, {
        '$lookup': {
          'from': 'vendororders', 
          'localField': 'vendorOrders', 
          'foreignField': '_id', 
          'as': 'vendorOrders'
        }
      }, {
        '$unwind': {
          'path': '$vendorOrders', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$unwind': {
          'path': '$vendorOrders.products', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$group': {
          '_id': {
            '$dayOfMonth': '$createdAt'
          }, 
          'totalProductsSold': {
            '$count': {}
          }
        }
      }, {
        '$project': {
          '_id': 0, 
          'dayOfTheMonth': '$_id', 
          'totalProductsSold': 1
        }
      }
    ];

    productsSoldPerDay = await Order.aggregate(pipeline);

    console.log("result is ",productsSoldPerDay)

    res.json({
        status : "success",
        result : productsSoldPerDay
    })
})