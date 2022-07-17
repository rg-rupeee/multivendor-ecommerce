const Order = require("../../../../../models/VendorOrder");
const catchAsync = require("../../../../../utils/catchAsync");

exports.vendorProductMonthlyStats = catchAsync(async function(req,res) {
    let year = req.body.year;
    let startDate = "01 Jan " + year + " 00:00:00 GMT";
    let endDate = "01 Jan " + (year+1) + " 00:00:00 GMT";

    console.log(startDate)
    console.log(endDate)

    const pipeline = [
      {
        '$match': {
          'orderStatus': 'Placed'
        }
      },
        {
          '$addFields': {
            'tempVendorId': {
              '$toString': '$vendorId'
            }
          }
        }, {
          '$match': {
            'tempVendorId': req.user.id
          }
        }, {
          '$match': {
            'createdAt': {
              '$gte': new Date(startDate),
              '$lt': new Date(endDate)
            }
          }
        }, {
          '$unwind': {
            'path': '$products', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$group': {
            '_id': {
              '$month': '$productOrderedAt.createdAt'
            }, 
            'totalProductSold': {
              '$count': {}
            }
          }
        }, {
          '$project': {
            'totalProductSold': 1, 
            'month': '$_id', 
            '_id': 0
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

exports.vendorProductYearlyStats = catchAsync(async function(req,res) {
    
    const pipeline = [
      {
        '$match': {
          'orderStatus': 'Placed'
        }
      },
        {
            '$addFields': {
            'tempVendorId': {
                '$toString': '$vendorId'
                }
            }
        }, {
            '$match': {
                'tempVendorId': String(req.user.id)
                }
        }, {
            '$unwind': {
                'path': '$products', 
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$group': {
                '_id': {
                    '$year': '$createdAt'
                }, 
                'totalProductSold': {
                    '$count': {}
                }
            }
        }, {
            '$project': {
                'totalProductSold': 1, 
                'Year': '$_id', 
                '_id': 0
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

exports.vendorProductDailyStats = catchAsync(async function(req,res) {
    let year = req.body.year;
    let month = req.body.month;
    
    let startDate = year+"-"+month+"-1 00:00:00 GMT";
    let endDate = year+"-"+(month+1)+"-1 00:00:00 GMT";

    console.log(startDate)
    console.log(endDate)

    const pipeline = [
      {
        '$match': {
          'orderStatus': 'Placed'
        }
      },
        {
          '$addFields': {
            'tempVendorId': {
              '$toString': '$vendorId'
            }
          }
        }, {
          '$match': {
            'tempVendorId': req.user.id
          }
        }, {
          '$match': {
            'createdAt': {
              '$gte': new Date(startDate), 
              '$lt': new Date(endDate)
            }
          }
        }, {
          '$unwind': {
            'path': '$products', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$group': {
            '_id': {
              '$dayOfMonth': '$createdAt'
            }, 
            'totalProductSold': {
              '$count': {}
            }
          }
        }, {
          '$project': {
            'totalProductSold': 1, 
            'dayOfTheMonth': '$_id', 
            '_id': 0
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