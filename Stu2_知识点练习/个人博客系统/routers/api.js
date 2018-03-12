var express=require('express');
var router=express.Router();
var dateFormat=require('dateformat');
var User=require('../models/user');
var Category=require('../models/category');
var Article=require('../models/article');
var Comment=require('../models/comment');

// 统一返回数据格式
var responseData;
router.use(function(req,res,next){
	responseData={
		code:0,
		message:'',
		value:null,
		tag:null
	};
	next();
});
// 用户注册
router.post('/user/register',function(req,res,next){
	var username=req.body.username||'';
		password=req.body.password||'',
		repassword=req.body.repassword||'',
		createTime=dateFormat(new Date(),'yyyy-mm-dd HH:MM:ss');
	// 用户名是否为空
	if (username==='') {
		responseData.code=1;
		responseData.message='用户名不能为空';
		res.json(responseData);
		return;
	}
	// 密码是否为空
	if (password==='') {
		responseData.code=2;
		responseData.message='密码不能为空';
		res.json(responseData);
		return;
	}
	// 两次密码是否一致
	if (password!==repassword) {
		responseData.code=3;
		responseData.message='两次输入的密码不一致';
		res.json(responseData);
		return;
	}
	// 用户名是否已经被注册
	User.findOne({
		username:username
	}).then(function(userInfo){
		if (userInfo) {
			responseData.code=4;
			responseData.message='该用户名已经被占用';
			res.json(responseData);
			return;
		}
		// 将用户信息保存到数据库中
		var user=new User({
			username:username,
			password:password,
			isAdmin:false,
			createTime:createTime
		});
		return user.save();
	}).then(function(newUserInfo){
		responseData.message='注册成功';
		res.json(responseData);
	});
});
// 用户登录
router.post('/user/login',function(req,res,next){
	var username=req.body.username||'';
	var password=req.body.password||'';
	// 用户名密码是否为空
	if (username===''||password==='') {
		responseData.code=1;
		responseData.message='用户名或密码不能为空';
		res.json(responseData);
		return;
	}
	// 用户是否存在
	User.findOne({
		username:username,
		password:password
	}).then(function(userInfo){
		if (!userInfo) {
			responseData.code=2;
			responseData.message='用户名或密码错误';
			res.json(responseData);
			return;
		}
		// 用户名和密码正确
		responseData.message='登录成功';
		responseData.userInfo={
			_id:userInfo._id,
			username:userInfo.username
		};
		req.cookies.set('userInfo',JSON.stringify(responseData.userInfo));
		res.json(responseData);
	});
});
// 用户退出
router.post('/user/logout',function(req,res,next){
	responseData.message='操作成功';
	req.cookies.set('userInfo',null);
	res.json(responseData);
});
// 获取用户列表
router.post('/user/getUserList',function(req,res,next){
	var pageIndex=parseInt(req.body.pageIndex);
	var pageSize=parseInt(req.body.pageSize);
	User.count(function(err,count){
		responseData.tag=count||0;
		User.find().skip((pageIndex-1)*pageSize).limit(pageSize).then(function(users){
			responseData.value=users||[];
			res.json(responseData);
		});
	});
});
// 添加用户
router.post('/user/addUser',function(req,res,next){
	var username=req.body.username||'',
		password=req.body.password||'',
		isAdmin=req.body.isAdmin?true:false,
		createTime=dateFormat(new Date(),'yyyy-mm-dd HH:MM:ss');
	// 用户名密码是否为空
	if (username===''||password==='') {
		responseData.code=1;
		responseData.message='用户名或密码不能为空';
		res.json(responseData);
		return;
	}
	// 用户是否存在
	User.findOne({
		username:username
	}).then(function(userInfo){
		if (userInfo) {
			responseData.code=2;
			responseData.message='该用户名已经被占用';
			res.json(responseData);
			return;
		}
		// 将用户信息保存到数据库中
		var user=new User({
			username:username,
			password:password,
			isAdmin:isAdmin,
			createTime:createTime
		});
		return user.save();
	}).then(function(newUserInfo){
		responseData.message='添加成功';
		res.json(responseData);
	});
});
// 修改用户
router.post('/user/editUser',function(req,res,next){
	var _id=req.body._id,
		username=req.body.username||'',
		password=req.body.password||'',
		isAdmin=req.body.isAdmin?true:false;
	// 用户名密码是否为空
	if (username===''||password==='') {
		responseData.code=1;
		responseData.message='用户名或密码不能为空';
		res.json(responseData);
		return;
	}
	// 用户是否存在
	User.findOne({
		_id:_id
	}).then(function(userInfo){
		if (!userInfo) {
			responseData.code=2;
			responseData.message='用户不存在';
			res.json(responseData);
			return;
		}
		User.update({
			_id:_id
		},{
			username:username,
			password:password,
			isAdmin:isAdmin
		},function(err){
			if (err) {
				responseData.code=3;
				responseData.message='修改失败';
			}else{
				responseData.message='修改成功';
			}
			res.json(responseData);
		});
	});
});
// 删除用户
router.post('/user/delUser',function(req,res,next){
	var _id=req.body._id;
	// 用户是否存在
	User.findOne({
		_id:_id
	}).then(function(userInfo){
		if (!userInfo) {
			responseData.code=1;
			responseData.message='用户不存在';
			res.json(responseData);
			return;
		}
		User.remove({
			_id:_id
		},function(err){
			if (err) {
				responseData.code=2;
				responseData.message='删除失败';
			}else{
				responseData.message='删除成功';
			}
			res.json(responseData);
		});
	});
});

