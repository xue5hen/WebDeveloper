var ws=require('nodejs-websocket');
var url=require('url');
var i=1,Members=[];
var server=ws.createServer(function(conn){
	console.log("有用户接入...");
	// 当有新用户接入时，整理用户列表
	var params=url.parse(conn.path,true).query;
	if (params.name=="Guest") {
		params.name+=(i++);
		conn.sendText(JSON.stringify({
			type:'update_self',
			User:params
		}));
	}
	Members.push(params);
	Broadcast(JSON.stringify({
		type:'update_conn',
		Members:Members
	}));
	conn.params=params;

	// 消息事件
	conn.on('text',function(str){
		Broadcast(str);
	});

	// 连接关闭
	conn.on("close",function(code,reason){
		console.log("连接关闭...");
		// 更新成员列表
		Members=[];
		server.connections.forEach(function(v){
			Members.push(v.params);
		});
		Broadcast(JSON.stringify({
			type:'update_conn',
			Members:Members
		}));
	});

	// 错误处理
	conn.on("error",function(err){
		console.log("出错啦...");
	});
}).listen(888);

// 广播消息
function Broadcast(str){
	server.connections.forEach(function(conn){
		conn.sendText(str);
	});
}

// 服务器运行提示信息
console.log("this server is running in port 888...");