document.writeln('<div class="header clearfix">');
document.writeln('<div class="headNav">');
document.writeln('<div class="wrapper">');
document.writeln('<ul class="fr">');
/* 判断用户是否登录 start */
var cookie_uid = $.cookie("cookie_uid");
var cookie_userName = $.cookie("cookie_userName");
var cookie_mobile = $.cookie("cookie_mobile");
if (cookie_uid != "" && cookie_uid != undefined && cookie_uid != null) {
    if (cookie_userName != "" && cookie_userName != null) {
        document.writeln('<li class="onLogin">欢迎<strong>' + cookie_userName + '</strong>来到拔萝卜！<a href="javascript:logout();">[退出]</a>|</li>');
    } else {
    	document.writeln('<li class="onLogin">欢迎<strong>' + cookie_mobile + '</strong>来到拔萝卜！<a href="javascript:logout();">[退出]</a>|</li>');
    }
}else{
	document.writeln('<li class="onLogin"><a href="../login.html"><em>登录</em></a>|</li>');
	document.writeln('<li class="toRegister"><a href="../register.html"><em>注册</em></a>|</li>');
}
/* 判断用户是否登录 end */
document.writeln('<li><a href="../help/NoviceGuide.html">新手帮助</a>|</li>');
document.writeln('<li><a href="../about/about.html">关于我们</a>|</li>');
document.writeln('<li><a href="../invest/DownloadPage.html" target="_blank"><span class="icon-mobile"></span> 手机APP</a></li>');
document.writeln('</ul>');
document.writeln('<p class="fl">');
document.writeln('<a href="http://weibo.com/u/5662479711" target="_blank"><span class="icon-sina-disc"></span></a>');
document.writeln('<a href="javascript:void(0);"><span class="icon-weixin-disc"><i class="weixinPopWin"></i></span></a>');
document.writeln('客服热线： <em>400-825-8626</em> (周一至周五，9:00~18:00)');
document.writeln('</p>');
document.writeln('</div>');
document.writeln('</div>');
document.writeln('<div class="headMenu">');
document.writeln('<div class="wrapper">');
document.writeln('<ul class="fr">');
document.writeln('<li><a href="../index.html">首页</a></li>');
document.writeln('<li><a href="../invest/toFinance.html">开始理财</a>');
document.writeln('<div class="items" id="financeItems"></div></li>');
document.writeln('<li><a href="../invest/iHaveBills.html">我有票据</a></li>');
document.writeln('<li><a href="../invest/ProductIntroduce.html">产品介绍</a></li>');
document.writeln('<li>');
document.writeln('<a href="../about/about.html">关于拔萝卜</a>');
document.writeln('<div class="items">');
document.writeln('<a href="../about/about.html?index=1">关于拔萝卜</a>');
document.writeln('<a href="../about/about.html?index=2">安全保障</a>');
document.writeln('<a href="../about/about.html?index=3">媒体报道</a>');
document.writeln('<a href="../about/about.html?index=4">招贤纳士</a>');
document.writeln('<a href="../about/about.html?index=5">联系我们</a>');
document.writeln('</div>');
document.writeln('</li>');
document.writeln('<li>');
document.writeln('<a href="../myAccount/myAccount.html">我的账户</a>');
document.writeln('<div class="items">');
document.writeln('<a href="../myAccount/myAccount.html?index=1">账户主页</a>');
document.writeln('<a href="../myAccount/myAccount.html?index=2">银行卡管理</a>');
document.writeln('<a href="../myAccount/myAccount.html?index=3">萝卜币管理</a>');
document.writeln('<a href="../myAccount/myAccount.html?index=4">消息中心</a>');
document.writeln('<a href="../myAccount/myAccount.html?index=5">更多设置</a>');
document.writeln('<a href="../myAccount/myAccount.html?index=6">活动中心</a>');
document.writeln('</div>');
document.writeln('</li>');
document.writeln('</ul>');
document.writeln('</div>');
document.writeln('</div>');
document.writeln('</div>');
