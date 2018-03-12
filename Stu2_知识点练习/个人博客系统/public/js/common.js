// 退出登录
function Logout(){
    axios.post('/api/user/logout').then(function(res){
        location.reload();
    }).catch(function(err){
        console.log(err);
    });
}

// 提示消息
function Warning(title, message) {
    $("#blog_popwin_warning .panel-title").html(title);
    $("#blog_popwin_warning .panel-body").html(message);
    $("#blog_popwin_warning").animate({
        "bottom":"-1rem"
    },1000,function(){
        setTimeout(function(){
            $("#blog_popwin_warning").animate({
                "bottom":"-11rem"
            },1000);
        },1000);
    });
}

// 获取url中的参数
function GetUrlParams(){
    var params={};
    var paramArr=location.search.substr(1).split("&");
    for (var i = 0; i < paramArr.length; i++) {
        var paramItem=paramArr[i].split("=");
            params[paramItem[0]]=paramItem[1];
    }
    return params;
}

// 后台管理左侧菜单栏
function InitAdminMenu(){
    // 初始化菜单栏显示效果
    var params=GetUrlParams();
    var grade1=parseInt(params.g1||0);
    var grade2=parseInt(params.g2||0);
    if ($('.nav-list>li').eq(grade1).hasClass('isParent')) {
        $('.nav-list>li').eq(grade1).addClass('active open').find('li').eq(grade2).addClass('active');
    }else{
        $('.nav-list>li').eq(grade1).addClass('active');
    }
    // 事件绑定
    $('.nav-list>li').click(function(){
        // 分析active状态
        $(this).siblings().removeClass('active open').find('active').removeClass('active open');
        $(this).addClass('active');
        // 分析open状态
        if ($(this).hasClass('isParent')) {
            if ($(this).hasClass('open')) {
                $(this).removeClass('open');
            }else{
                $(this).addClass('open');
            }
        }
    });
    $('.nav-list .submenu').click(function(e){
        e=e||window.event;
        e.stopPropagation();
    });
}