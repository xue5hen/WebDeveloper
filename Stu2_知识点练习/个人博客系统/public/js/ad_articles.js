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
			$("#articles_table").bootstrapTable(options);
			$(window).on("resize",function(){
                clearTimeout(vm.TableTimer);
                vm.TableTimer=setTimeout(function(){
                    $("#articles_table").bootstrapTable("resetView",{height:$(".blog_admin_content").height()});
                },50);
            });
            this.GetArticleList();
            InitAdminMenu();
		});
	},
	methods:{
		GetArticleList:function(){
			axios.post('/api/article/getArticleList',{
				pageIndex:this.pageIndex,
				pageSize:this.pageSize
			}).then(function(res){
				if (!res.data.code) {
					if (vm.pageIndex>1 && res.data.value.length===0) {
						$("#articles_table").bootstrapTable('selectPage',1);
					}else{
						$("#articles_table").bootstrapTable("load",res.data);
					}
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		DelArticle:function(){
			var rows = $('#articles_table').bootstrapTable('getSelections');
			axios.post('/api/article/delArticle',{
				_id:rows[0]._id
			}).then(function(res){
				Warning("系统提示", res.data.message);
				if (!res.data.code) {
					vm.GetArticleList();
					$('#del_article').modal('hide');
				}
			}).catch(function(err){
				console.log(err);
			});
		},
		CallArticlePopWin:function(type){
			var rows = $('#articles_table').bootstrapTable('getSelections');
			if (type==='edit') {
				if (rows == null || rows.length === 0) {
					Warning("系统提示", "请选择要修改的文章");
					return;
				}
				location.href='/admin/articleEdit?g1=3&g2=2&_id='+rows[0]._id;
			}else if (type==='del') {
				if (rows == null || rows.length === 0) {
					Warning("系统提示", "请选择要删除的文章");
					return;
				}
				$('#del_article').modal('show');
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
        {title:'标题', field:'title',align:"center"},
        {title:'分类', field:'category',align:"center",width:'12%',formatter:function(value,rec,rowIndex){
        	value=value||{};
            return value.categoryname||'';
        }},
        {title:'作者', field:'author',align:"center",width:'12%',formatter:function(value,rec,rowIndex){
        	value=value||{};
            return value.username||'未知';
        }},
        {title:'创建时间', field:'createTime',align:"center",width:'20%'},
        {title:'评论', field:'commentCount',align:"center",width:'10%'},
        {title:'阅读', field:'readCount',align:"center",width:'10%'}
    ],
    onPageChange:function(number, size){
        vm.pageIndex=number;
        vm.pageSize=size;
        vm.GetArticleList();
    }
};