// 获取分类列表
router.post('/category/getCategoryList',function(req,res,next){
	var pageIndex=parseInt(req.body.pageIndex);
	var pageSize=parseInt(req.body.pageSize);
	Category.count(function(err,count){
		responseData.tag=count||0;
		Category.find().skip((pageIndex-1)*pageSize).limit(pageSize).then(function(categories){
			responseData.value=categories||[];
			res.json(responseData);
		});
	});
});
// 添加分类
router.post('/category/addCategory',function(req,res,next){
	var categoryname=req.body.categoryname||'',
		remark=req.body.remark||'';
	// 分类名是否为空
	if (categoryname==='') {
		responseData.code=1;
		responseData.message='分类名不能为空';
		res.json(responseData);
		return;
	}
	// 分类是否存在
	Category.findOne({
		categoryname:categoryname
	}).then(function(categoryInfo){
		if (categoryInfo) {
			responseData.code=2;
			responseData.message='该分类名已存在';
			res.json(responseData);
			return;
		}
		// 将分类信息保存到数据库中
		var category=new Category({
			categoryname:categoryname,
			remark:remark
		});
		return category.save();
	}).then(function(newCategoryInfo){
		responseData.message='添加成功';
		res.json(responseData);
	});
});
// 修改分类
router.post('/category/editCategory',function(req,res,next){
	var _id=req.body._id,
		categoryname=req.body.categoryname||'',
		remark=req.body.remark||'';
	// 分类名是否为空
	if (categoryname==='') {
		responseData.code=1;
		responseData.message='分类名不能为空';
		res.json(responseData);
		return;
	}
	// 分类是否存在
	Category.findOne({
		_id:_id
	}).then(function(categoryInfo){
		if (!categoryInfo) {
			responseData.code=2;
			responseData.message='修改失败，请刷新页面重试';
			res.json(responseData);
			return;
		}
		Category.update({
			_id:_id
		},{
			remark:remark,
			categoryname:categoryname
		},function(err){
			if (err) {
				responseData.code=3;
				responseData.message='修改失败';
			}else{
				responseData.message='修改成功';
			}
			res.json(responseData);
		});
	});
});
// 删除分类
router.post('/category/delCategory',function(req,res,next){
	var _id=req.body._id;
	// 分类是否存在
	Category.findOne({
		_id:_id
	}).then(function(categoryInfo){
		if (!categoryInfo) {
			responseData.code=1;
			responseData.message='分类不存在';
			res.json(responseData);
			return;
		}
		Category.remove({
			_id:_id
		},function(err){
			if (err) {
				responseData.code=2;
				responseData.message='删除失败';
			}else{
				responseData.message='删除成功';
			}
			res.json(responseData);
		});
	});
});

