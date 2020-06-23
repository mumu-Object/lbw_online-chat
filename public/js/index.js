// 用户名输入框
var usernameInput = $('.usernameinput')
// 确定用户名按钮
var confirmUsername = $('.confirmUsernameButton')
// 消息输入框
var messageInput = $('.messageInput')
// 发送消息按钮
var sendMessageButton = $('.sendMessageButton')
// alert
var alertBox = $('.alert')
// 消息框
var chatbox = $('.chatbox')
var io = io.connect();
var COLORS = [
	'#e21400', '#91580f', '#f8a700', '#f78b00',
	'#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
	'#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];
var isLogin = false
var isColor = ''
var isUsername = ''
// 点击登录按钮
$('.login').click(function () {
	$('.modal').modal()
})
// 模态框显示之前
$('.modal').modal()
$('.modal').on('shown.bs.modal', function () {
	usernameInput.focus()
})
$('.modal').on('hide.bs.modal', function (e) {
	if (isLogin) return
	isUsername = '憨批'
	io.emit('add user', {username: isUsername, type: 'skyblue'})
	io.on('login', function (data) {
		openNotice(data.onlineUserNum)
	})
})
confirmUsername.click(function () {
	var username = setString(usernameInput.val().trim(), 4)
	isColor = COLORS[Math.floor(Math.random() * 12) + 1]
	if (username === '') return alert('alert-danger', '名字不能为空哦', '-52px', '100px', '0', '1', false)
	io.emit('add user', {username: username, type: isColor})
	io.on('login', function (data) {
		openNotice(data.onlineUserNum)
	})
	isLogin = true
	isUsername = username;
	$('.modal').modal('hide')
})
sendMessageButton.click(sendMessage)
confirmUsername.click(function () {
	$('.modal').modal()
})
io.on('user joined', function (data) {
	alert('alert-success', data.username + ' 已加入聊天室', '-52px', '100px', '0', '1', false)
	openNotice(data.onlineUserNum)
})
io.on('new message', function (data) {
	getMessage(data)
})

// 发送消息
function sendMessage() {
	var message = messageInput.val().trim()
	if (message === '') {
		return alert('alert-danger', '发送的消息不能为空哦', '-52px', '100px', '0', '1', false)
	}
	var sendMessageHtml = '<div class="col-md-12 to">\n' +
			'\t\t\t<div class="avatarColor" style="background-color: ' + isColor + '">' + isUsername + '</div>\n' +
			'\t\t\t<span class="message">' + message + '</span>\n' +
			'\t\t</div>'
	chatbox.append(sendMessageHtml)
	io.emit('new message', message)
	if (hasScrollbar()) {
		runScrollbal()
	}
	messageInput.val('')
	messageInput.focus()
}

function getMessage(data) {
	var sendMessageHtml =
			'<div class="col-md-12 form">\n' +
			'\t\t\t<div class="avatarColor" style="background-color: ' + data.type + '">' + data.username + '</div>\n' +
			'\t\t\t<span class="message">' + data.message + '</span>\n' +
			'\t\t</div>'
	chatbox.append(sendMessageHtml)
	if (hasScrollbar()) {
		runScrollbal()
	}
}

function hasScrollbar() {
	return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
}

function runScrollbal() {
	window.scrollTo(0, document.body.clientHeight)
}

// 弹出消息
function alert(type, message, tForm, tTo, oForm, oTo, stop) {
	alertBox[0].className = 'alert'
	alertBox.addClass(type)
	alertBox.text(message)
	transition.begin(alertBox[0], [
		["top", tForm, tTo],
		["opacity", oForm, oTo]
	], {
		duration: "2s",
		timingFunction: "ease-in-out",
		onTransitionEnd: function (element, finished) {
			if (!finished || stop) return;
			// Animate backwards by switching values
			alert(type, message, tTo, tForm, oTo, oForm, true);
		}
	});
}

function setString(str, len) {
	var strlen = 0;
	var s = "";
	for (var i = 0; i < str.length; i++) {
		if (str.charCodeAt(i) > 128) {
			strlen += 2;
		} else {
			strlen++;
		}
		s += str.charAt(i);
		if (strlen >= len) {
			return s + ''
		}
	}
	return s;
}

function openNotice(nMessage) {
	chatbox.append(
			'<div class="notice row">\n' +
			'\t\t\t<code>\n' +
			'\t\t\t\t<span>当前在线人数：</span>\n' +
			'\t\t\t\t<span>' + nMessage + '</span>\n' +
			'\t\t\t</code>\n' +
			'\t\t</div>'
	)
}


