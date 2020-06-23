// 引入express
var express = require('express')
// 创建express服务器
var app = express()
// 引入系统path模块
var path = require('path')
// 创建服务器
var server = require('http').createServer(app)
// 引入socket.io
var io = require('socket.io')(server)
// 声明端口
var port = process.env.PORT || 3000
// 监听端口
server.listen(port, () => {
	console.log('The Server Runing in http://localhost:%d', port);
})
// 开启静态资源访问
app.use(express.static(path.join(__dirname, 'public')))
// 声明在线人数
var onlineUserNum = 0;

io.on('connection', (socket) => {
	var addedUser = false;
	socket.on('new message', (data) => {
		socket.broadcast.emit('new message', {
			username: socket.username,
			type: socket.type,
			message: data
		})
	})
	socket.on('add user', (data) => {
		if (addedUser) return;
		socket.username = data.username
		socket.type = data.type
		++onlineUserNum
		addedUser = true
		socket.emit('login', {
			onlineUserNum: onlineUserNum
		})
		socket.broadcast.emit('user joined', {
			username: socket.username,
			onlineUserNum: onlineUserNum
		})
	})
	socket.on('typing', () => {
		socket.broadcast.emit('typing', {
			username: socket.username
		});
	});
	// when the client emits 'stop typing', we broadcast it to others
	socket.on('stop typing', () => {
		socket.broadcast.emit('stop typing', {
			username: socket.username
		});
	});
	// when the user disconnects.. perform this
	socket.on('disconnect', () => {
		if (addedUser) {
			--onlineUserNum;
			
			// echo globally that this client has left
			socket.broadcast.emit('user left', {
				username: socket.username,
				numUsers: onlineUserNum
			});
		}
	});
})
