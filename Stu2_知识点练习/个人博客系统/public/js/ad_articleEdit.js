var vm=new Vue({
	el:'#app',
	delimiters: ['${', '}'],
	data:{
		editFinished:false,
		title:'',
		category:'',
		info:'',
		content:''
	},
	computed:{
		_id:function(){
			var params=GetUrlParams();
			return params._id||'';
		}
	},
	mounted:function(){
		this.$nextTick(function(){
            InitAdminMenu();
            this.GetArticle();
		});
	},
	methods:{
		GetArticle:function(){
			if (this._id==='') {
				Warning("系统提示", '文章不存在');
				setTimeout(function(){
					location.href='/admin/articles?g1=3&g2=0';
				},3000);
				return;
			}
			axios.post('/api/article/getArticle',{
				_id:this._id,
				all:true
			}).then(function(res){
				if (!res.data.code) {
					vm.title=res.data.value.title;
					vm.category=res.data.value.category;
					vm.info=res.data.value.info;
					vm.content=res.data.value.content;
				}else{
					Warning("系统提示", res.data.message);
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		EditArticle:function(){
			if (this.title===''||this.category==='') {
				Warning("系统提示", '标题或分类不能为空');
				return;
			}
			axios.post('/api/article/editArticle',{
				_id:this._id,
				title:this.title,
				category:this.category,
				info:this.info,
				content:this.content
			}).then(function(res){
				Warning("系统提示", res.data.message);
				if (!res.data.code) {
					vm.editFinished=true;
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		Logout:Logout
	}
});