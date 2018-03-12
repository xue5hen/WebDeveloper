var vm=new Vue({
	el:"#app",
	data:{
		WS:null,
		WSServer:'ws://192.168.0.70:888',
		IsConn:false,
		IsBoy:true,
		Message:"",
		ToolBtns:[{
			icon:"icon-mic",
			title:"语音"
		},{
			icon:"icon-video-camera",
			title:"视频"
		}],
		ShowEmojiSelector:false,
		Members:[],
		HistoryMsg:[],
		DB:null,
		DBName:"chatroom",
	},
    computed:{
		User:function(){
			var user=localStorage.getItem('ChatRoomUser');
			return user?JSON.parse(user):{
				icon:"icon-boy",
				name:"Guest",
				token:Math.random().toString(36).substring(2)
			};
		}
    },
    mounted:function(){
        this.$nextTick(function(){
            this.Init();
        });
    },
	methods:{
		Init:function() {
			// 获取历史信息
			this.GetHistoryMsg();
			// 连接服务器
			if ("WebSocket" in window) {
				this.EstablishConn();
				//发送消息组合键
				document.addEventListener('keydown',function(e){
					if (e.ctrlKey && e.keyCode==13) {vm.SendMsg();}
				});
			}else{
				alert("您的浏览器不支持 WebSocket!");
			}
		},
		GetHistoryMsg:function() {
			// 从本地数据库中加载历史信息
			var DBOpenRequest=window.indexedDB.open(vm.DBName,3);
			DBOpenRequest.onsuccess=function(e){
				console.log("数据库打开成功");
				console.log(e);
				// 将数据结果保存到变量
				vm.DB=DBOpenRequest.result;
				var objectStore=vm.DB.transaction(vm.DBName).objectStore(vm.DBName);
				objectStore.openCursor().onsuccess=function(e){
					var cursor=e.target.result;
					if (cursor) {
						vm.HistoryMsg.push(cursor.value);
						cursor.continue();
					}else{
						console.log("数据库遍历完成");
					}
				};
			};
			DBOpenRequest.onerror=function(e){
				console.error("数据库打开错误");
				console.log(e);
				console.log(DBOpenRequest.error);
			};
			DBOpenRequest.onupgradeneeded=function(e){
				console.log("onupgradeneeded");
				console.log(e);
				vm.DB=e.target.result;
				var objectStore=vm.DB.createObjectStore(vm.DBName,{
					keyPath:'id',
					autoIncrement:true
				});
				objectStore.createIndex('id','id',{unique:true});
				objectStore.createIndex('name','name');
				objectStore.createIndex('time','time');
				objectStore.createIndex('msg','msg');
			};
		},
		InsertEmoji:function(i) {
			// 在发送消息中插入Emoji表情
			var msgBox=document.querySelector('.yb_chatroom_msginput'),
				msg=this.Message;
			var cursorPosition=msgBox.selectionStart;
			if (cursorPosition>=0) {	//IE9+
				this.Message=msg.substring(0,cursorPosition)+('[(:'+i+')]')+msg.substring(cursorPosition);
				// 因为修改文本后，浏览器会自动将光标移至文本末尾，故需人为将光标位置设置到该emoji后面
				setTimeout(function(){
					msgBox.selectionStart=cursorPosition+('[(:'+i+')]').length;
				},0);
			}else{
				this.Message+=('[(:'+i+')]');
			}
		},
		SendMsg:function() {
			// 发送消息
			if (this.Message) {
				this.WS.send(JSON.stringify({
					type:'msg',
					Msg:{
						name:this.User.name,
						time:this.TimeFormat(new Date()),
						msg:this.Message
					}
				}));
				this.Message="";
			}
		},
		RecvMsg:function(data) {
			if (data.type=='msg') {
				// 输出到页面
				this.HistoryMsg.push(data.Msg);
				// 存储到本地数据库
				var transaction=vm.DB.transaction([vm.DBName],'readwrite');
				var objectStore=transaction.objectStore(vm.DBName);
				var objectStoreRequest=objectStore.add(data.Msg);
			}else if (data.type=='update_self'){
				// 输出到页面
				this.User=data.User;
			}else if (data.type=='update_conn'){
				// 输出到页面
				var Members=[];
				data.Members.forEach(function(v){
					if (v.token==vm.User.token&&v.name==vm.User.name) {return;}
					Members.push(v);
				});
				this.Members=Members;
			}else if (data.type=='update_user'){
				// 输出到页面
				this.Members.forEach(function(v,i,arr){
					if (v.token==data.User.token) {
						vm.$set(arr,i,data.User);
					}
				});
			}
		},
		str2emoji:function(str){
			return str.replace(/\[\(:(\d+)\)\]/g,'<span class="icon-emoji-$1"></span>');
		},
		TimeFormat:function(date) {
			// 格式化时间
			date=new Date(date);
			var Y=date.getFullYear(),
				M=date.getMonth()+1,
				D=date.getDate(),
				h=date.getHours(),
				m=date.getMinutes(),
				s=date.getSeconds();
			return Y+'/'+M+'/'+D+' '+this.Zeroize(h)+':'+this.Zeroize(m)+':'+this.Zeroize(s);
		},
		Zeroize:function(value) {
			// 补零
			return value>=10?value:'0'+value;
		},
		SetUserInfo:function() {
			// 更新本地
			localStorage.setItem('ChatRoomUser',JSON.stringify(this.User));
			// 更新其它成员的页面
			if (this.IsConn) {
				this.WS.send(JSON.stringify({
					type:'update_user',
					User:this.User
				}));
			}
		},
		ChangeHead:function() {
			// 更换头像
			this.IsBoy=!this.IsBoy;
			this.User.icon=this.IsBoy?"icon-boy":"icon-girl";
			// 更新用户信息
			this.SetUserInfo();
		},
		EstablishConn:function() {
			var ws=this.WSServer+'?name='+this.User.name+'&icon='+this.User.icon+'&token='+this.User.token;
			this.WS=new WebSocket(ws);
			this.WS.addEventListener('open',function(e){
				vm.IsConn=true;
				console.log("连接已建立...");
				console.log(e);
			});
			this.WS.addEventListener('message',function(e){
				console.log("有数据传输...");
				console.log(e);
				vm.RecvMsg(JSON.parse(e.data));
			});
			this.WS.addEventListener('close',function(e){
				vm.IsConn=false;
				console.log("连接已关闭...");
				console.log(e);
			});
			this.WS.addEventListener('error',function(e){
				console.log("出错啦...");
				console.log(e);
			});
		},
		CloseConn:function() {
			this.WS.close();
			this.IsConn=false;
			this.Members=[];
		},
		TabConn:function() {
			this.IsConn?this.CloseConn():this.EstablishConn();
		},
		CloseWin:function() {
			this.CloseConn();
			window.opener=null;
			window.open('','_self');
			window.close();
		},
		ClearBin:function() {
			vm.DB.transaction(vm.DBName,'readwrite').objectStore(vm.DBName).clear();
			this.HistoryMsg=[];
		},
		ContactMe:function() {
			alert(decodeURIComponent("%E5%8D%8A%E5%90%8A%E5%AD%90%E4%BC%AF%E7%88%B5")+" QQ:"+parseInt('11011100000000110010110110111',2));
		},
	}
});
