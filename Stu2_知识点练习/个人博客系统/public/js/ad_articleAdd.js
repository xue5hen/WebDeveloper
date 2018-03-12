var vm=new Vue({
	el:'#app',
	delimiters: ['${', '}'],
	data:{
		addFinished:false,
		title:'',
		category:'',
		info:'',
		content:''
	},
	mounted:function(){
		this.$nextTick(function(){
            InitAdminMenu();
		});
	},
	methods:{
		AddArticle:function(){
			if (this.title===''||this.category==='') {
				Warning("系统提示", '标题或分类不能为空');
				return;
			}
			axios.post('/api/article/addArticle',{
				title:this.title,
				category:this.category,
				info:this.info,
				content:this.content
			}).then(function(res){
				Warning("系统提示", res.data.message);
				if (!res.data.code) {
					vm.title="";
					vm.category="";
					vm.info="";
					vm.content="";
					vm.addFinished=true;
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		Logout:Logout
	}
});