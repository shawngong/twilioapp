// Your accountSid and authToken from twilio.com/user/account
var accountSid = 'AC2057a119efbe2edad1fce813000becd1';
var authToken = '1eb8dccd0b379b2b8c46095476d9af47';
var client = require('twilio')(accountSid, authToken);
var unirest = require('unirest');
var express = require("express");
var http = require('http');
var app = express();
var o2x = require('object-to-xml');
var qs = require('querystring');

var twiml2 = "https://api.twilio.com/cowbell.mp3";
var rickRoll = "http://demo.twilio.com/docs/voice.xml";
var search = "aaaambient";

app.use(express.logger());



app.get("/test", function (req, res) {
	res.set("Content-Type", "text/xml");
	res.send(o2x({
		'?xml version="1.0" encoding="utf-8"?' : null,
		Response: {
				Play: twiml2
		}
	}));

  console.log(req.query.From);
	req.setEncoding('utf8');
	var input = "" + req.query.From;
	search = "" + req.query.Body;

	var newSearch = "";
	for (var i = 0; i<search.length; i++){
		if (search.charAt(i) == ' '){
			newSearch += '+';
		}
		else {
			newSearch += search.charAt(i);
		}
	}
	console.log(req.query.Body);
	unirest.get("https://deezerdevs-deezer.p.mashape.com/search?q=" + newSearch)
	.header("X-Mashape-Key", "ap39nZvedEmshxZMoGpWdR5AWajap1eUrawjsnaAE1SOlwVBjH")
	.header("Accept", "text/plain")
	.end(function (result) {
		//console.log(result.body);
		console.log("1");
		//console.log(result.body.data);
		console.log("2");
		//console.log(result.body.total);
		//console.log(twiml2);
		//console.log(newSearch);
		console.log("3");
		// Checks if the song is found or not
		if (result === null || result.body.total <= 0) {
			twiml2 = rickroll;
		}
		else {
			console.log(twiml2);
			twiml2 = result.body.data[0].preview;
		}
		console.log(twiml2);
		console.log("4");
		if (input != null && typeof input == "string"){
			//console.log(input);
			//console.log(twiml2 + " something");
			client.calls.create({
				to: input,
				from: "+12268871654",
				url: twiml2,
				method: "GET",
				fallbackMethod: "GET",
				statusCallbackMethod: "GET",
				record: "false"
			}, function(err, call) {
				console.log(call.sid);
			});

		} else {
				console.log(input);
				client.messages.create({
							body: input + " error",
							to: "+1 personal-number",
							from: "+12268871654"
					}, function(err, message) {
						console.log(err);
							//process.stdout.write(message.sid);
					});
		}
	});
});

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/app');
  //app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/app'));
  app.use(app.router);
  app.engine('html', require('ejs').renderFile);
});

app.get('/', function(request, response) {
  response.render('index.html')
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
