/* 应用程序入口文件 */

// 加载express模块
var express=require('express');
// 加载模板处理模块
var swig=require('swig');
// 加载数据库模块
var mongoose=require('mongoose');
// POST数据处理
var bodyParser=require('body-parser');
// Cookies
var Cookies=require('cookies');
// 创建app应用 => NodeJS Http.createServer()
var app=express();
// 获取用户模型
var User=require('./models/user');

// 设置静态文件托管
app.use('/public',express.static(__dirname+'/public'));

// 配置应用模板
app.engine('html',swig.renderFile);
// 设置模板存放目录
app.set('views','./views');
// 注册所使用的模板引擎
app.set('view engine','html');
// 开发阶段禁用模板缓存
swig.setDefaults({cache:false});
// body-parser设置
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// 设置cookies
app.use(function(req,res,next){
	req.cookies=new Cookies(req,res);
	req.userInfo={};
	req.systemInfo={blogTitle:'半吊子伯爵的个人博客',blogName:'明空个人博客系统',blogVersion:'v1.0'};
	if (req.cookies.get('userInfo')) {
		try{
			req.userInfo=JSON.parse(req.cookies.get('userInfo'))||{};
			// 获取当前登录用户的类型，是否是管理员
			User.findById(req.userInfo._id).then(function(userInfo){
				req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
				next();
			});
		}catch(e){
			next();
		}	
	}else{
		next();
	}
});

// 路由管理
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

// 监听http请求
mongoose.connect('mongodb://localhost:6666/blog',function(err){
	if (err) {
		console.log('数据库连接失败');
	}else{
		console.log('数据库连接成功');
		app.listen(666);
	}
});
