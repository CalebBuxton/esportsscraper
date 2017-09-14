var mongoose = require("mongoose");

mongoose.connect("mongodb://buxton:Notarealpassword123456@ds117830.mlab.com:17830/heroku_s75mggjw", function(err) {
	if(err) throw err;
	console.log('database connected');
});