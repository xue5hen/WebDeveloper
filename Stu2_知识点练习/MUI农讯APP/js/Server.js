(function(){
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	var $={},
		// 数据库名称
		DBName='FarmAPP',
		// 数据库对象
		DB=null,
		// 预设数据表名称
		UserTable='user',
		InfoTable='info',
		NewsTable='news',
		// 服务器返回数据格式
		res={code:0,msg:'',data:''};
	// 初始化数据库对象
	function InitDB(callback){
		var DBOpenRequest=window.indexedDB.open(DBName,5);
		DBOpenRequest.onsuccess=function(e){
//			alert("onsuccess");
			// 将数据结果保存到变量
			DB=DBOpenRequest.result;
			if(callback){callback();}
		};
		DBOpenRequest.onerror=function(e){
//			alert("数据库打开错误");
		};
		DBOpenRequest.onupgradeneeded=function(e){
//			alert("onupgradeneeded");
			DB=e.target.result;
			// 创建用户表
			var objectStore_user=DB.createObjectStore(UserTable,{
				keyPath:'id',
				autoIncrement:true
			});
			objectStore_user.createIndex('id','id',{unique:true});
			objectStore_user.createIndex('account','account',{unique:true});
			objectStore_user.createIndex('password','password');
			objectStore_user.createIndex('fund','fund');
			objectStore_user.createIndex('email','email');
			// 创建供求信息表
			var objectStore_info=DB.createObjectStore(InfoTable,{
				keyPath:'id',
				autoIncrement:true
			});
			objectStore_info.createIndex('id','id',{unique:true});
			objectStore_info.createIndex('account','account');
			objectStore_info.createIndex('title','title');
			objectStore_info.createIndex('type','type');
			objectStore_info.createIndex('imgSrc','imgSrc');
			objectStore_info.createIndex('time','time');
			objectStore_info.createIndex('content','content');
			// 创建资讯信息表
			var objectStore_news=DB.createObjectStore(NewsTable,{
				keyPath:'id',
				autoIncrement:true
			});
			objectStore_news.createIndex('id','id',{unique:true});
			objectStore_news.createIndex('title','title');
			objectStore_news.createIndex('imgSrc','imgSrc');
			objectStore_news.createIndex('time','time');
			objectStore_news.createIndex('abstract','abstract');
			objectStore_news.createIndex('href','href');
		};
	}
	
	// 用户注册
	$.Register=function(options){
		InitDB(function(){
			var transaction=DB.transaction([UserTable],'readwrite');
			var objectStore = transaction.objectStore(UserTable);
			var myIndex=objectStore.index('account');
			var getRequest = myIndex.get(options.data.account);
			getRequest.onsuccess=function(){
				if(getRequest.result){
					res.code=1;
					res.msg='注册失败，用户名已存在';
					options.fail(res);
				}else{
					options.data.fund=0;
					var objectStoreRequest = objectStore.add(options.data);
					objectStoreRequest.onsuccess = function(event) {
						res.code=0;
						res.msg='注册成功';
						options.success(res);
					};
					objectStoreRequest.onerror = function(event) {
						res.code=2;
						res.msg='注册失败，数据库错误';
						options.fail(res);
					};	
				}
			};	
		});
	};
	
	// 用户登录
	$.Login=function(options){
		InitDB(function(){
			var transaction=DB.transaction([UserTable],'readonly');
			var objectStore = transaction.objectStore(UserTable);
			var myIndex=objectStore.index('account');
			var getRequest = myIndex.get(options.data.account);
			getRequest.onsuccess=function(){
				if(getRequest.result && getRequest.result.password===options.data.password){
					res.code=0;
					res.msg='登录成功';
					options.success(res);
				}else{
					res.code=1;
					res.msg='登录失败，账号不存在或密码错误';
					options.fail(res);
				}
			};	
		});
	};
	
	// 获取资金金额
	$.GetFund=function(options){
		InitDB(function(){
			var transaction=DB.transaction([UserTable],'readonly');
			var objectStore = transaction.objectStore(UserTable);
			var myIndex=objectStore.index('account');
			var getRequest = myIndex.get(options.data.account);
			getRequest.onsuccess=function(){
				if(getRequest.result){
					res.code=0;
					res.msg='余额读取成功';
					res.data=getRequest.result.fund;
					options.success(res);
				}else{
					res.code=1;
					res.msg='余额读取失败';
					options.fail(res);
				}
			};	
		});
	};
	
	// 密码修改
	$.ChangePwd=function(options){
		InitDB(function(){
			var transaction=DB.transaction([UserTable],'readwrite');
			var objectStore = transaction.objectStore(UserTable);
			var myIndex=objectStore.index('account');
			var getRequest = myIndex.get(options.data.account);
			getRequest.onsuccess=function(){
				if(getRequest.result && getRequest.result.password===options.data.oldPassword){
					var temp=getRequest.result;
					temp.password=options.data.newPassword;
					objectStore.put(temp);
					res.code=0;
					res.msg='密码修改成功';
					options.success(res);
				}else{
					res.code=1;
					res.msg='原密码错误';
					options.fail(res);
				}
			};	
		});
	};
	
	// 发布供求信息
	$.AddInfo=function(options){
		InitDB(function(){
			var transaction=DB.transaction([InfoTable],'readwrite');
			var objectStore = transaction.objectStore(InfoTable);
			var objectStoreRequest = objectStore.add(options.data);
			objectStoreRequest.onsuccess = function(event) {
				res.code=0;
				res.msg='发布成功';
				options.success(res);
			};
			objectStoreRequest.onerror = function(event) {
				res.code=1;
				res.msg='发布失败，数据库错误';
				options.fail(res);
			};
		});
	};
	// 获取供求信息
	$.GetInfo=function(options){
		InitDB(function(){
			res.code=0;
			res.data=[];
			var transaction=DB.transaction([InfoTable],'readonly');
			var objectStore = transaction.objectStore(InfoTable);
			var myIndex=objectStore.index('id');
			myIndex.openCursor().onsuccess=function(e){
				var cursor=e.target.result;
				if(cursor){
					res.data.unshift(cursor.value);
					cursor.continue();
				}else{
					res.msg='获取成功';
					options.success(res);
				}
			};
		});
	};
	// 通过id获取供求信息
	$.GetInfoById=function(options){
		InitDB(function(){
			res.code=0;
			res.data={};
			var transaction=DB.transaction([InfoTable],'readonly');
			var objectStore = transaction.objectStore(InfoTable);
			var myIndex=objectStore.index('id');
			var getRequest=myIndex.get(options.data.id);
			getRequest.onsuccess=function(){
				res.msg='获取成功';
				res.data=getRequest.result||{};
				options.success(res);
			};
		});
	};
	
	// 发布资讯信息
	$.AddNews=function(options){
		InitDB(function(){
			var transaction=DB.transaction([NewsTable],'readwrite');
			var objectStore = transaction.objectStore(NewsTable);
			var objectStoreRequest = objectStore.add(options.data);
			objectStoreRequest.onsuccess = function(event) {
				res.code=0;
				res.msg='发布成功';
				options.success(res);
			};
			objectStoreRequest.onerror = function(event) {
				res.code=1;
				res.msg='发布失败，数据库错误';
				options.fail(res);
			};
		});
	};
	// 获取资讯信息
	$.GetNews=function(options){
		InitDB(function(){
			res.code=0;
			res.data=[];
			var transaction=DB.transaction([NewsTable],'readonly');
			var objectStore = transaction.objectStore(NewsTable);
			var myIndex=objectStore.index('id');
			myIndex.openCursor().onsuccess=function(e){
				var cursor=e.target.result;
				if(cursor){
					res.data.unshift(cursor.value);
					cursor.continue();
				}else{
					res.msg='获取成功';
					options.success(res);
				}
			};
		});
	};
	// 通过id获取资讯信息
	$.GetNewsById=function(options){
		InitDB(function(){
			res.code=0;
			res.data={};
			var transaction=DB.transaction([NewsTable],'readonly');
			var objectStore = transaction.objectStore(NewsTable);
			var myIndex=objectStore.index('id');
			var getRequest=myIndex.get(options.data.id);
			getRequest.onsuccess=function(){
				res.msg='获取成功';
				res.data=getRequest.result;
				options.success(res);
			};
		});
	};
	
	// 幸运转盘
	$.GetLottery=function(options){
		var num=Math.random(),
			prizeArr=[10,5,1],
			prize=0;
		if(num<0.1){
			prize=prizeArr[0];
			res.msg='恭喜您获得了一等奖！\n'+prize+'元奖金已发放到个人账户';
			res.data=1;
		}else if(num<0.25){
			prize=prizeArr[1];
			res.msg='恭喜您获得了二等奖！\n'+prize+'元奖金已发放到个人账户';
			res.data=2;
		}else if(num<0.45){
			prize=prizeArr[2];
			res.msg='恭喜您获得了三等奖！\n'+prize+'元奖金已发放到个人账户';
			res.data=3;
		}else{
			res.msg='很遗憾，您没中奖！';
			res.data=0;
		}
		InitDB(function(){
			var transaction=DB.transaction([UserTable],'readwrite');
			var objectStore = transaction.objectStore(UserTable);
			var myIndex=objectStore.index('account');
			var getRequest = myIndex.get(options.data.account);
			getRequest.onsuccess=function(){
				if(getRequest.result){
					res.code=0;
					var temp=getRequest.result;
					temp.fund+=prize;
					objectStore.put(temp);
					options.success(res);
				}else{
					res.code=1;
					res.msg='服务器错误，请确认是否已登录';
					options.fail(res);
				}
			};
		});
	};
	
	window.Server=$;
})();
