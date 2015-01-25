var views = require('../app/controllers/views');

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('index');
    });

    app.post('/getViews', views.getViews);

    app.get('/getUsername', views.getUsername);
};