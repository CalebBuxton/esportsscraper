var express = require('express');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();
var mongoose = require('mongoose');
var Promise = require("bluebird");

mongoose.Promise = Promise;

var Articles = require("../models/articles");
var Comments = require("../models/comments");

var url = "http://www.thescoreesports.com/home";

router.get('/test', function(req, res) {
    request(url, function(error, response, html) {
        var $ = cheerio.load(html);
		var result = [];
		$(".NewsCard__container--1KkQS").each(function(i, element) {
			var title = $(element).find("a").find(".NewsCard__bodyContainer--1h9Eb").find(".NewsCard__title--37vMp").text();
			var storyLink = "www.thescoreesports.com" + $(element).find("a").attr("href");
			var imgLink = $(element).find("a").find(".NewsCard__featureImage--2wnda").find("img").attr("src");
			var summary = $(element).find("a").find(".NewsCard__bodyContainer--1h9Eb").find(".NewsCard__content--1VLID").text();
			summary = summary.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
			result.push({ 
				title: title,
				storyLink: storyLink,
				imgLink: imgLink,
				summary: summary
			});
		});
		console.log(result);
		res.send(result);
    });
});

router.get('/', function(req, res){
	res.render('home');
});

router.get('/scrape', function(req, res){
	console.log("request: " + req)
	console.log("response: " + res)
    request(url, function(error, response, html) {	
        var $ = cheerio.load(html);
		var result = [];
		$(".NewsCard__container--1KkQS").each(function(i, element) {
			var title = $(element).find("a").find(".NewsCard__bodyContainer--1h9Eb").find(".NewsCard__title--37vMp").text();
			var storyLink = "www.thescoreesports.com" + $(element).find("a").attr("href");
			var imgLink = $(element).find("a").find(".NewsCard__featureImage--2wnda").find("img").attr("src");
			var summary = $(element).find("a").find(".NewsCard__bodyContainer--1h9Eb").find(".NewsCard__content--1VLID").text();
			summary = summary.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
			result.push({ 
				title: title,
				storyLink: storyLink,
				imgLink: imgLink,
				summary: summary
			});
			Articles.findOne({'title': title}, function(err, articleRecord) {
				if(err) {
					console.log(err);
				} else {
					if(articleRecord == null) {
						Articles.create(result[i], function(err, record) {
							if(err) throw err;
							console.log("New Post Added");
						});
					} else {
						console.log("No Posts Added");
					}					
				}
			});	
		});
    });	
});

router.get('/articles', function(req, res){
	Articles.find().sort({ createdAt: -1 }).exec(function(err, data) { 
		if(err) throw err;
		res.json(data);
	});
});

router.get('/comments/:id', function(req, res){
	Comments.find({'articleId': req.params.id}).exec(function(err, data) {
		if(err) {
			console.log(err);
		} else {
			res.json(data);
		}	
	});
});

router.post('/addcomment/:id', function(req, res){
	console.log(req.params.id+' '+req.body.comment);
	Comments.create({
		articleId: req.params.id,
		name: req.body.name,
		comment: req.body.comment
	}, function(err, docs){    
		if(err){
			console.log(err);			
		} else {
			console.log("New Comment Added");
		}
	});
});

router.get('/deletecomment/:id', function(req, res){
	console.log(req.params.id)
	Comments.remove({'_id': req.params.id}).exec(function(err, data){
		if(err){
			console.log(err);
		} else {
			console.log("Comment deleted");
		}
	})
});

module.exports = router;