var vm=new Vue({
	el:'#app',
	delimiters: ['${', '}'],
	data:{
		category:{
			_id:'',
			name:'',
			remark:''
		},
		pageIndex:1,
        pageSize:20,
        IsAddCategory:true,
        TableTimer:null
	},
	mounted:function(){
		this.$nextTick(function(){
			$("#categories_table").bootstrapTable(options);
			$(window).on("resize",function(){
                clearTimeout(vm.TableTimer);
                vm.TableTimer=setTimeout(function(){
                    $("#categories_table").bootstrapTable("resetView",{height:$(".blog_admin_content").height()});
                },50);
            });
            this.GetCategoryList();
            InitAdminMenu();
		});
	},
	methods:{
		GetCategoryList:function(){
			axios.post('/api/category/getCategoryList',{
				pageIndex:this.pageIndex,
				pageSize:this.pageSize
			}).then(function(res){
				if (!res.data.code) {
					if (vm.pageIndex>1 && res.data.value.length===0) {
						$("#categories_table").bootstrapTable('selectPage',1);
					}else{
						$("#categories_table").bootstrapTable("load",res.data);
					}
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		AddCategory:function(){
			if (this.category.name==='') {
				Warning("系统提示", '分类名不能为空');
				return;
			}
			axios.post('/api/category/addCategory',{
				categoryname:this.category.name,
				remark:this.category.remark
			}).then(function(res){
				Warning("系统提示", res.data.message);
				if (!res.data.code) {
					vm.GetCategoryList();
					$('#add_category').modal('hide');
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		EditCategory:function(){
			if (this.category.name==='') {
				Warning("系统提示", '分类名不能为空');
				return;
			}
			axios.post('/api/category/editCategory',{
				_id:this.category._id,
				categoryname:this.category.name,
				remark:this.category.remark
			}).then(function(res){
				Warning("系统提示", res.data.message);
				if (!res.data.code) {
					vm.GetCategoryList();
					$('#add_category').modal('hide');
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		DelCategory:function(){
			var rows = $('#categories_table').bootstrapTable('getSelections');
			axios.post('/api/category/delCategory',{
				_id:rows[0]._id
			}).then(function(res){
				Warning("系统提示", res.data.message);
				if (!res.data.code) {
					vm.GetCategoryList();
					$('#del_category').modal('hide');
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		CallCategoryPopWin:function(type){
			var rows = $('#categories_table').bootstrapTable('getSelections');
			if (type==='add') {
				this.IsAddCategory=true;
				this.category.name='';
				this.category.remark='';
				$('#add_category').modal('show');
			}else if (type==='edit') {
				this.IsAddCategory=false;
				if (rows == null || rows.length === 0) {
					Warning("系统提示", "请选择要修改的分类");
					return;
				}
				this.category._id=rows[0]._id;
				this.category.name=rows[0].categoryname;
				this.category.remark=rows[0].remark;
				$('#add_category').modal('show');
			}else if (type==='del') {
				if (rows == null || rows.length === 0) {
					Warning("系统提示", "请选择要删除的分类");
					return;
				}
				$('#del_category').modal('show');
			}
		},
		SubmitCategoryInfo:function(){
			this.IsAddCategory?this.AddCategory():this.EditCategory();
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
        {title:'分类名', field:'categoryname',align:"center",width:'15%'},
        {title:'备注', field:'remark',align:"center"}
    ],
    onPageChange:function(number, size){
        vm.pageIndex=number;
        vm.pageSize=size;
        vm.GetCategoryList();
    }
};