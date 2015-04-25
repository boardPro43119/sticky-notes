var express = require('express'), 
	redis = require('redis'),
	path = require('path'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	redisClient = redis.createClient(6379, "localhost"),
	newNoteID=JSON.parse(redisClient.lindex("notes", 0))[3] || 1;

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, './', 'index.html'));
});

io.sockets.on("connection", function(client){
	console.log("client connected");
	redisClient.lrange("notes", 0, -1, function(err, notes){
		notes.reverse();
		notes.forEach(function(note){
			note = JSON.parse(note);
			client.emit("add note", note[0], note[1], note[2], note[3]);
		});
	});
	client.on("add note", function(title, content, color){
		console.log(newNoteID);
		console.log("Attempting to add note with title " + title + " to Redis list");
		redisClient.lpush("notes", JSON.stringify([title, content, color, newNoteID]));
		client.emit("add note", title, content, color, newNoteID);
		newNoteID++;
	});
});

http.listen(3000, function(){
	console.log("Listening on port 3000...");
});