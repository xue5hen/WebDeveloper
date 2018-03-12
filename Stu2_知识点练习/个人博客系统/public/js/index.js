var article={
	title:'',author:'',info:'',content:'',
	createTime:'',readCount:0,commentCount:0,infoimg:''
};
var articleBak=$.extend(true,{},article);
var vm=new Vue({
	el:'#app',
	delimiters: ['${', '}'],
	data:{
		username:'',
		password:'',
		repassword:'',
		regMsg:'',
		loginMsg:'',
		rightPanel:1,
		filter:'',
		keyword:'',
		IsReadArticle:false,
		pageSize:5,
		pageCount:1,
		pageIndex:1,
		articles:[],
		article:article,
		commentText:'',
		comments:[]
	},
	mounted:function(){
		this.$nextTick(function(){
			this.Init();
			window.addEventListener('popstate',function(){
				vm.Init();
			});
		});
	},
	methods:{
		Init:function(){
			var params=GetUrlParams();
			var articleId=params.articleId||'';
			this.pageIndex=params.p||1;
			if (articleId) {
				this.GetArticle(articleId);
			}else{
				this.GetArticleList({});
			}
		},
		GetArticleList:function(options){
			history.pushState({title:document.title},document.title,location.href);
			history.replaceState(null, document.title, location.href.split('?')[0]);
			this.IsReadArticle=false;
			this.filter=options.filter||'';
			if (!options.keyword) {this.keyword='';}
			switch(options.pageDirec){
				case -1:
					vm.pageIndex=Math.max(--vm.pageIndex,1);
					break;
				case 1:
					vm.pageIndex=Math.min(++vm.pageIndex,vm.pageCount);
					break;
				case 2:
					vm.pageIndex=vm.pageCount;
					break;
				default:
					vm.pageIndex=1;
					break;
			}
			axios.post('/api/article/getArticleList',{
				pageIndex:this.pageIndex,
				pageSize:this.pageSize,
				filter:this.filter,
				keyword:this.keyword,
				needInfo:true
			}).then(function(res){
				if (!res.data.code) {
					vm.articles=res.data.value||[];
					vm.pageCount=Math.ceil((res.data.tag||1)/vm.pageSize);
					vm.pageIndex=Math.min(vm.pageIndex,vm.pageCount);
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		/*GetArticle:function(_id){
			history.pushState({title:document.title},document.title,location.href);
			history.replaceState(null, document.title, location.href.split('?')[0]+'?articleId='+_id);
			this.article=$.extend(true,{},articleBak);
			this.pageIndex=1;
			this.IsReadArticle=true;
			setTimeout(function(){
				axios.post('/api/article/getArticle',{
					_id:_id,
					all:true
				}).then(function(res){
					if (!res.data.code) {
						vm.article=res.data.value||vm.article;
						vm.GetCommentList(_id);
					}
				}).catch(function(err){
					console.log(err);
				});
			},0);
		},*/
		// 2018.01.23 使用“来必力”评论方案
		GetArticle:function(_id){
			history.pushState({title:document.title},document.title,location.href);
			history.replaceState(null, document.title, location.href.split('?')[0]+'?articleId='+_id);
			this.article=$.extend(true,{},articleBak);
			this.pageIndex=1;
			setTimeout(function(){
				axios.post('/api/article/getArticle',{
					_id:_id,
					all:true
				}).then(function(res){
					if (!res.data.code) {
						vm.article=res.data.value||vm.article;
						var livere=$('#lv-container');
						if ($('#lv-container iframe').length>0) {
							$('#lv-container iframe').attr('src','https://livere.me/comment/city?id='+livere.data('id')+'&refer='+location.href+'&uid='+livere.data('uid')+'&site='+location.href+'&title='+vm.article.title);
						}else{
							livere.data('refer',location.href);
						}
						setTimeout(function(){vm.IsReadArticle=true;},300);
					}
				}).catch(function(err){
					console.log(err);
				});
			},0);
		},
		SearchArticle:function(){
			this.GetArticleList({
				"filter":this.filter,
				"keyword":this.keyword,
				"pageDirec":0
			});
		},
		GetCommentList:function(_id){
			axios.post('/api/comment/getCommentList',{
				articleId:_id
			}).then(function(res){
				if (!res.data.code) {
					vm.comments=res.data.value||[];
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		AddComment:function(){
			if (this.commentText==='') {
				Warning('系统提示', '评论内容不能为空');
				return;
			}
			axios.post('/api/comment/addComment',{
				articleId:this.article._id,
				content:this.commentText
			}).then(function(res){
				if (!res.data.code) {
					vm.commentText='';
					vm.GetCommentList(vm.article._id);
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		UserRegister:function(){
			if (this.username==='') {
				Warning('系统提示', '用户名不能为空');
				return;
			}else if (this.password==='') {
				Warning('系统提示', '密码不能为空');
				return;
			}else if (this.password!==this.repassword) {
				Warning('系统提示', '两次输入的密码不一致');
				return;
			}
			axios.post('/api/user/register',{
				username:this.username,
				password:this.password,
				repassword:this.repassword
			}).then(function(res){
				vm.regMsg=res.data.message;
				if (!res.data.code) {
					setTimeout(function(){
						vm.username='';
						vm.password='';
						vm.repassword='';
						vm.rightPanel=1;
						vm.regMsg='';
					},1000);
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		UserLogin:function(){
			if (this.username==='') {
				Warning('系统提示', '用户名不能为空');
				return;
			}else if (this.password==='') {
				Warning('系统提示', '密码不能为空');
				return;
			}
			axios.post('/api/user/login',{
				username:this.username,
				password:this.password
			}).then(function(res){
				vm.loginMsg=res.data.message;
				if (!res.data.code) {
					setTimeout(function(){
						location.reload();
					},500);
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		Logout:Logout
	}
});