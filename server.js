var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var app = express();
var mongoose = require('mongoose');

app.use(express.static(__dirname + '/public'));
var port = process.env.PORT || 3000;

require("./config/connection");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

var expressHandlebars = require('express-handlebars');
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


var routes = require('./controllers/scraper.js');
app.use('/',routes);

app.use(function(req, res) {
	res.render('404');
});

app.listen(port, function() {
    console.log("Listening on port:" + port);
});