// 获取文章列表
router.post('/article/getArticleList',function(req,res,next){
	var pageIndex=parseInt(req.body.pageIndex);
	var pageSize=parseInt(req.body.pageSize)||5;
	var needInfo=req.body.needInfo;
	var filter=req.body.filter?{category:req.body.filter}:{};
	if (req.body.keyword) {filter.content=new RegExp(req.body.keyword);}
	Article.count(function(err,count){
		responseData.tag=count||0;
		var pageCount=Math.ceil(count/pageSize);
		pageIndex=Math.min(pageIndex,pageCount);
		pageIndex=Math.max(pageIndex,1);
		Article.where(filter).find().sort({_id:-1}).skip((pageIndex-1)*pageSize).limit(pageSize).populate(['category','author']).then(function(articles){
			console.log(articles);
			responseData.value=articles||[];
			responseData.value.forEach(function(v){
				v.info=needInfo?v.info:'';
				v.content='';
				v.author.password=undefined;
				v.author.isAdmin=undefined;
			});
			res.json(responseData);
		});
	});
});
// 获取文章内容
router.post('/article/getArticle',function(req,res,next){
	var _id=req.body._id||'',
		all=req.body.all;
	// _id是否为空
	if (_id==='') {
		responseData.code=1;
		responseData.message='文章不存在';
		res.json(responseData);
		return;
	}
	// 文章是否存在
	Article.findOne({
		_id:_id
	}).populate(['category','author']).then(function(articleInfo){
		if (!articleInfo) {
			responseData.code=2;
			responseData.message='文章不存在';
			res.json(responseData);
			return;
		}
		articleInfo.readCount++;
		articleInfo.save();
		responseData.value=articleInfo;
		responseData.value.author.password=undefined;
		responseData.value.author.isAdmin=undefined;
		if (!all) {
			responseData.value.content='';
		}
		res.json(responseData);
	});
});
// 添加文章
router.post('/article/addArticle',function(req,res,next){
	var title=req.body.title||'',
		category=req.body.category||'',
		info=req.body.info||'',
		content=req.body.content||'',
		author=req.userInfo._id.toString(),
		createTime=dateFormat(new Date(),'yyyy-mm-dd HH:MM:ss');
	// 标题和分类是否为空
	if (title===''||category==='') {
		responseData.code=1;
		responseData.message='标题或分类不能为空';
		res.json(responseData);
		return;
	}
	// 将文章信息保存到数据库中
	var article=new Article({
		title:title,
		category:category,
		info:info,
		content:content,
		author:author,
		createTime:createTime,
		readCount:0
	});
	article.save(function(){
		responseData.message='添加成功';
		res.json(responseData);
	});
});
// 修改文章
router.post('/article/editArticle',function(req,res,next){
	var _id=req.body._id,
		title=req.body.title||'',
		category=req.body.category||'',
		info=req.body.info||'',
		content=req.body.content||'';
	// 标题和分类是否为空
	if (title===''||category==='') {
		responseData.code=1;
		responseData.message='标题或分类不能为空';
		res.json(responseData);
		return;
	}
	// 文章是否存在
	Article.findOne({
		_id:_id
	}).then(function(articleInfo){
		if (!articleInfo) {
			responseData.code=2;
			responseData.message='修改失败，该文章可能已被删除';
			res.json(responseData);
			return;
		}
		Article.update({
			_id:_id
		},{
			title:title,
			category:category,
			info:info,
			content:content
		},function(err){
			if (err) {
				responseData.code=3;
				responseData.message='修改失败';
			}else{
				responseData.message='修改成功';
			}
			res.json(responseData);
		});
	});
});
// 删除文章
router.post('/article/delArticle',function(req,res,next){
	var _id=req.body._id;
	// 文章是否存在
	Article.findOne({
		_id:_id
	}).then(function(categoryInfo){
		if (!categoryInfo) {
			responseData.code=1;
			responseData.message='文章不存在';
			res.json(responseData);
			return;
		}
		// 删除文章对应的评论
		Comment.remove({
			articleId:_id
		},function(err){
			if (err) {
				responseData.code=2;
				responseData.message='删除失败';
				res.json(responseData);
			}else{
				// 删除文章
				Article.remove({
					_id:_id
				},function(err){
					if (err) {
						responseData.code=3;
						responseData.message='删除失败';
					}else{
						responseData.message='删除成功';
					}
					res.json(responseData);
				});
			}
		});
	});
});

