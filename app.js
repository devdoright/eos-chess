var express = require("express");
var app = express();
var bodyParser       = require("body-parser");
var mongoose         = require("mongoose");

// SOCKET FORWARD DECLARATIONS
var http = require('http').Server(app);
var io = require('socket.io')(http);

// USERS LIST
var users = []

// ROOM ID GENERATOR
function generateRoomId() {
    var result = "";
    var length = 16; 
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-@";
  
    for (var i = 0; i < length; i++)
      result += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return result;
  }

// APP CONFIG
mongoose.connect("mongodb://localhost/chess_eos");
app.set("view engine", "ejs");
app.use(express.static("public"));

// MONGOOSE/MODEL CONFIG
var moveSchema = new mongoose.Schema({
    player: String,
    move: String,
    created: {type: Date, default: Date.now()}
});

var Move = mongoose.model("Move", moveSchema);

var data = [
    {
        player: "Cloud's rest", 
        move: "RE1"
    },
    {
        player: "Cloud's rest", 
        move: "RE4"
    },
    {
        player: "Cloud's rest", 
        move: "RE6"
    },
    {
        player: "Cloud's rest", 
        move: "RE6"
    },
    {
        player: "Cloud's rest", 
        move: "RE6"
    }
]

function seedDB(){
    // Remove all campgrounds
    Move.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed moves!");
        // data.forEach(function(seed){
        //     Move.create(seed, function(err, move){
        //         if(err){
        //             console.log(err)
        //         } else {
        //             console.log("added a move");
        //         }; 
        //     });
        // });
    });
};

seedDB()

// SETUP RESOURCES TO BE USED
app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/img/chesspieces/wikipedia", express.static(__dirname + '/img/chesspieces/wikipedia'));
app.use("/stylesheets", express.static(__dirname + '/stylesheets'));
app.use("/node_modules", express.static(__dirname + '/node_modules'));

// INDEX ROUTE
app.get("/", function(req, res) {
    Move.find({}, function(err, allMoves){
        if(err){
            console.log(err);
        } else {
           res.render("index",{moves : allMoves});
        }
     });
});

// SOCKET LOGIC
io.on('connection', function(socket) {
    // once a client has connected, we expect to get a ping from them saying what room they want to join
    socket.on('room', function(room) {
        socket.join(room);
    });
    console.log('New connection');
    socket.on('move', function(msg) {
        // PREV BROADCAST TO ALL ROOMS, NOW TO SPECIFIC ROOM
        // socket.broadcast.emit('move', msg);
        socket.broadcast.to(room).emit("move",msg);
        console.log(room);
        // console.log(msg);
        data.push(msg.to);
    });
    socket.on('disconnect', function(){
        console.log("user disconnected");
     });
})

room = "abc123";

http.listen(3000, function(){
    console.log('listening on *:3000');
});