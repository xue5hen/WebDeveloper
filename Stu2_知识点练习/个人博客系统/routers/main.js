var express=require('express');
var router=express.Router();
// 获取分类名称
var Category=require('../models/category');

router.use('/',function(req,res,next){
	// 获取分类列表
	var categoriesList=[];
	Category.find().then(function(categoriesList){
		categoriesList=categoriesList||[];
		res.render('main/index',{
			userInfo:req.userInfo,
			categoriesList:categoriesList,
			systemInfo:req.systemInfo
		});
	});
});

module.exports=router;