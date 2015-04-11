var express = require('express'), 
	redis = require('redis'),
	path = require('path'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	redisClient = redis.createClient(6379, "localhost");

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, './', 'index.html'));
});

io.sockets.on("connection", function(client){
	console.log("client connected");
	client.on("add note", function(title, content, color){
		console.log("Attempting to add note with title " + title + " to Redis list");
		redisClient.lpush("notes", JSON.stringify([title, content, color]));
	});
});

http.listen(3000, function(){
	console.log("Listening on port 3000...");
});