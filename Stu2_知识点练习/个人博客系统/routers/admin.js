var express=require('express');
var router=express.Router();
// 获取分类名称
var Category=require('../models/category');
// 获取系统信息
var getSize = require('get-folder-size');
var os = require('os');

router.get('/',function(req,res,next){
	req.systemInfo.platform=os.platform();
	req.systemInfo.release=os.release();
	req.systemInfo.systemName=os.hostname();
	req.systemInfo.localIp=req.ip;
	var networks = os.networkInterfaces();
	for(i in networks){
		if(networks[i].family){
			if (networks[i].family.toLowerCase()=='ipv4') {
				req.systemInfo.serverIp=networks[i].address;
			}
		}else if (networks[i][0].family) {
			networks[i].forEach(function(v){
				if (v.family.toLowerCase()=='ipv4') {
					req.systemInfo.serverIp=v.address;
					return;
				}
			});
		}
		if (req.systemInfo.serverIp) {break;}
	}
	getSize('db',function(err,size){
		if (!err) {
			req.systemInfo.dbSize=(size/1024/1024).toFixed(2) + ' Mb';
		}
		res.render('admin/index',{
			userInfo:req.userInfo,
			systemInfo:req.systemInfo
		});
	});
});
router.get('/users',function(req,res,next){
	res.render('admin/users',{
		userInfo:req.userInfo,
		systemInfo:req.systemInfo
	});
});
router.get('/categories',function(req,res,next){
	res.render('admin/categories',{
		userInfo:req.userInfo,
		systemInfo:req.systemInfo
	});
});
router.get('/articles',function(req,res,next){
	res.render('admin/articles',{
		userInfo:req.userInfo,
		systemInfo:req.systemInfo
	});
});
router.get('/articleAdd',function(req,res,next){
	// 获取分类列表
	var categoriesList=[];
	Category.find().then(function(categoriesList){
		categoriesList=categoriesList||[];
		res.render('admin/articleAdd',{
			userInfo:req.userInfo,
			categoriesList:categoriesList,
			systemInfo:req.systemInfo
		});
	});
});
router.get('/articleEdit',function(req,res,next){
	// 获取分类列表
	var categoriesList=[];
	Category.find().then(function(categoriesList){
		categoriesList=categoriesList||[];
		res.render('admin/articleEdit',{
			userInfo:req.userInfo,
			categoriesList:categoriesList,
			systemInfo:req.systemInfo
		});
	});
});
router.get('/comments',function(req,res,next){
	res.render('admin/comments',{
		userInfo:req.userInfo,
		systemInfo:req.systemInfo
	});
});

module.exports=router;