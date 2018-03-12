var vm=new Vue({
	el:'#app',
	delimiters: ['${', '}'],
	data:{
		pageIndex:1,
        pageSize:20,
        TableTimer:null
	},
	mounted:function(){
		this.$nextTick(function(){
			$("#comments_table").bootstrapTable(options);
			$(window).on("resize",function(){
                clearTimeout(vm.TableTimer);
                vm.TableTimer=setTimeout(function(){
                    $("#comments_table").bootstrapTable("resetView",{height:$(".blog_admin_content").height()});
                },50);
            });
            this.GetCommentList();
            InitAdminMenu();
		});
	},
	methods:{
		GetCommentList:function(){
			axios.post('/api/comment/getCommentList',{
				pageIndex:this.pageIndex,
				pageSize:this.pageSize
			}).then(function(res){
				if (!res.data.code) {
					if (vm.pageIndex>1 && res.data.value.length===0) {
						$("#comments_table").bootstrapTable('selectPage',1);
					}else{
						$("#comments_table").bootstrapTable("load",res.data);
					}
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		DelComment:function(){
			var rows = $('#comments_table').bootstrapTable('getSelections');
			axios.post('/api/comment/delComment',{
				_id:rows[0]._id
			}).then(function(res){
				Warning("系统提示", res.data.message);
				if (!res.data.code) {
					vm.GetCommentList();
					$('#del_comment').modal('hide');
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		CallCommentPopWin:function(type){
			var rows = $('#comments_table').bootstrapTable('getSelections');
			if (type==='del') {
				if (rows == null || rows.length === 0) {
					Warning("系统提示", "请选择要删除的评论");
					return;
				}
				$('#del_comment').modal('show');
			}
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
        {title:'发布者', field:'username',align:"center",width:'10%'},
        {title:'所属文章', field:'articleId',align:"center",width:'20%',formatter:function(value,rec,rowIndex){
        	value=value||{};
            return value.title||'';
        }},
        {title:'创建时间', field:'createTime',align:"center",width:'20%'},
        {title:'内容', field:'content',align:"center"}
    ],
    onPageChange:function(number, size){
        vm.pageIndex=number;
        vm.pageSize=size;
        vm.GetCommentList();
    }
};