// 获取评论列表
router.post('/comment/getCommentList',function(req,res,next){
	var articleId=req.body.articleId||'';
	var filter=articleId?{articleId:articleId}:{};
	Comment.count(function(err,count){
		responseData.tag=count||0;
		Comment.where(filter).find().sort({_id:-1}).populate('articleId').then(function(comments){
			responseData.value=comments||[];
			res.json(responseData);
		});
	});
});
// 添加评论
router.post('/comment/addComment',function(req,res,next){
	var articleId=req.body.articleId||'',
		content=req.body.content||'',
		createTime=dateFormat(new Date(),'yyyy-mm-dd HH:MM:ss');
	// 目标文章是否为空
	if (articleId==='') {
		responseData.code=1;
		responseData.message='评论失败，文章不存在';
		res.json(responseData);
		return;
	}
	// 评论是否为空
	if (content==='') {
		responseData.code=2;
		responseData.message='评论内容不能为空';
		res.json(responseData);
		return;
	}
	// 文章是否存在
	Article.findOne({
		_id:articleId
	}).then(function(articleInfo){
		if (!articleInfo) {
			responseData.code=3;
			responseData.message='评论失败，文章不存在';
			res.json(responseData);
			return;
		}
		// 将评论信息保存到数据库中
		var comment=new Comment({
			articleId:articleId,
			username:req.userInfo.username,
			content:content,
			createTime:createTime
		});
		comment.save(function(){
			articleInfo.commentCount++;
			articleInfo.save();
			responseData.message='评论成功';
			res.json(responseData);
		});
	});
});
// 修改评论
router.post('/comment/editComment',function(req,res,next){
	var _id=req.body._id||'',
		content=req.body.content||'';
	// 评论是否为空
	if (content==='') {
		responseData.code=1;
		responseData.message='修改失败，评论内容不能为空';
		res.json(responseData);
		return;
	}
	// 评论是否存在
	Comment.findOne({
		_id:_id
	}).then(function(commentInfo){
		if (!commentInfo) {
			responseData.code=2;
			responseData.message='修改失败，该评论可能已被删除';
			res.json(responseData);
			return;
		}
		Comment.update({
			_id:_id
		},{
			content:content
		},function(err){
			if (err) {
				responseData.code=3;
				responseData.message='修改失败';
			}else{
				responseData.message='修改成功';
			}
			res.json(responseData);
		});
	});
});
// 删除评论
router.post('/comment/delComment',function(req,res,next){
	var _id=req.body._id;
	// 评论是否存在
	Comment.findOne({
		_id:_id
	}).then(function(commentInfo){
		if (!commentInfo) {
			responseData.code=1;
			responseData.message='评论不存在';
			res.json(responseData);
			return;
		}
		Comment.remove({
			_id:_id
		},function(err){
			if (err) {
				responseData.code=2;
				responseData.message='删除失败';
			}else{
				responseData.message='删除成功';
			}
			res.json(responseData);
		});
	});
});

module.exports=router;