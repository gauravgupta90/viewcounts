var db = require('orm').db,
    Views = db.models.views,
    request = require('request'),
    config = require('../../config/config');


var CronJob = require('cron').CronJob;
var job = new CronJob({
    cronTime: config.cronTime,
    onTick: function() {
        request(config.url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var obj = JSON.parse(body)
                Views.create([{
                    count: obj.items[0].statistics.viewCount,
                    date: new Date()
                }], function(err, result) {
                    if (err) {
                        throw new Error(err);
                        return;
                    }
                    console.log("Sucessfull");
                });

            }
        })


    },
    start: false,
    timeZone: config.timeZone
});
job.start();

exports.getViews = function(req, res, next) {

    var request = req.body;
    if (typeof(request) !== 'object' || req.get('Content-Type') != "application/json;charset=UTF-8") {
        var err = new Object();
        err.code = 400;
        err.message = 'Invalid request object';
        console.log(err);
        return next(err);
    } else {
        var count;
        Views.find({
            date: req.body.date
        }, function(err, views) {
            if (err) {
                throw new Error(err);
                return;
            }
            if (views[0] === undefined)
                res.end("No current date found");
            else count = views[0].count;
            var date = new Date(req.body.date).getDate() - 1;
            var year = new Date(req.body.date).getYear();
            var month = new Date(req.body.date).getMonth();
            var prev = year + "-" + month + "-" + date;
            Views.find({
                date: prev
            }, function(err, views) {
                if (err) {
                    throw new Error(err);
                    return;
                }

                if (views[0] === undefined)
                    res.end("No previous date found");
                else
                    count = count - views[0].count;
                res.end(JSON.stringify(count));
            });
        });
    }
}