const Order = require("../../../../models/Order");
const User = require("../../../../models/User");
const catchAsync = require("../../../../utils/catchAsync");

exports.earningsYearlyStats = catchAsync(async function(req,res,next){

    const pipeline = [
      {
        '$match': {
          'paymentStage': 'Done'
        }
      }, {
        '$group': {
          '_id': {
            '$year': '$createdAt'
          }, 
          'totalEarnings': {
            '$sum': '$finalAmount'
          }
        }
      }, {
        '$project': {
          'totalEarnings': 1, 
          'Year': '$_id', 
          '_id': 0
        }
      }
    ];

      const totalEarnings = await Order.aggregate(pipeline);

      res.json({
        status : "success",
        result : totalEarnings
      })
})

exports.earningsMonthlyStats = catchAsync(async function(req,res,next){
    let year = req.body.year;
    let startDate = "01 Jan " + year + " 00:00:00 GMT";
    let endDate = "01 Jan " + (year+1) + " 00:00:00 GMT";

    const pipeline = [
      {
        '$match': {
          'paymentStage': 'Done'
        }
      }, {
        '$match': {
          'createdAt': {
            '$gte': new Date(startDate), 
            '$lt': new Date(endDate)
          }
        }
      }, {
        '$group': {
          '_id': {
            '$month': '$createdAt'
          }, 
          'totalEarnings': {
            '$sum': '$finalAmount'
          }
        }
      }, {
        '$project': {
          'totalEarnings': 1, 
          'Month': '$_id', 
          '_id': 0
        }
      }
    ];

      const totalEarnings = await Order.aggregate(pipeline);

      res.json({
        status : "success",
        result : totalEarnings
      })
})

exports.earningsDailyStats = catchAsync(async function(req,res,next){
    let year = req.body.year;
    let month = req.body.month;
    
    let startDate = year+"-"+month+"-1 00:00:00 GMT";
    let endDate = year+"-"+(month+1)+"-1 00:00:00 GMT";

    const pipeline = [
      {
        '$match': {
          'paymentStage': 'Done'
        }
      }, {
        '$match': {
          'createdAt': {
            '$gte': new Date(startDate), 
            '$lt': new Date(endDate)
          }
        }
      }, {
        '$group': {
          '_id': {
            '$dayOfMonth': '$createdAt'
          }, 
          'totalEarnings': {
            '$sum': '$finalAmount'
          }
        }
      }, {
        '$project': {
          'totalEarnings': 1, 
          'dayOfTheMonth': '$_id', 
          '_id': 0
        }
      }
    ];
    
      const totalEarnings = await Order.aggregate(pipeline);

      res.json({
        status : "success",
        result : totalEarnings
      })
})