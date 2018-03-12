var vm=new Vue({
	el:'#app',
	delimiters: ['${', '}'],
	data:{
		user:{
			_id:'',
			username:'',
			password:'',
			isAdmin:0
		},
		pageIndex:1,
        pageSize:20,
        IsAddUser:true,
        TableTimer:null
	},
	mounted:function(){
		this.$nextTick(function(){
			$("#users_table").bootstrapTable(options);
			$(window).on("resize",function(){
                clearTimeout(vm.TableTimer);
                vm.TableTimer=setTimeout(function(){
                    $("#users_table").bootstrapTable("resetView",{height:$(".blog_admin_content").height()});
                },50);
            });
            this.GetUserList();
            InitAdminMenu();
		});
	},
	methods:{
		GetUserList:function(){
			axios.post('/api/user/getUserList',{
				pageIndex:this.pageIndex,
				pageSize:this.pageSize
			}).then(function(res){
				if (!res.data.code) {
					if (vm.pageIndex>1 && res.data.value.length===0) {
						$("#users_table").bootstrapTable('selectPage',1);
					}else{
						$("#users_table").bootstrapTable("load",res.data);
					}
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		AddUser:function(){
			if (this.user.username===''||this.user.password==='') {
				Warning("系统提示", '用户名或密码不能为空');
				return;
			}
			axios.post('/api/user/addUser',{
				username:this.user.username,
				password:this.user.password,
				isAdmin:this.user.isAdmin,
			}).then(function(res){
				Warning("系统提示", res.data.message);
				if (!res.data.code) {
					vm.GetUserList();
					$('#add_user').modal('hide');
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		EditUser:function(){
			if (this.user.username===''||this.user.password==='') {
				Warning("系统提示", '用户名或密码不能为空');
				return;
			}
			axios.post('/api/user/editUser',{
				_id:this.user._id,
				username:this.user.username,
				password:this.user.password,
				isAdmin:this.user.isAdmin,
			}).then(function(res){
				Warning("系统提示", res.data.message);
				if (!res.data.code) {
					vm.GetUserList();
					$('#add_user').modal('hide');
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		DelUser:function(){
			var rows = $('#users_table').bootstrapTable('getSelections');
			axios.post('/api/user/delUser',{
				_id:rows[0]._id
			}).then(function(res){
				Warning("系统提示", res.data.message);
				if (!res.data.code) {
					vm.GetUserList();
					$('#del_user').modal('hide');
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		CallUserPopWin:function(type){
			var rows = $('#users_table').bootstrapTable('getSelections');
			if (type==='add') {
				this.IsAddUser=true;
				this.user.username='';
				this.user.password='';
				this.user.isAdmin=0;
				$('#add_user').modal('show');
			}else if (type==='edit') {
				this.IsAddUser=false;
				if (rows == null || rows.length === 0) {
					Warning("系统提示", "请选择要修改的用户");
					return;
				}
				this.user._id=rows[0]._id;
				this.user.username=rows[0].username;
				this.user.password=rows[0].password;
				this.user.isAdmin=rows[0].isAdmin?1:0;
				$('#add_user').modal('show');
			}else if (type==='del') {
				if (rows == null || rows.length === 0) {
					Warning("系统提示", "请选择要删除的用户");
					return;
				}
				$('#del_user').modal('show');
			}
		},
		SubmitUserInfo:function(){
			this.IsAddUser?this.AddUser():this.EditUser();
		},
		Logout:Logout
	}
});

// 数据表格
var options={
    sidePagination:"server",
    pagination:true,
    pageSize:vm.pageSize,
    pageList:[20, 30, 50, 100],
    toolbar:"#tb",
    height:$(".blog_admin_content").height(),
    totalField:'tag',
    dataField:"value",
    undefinedText: '',
    clickToSelect:true,
    singleSelect:true,
    checkboxHeader:false,
    columns:[
        {checkbox:true,align:"center",width:40},
        {title:'ID', field:'_id',align:"center",width:'20%'},
        {title:'用户名', field:'username',align:"center",width:'15%'},
        {title:'密码', field:'password',align:"center",width:'20%'},
        {title:'是否是管理员', field:'isAdmin',align:"center",width:'15%',formatter:function(value,rec,rowIndex){
            return value?'是':'';
        }},
        {title:'创建时间', field:'createTime',align:"center"}
    ],
    onPageChange:function(number, size){
        vm.pageIndex=number;
        vm.pageSize=size;
        vm.GetUserList();
    }
};