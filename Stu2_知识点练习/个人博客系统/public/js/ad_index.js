var vm=new Vue({
	el:'#app',
	delimiters: ['${', '}'],
	data:{},
	mounted:function(){
		this.$nextTick(function(){
            InitAdminMenu();
		});
	},
	methods:{
		Logout:Logout
	}
});