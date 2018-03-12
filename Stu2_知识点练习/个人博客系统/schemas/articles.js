var mongoose=require('mongoose');

// 文章表结构
module.exports=new mongoose.Schema({
	// 标题
	title:String,
	// 分类
	category:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'category'
	},
	// 作者
	author:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'user'
	},
	// 简介
	info:{
		type:String,
		default:''
	},
	// 内容
	content:{
		type:String,
		default:''
	},
	// 创建时间
	createTime:String,
	// 阅读次数
	readCount:{
		type:Number,
		default:0
	},
	// 评论次数
	commentCount:{
		type:Number,
		default:0
	}
});