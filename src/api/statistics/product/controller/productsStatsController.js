const Order = require("../../../../models/Order");
const OrgUser = require("../../../../models/OrgUser");
const Product = require("../../../../models/Product");
const VendorOrder = require("../../../../models/VendorOrder");
const catchAsync = require("../../../../utils/catchAsync");

exports.productMonthlyStats = catchAsync(async function(req,res,next) {
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
            'orderStatus': 'Initiated'
          }
        }, {
          '$lookup': {
            'from': 'vendororders', 
            'localField': 'vendorOrders', 
            'foreignField': '_id', 
            'as': 'vendorOrders'
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
            '_id': '$vendorOrders.products.productId', 
            'productOrderedAt': {
              '$push': {
                'createdAt': '$createdAt'
              }
            }, 
            'totalsale': {
              '$count': {}
            }
          }
        }, {
          '$unwind': {
            'path': '$productOrderedAt', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
            '$group': {
              '_id': {
                '$dateToString': {
                  'format': '%m', 
                  'date': '$productOrderedAt.createdAt'
                }
              }, 
              'productsIds': {
                '$addToSet': {
                  'productId': '$_id', 
                  'totalsale': '$totalsale'
                }
              }
            }
          }, {
            '$project': {
              'productsIds': 1, 
              'Month': '$_id', 
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

exports.productYearlyStats = catchAsync(async function(req,res,next) {
    
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
            '_id': '$vendorOrders.products.productId', 
            'productOrderedAt': {
              '$push': {
                'createdAt': '$createdAt'
              }
            }, 
            'totalsale': {
              '$count': {}
            }
          }
        }, {
          '$unwind': {
            'path': '$productOrderedAt', 
            'preserveNullAndEmptyArrays': true
          }
        },  {
            '$group': {
              '_id': {
                '$dateToString': {
                  'format': '%Y', 
                  'date': '$productOrderedAt.createdAt'
                }
              }, 
              'productsIds': {
                '$addToSet': {
                  'productId': '$_id', 
                  'totalsale': '$totalsale'
                }
              }
            }
          }, {
            '$project': {
              'productsIds': 1, 
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

exports.productDailyStats = catchAsync(async function(req,res,next) {
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
            'orderStatus': 'Initiated'
          }
        }, {
          '$lookup': {
            'from': 'vendororders', 
            'localField': 'vendorOrders', 
            'foreignField': '_id', 
            'as': 'vendorOrders'
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
            '_id': '$vendorOrders.products.productId', 
            'productOrderedAt': {
              '$push': {
                'createdAt': '$createdAt'
              }
            }, 
            'totalsale': {
              '$count': {}
            }
          }
        }, {
          '$unwind': {
            'path': '$productOrderedAt', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
            '$group': {
              '_id': {
                '$dateToString': {
                  'format': '%d', 
                  'date': '$productOrderedAt.createdAt'
                }
              }, 
              'productsIds': {
                '$addToSet': {
                  'productId': '$_id', 
                  'totalsale': '$totalsale'
                }
              }
            }
          }, {
            '$project': {
              'productsIds': 1, 
              'Day': '$_id', 
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