var mongoose=require('mongoose');

// 分类表结构
module.exports=new mongoose.Schema({
	// 分类名
	categoryname:String,
	// 备注
	remark:String
});