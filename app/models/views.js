var db = require('orm').db;

var Views = db.define('views', {
    id: Number,
    count: String,
    date: Date

}, {
    id: "id"
});