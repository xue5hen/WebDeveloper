var mongoose=require('mongoose');

// 评论表结构
module.exports=new mongoose.Schema({
	// 所属文章
	articleId:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'article'
	},
	// 评论人
	username:String,
	// 内容
	content:String,
	// 创建时间
	createTime:String
});