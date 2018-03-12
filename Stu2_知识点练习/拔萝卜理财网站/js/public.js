var ServerUrl = "/baluobo/";
/* 判断用户是否登录 start */
var cookie_mobile = $.cookie("cookie_mobile");
var cookie_uid = $.cookie("cookie_uid");
var UserModel;
if (cookie_uid != "" && cookie_uid != undefined) {
    $.ajax({
        type: "POST",
        data: {
            userId: cookie_uid,
            r: Math.random()
        },
        url: "/baluobo/user/queryById.do",
        async: false,
        dataType: "json",
        success: function(mss, textStatus, jqXHR) {
            if (mss.success) {
                UserModel = mss.rows;
                var a = location.href;
                var b = a.split("/");
                var c = b.slice(b.length - 1, b.length).toString().split(".");
                var pagename = c.slice(0, 1);
                if (pagename != "login" && pagename != "register") {
                    if (UserModel.userName != "" && UserModel.userName != null) {
                        $(".headNav li.onLogin").html("欢迎<strong>" + mss.rows.userName + '</strong>来到拔萝卜！<a href="javascript:logout();">[退出]</a>|');
                    } else {
                        $(".headNav li.onLogin").html("欢迎<strong>" + mss.rows.mobile + '</strong>来到拔萝卜！<a href="javascript:logout();">[退出]</a>|');
                    }
                    $(".headNav li.toRegister").remove();
                    if (pagename == "index"){
                        $(".headBanner .goRegLogin>p:eq(2)>a").html("立即投资").attr("href","invest/toFinance.html");
                        $(".headBanner .goRegLogin>p:eq(3)").hide();
                    }
                }else if (cookie_uid != null && cookie_uid != undefined) {
				    $(".popWin,.mask").show();
					$(".popWinTitle").html("温馨提示");
					$(".popWin .content>p").html("请先退出登录");
				    $(".popWin .closeBtn").on("click",function(){
                        location.href = "myAccount/myAccount.html";
                    });
                }
            }
        }
    })
};
/* 判断用户是否登录 end */
/* 微信公众号弹窗 start */
$(".headNav .icon-weixin-disc,.fixedSideBar .icon-weixin").on("mouseover",function(){
	$(this).find(".weixinPopWin").show();
}).on("mouseout",function(){
	$(this).find(".weixinPopWin").hide();
});
/* 微信公众号弹窗 end */
/* APP二维码弹窗 start */
$(".fixedSideBar .icon-qr-code").on("mouseover",function(){
	$(this).find(".appQrCode").show();
}).on("mouseout",function(){
	$(this).find(".appQrCode").hide();
});
/* APP二维码弹窗 end */
/* 回到顶部 start */
function backTop(){
	$(window).scroll(function(){
		if($(window).scrollTop() > 400){
			$(".fixedSideBar").css({"display":"block"});
		}else{
			$(".fixedSideBar").css({"display":"none"});
		}
	});
	$(".backTop").on("click",function(){
		$("html,body").animate({
			scrollTop:"0"
		},500);
	});
}
backTop();
/* 回到顶部 end */
/* 关闭弹窗 start */
$(".popWin .closeBtn").on("click",function(){
	$(".popWin").hide();
	$(".mask").hide();
});
/* 关闭弹窗 end */
/* 回车提交表单 start */
function enterKeyEvent(){
	$(document).on("keydown",function(e){
		if (e.which==13) {
			$(".submitBtn").click();
		};
	});
}
/* 回车提交表单 end */
/* 退出登录函数 start */
function logout() {
    var a = location.href;
    var b = a.split("/");
    var c = b.slice(b.length - 1, b.length).toString().split(".");
    var pagename = c.slice(0, 1);
    if (pagename != "login" && pagename != "register" && pagename !="index") {
        $.cookie("cookie_uid", null,{ path:'/'});
        $.cookie("cookie_uid", null,{ path:'/baluobo/blb2016'});
        $.cookie("cookie_uid", null,{ path:'/baluobo/blb2016/'});
        $.cookie("cookie_userName", null,{ path:'/'});
        $.cookie("cookie_userName", null,{ path:'/baluobo/blb2016'});
        $.cookie("cookie_userName", null,{ path:'/baluobo/blb2016/'});
        $.cookie("cookie_mobile", null,{ path:'/'});
        $.cookie("cookie_mobile", null,{ path:'/baluobo/blb2016'});
        $.cookie("cookie_mobile", null,{ path:'/baluobo/blb2016/'});
        location.href = "../login.html";
    }else{
        $.cookie("cookie_uid", null);
        $.cookie("cookie_userName", null);
        $.cookie("cookie_mobile", null);
        location.href = "login.html";
    }
}
/* 退出登录函数 end */
/* 防止网页被别人（允许自己）嵌入框架的代码 start */
try{
　　top.location.hostname;
　　if (top.location.hostname != window.location.hostname) {
　　　　top.location.href =window.location.href;
　　}
}
catch(e){
　　top.location.href = window.location.href;
}
/* 防止网页被别人（允许自己）嵌入框架的代码 end */
/* 获取导航栏开始理财菜单 start */
function getFinanceNav(){
    $.ajax({
            type : "post",
            data : {
                r : Math.random()
            },
            url : ServerUrl + "goodClass/queryAll.do",
            async : true,
            dataType : "json",
            success : function(Mess) {
                var listhtml="";
                var a = location.href;
                var b = a.split("/");
                var c = b.slice(b.length - 1, b.length).toString().split(".");
                var pagename = c.slice(0, 1);
                if (pagename != "login" && pagename != "register" && pagename !="index") {
                    for (var i = 0; i < Mess.rows.length; i++) {
                         listhtml +='<a href="../invest/toFinance.html?gcId='+Mess.rows[i].goodClassId+'">'+Mess.rows[i].gcName+'</a>';
                    }
                }else{
                    for (var i = 0; i < Mess.rows.length; i++) {
                         listhtml +='<a href="invest/toFinance.html?gcId='+Mess.rows[i].goodClassId+'">'+Mess.rows[i].gcName+'</a>';
                    }    
                }
                $("#financeItems").html(listhtml);
            }
        });  
}
getFinanceNav();
/* 获取导航栏开始理财菜单 end */