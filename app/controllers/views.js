var db = require('orm').db,
    Views = db.models.views,
    request = require('request'),
    config = require('../../config/config'),
    username = require('../../config/username').username,
    google = require('googleapis');
var youtube = google.youtube('v3');


var CronJob = require('cron').CronJob;
var job = new CronJob({
    cronTime: config.cronTime,
    onTick: function() {
        var j = 0;
        for (var i = 0; i < username.length; i++) {
            youtube.channels.list({
                auth: config.apiKey,
                part: 'statistics',
                forUsername: username[i]
            }, function(err, user) {
                var query = {};
                query['username'] = username[j];
                query['count'] = user.items[0].statistics.viewCount;
                query['date'] = new Date();

                Views.create(query, function(err, result) {
                    if (err) {
                        throw new Error(err);
                        return;
                    }
                    console.log("Sucessfull");
                });
                j++;
            });
        }
    },
    start: false,
    timeZone: config.timeZone
});
job.start();

exports.getViews = function(req, res, next) {

    var request = req.body;
    console.log(req.body);
    if (typeof(request) !== 'object' || req.get('Content-Type') != "application/json;charset=UTF-8") {
        var err = new Object();
        err.code = 400;
        err.message = 'Invalid request object';
        console.log(err);
        return next(err);
    } else {
        var count;
        Views.find({
            date: req.body.date,
            username: req.body.username
        }, function(err, views) {
            if (err) {
                throw new Error(err);
                return;
            }
            if (views[0] === undefined)
                res.end("No current date found");
            else count = views[0].count;

            var exploded = req.body.date.split('-');
            var prev = exploded[0] + "-" + exploded[1] + "-" + (exploded[2] - 1);

            Views.find({
                date: prev,
                username: req.body.username
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

exports.getUsername = function(req, res) {
    res.end(JSON.stringify(username));
}