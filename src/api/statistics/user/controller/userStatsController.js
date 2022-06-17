const User = require("../../../../models/User");
const catchAsync = require("../../../../utils/catchAsync");

exports.userYearlyStats = catchAsync(async function(req,res,next){

    const pipeline = [
        {
          '$group': {
            '_id': {
              '$year': '$createdAt'
            }, 
            'totalUserSignedIn': {
              '$count': {}
            }, 
            'users': {
              '$addToSet': '$_id'
            }
          }
        }, {
          '$project': {
            'year': '$_id', 
            'totalUserSignedIn': 1, 
            'users': 1, 
            '_id': 0
          }
        }
      ];

      const totalUsers = await User.aggregate(pipeline);

      res.json({
        status : "success",
        result : totalUsers
      })
})

exports.userMonthlyStats = catchAsync(async function(req,res,next){
    let year = req.body.year;
    let startDate = "01 Jan " + year + " 00:00:00 GMT";
    let endDate = "01 Jan " + (year+1) + " 00:00:00 GMT";

    const pipeline = [
        {
          '$match': {
            'createdAt': {
              '$gte': new Date(startDate), 
              '$lt': new Date(endDate)
            }
          }
        }, {
          '$group': {
            '_id': {
              '$dateToString': {
                'format': '%m', 
                'date': '$createdAt'
              }
            }, 
            'totalUserSignedIn': {
              '$count': {}
            }, 
            'users': {
              '$addToSet': '$_id'
            }
          }
        }, {
          '$project': {
            'month': '$_id', 
            'totalUserSignedIn': 1, 
            'users': 1, 
            '_id': 0
          }
        }
      ];

      const totalUsers = await User.aggregate(pipeline);

      res.json({
        status : "success",
        result : totalUsers
      })
})

exports.userDailyStats = catchAsync(async function(req,res,next){
    let year = req.body.year;
    let month = req.body.month;
    
    let startDate = year+"-"+month+"-1 00:00:00 GMT";
    let endDate = year+"-"+(month+1)+"-1 00:00:00 GMT";

    const pipeline = [
        {
          '$match': {
            'createdAt': {
              '$gte': new Date(startDate), 
              '$lt': new Date(endDate)
            }
          }
        }, {
          '$group': {
            '_id': {
              '$dateToString': {
                'format': '%d', 
                'date': '$createdAt'
              }
            }, 
            'totalUserSignedIn': {
              '$count': {}
            }, 
            'users': {
              '$addToSet': '$_id'
            }
          }
        }, {
          '$project': {
            'day': '$_id', 
            'totalUserSignedIn': 1, 
            'users': 1, 
            '_id': 0
          }
        }
      ];
    
      const totalUsers = await User.aggregate(pipeline);

      res.json({
        status : "success",
        result : totalUsers
      })
})