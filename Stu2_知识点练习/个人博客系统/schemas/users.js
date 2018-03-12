var mongoose=require('mongoose');

// 用户表结构
module.exports=new mongoose.Schema({
	// 用户
	username:String,
	// 密码
	password:String,
	// 是否是管理员
	isAdmin:{
		type:Boolean,
		default:false
	},
	// 创建时间
	createTime:String
});