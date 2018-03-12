var ServerUrl = "/baluobo/";
var PicUrl = "http://baluobo-zxtc.imwork.net:12178/";

/* 获取网址中的参数 start */
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2])
	}
	return null
}
/* 获取网址中的参数 end */
/* 字符串处理·去除首尾的空格 start */
function removeStrSpace(str) {
	if (str != "") {
		return str.replace(/(^\s*)|(\s*$)/g, "")
	} else {
		return ""
	}
}
/* 字符串处理·去除首尾的空格 end */
/* 部分页面左侧列表TAB start */
$(".problemType>li,.projectList>li").on("click",function(){
	$(this).addClass("cur").siblings().removeClass("cur");
	$("#QATitle").html($(this).html());
});
/* 部分页面左侧列表TAB end */

/* 注册页 start */
/* 注册函数 start */
function onRegister() {
	var phone = removeStrSpace($("#phone").val());
	var vCode = removeStrSpace($("#vCode").val());
	var vCodeImg = $("#vCodeImg").attr("src");
	var pwd01 = $("#password01").val();
	var pwd02 = $("#password02").val();
	var mobileVCode = removeStrSpace($("#mobileVCode").val());
	var agreeId = $("#agree").is(":checked");
	var ph = /^1[345789]\d{9}$/gi;
	var message = "";
	if (phone == "") {
		message += "-请输入手机号码<br>";
	} else if (!ph.test(phone)) {
		message += "-请输入正确手机号码<br>";
	}
	if (vCode == "") {
		message += "-请输入验证码<br>";
	} else if("images/valid/"+vCode+".jpg"!=vCodeImg){
		message += "-验证码计算有误<br>";
	}
	if (pwd01 == "") {
		message += "-请输入密码<br>";
	} else if (pwd01.length < 6) {
		message += "-密码长度不能少于6位<br>";
	}
	if (mobileVCode == "") {
		message += "-请输入验证码<br>";
	}
	if (pwd01 != pwd02) {
		message += "-两次密码输入不一致<br>";
	}
	if (!agreeId) {
		message += "-需要同意《拔萝卜用户注册协议》";
	}
	if (message == "") {
		$(".submitBtn").val("提交中...");
		$(".submitBtn").attr("disabled", true);
		$.ajax({
			type : "POST",
			data : {
				passWord : hex_md5(pwd01),
				mobile : phone,
				validCode : mobileVCode,
				r : Math.random()
			},
			url : ServerUrl + "user/regist.do",
			async : true,
			dataType : "json",
			success : function(Mess, textStatus, jqXHR) {
				if (Mess.success) {
					$(".popWin,.mask").show();
					yima_register(phone);
					$(".popWin .closeBtn").on("click",function(){
						$(".popWin").hide();
						$(".mask").hide();
						location.href = "/login.html";
					});
				} else {
					$(".submitBtn").val("注 册");
					$(".submitBtn").attr("disabled", false);
					$(".popWin,.mask").show();
					$(".popWin .content>p").html(Mess.message);
				}
			}
		})
	} else {
		$(".popWin,.mask").show();
		$(".popWin .content>p").html(message);
	}
}
/* 注册函数 end */
/* 亿码注册户抄送 start */
function yima_register(yima_register_userid){
	var emar_adwe = document.cookie.match(new RegExp("(^| )" + "_adwe" + "=([^;]*)(;|$)"));
	if(emar_adwe != null){
		_adwq.push(['_setAction','8jgn9m',yima_register_userid]); 
	}
}
/* 亿码注册户抄送 end */
/* 更换验证码 start */
function changeValid(id){
	var imgArr=['47.jpg','51.jpg','9.jpg','77.jpg','86.jpg','8.jpg'];
	var luckyNum=parseInt(Math.random()*5);
	$("#"+id).attr("src","images/valid/"+imgArr[luckyNum]);
}
/* 更换验证码 end */
/* 发送手机验证码 start */
function sendMVCode(o) {
	var phone = removeStrSpace($("#phone").val());
	var ph = /^1[345789]\d{9}$/gi;
	var message = "";
	if (phone == "") {
		message += "-请输入手机号码<br>";
	} else if (!ph.test(phone)) {
		message += "-请输入正确手机号码<br>";
	}
	if (message == "") {
		$.ajax({
			type : "post",
			data : {
				mobile : phone,
				r : Math.random()
			},
			url : ServerUrl + "user/queryMobileVaild.do",
			async : true,
			dataType : "json",
			success : function(Mess) {
				$(".popWin,.mask").show();
				$(".popWin .content>p").html(Mess.message);
				time(o);
			}
		});
	} else {
		$(".popWin,.mask").show();
		$(".popWin .content>p").html(message);
	}
}
/* 发送手机验证码 end */
/* 手机验证码发送后等待时间 start */
var waitTime=60;
function time(o) {
	if (waitTime < 0) {
		o.removeAttribute("disabled");
		o.className="on";
		o.value="获取验证码";
		waitTime = 60;
	} else { 
		o.setAttribute("disabled", true);
		o.className="off";
		o.value="重新发送(" + waitTime + ")";
		waitTime--;
		setTimeout(function() {
			time(o);
		},1000);
	}
}
/* 手机验证码发送后等待时间 end */
/* 注册页 end */

/* 登录页 start */
/* 登录函数 start */
function onLogin() {
	var phone = removeStrSpace($("#phone").val());
	var pwd = $("#password").val();
	var rememberMe = $("#rememberMe").is(":checked");
	var message = "";
	var ph = /^1[345789]\d{9}$/gi;
	if (phone == "") {
		message += "-请输入手机号码<br>";
	} else if (!ph.test(phone)) {
		message += "-请输入正确手机号码<br>";
	}
	if (message == "") {
		$.ajax({
			type : "post",
			data : {
				mobile : phone,
				passWord : hex_md5(pwd),
				r : Math.random()
			},
			url : ServerUrl + "user/login.do",
			async : true,
			dataType : "json",
			success : function(Mess, status) {
				if (Mess.success) {
					if (rememberMe) {
						$.cookie("cookie_uid", Mess.rows.userId, {
							expires : 1
						});
						$.cookie("cookie_userName", Mess.rows.userName, {
							expires : 1
						});
						$.cookie("cookie_mobile", Mess.rows.mobile, {
							expires : 1
						});
					} else {
						$.cookie("cookie_uid", Mess.rows.userId);
						$.cookie("cookie_userName", Mess.rows.userName);
						$.cookie("cookie_mobile", Mess.rows.mobile);
						$("#phone").val("");
						$("#password").val("");
					}
					var ref = GetQueryString("ref");
					if (ref != undefined && ref != "") {
						location.href = ref;
					} else {
						location.href = "myAccount/myAccount.html";
					}
				} else {
					$(".popWin,.mask").show();
					$(".popWin .content>p").html(Mess.message);
				}
			}
		});
	} else {
		$(".popWin,.mask").show();
		$(".popWin .content>p").html(message);
	}
}
/* 登录函数 end */
/* 登录页 end */

/* 开始理财页 start */
/* 获取项目类型及当前项目列表 start */
function getProductCategory() {
	var gcId = 0;
	var gcId = GetQueryString("gcId");
	if (gcId == null || gcId.toString().length < 1) {
		gcId = -1;
	}
	$.ajax({
		type : "post",
		data : {
			r : Math.random()
		},
		url : ServerUrl + "goodClass/queryAll.do",
		async : true,
		dataType : "json",
		success : function(Mess) {
			var allNum = 0;
			for (var i = 0; i < Mess.rows.length; i++) {
				allNum += Mess.rows[i].sumCount;
				if (gcId == Mess.rows[i].goodClassId) {
					$(".projectList li").removeClass("cur");
					$(".projectList").append(
						'<li class="cur" onclick="javascript:location.href=\''
						+'toFinance.html?gcId='+Mess.rows[i].goodClassId+'\';"><span>'
						+Mess.rows[i].gcName+'</span><em>'+Mess.rows[i].sumCount+'</em></li>'
					);
				} else {
					$(".projectList").append(
						'<li onclick="javascript:location.href=\''
						+'toFinance.html?gcId='+Mess.rows[i].goodClassId+'\';"><span>'
						+Mess.rows[i].gcName+'</span><em>'+Mess.rows[i].sumCount+'</em></li>'
					);
				}
			}
			$("#allNum").html(allNum);
		}
	});
	getProductList(1);
}
/* 获取项目类型及当前项目列表 end */
/* 获取项目列表 start */
function getProductList(page) {
	var gcId = 0;
	var gcId = GetQueryString("gcId");
	if (gcId == null || gcId.toString().length < 1) {
		gcId = -1;
	}
	var procedflg = -1;
	var invertFlg = -1;
	var dl1 = "",
		dl2 = "";
	dl1 = $("#selectA").attr("val");
	dl2 = $("#selectB").attr("val");
	if (dl1 != "") {
		invertFlg = dl1;
	}
	if (dl2 != "") {
		procedflg = dl2;
	}
	$.ajax({
		type : "POST",
		data : {
			goodClassId : gcId,
			page : page,
			procedflg : procedflg,
			invertFlg : invertFlg,
			r : Math.random()
		},
		url : ServerUrl + "good/queryPage1.do",
		async : true,
		dataType : "json",
		success : function(Mess, textStatus, jqXHR) {
			if (Mess.success) {
				$(".projectItems .comingSoon").hide();
				$(".projectItems h2,.projectItems table,.projectItems .pagesBox").show();
				var prohtml = "";
				for (var i = 0; i < Mess.rows.length; i++) {
					prohtml += "<tr><td>"+Mess.rows[i].goodName+"</td><td></td><td></td><td><em>"+Mess.rows[i].payLabel+"</em></td></tr>";
					prohtml += "<tr><td><span><b>"+Mess.rows[i].proceeds+"</b> %</span><em>固定年化收益</em></td><td><span><b>";
					var _manageTime=Mess.rows[i].manageTime;
					if (Mess.rows[i].manageTime<0) {
						_manageTime=0;
					}
					prohtml += _manageTime+"</b> 天</span><em>距结息日</em></td><td><span><b>";
					var valuesTime = (Mess.rows[i].valuesTime).substr(0,10); //起息时间yyyy-MM-dd格式
					var valueTime = (Mess.rows[i].valueTime).substr(0,10);   //结息时间yyyy-MM-dd格式
					var valuedTime = (Mess.rows[i].valuedTime).substr(0,10); //到账时间yyyy-MM-dd格式
					getServerCurTime();
					var _surplusMoney=Mess.rows[i].surplusMoney;
					if(Mess.rows[i].gcId==13){
						_surplusMoney= Mess.rows[i].surplusMoney-(Mess.rows[i].buyMoney-Mess.rows[i].openMoney);
					}
					var _flag;
					if (Mess.rows[i].gcId==11 || Mess.rows[i].gcId==13) {
						_flag=dateCompare(now,valueTime);
					}else if (Mess.rows[i].gcId==5 || Mess.rows[i].gcId==10) {
						_flag=dateCompare(now,valuesTime);
					}
					if(_surplusMoney>0 && _flag<0){
						prohtml += (_surplusMoney / 10000).toFixed(2) + "万";
					}else{
						prohtml += "0.00万";
					}
					prohtml += "</b> 元</span><em>可投金额</em></td><td><a href=";
					if(_surplusMoney>0 && _flag<0){
						prohtml += "'productDetails.html?gid="+ Mess.rows[i].goodId + "&gcId="+ Mess.rows[i].gcId +"' class='gotoBuyIndex'>立即抢购";
					} else if(dateCompare(now,valuedTime)>=0) {
						prohtml += "'javascript:void(0);' class='gotoBuyIndex notAllowBuyIndex'>已还款";
					} else if(dateCompare(now,valuedTime)<0 && dateCompare(now,valueTime)>=0) {
						prohtml += "'javascript:void(0);' class='gotoBuyIndex notAllowBuyIndex'>还款中";
					} else {
						prohtml += "'javascript:void(0);' class='gotoBuyIndex notAllowBuyIndex'>已售罄";
					}
					prohtml += "</a></td></tr>";
				}
				$(".projectItems tbody").html(prohtml);
				var pageSize = 5;
				var pageCount = Math.ceil(Mess.total / pageSize);
				var pagehtml = "";
				if (page > 1) {
					pagehtml += '<a href="javascript:void(0)" onclick="getProductList('+ (page - 1) + ')" class="prev">上一页</a>';
				} else {
					pagehtml += '<a href="javascript:void(0)" class="prev">上一页</a>';
				}
				var start,end;
				start = page - 6 / 2;
				if (start < 1){
					start = 1;
				}
				end = start + 6;
				if (end > pageCount){
					start = pageCount - 6;
					end = pageCount;
				}
				if(start<1){
					start=1;
				}
				for(var i=start;i<=end;i++)  {
					if (i==page) {
						pagehtml += '<a href="javascript:void(0)" onclick="getProductList('+ i + ')" class="cur">'+ i + "</a>";
					} else {
						pagehtml += '<a href="javascript:void(0)" onclick="getProductList('+ i + ')">' + i + "</a>";
					}
				}
				if (page < pageCount) {
					pagehtml += '<a href="javascript:void(0)" onclick="getProductList('+ (page + 1) + ')" class="next">下一页</a>';
				} else {
					pagehtml += '<a href="javascript:void(0)" class="next">下一页</a>';
				}
				$(".pagesBox").html(pagehtml);

			} else {
				$(".pagesBox").html("");
				$(".projectItems h2,.projectItems table,.projectItems .pagesBox").hide();
				$(".projectItems .comingSoon").show();
			}
		}
	});
}
/* 获取项目列表 end */
/* 获取每页项目数量 start */
function getPageSize() {
	$.ajax({
		type : "post",
		data : {
			r : Math.random()
		},
		url : ServerUrl + "system/queryByCode.do?systemCode=pageSize",
		async : false,
		dataType : "json",
		success : function(Mess) {
			return Mess.rows.systemValue;
		}
	});
}
/* 获取每页项目数量 end */
/* 开始理财页 end */

/* 理财问答页 start */
/* 获取问题类型 start */
function getQuestionCategory() {
	$.ajax({
		type : "POST",
		data : {
			r : Math.random()
		},
		url : ServerUrl + "questionClass/queryAll.do",
		async : false,
		dataType : "json",
		success : function(Mess, textStatus, jqXHR) {
			var listhtml = "";
			var pageSize=10;
			if (Mess.success) {
				for (var i = 0; i < Mess.rows.length; i++) {
					listhtml += '<li onclick="openQuestionList('+Mess.rows[i].questionClassId+',1,'+pageSize+')" flag='+Mess.rows[i].questionClassId+'>'+ Mess.rows[i].questionClassName+ '</li>';
				}
				$(".problemType").html(listhtml);
				$(".problemType>li").on("click",function(){
					$(this).addClass("cur").siblings().removeClass("cur");
					$("#QATitle").html($(this).html());
				});	
				var qcId=GetQueryString("qcId");
				var index=GetQueryString("index");
				if (qcId!=null) {
					$(".problemType li[flag="+qcId+"]").trigger("click");
					if (index!=null) {
						var page=Math.ceil(parseInt(index)/pageSize);
						var rest=parseInt(index-1)%pageSize;
						openQuestionList(qcId,page,pageSize,rest);
					}
				}else{
					$(".problemType li:eq(0)").trigger("click");
				}
			}
		}
	});
}
/* 获取问题类型 end */
/* 获取问题列表 start */
function openQuestionList(questionType,page,pageSize,rest){
	$.ajax({
		type : "POST",
		data : {
			page : 1,
			qcId : questionType,
			r : Math.random()
		},
		url : ServerUrl+ "question/queryPage.do",
		async : false,
		dataType : "json",
		success : function(Mess, textStatus,jqXHR) {
			var listhtml="";
			var startIndex=(page-1)*pageSize;
			var pageCount=1;
			if (Mess.success) {
				pageCount=Math.ceil(Mess.total/pageSize);
				for (var i = startIndex ; i < Mess.rows.length; i++) {
					if (i<startIndex+pageSize) {
						listhtml+='<li><h3>'+Mess.rows[i].question+'<em></em></h3><p>'+Mess.rows[i].answer+'</p></li>';
					}else{
						break;
					}
				}
				$(".problemList ul").html(listhtml);
				$(".financialQA .problemList h3").on("click",function(){
					$(this).next().toggle(function(){
						$(this).prev().find("em").toggleClass("cur");
					});
				});
				var pagehtml = "";
				if (page > 1) {
					pagehtml += '<a href="javascript:void(0)" onclick="openQuestionList('+ questionType+','+ (page-1) +','+pageSize+ ')" class="prev">上一页</a>';
				} else {
					pagehtml += '<a href="javascript:void(0)" class="prev">上一页</a>';
				}
				var start,end;
				start = page - 6 / 2;
				if (start < 1){
					start = 1;
				}
				end = start + 6;
				if (end > pageCount){
					start = pageCount - 6;
					end = pageCount;
				}
				if(start<1){
					start=1;
				}
				for(var i=start;i<=end;i++)  {
					if (i==page) {
						pagehtml += '<a href="javascript:void(0)" onclick="openQuestionList('+ questionType+','+ i +','+pageSize+ ')" class="cur">'+ i + "</a>";
					} else {
						pagehtml += '<a href="javascript:void(0)" onclick="openQuestionList('+ questionType+','+ i +','+pageSize+ ')">' + i + "</a>";
					}
				}
				if (page < pageCount) {
					pagehtml += '<a href="javascript:void(0)" onclick="openQuestionList('+ questionType+','+ (page+1) +','+pageSize+ ')" class="next">下一页</a>';
				} else {
					pagehtml += '<a href="javascript:void(0)" class="next">下一页</a>';
				}
				$(".pagesBox").html(pagehtml);
				if (rest!=undefined) {
					$(".financialQA .problemList h3:eq("+rest+")").trigger("click");
				}
			}
		}
	});
}
/* 获取问题列表 end */
/* 理财问答页 end */

/* 平台公告、动态、新闻列表 start */
function getInfoList(page) {
	var t = 0;
	t = GetQueryString("t");
	if (t == 0) {
		$(".platformInfo h2").html("相关新闻");
		document.title="相关新闻-拔萝卜P2F票据理财平台";
	} else if (t == 1) {
		$(".platformInfo h2").html("平台公告");
		document.title="平台公告-拔萝卜P2F票据理财平台";
	} else if (t == 2) {
		$(".platformInfo h2").html("平台动态");
		document.title="平台动态-拔萝卜P2F票据理财平台";
	} else if (t == 3) {
		$(".platformInfo h2").html("媒体报道");
		document.title="媒体报道-拔萝卜P2F票据理财平台";
	}
	$.ajax({
		type : "POST",
		data : {
			page : page,
			contentType : t,
			r : Math.random()
		},
		url : ServerUrl + "news/queryByTypePage.do",
		async : true,
		dataType : "json",
		success : function(Mess, textStatus, jqXHR) {
			if (Mess.success) {
				var prohtml = "";
				for (var i = 0; i < Mess.rows.length; i++) {
					prohtml += ("<li>");
					prohtml += ('<h3><a href="platformDetail.html?id='
							+ Mess.rows[i].nId + '">'
							+ Mess.rows[i].newsTitle + "</a></h3>");
					var ns = Mess.rows[i].newsGuide.replace(
							/<\/?[^>]*>/g, "");
					if (ns.length > 50) {
						ns = ns.substr(0, 50)+"...";
					}
					prohtml +=('<div><em>'+Mess.rows[i].createTime+'</em><p>'
							+ns+'</p><a href="platformDetail.html?id='
							+ Mess.rows[i].nId+ '">全文&gt;&gt;</a></div>"');
					prohtml += ("</li>");
				}
				var pagesize = 5;
				var pagecount = Math.ceil(Mess.total / pagesize);
				var pagehtml = "";
				if (page > 1) {
					pagehtml += '<a href="javascript:void(0)" onclick="getInfoList('
							+ (page - 1) + ')" class="prev">上一页</a>'
				} else {
					pagehtml += '<a href="javascript:void(0)" class="prev">上一页</a>'
				}
				var start,end;
				start = page - 6 / 2;
				if (start < 0){
					start = 0;
				}
				end = start + 6;
				if (end > pagecount){
					start = pagecount - 6;
					end = pagecount;
				}
				if(start<0){
					start=0;
				}
				for(var i=start;i<end;i++)  {
					if (page == (i + 1)) {
						pagehtml += '<a href="javascript:void(0)" onclick="getInfoList('
								+ (i + 1)
								+ ')" class="cur">'
								+ (i + 1) + "</a>"
					} else {
						pagehtml += '<a href="javascript:void(0)" onclick="getInfoList('
								+ (i + 1) + ')">' + (i + 1) + "</a>"
					}
				}
				if (page < pagecount) {
					pagehtml += '<a href="javascript:void(0)" onclick="getInfoList('
							+ (page + 1) + ')" class="next">下一页</a>'
				} else {
					pagehtml += '<a href="javascript:void(0)" class="next">下一页</a>'
				}
				$(".platformInfo .infoList").html(prohtml);
				$(".pagesBox").html(pagehtml);
			}
		}
	})
}
/* 平台公告、动态、新闻列表 end */

/* 公告、动态、新闻详情页 start */
function getPlatformDetails(id) {
	var id = 0;
	id = GetQueryString("id");
	if (id != 0 && id != undefined) {
		$.ajax({
			type : "post",
			data : {
				nId : id,
				r : Math.random()
			},
			url : ServerUrl + "news/queryById.do",
			async : true,
			dataType : "json",
			success : function(Mess) {
				if (Mess.success) {
					if (Mess.rows.contentType == 0) {
						$(".platformDetail h2").html("新闻详情");
						document.title="相关新闻-拔萝卜P2F票据理财平台";
					} else if (Mess.rows.contentType == 1) {
						$(".platformDetail h2").html("公告详情");
						document.title="平台公告-拔萝卜P2F票据理财平台";
					} else if (Mess.rows.contentType == 2) {
						$(".platformDetail h2").html("动态详情");
						document.title="平台动态-拔萝卜P2F票据理财平台";
					} else if (Mess.rows.contentType == 3) {
						$(".platformDetail h2").html("报道详情");
						document.title="媒体报道-拔萝卜P2F票据理财平台";
					}
					$(".platformDetail .mainheader h3").html(Mess.rows.newsTitle);
					$(".platformDetail .mainheader span").html("来源:"+ Mess.rows.newFrom);
					$(".platformDetail .mainheader em").html(Mess.rows.createTime);
					$("..platformDetail .mainText").html(Mess.rows.newsContent);
				}
			}
		})
	}
}
/* 公告、动态、新闻详情页 end */

/* 我有票据页 start */
/* 图片验证码 start */
function getVCodeImg() {
	if (UserModel != null && UserModel != undefined) {
		$(".vCodeImg").attr("src",ServerUrl + "pictureCheckCode/getPictureCode.do?uId="+ UserModel.userId + "&r=" + Math.random());
	}
}
/* 图片验证码 end */
/* 提交票据信息 start */
function submitBill() {
	if (UserModel != null && UserModel != undefined) {
		var ticketMoney = removeStrSpace($("#ticketMoney").val());
		var dueTime = removeStrSpace($("#dueTime").val());
		var billPhoto = $("#billPhoto").val();
		var bankType = $(".bankSelectList>.selected").attr("val");
		var fullName = removeStrSpace($("#fullName").val());
		var phone = removeStrSpace($("#phone").val());
		var vCode = removeStrSpace($("#vCode").val());
		var message = "";
		var fileSuffix = billPhoto.substr(billPhoto.lastIndexOf(".")).toUpperCase();
		if (billPhoto == "") {
			message += "-请选择票据图片<br>";
		} else if (fileSuffix != ".JPG" && fileSuffix != ".PNG" && fileSuffix != ".GIF"&& fileSuffix != ".JPEG" && fileSuffix != ".BMP") {
			message += "-请选择图片格式文件<br>";
		}
		if (ticketMoney == "") {
			message += "-请输入票据面额<br>";
		} else if (isNaN(ticketMoney)) {
			message += "-票据面额应为数字<br>";
		}
		if(parseFloat(ticketMoney)>9999999.99){
			message+="-票据金额必须小于9999999.99<br>";
		}
		if (dueTime == "") {
			message += "-请输入到期时间<br>";
		}
		if (bankType == "") {
			message += "-请选择银行类型<br>";
		}
		if (fullName == "") {
			message += "-请输入联系人<br>";
		}
		if (phone == "") {
			message += "-请输入手机号码<br>";
		}
		if (vCode == "") {
			message += "-请输入验证码<br>";
		}
		if (message == "") {
			$.ajax({
				type : "POST",
				url : ServerUrl + "ticket/save.do",
				dataType : 'json',
				success : function(Mess) {
					if (Mess.success) {
						$(".popWin,.mask").show();
						$("#ticketMoney").val("");
						$("#dueTime").val("");
						$("#billPhoto").val("");
						$("#fullName").val("");
						$("#phone").val("");
					} else {
						$(".popWin,.mask").show();
						$(".popWinTitle").html("温馨提示");
						$(".popWin .content>p").html(Mess.message);
					}
				}
			});
		} else {
			$(".popWin,.mask").show();
			$(".popWinTitle").html("温馨提示");
			$(".popWin .content>p").html(message);
		}
	} else {
		$(".popWin,.mask").show();
		$(".popWinTitle").html("温馨提示");
		$(".popWin .content>p").html("请先登录");
		$(".popWin .closeBtn").on("click",function(){
			location.href = "../login.html";
		});
	}
}
/* 提交票据信息 end */
/* 我有票据页 end */

/* 关于拔萝卜页 start */
/* 关于拔萝卜页·初始化 start */
function aboutInit(){
	var index=GetQueryString("index");
	if (index!=null && index!="") {
		$(".aboutList li[index="+index+"]").trigger("click");
	}else{
		$(".aboutList li[index='1']").trigger("click");
	}
}
/* 关于拔萝卜页·初始化 end */
/* 左侧TAB切换 start */
$(".aboutList li").on("click",function(){
	$(this).addClass("cur").siblings().removeClass("cur");
	$("#aboutDetailTitle").html($(this).html());
	aboutFaceSwitch($(this).attr("index"));
});
$(".aboutList>li").on("click",function(){
	aboutFaceSwitch($(this).attr("index"));
});
function aboutFaceSwitch(index){
		$("#aboutDetailContent>div").hide();
		switch(index){
			case "1":
				$("#aboutDetailContent .baluobo").show();
				break;
			case "2":
				$("#aboutDetailContent .safety").show();
				loadSafety();
				break;
			case "3":
				$("#aboutDetailContent .mediaReport").show();
				getMediaList(1);
				break;
			case "4":
				$("#aboutDetailContent .joinUs").show();
				getJobCategory();
				$(".aboutList>.jobType>li:first-child").trigger("click");
				break;
			case "5":
				$("#aboutDetailContent .contactUs").show();
				loadMap();
				break;
		}
}
/* 左侧TAB切换 end */
/* 安全保障 start */
function loadSafety(){
	var prohtml="";
	for (var i = 1; i <= 7; i++) {
		prohtml += '<img src="../images/about/safety_0'+i+'.jpg">';
	}
	$("#aboutDetailContent .safety").html(prohtml);
}
/* 安全保障 end */
/* 媒体报道 start */
function getMediaList(page) {
	$.ajax({
		type : "POST",
		data : {
			page : page,
			contentType : 3,
			r : Math.random()
		},
		url : ServerUrl + "news/queryByTypePage.do",
		async : true,
		dataType : "json",
		success : function(Mess, textStatus, jqXHR) {
			if (Mess.success) {
				var prohtml = "";
				for (var i = 0; i < Mess.rows.length; i++) {
					prohtml += ("<li>");
					prohtml += ('<h3><a href="platformDetail.html?id='+Mess.rows[i].nId+'">'+Mess.rows[i].newsTitle+'"</a></h3>');
					var ns = Mess.rows[i].newsGuide.replace(/<\/?[^>]*>/g, "");
					if (ns.length > 37) {
						ns = ns.substr(0, 37)
					}
					prohtml += ('<p>'+ns+'<a href="platformDetail.html?id='+Mess.rows[i].nId+'">全文&gt;&gt;</a><em class="newsTime">'+Mess.rows[i].createTime+'</em></p>');
					prohtml += ("</li>");
				}
				var pagesize = 5;
				var pagecount = Math.ceil(Mess.total / pagesize);
				var pagehtml = "";
				if (page > 1) {
					pagehtml += '<a href="javascript:void(0)" onclick="getMediaList('
							+ (page - 1) + ')" class="prev">上一页</a>'
				} else {
					pagehtml += '<a href="javascript:void(0)" class="prev">上一页</a>'
				}
				var start,end;
				start = page - 6 / 2;
				if (start < 0){
					start = 0;
				}
				end = start + 6;
				if (end > pagecount){
					start = pagecount - 6;
					end = pagecount;
				}
				if(start<0){
					start=0;
				}
				for(var i=start;i<end;i++)  {
					if (page == (i + 1)) {
						pagehtml += '<a href="javascript:void(0)" onclick="getMediaList('
								+ (i + 1)+ ')" class="cur">'+ (i + 1) + "</a>"
					} else {
						pagehtml += '<a href="javascript:void(0)" onclick="getMediaList('
								+ (i + 1) + ')">' + (i + 1) + "</a>"
					}
				}
				if (page < pagecount) {
					pagehtml += '<a href="javascript:void(0)" onclick="getMediaList('
							+ (page + 1) + ')" class="next">下一页</a>'
				} else {
					pagehtml += '<a href="javascript:void(0)" class="next">下一页</a>'
				}
				$(".pagesBox").html(pagehtml);
				$(".mediaReportList").html(prohtml);
			} else {
				$(".mediaReportList").html("<li style='text-align: center'>暂无内容</li>")
			}
		}
	})
}
/* 媒体报道 end */
/* 招贤纳士 start */
/* 获取招聘部门 start */
function getJobCategory() {
	$.ajax({
		type : "post",
		data : {
			r : Math.random()
		},
		url : ServerUrl + "jobClass/queryAll.do",
		async : true,
		dataType : "json",
		success : function(Mess, status) {
			var listhtml = "";
			if (Mess.success) {
				for (var i = 0; i < Mess.rows.length; i++) {
					listhtml += ('<li onclick="onJobClick('
							 + Mess.rows[i].jcId + ')">'+Mess.rows[i].jcName+'</li>');
				}
				$(".jobType").html(listhtml);
				$(".aboutList .jobType>li").on("click",function(){
					$(this).addClass("cur").siblings().removeClass("cur");
				});
			}
		}
	})
}
/* 获取招聘部门 end */
/* 获取招聘职位 start */
function onJobClick(id) {
	$.ajax({
		type : "post",
		data : {
			jcId : id,
			page : 1,
			r : Math.random()
		},
		url : ServerUrl + "job/queryByClassPage.do",
		async : true,
		dataType : "json",
		success : function(Mess, status) {
			var listhtml = "";
			if (Mess.success) {
				for (var i = 0; i < Mess.rows.length; i++) {
					listhtml += ('<li>');
					listhtml += ('<h3>'+Mess.rows[i].jobName+'<em></em></h3>');
					listhtml += ('<div class="jobRequire">');
					listhtml += ('<h4>岗位职责：</h4><br>'+Mess.rows[i].jobDuty);
					listhtml += ('<h4>任职要求：</h4><br>'+Mess.rows[i].jobRequest);
					if(Mess.rows[i].emaile){
						listhtml += ('<h4>投递方式：</h4><br>'+Mess.rows[i].emaile);
					}
					listhtml += ('</div>');
					listhtml += ('</li>');
				}
				$("#jobList").html(listhtml);
				$("#jobList h3").on("click",function() {
					$(this).find("em").toggleClass("cur");
					$(this).parent().find(".jobRequire").toggle();
				});
			} else {
				listhtml += '<li style="text-align: center;">暂无此职位</li>';
				$("#jobList").html(listhtml);
			}
		}
	})
}
/* 获取招聘职位 end */
/* 招贤纳士 end */
/* 在线地图 start */
function loadMap(){
	var map=new AMap.Map("map");
	var layer;
	map.setZoom(12);
	map.plugin(['AMap.CloudDataLayer'],function(){
		var layer=new AMap.CloudDataLayer("56a73b2e7bbf197f39979c46");
		layer.setMap(map);
	});
	// 初始化地图对象
	map.plugin(['AMap.Scale'],function(){
		var scale=new AMap.Scale();
		map.addControl(scale);
	});
	// 添加地图比例尺
	map.plugin(['AMap.OverView'],function(){
		var view=new AMap.OverView();
		// view.open();
		map.addControl(view);
	});
	// 添加鹰眼控件
	map.plugin(['AMap.MapType'],function(){
		var type=new AMap.MapType();
		map.addControl(type);
	});
	// 添加卫星地图控件（添加后，定位点会消失）
	map.plugin(['AMap.ToolBar'],function(){
		var toolBar=new AMap.ToolBar();
		map.addControl(toolBar);
	});
	// 添加“缩放”&“平移”工具条
	var marker=new AMap.Marker({
		map:map,
		icon:"../favicon.ico",
		position:[117.254601,39.124176],
		title:"天成金控(天津)集团有限公司"
	});
	// 设置Marker（作为定位点消失后的替代）
	var info=new AMap.InfoWindow({
		closeWhenClickMap:true,
		content:'<table style="width:280px;height:120px;"><tr><th colspan="2" style="height:30px;text-align:left;font-size:16px;">天成金控(天津)集团有限公司</th></tr><tr><td style="width:40%;vertical-align:text-top;"><img src="../images/about/about_mapLogo.jpg" width=100%></td><td style="font-size:14px;font-family:微软雅黑,sans-serif;padding-left:5px;"><p style="margin-top:0;"><strong>地址：</strong>天津市河东区津滨大道万达广场写字楼B座19层</p><p><strong>电话：</strong>400-825-8626</p></td></tr></table>'
	});
	AMap.event.addListener(marker,"click",function(){
		info.open(map,[117.254601,39.124176]);
	});
	// 点击marker时，弹出单位简介
}
/* 在线地图 end */
/* 关于拔萝卜页 end */

/* 我的账户页 start */
/* 我的账户页·初始化 start */
function myAccountInit(){
	if (UserModel != null && UserModel != undefined) {
	    var myDate = new Date();
	    var hour = myDate.getHours();
	    var helloMsg = "";
	    if (hour < 6) {
	        helloMsg = ("夜里好！");
	    } else if (hour < 9) {
	        helloMsg = ("早上好，");
	    } else if (hour < 12) {
	        helloMsg = ("上午好，");
	    } else if (hour < 14) {
	        helloMsg = ("中午好，");
	    } else if (hour < 17) {
	        helloMsg = ("下午好，");
	    } else if (hour < 23) {
	        helloMsg = ("晚上好，");
	    } else {
	        helloMsg = ("夜里好!");
	    }
	    if (UserModel.userName != "" && UserModel.userName != null) {
	        $(".myHomePage .helloMsg").html(helloMsg + '<span class="myName">' + UserModel.userName + '</span>');
	    } else {
	    	$(".myHomePage .helloMsg").html(helloMsg + '<span class="myName">' + UserModel.mobile + '</span>');
	    }
	    $(".myHomePage .regTime").html("注册时间："+UserModel.createTime);
	    $(".userOwnedInfo .totalAssets").html(UserModel.countMoney);
	    $(".userOwnedInfo .curIncome").html(UserModel.nowProceeds);
	    $(".userOwnedInfo .accumulatedIncome").html(UserModel.sumProceeds);
	    $(".userOwnedInfo .frozenFunds").html(UserModel.freezeMoney);
	    $(".userOwnedInfo .availableFunds").html(UserModel.enAbleMoney);
	    $.ajax({
	        type: "post",
	        data: {
	            userId: UserModel.userId,
	            r: Math.random()
	        },
	        url: "/baluobo/bankCard/queryByUser.do",
	        async: false,
	        dataType: "json",
	        success: function(Mess) {
	        	$(".myHomePage .icon-phone-hollow>.icon-check-right-hollow").show();
	            if (Mess.success) {
	            	$(".myHomePage .icon-id-card>.icon-check-right-hollow").show();
	            	$(".myHomePage .icon-bank-card-01>.icon-check-right-hollow").show();
	                $(".securityProgress").width("100%").addClass("higherSecurityLevel");
	                $(".safeLevel").html("高").css({
	                	"color":"#2ebe69"
	                });
	                $("#username").val(Mess.rows.userName).attr("readonly","readonly");
	                $("#idCard").val(Mess.rows.idCard.substr(0, 3)+ "*******"+ Mess.rows.idCard.substr(Mess.rows.idCard.length - 3, 3)).attr("readonly","readonly");
	                $("#rechargeCard").val("尾号："+ Mess.rows.idCard.substr(Mess.rows.idCard.length - 4, 4)).attr("readonly","readonly");
	                $("#withdrawCard").val("尾号："+ Mess.rows.idCard.substr(Mess.rows.idCard.length - 4, 4)).attr("readonly","readonly");
	                $("#authenticationForm .submitBtn").hide();
	                $("#authenticatedImg").show();
	            } else {
	            	$(".securityProgress").width("50%").addClass("mediumSecurityLevel");
	            	$(".safeLevel").html("中").css({
	                	"color":"#ffae4f"
	                });
	                $("#rechargeCard").val("未绑定").attr("readonly","readonly");
	                $("#withdrawCard").val("未绑定").attr("readonly","readonly");
	                $(".rechargePopWin .submitBtn,.withdrawPopWin .submitBtn").attr("unbound","unbound");
	                var prohtml = '<p>您还未开户，<a class="cur" href="javascript:void(0);" onclick="regUserAccount('
						+ UserModel.userId + ')">立即开户，马上赚钱</a></p>';
	                $("#authenticationForm").parent().html(prohtml);
	            }
	        }
	    });
	} else {
	    $.cookie("cookie_uid", null);
	    var a = location.href;
	    // location.href = "login.html?ref=" + a;
	}
	var index=GetQueryString("index");
	if (index!=null && index!="") {
		var indexArr=index.split(".");
		if (indexArr.length>1) {
			$(".myAccountList li[index="+indexArr[0].slice(1)+"]").trigger("click");
		}
		$(".myAccountList li[index="+index+"]").trigger("click");
	}else{
		$(".myAccountList li[index='1']").trigger("click");
	}
}
/* 我的账户页·初始化 end */
/* 左侧TAB切换 start */
$(".myAccountList>li").on("click",function(){
	$(".myAccountList .items>li.cur").removeClass("cur");
	$(this).addClass("cur").siblings().removeClass("cur");
	faceSwitch($(this).attr("index"));
});
$(".myAccountList .items>li").on("click",function(){
	$(this).addClass("cur").siblings().removeClass("cur");
	faceSwitch($(this).attr("index"));
});
function faceSwitch(index){
		$(".myAccountDetail>div,.myAccountDetail .activity,.myAccountDetail .pagesBox").hide();
		switch(index){
			case "1":
				$(".userOwnedInfo,.incomeTrend,.myBuyLog,.activity").show();
				getEarnChart();
				getBuyLog(1, 0);
				break;
			case "1.1":
				$(".userOwnedInfo,.assetDetail,.activity,.myAccountDetail .pagesBox").show();
				getAssetList(1);
				break;
			case "1.2":
				$(".userOwnedInfo,.myBuyLog,.activity,.myAccountDetail .pagesBox").show();
				$(".myBuyLog>a").hide();
				getBuyLog(1, 1);
				break;
			case "2":
				$(".bankCardManagement").show();
				getUserBankCard();
				break;
			case "3":
				$(".radishCoin,.myAccountDetail .pagesBox").show();
				$(".radishCoin .earnRadishCoin,.radishCoin .radishCoinDetail").hide();
				$(".radishCoin .radishCoinInfo,.radishCoin .exchangeGifts,.activity").show();
				getCoin();
				getGiftList(1);
				break;
			case "3.1":
				$(".radishCoin").show();
				$(".radishCoin .exchangeGifts,.radishCoin .radishCoinDetail").hide();
				$(".radishCoin .radishCoinInfo,.radishCoin .earnRadishCoin,.activity").show();
				getCoin();
				isSign();
				break;
			case "3.2":
				$(".radishCoin,.myAccountDetail .pagesBox").show();
				$(".radishCoin .earnRadishCoin,.radishCoin .exchangeGifts").hide();
				$(".radishCoin .radishCoinInfo,.radishCoin .radishCoinDetail,.activity").show();
				getCoin();
				coinList(1);
				break;
			case "4":
				$(".messageCenter,.myAccountDetail .pagesBox").show();
				getMessageList(1);
				break;
			case "5":
				$(".moreSetting").show();
				getSafeSetting();
				break;
			case "6":
				$(".activityCenter,.myAccountDetail .pagesBox").show();
				getActivityList(1);
				break;
		}
}
/* 左侧TAB切换 end */
/* 公告展示 start */
function topNotice() {
	$.ajax({
		type : "post",
		data : {
			systemCode : "gonggao",
			r : Math.random()
		},
		url : ServerUrl + "singleContent/queryByCode.do",
		async : true,
		dataType : "json",
		success : function(Mess, status) {
			if (Mess.success) {
				$(".myAccountDetail #scrollNotice").html(Mess.rows.singleDesc)
			} 
		}
	})
};
/* 公告展示 end */
/* 充值弹窗 start */
function recharge(){
	$(".rechargePopWin,.mask").show();
}
/* 充值弹窗 end */
/* 提现弹窗 start */
function withdraw(){
	$(".withdrawPopWin,.mask").show();
}
/* 提现弹窗 end */
/* 账户充值 start */
function doRecharge() {
	if ($(".rechargePopWin .submitBtn").attr("unbound")=="unbound") {
		$(".warningPopWin").show();
		$(".rechargePopWin").hide();
		$(".warningPopWin .content>p").html(
			'您还未开户，请先开户再进行操作。<br><a href="javascript:void(0);" onclick="regUserAccount('
			+ UserModel.userId + ')">立即开户，马上赚钱</a>');
	}else{
		if(parseFloat($("#rechargeMoney").val())<100){
			alert("充值金额必须大于100");
		}else if ($("#rechargeMoney").val() != "") {
			window.open(ServerUrl + "huifu/doRecharge.do?userId="
					+ UserModel.userId + "&money=" + $("#rechargeMoney").val())
		}	
	}
}
/* 账户充值 end*/
/* 账户提现 start */
function doDraw() {
	if ($(".withdrawPopWin .submitBtn").attr("unbound")=="unbound") {
		$(".warningPopWin").show();
		$(".withdrawPopWin").hide();
		$(".warningPopWin .content>p").html(
				'您还未开户，请先开户再进行操作。<br><a href="javascript:void(0);" onclick="regUserAccount('
						+ UserModel.userId + ')">立即开户，马上赚钱</a>');
	}else{
		if($("#withdrawMoney").val()==""){
			alert("金额没有输入");
		}else if(parseFloat(UserModel.enAbleMoney)<parseFloat($("#withdrawMoney").val())){
			alert("可用资金不足");
		}else if(parseFloat($("#withdrawMoney").val())<=0){
			alert("金额必须大于0");
		}else if ($("#withdrawMoney").val() != "") {
			window.open(ServerUrl + "huifu/doWithdraw.do?userId="+ UserModel.userId + "&money=" + $("#withdrawMoney").val())
		}	
	}
	$("#withdrawMoney").val("");
}
/* 账户提现 end */
$("#rechargeMoney,#withdrawMoney").on("blur", function() {
	var n =/^\d+(\.\d+)?$/;	
	if (!(n.test($(this).val()))) {
		$(this).val("");
		alert("请输入正确的金额");
	}
});
$(".rechargePopWin .closeBtn,.withdrawPopWin .closeBtn").on("click",function(){
	$("#rechargeMoney,#withdrawMoney").val("");
});
/* 绘制用户的年收益走势图 start */
function getEarnChart() {
	if (UserModel != null && UserModel != undefined) {
		$.ajax({
			type : "post",
			data : {
				userId : UserModel.userId,
				r : Math.random()
			},
			url : ServerUrl + "proceedsTreds/queryAll.do",
			async : true,
			dataType : "json",
			success : function(Mess, status) {
				if (Mess.success) {
					if (Mess.rows != null) {
						 // 路径配置
				        require.config({
				            paths: {
				                echarts: 'echarts/'
				            }
				        });
						require([ "echarts", "echarts/chart/line" ], function(ec) {
							var myChart = ec.init(document.getElementById("incomeTrendChart"));
							myChart.setOption({
								color : [ "#52aae2", "#dd7802" ],
								tooltip : {
									trigger : "axis"
								},
								legend : {
									show : false,
									data : [ "意向" ]
								},
								grid : {
									x : 50,
									y : 10,
									x2 : 20,
									y2 : 40
								},
								toolbox : {
									show : false
								},
								calculable : false,
								xAxis : [ {
									type : "category",
									boundaryGap : false,
									"axisLine" : {
										show : false,
										lineStyle : {
											color : "rgba(255,255,255,0.35)",
											width : 1,
											type : "solid"
										}
									},
									data : Mess.rows.X
								} ],
								yAxis : [ {
									"axisLine" : {
										show : false,
										lineStyle : {
											color : "rgba(255,255,255,0.35)",
											width : 1,
											type : "solid"
										}
									},
									type : "value"
								} ],
								series : [ {
									name : "收益",
									type : "line",
									smooth : true,
									symbol : "emptyCircle",
									symbolSize : 4,
									itemStyle : {
										normal : {
											areaStyle : {
												type : "default"
											}
										}
									},
									data : Mess.rows.Y
								} ]
							})
						})
					}
				} 
			}
		})
	}
}
/* 绘制用户的年收益走势图 end */
/* 获取用户的资产明细 start */
function getAssetList(page) {
	if (UserModel != null && UserModel.userId > 0) {
		$.ajax({
			type : "POST",
			data : {
				uId : UserModel.userId,
				page : page,
				r : Math.random()
			},
			url : ServerUrl + "buyOrder/queryPageEnd.do",
			async : true,
			dataType : "json",
			success : function(Mess, textStatus, jqXHR) {
				if (Mess.success) {
					var listhtml = "";
					for (var i = 0; i < Mess.rows.length; i++) {
						listhtml += ("<li>");
						listhtml += ("<h3>"+Mess.rows[i].goodName+"</h3>");
						listhtml += ("<div>");
						if (Mess.rows[i].gcId==13 && Mess.rows[i].buyOrder==2) {
							listhtml += ('<p><em>持仓本金：<span>'+Mess.rows[i].speedMoney+'元</span></em><input type="button" value="赎 回"  class="fr" onclick="redeem('+Mess.rows[i].buyOrderNo+')"></p>');
							listhtml += ('<p><em>累计收益：<span>'+Mess.rows[i].sumEarn+'元</span></em></p>');	
						}else if (Mess.rows[i].gcId==13){
							listhtml += ('<p><em>持仓本金：<span>'+Mess.rows[i].speedMoney+'元</span></em></p>');
							listhtml += ('<p><em>累计收益：<span>'+Mess.rows[i].sumEarn+'元</span></em></p>');
						}else{
							listhtml += ('<p><em>持仓本金：<span>'+Mess.rows[i].speedMoney+'元</span></em></p>');
							listhtml += ('<p><em>累计收益：<span>'+Mess.rows[i].sumEarn+'元</span></em><em class="fr">本息到账时间：<i>'+Mess.rows[i].buyEndTime+'</i></em></p>');
						}
						listhtml += ("</div>");
						listhtml += ("</li>");
					}
					var pagesize = 5;
					var pagecount = Math.ceil(Mess.total / pagesize);
					var pagehtml = "";
					if (page > 1) {
						pagehtml += '<a href="javascript:void(0)" onclick="getAssetList('+ (page - 1) + ')" class="prev">上一页</a>';
					} else {
						pagehtml += '<a href="javascript:void(0)" class="prev">上一页</a>';
					}
					var start,end;
					start = page - 6 / 2;
					if (start < 0){
						start = 0;
					}
					end = start + 6;
					if (end > pagecount){
						start = pagecount - 6;
						end = pagecount;
					}
					if(start<0){start=0;}
					for(var i=start;i<end;i++)  {
						if (page == (i + 1)) {
							pagehtml += '<a href="javascript:void(0)" onclick="getAssetList('
									+ (i + 1)+ ')" class="cur">'+ (i + 1) + "</a>";
						} else {
							pagehtml += '<a href="javascript:void(0)" onclick="getAssetList('
									+ (i + 1)+ ')">'+ (i + 1)+ "</a>";
						}
					}
					if (page < pagecount) {
						pagehtml += '<a href="javascript:void(0)" onclick="getAssetList('
								+ (page + 1)+ ')" class="next">下一页</a>';
					} else {
						pagehtml += '<a href="javascript:void(0)" class="next">下一页</a>';
					}
					$(".pagesBox").html(pagehtml);
					$("#assetDetailList").html(listhtml);
				}
			}
		});
	} else {
		$(".warningPopWin,.mask").show();
		$(".warningPopWin .content>p").html("请先登录");
		$(".warningPopWin .closeBtn").on("click",function(){
			location.href = "../login.html";
		});
	}
}
/* 获取用户的资产明细 end */
/* 活期赎回 start */
function redeem(buyOrderNo){
	if (UserModel != null && UserModel != undefined) {
		$.ajax({
			type : "POST",
			data : {
			},
			url : ServerUrl + "huifu/doReturnMoney.do?ordId="+buyOrderNo,
			async : true,
			dataType : "json",
			success : function(Mess, textStatus, jqXHR) {
	        	if (Mess.success) {
					$(".warningPopWin,.mask").show();
					$(".warningPopWin .content>p").html("交易订单"+buyOrderNo+"赎回成功！");
	        	}else{
	        		$(".warningPopWin,.mask").show();
					$(".warningPopWin .content>p").html(Mess.message);
	        	}
	        	$(".warningPopWin .closeBtn").on("click",function(){
					location.reload();
				});
	        }
	    });	
	} else {
		$(".warningPopWin,.mask").show();
		$(".warningPopWin .content>p").html("请先登录");
		$(".warningPopWin .closeBtn").on("click",function(){
			location.href = "../login.html";
		});
	}
}
/* 活期赎回 end */
/* 获取用户的交易记录 start */
function getBuyLog(page, type) {
	if (UserModel != null && UserModel.userId > 0) {
		if (UserModel.isAutonym == 0) {
			var prohtml = '您还未开户，开户方可进行投资。<br><a class="cur" href="javascript:void(0);" onclick="regUserAccount('
						+ UserModel.userId + ')">立即开户，马上赚钱</a>';
			$(".warningPopWin,.mask").show();
			$(".warningPopWin .content>p").html(prohtml);
		}
		$.ajax({
			type : "POST",
			data : {
				uId : UserModel.userId,
				page : page,
				r : Math.random()
			},
			url : ServerUrl + "buyOrder/queryPageEnding.do",
			async : true,
			dataType : "json",
			success : function(Mess, textStatus, jqXHR) {
				if (Mess.success) {
					var listhtml = "";
					for (var i = 0; i < Mess.rows.length; i++) {
						if (type == 0 && i > 2) {
							break;
						}
						listhtml += ('<tr>');
						listhtml += ('<td><p><strong>'+Mess.rows[i].goodName+'</strong></p><p><span class="icon-protect"></span>到期无条件兑付</p></td>');
						listhtml += ('<td><p><span>'+Mess.rows[i].speedMoney+'元</span></p><p>投资金额</p></td>');
						listhtml += ('<td><p><span>'+Mess.rows[i].preProceeds+'元</span></p><p>预期待收收益</p></td>');
						listhtml += ('<td><p><em>'+Mess.rows[i].createTime.substr(0, 10)+'</em></p><p>交易日期</p></td>');
						listhtml += ('</tr>');
					}
					if (type == 1) {
						var pagesize = 5;
						var pagecount = Math.ceil(Mess.total / pagesize);
						var pagehtml = "";
						if (page > 1) {
							pagehtml += '<a href="javascript:void(0)" onclick="getBuyLog('
									+ (page - 1)+ ',1)" class="prev">上一页</a>';
						} else {
							pagehtml += '<a href="javascript:void(0)" class="prev">上一页</a>';
						}
						var start,end;
						start = page - 6 / 2;
						if (start < 0){
							start = 0;
						}
						end = start + 6;
						if (end > pagecount){
							start = pagecount - 6;
							end = pagecount;
						}
						if(start<0){
							start=0;
						}
						for(var i=start;i<end;i++)  {
							if (page == (i + 1)) {
								pagehtml += '<a href="javascript:void(0)" onclick="getBuyLog('
										+ (i + 1)+ ',1)" class="cur">'+ (i + 1) + "</a>";
							} else {
								pagehtml += '<a href="javascript:void(0)" onclick="getBuyLog('
										+ (i + 1)+ ',1)">'+ (i + 1)+ "</a>";
							}
						}
						if (page < pagecount) {
							pagehtml += '<a href="javascript:void(0)" onclick="getBuyLog('
									+ (page + 1)+ ',1)" class="next">下一页</a>';
						} else {
							pagehtml += '<a href="javascript:void(0)" class="next">下一页</a>';
						}
						$(".pagesBox").html(pagehtml);
					}
					$("#myBuyLogList").html(listhtml);
				} 
			}
		});
	} else {
		$(".warningPopWin,.mask").show();
		$(".warningPopWin .content>p").html("请先登录");
		$(".warningPopWin .closeBtn").on("click",function(){
			location.href = "../login.html";
		});
	}
}
/* 获取用户的交易记录 end */
/* 获取用户的银行卡信息 start */
function getUserBankCard() {
	if (UserModel != null && UserModel != undefined) {
		if (UserModel.isAutonym == 0) {
			var prohtml = '为了保障用户安全，在绑定银行卡之前，请<a class="cur" href="javascript:" onclick="regUserAccount('+ UserModel.userId + ')">进行开户</a>';
			$(".warningPopWin,.mask").show();
			$(".warningPopWin .content>p").html(prohtml);
		}
		$.ajax({
			type : "post",
			data : {
				userId : UserModel.userId,
				r : Math.random()
			},
			url : ServerUrl + "bankCard/queryByUser.do",
			async : false,
			dataType : "json",
			success : function(Mess, status) {
				if (Mess.success) {
					$(".bankCardManagement .bankCardInfo").remove();
					$(".bankCardManagement .bankCardInfo_bound").show();
					$(".bankCardManagement .infoContent").html("由于我们实行单卡进出，所以如果您解绑你现在的银行卡，由这个银行卡购买的产品到期后资金将不能退还您的银行卡，请产品到期本金收益退回之后在进行解绑。");
					$("#boundBankCard").html(Mess.rows.bankCard.substr(0, 4)+ " **** **** **** "+ Mess.rows.bankCard.substr(Mess.rows.bankCard.length - 3, 3));
					if (Mess.rows.userName != null) {
						$("#boundOwner").html(Mess.rows.userName);
					}
				} else {
					$(".bankCardManagement .bankCardInfo_bound").remove();
					var contenthtml = "";
					if (UserModel.isAutonym == 0) {
						contenthtml += ('您还没有开户，<a class="cur" href="javascript:void(0);" onclick="regUserAccount('
									+ UserModel.userId + ')">请先开户</a>，然后再进行银行卡绑定。');
						$(".bankCardManagement .addBankCard>a").on("click",function(){
							var prohtml = '为了保障用户安全，在绑定银行卡之前，请<a class="cur" href="javascript:" onclick="regUserAccount('+ UserModel.userId + ')">进行开户</a>';
							$(".warningPopWin,.mask").show();
							$(".warningPopWin .content>p").html(prohtml);
						});
					} else {
						contenthtml += ('您当前真实姓名为'+Mess.rows.userName+'，当前真实姓名必须与您将要设置的银行卡号的姓名一致，如不一致，请联系客服！');
						$(".bankCardManagement .addBankCard>a").attr("href",ServerUrl+"huifu/doBankCardHuiFu.do?userId="+ UserModel.userId);
					}
					$(".bankCardManagement .infoContent").html(contenthtml);
				}
			}
		});
	} else {
		$(".warningPopWin,.mask").show();
		$(".warningPopWin .content>p").html("请先登录");
		$(".warningPopWin .closeBtn").on("click",function(){
			location.href = "../login.html";
		});
	}
}
/* 获取用户的银行卡信息 end */
/* 银行卡解绑 start */
function onCacelBankCard() {
	if (UserModel != null && UserModel != undefined) {
		$.ajax({
			type : "post",
			data : {
				systemCode : "yinhankajiebang",
				r : Math.random()
			},
			url : ServerUrl + "singleContent/queryByCode.do",
			async : false,
			dataType : "json",
			success : function(Mess, status) {
				if (Mess.success) {
					var prohtml="";
					prohtml += "汇付账号："+UserModel.countName+"<br>";
					prohtml += "解绑提示：";
					prohtml += Mess.rows.singleDesc;
					$(".warningPopWin,.mask").show();
					$(".warningPopWin .content>p").html(prohtml);
				} else {
					$(".warningPopWin,.mask").show();
					$(".warningPopWin .content>p").html(Mess.message);
				}
			}
		});
	} else {
		$(".warningPopWin,.mask").show();
		$(".warningPopWin .content>p").html("请先登录");
		$(".warningPopWin .closeBtn").on("click",function(){
			location.href = "../login.html";
		});
	}
}
/* 银行卡解绑 end */
function contactUsPopWin(){
	$(".warningPopWin,.mask").show();
	$(".warningPopWin .content>p").html("请联系客服进行咨询");
}
/* 获取用户的萝卜币数量 start */
function getCoin() {
	if (UserModel != null && UserModel != undefined) {
		$.ajax({
			type : "post",
			data : {
				uId : UserModel.userId,
				r : Math.random()
			},
			url : ServerUrl + "turnips/queryTurnipsSum.do",
			async : false,
			dataType : "json",
			success : function(Mess, status) {
				if (Mess.success) {
					$(".radishCoin .radishCoinInfo>strong").html(Mess.rows);
				} else {
					$(".warningPopWin,.mask").show();
					$(".warningPopWin .content>p").html(Mess.message);
				}
			}
		});
	} else {
		$(".warningPopWin,.mask").show();
		$(".warningPopWin .content>p").html("请先登录");
		$(".warningPopWin .closeBtn").on("click",function(){
			location.href = "../login.html";
		});
	}
}
/* 获取用户的萝卜币数量 end */
/* 萝卜币兑换礼物列表 start */
function getGiftList(page) {
	if (UserModel != null && UserModel.userId > 0) {
		$.ajax({
			type : "post",
			data : {
				page : page,
				r : Math.random()
			},
			url : ServerUrl + "gift/queryPage.do",
			async : false,
			dataType : "json",
			success : function(Mess, status) {
				if (Mess.success) {
					var listhtml = "";
					for (var i = 0; i < Mess.rows.length; i++) {
						listhtml += ("<tr>");
						listhtml += ('<td><img src="'+ PicUrl + Mess.rows[i].giftPic +'" alt="奖品LOGO"></td>');
						listhtml += ('<td><strong>'+Mess.rows[i].giftTitle+'</strong><br><em>兑换需'+Mess.rows[i].turnipCount+'萝卜币</em></td>');
						listhtml += ('<td><input type="button" value="兑换" onclick="onBuyGift(this,'
								 + Mess.rows[i].giftId + ',' + Mess.rows[i].turnipCount + ')" giftType='+Mess.rows[i].giftType+'></td>');
						listhtml += ("</tr>");
					}
					$("#exchangeGiftsList").html(listhtml);
					var pagehtml="";
					pagehtml += '更多奖品 >>  <a href="javascript:getGiftList(1);" class="cur">1</a>';
					pagehtml += '<a href="javascript:getGiftList(2);" class="cur">2</a>';
					$(".pagesBox").html(pagehtml);
				}
			}
		});
	}
}
/* 萝卜币兑换礼物列表 end */
/* 萝卜币兑换礼物 start */
function onBuyGift(o, id, turnipCount) {
	if (UserModel != null && UserModel != undefined) {
	$.ajax({
			type : "post",
			data : {
				uId : UserModel.userId,
				r : Math.random()
			},
			url : ServerUrl + "turnips/queryTurnipsSum.do",
			async : false,
			dataType : "json",
			success : function(Mess, status) {
				if (Mess.success) {
					if(Mess.rows >= turnipCount) {
						//有足够的萝卜币
						$(".giftPopWin .content>.giftName").html($(o).parent().parent().find("strong").html());
						if ($(o).attr("giftType") == "0") {
							$(".giftPopWin .infoContent").html("(客服会在15个工作日内发放到您绑定的手机中,是否确定兑换？)")
						} else {
							$(".giftPopWin .infoContent").html("客服会在15个工作日内联系您进行礼品兑换,是否确定兑换？")
						}
						$(".giftPopWin,.mask").show();
						$("#toDo").click(function() {
							$(".giftPopWin").hide();
							doBuyGift(id);
						});
					}else {
						$(".warningPopWin,.mask").show();
						$(".warningPopWin .content>p").html("萝卜币数量不够！");
					}
				}else {
					$(".warningPopWin,.mask").show();
					$(".warningPopWin .content>p").html(Mess.message);
				}
			}
		});
	}else {
		$(".warningPopWin,.mask").show();
		$(".warningPopWin .content>p").html("请先登录");
		$(".warningPopWin .closeBtn").on("click",function(){
			location.href = "../login.html";
		});
	}
}
/* 萝卜币兑换礼物 end */
/* 取消礼品兑换 start */
function toCancle(){
	$(".giftPopWin,.mask").hide();
}
/* 取消礼品兑换 end */
/* 确认礼品兑换 start */
function doBuyGift(id) {
	if (UserModel != null && UserModel.userId > 0) {
		$.ajax({
			type : "post",
			data : {
				uId : UserModel.userId,
				gtId : id,
				r : Math.random()
			},
			url : ServerUrl + "giftOrder/save.do",
			async : false,
			dataType : "json",
			success : function(Mess, status) {
				if (Mess.success) {
					$(".warningPopWin").show();
					$(".warningPopWin .content>p").html("恭喜您！兑换成功。");
				} else {
					$(".warningPopWin").show();
					$(".warningPopWin .content>p").html(Mess.message);
				}
			}
		})
	} else {
		$(".warningPopWin,.mask").show();
		$(".warningPopWin .content>p").html("请先登录");
		$(".warningPopWin .closeBtn").on("click",function(){
			location.href = "../login.html";
		});
	}
}
/* 确认礼品兑换 end */
/* 是否已签到 start */
function isSign() {
	if (UserModel != null && UserModel != undefined) {
		$.ajax({
			type : "post",
			data : {
				uId : UserModel.userId,
				turnipType : 1,
				r : Math.random()
			},
			url : ServerUrl + "turnips/queryTody.do",
			async : false,
			dataType : "json",
			success : function(Mess, status) {
				if (Mess.success) {
					$("#earnRadishCoinList input").val("今日已签").attr("disabled",true).css("background-color","#c8c8c8");
				} else {
					$("#earnRadishCoinList input").on("click",userSign).attr("disabled", false);
				}
			}
		})
	}
}
/* 是否已签到 end */
/* 每日签到 start */
function userSign() {
	if (UserModel != null && UserModel != undefined) {
		$.ajax({
			type : "post",
			data : {
				uId : UserModel.userId,
				r : Math.random()
			},
			url : ServerUrl + "turnips/signTurnips.do",
			async : false,
			dataType : "json",
			success : function(Mess, status) {
				if (Mess.success) {
					$(".warningPopWin,.mask").show();
					$(".warningPopWin .content>p").html("签到成功！");
					$("#earnRadishCoinList input").val("今日已签").attr("disabled",true).css("background-color","#c8c8c8");
					location.reload();
				} else {
					$(".warningPopWin,.mask").show();
					$(".warningPopWin .content>p").html(Mess.message);
				}
			}
		})
	} else {
		$(".warningPopWin,.mask").show();
		$(".warningPopWin .content>p").html("请先登录");
		$(".warningPopWin .closeBtn").on("click",function(){
			location.href = "../login.html";
		});
	}
}
/* 每日签到 end */
/* 萝卜币明细 start */
function coinList(page) {
	if (UserModel != null && UserModel != undefined) {
		$.ajax({
			type : "post",
			data : {
				uId : UserModel.userId,
				page : page,
				r : Math.random()
			},
			url : ServerUrl + "turnips/queryTurnipsDto.do",
			async : false,
			dataType : "json",
			success : function(Mess, status) {
				if (Mess.success) {
					var listhtml = "";
					for (var i = 0; i < Mess.rows.length; i++) {
						for (var j = 0; j < Mess.rows[i].turnipsEntitys.length; j++) {
							listhtml += ("<tr>");
							listhtml += ('<td><span class="icon-solid-disc"></span></td>');
							var ty = "";
							if (Mess.rows[i].turnipsEntitys[j].addtype == 0) {
								ty = "-";
							}
							listhtml += ('<td><strong>'+Mess.rows[i].turnipsEntitys[j].turnipsDesction+'</strong><br><em>'+Mess.rows[i].createTime+'</em></td>');
							listhtml += ('<td><span>'+ty+ Mess.rows[i].turnipsEntitys[j].turnipCount+'</span></td>');
							listhtml += ("</tr>")
						}
					}
					var pagesize = 5;
					var pagecount = Math.ceil(Mess.total / pagesize);
					var pagehtml = "";
					if (page > 1) {
						pagehtml += '<a href="javascript:void(0)" onclick="coinList('+ (page - 1) + ')" class="prev">上一页</a>'
					} else {
						pagehtml += '<a href="javascript:void(0)" class="prev">上一页</a>';
					}
					var start,end;
					start = page - 6 / 2;
					if (start < 0){start = 0;}
					end = start + 6;
					if (end > pagecount){
						start = pagecount - 6;
						end = pagecount;
					}
					if(start<0){
						start=0;
					}
					for(var i=start;i<end;i++)  {
						if (page == (i + 1)) {
							pagehtml += '<a href="javascript:void(0)" onclick="coinList('
									+ (i + 1)+ ')" class="cur">'+ (i + 1) + "</a>";
						} else {
							pagehtml += '<a href="javascript:void(0)" onclick="coinList('
									+ (i + 1)+ ')">'+ (i + 1)+ "</a>";
						}
					}
					if (page < pagecount) {
						pagehtml += '<a href="javascript:void(0)" onclick="coinList('
								+ (page + 1)+ ')" class="next">下一页</a>';
					} else {
						pagehtml += '<a href="javascript:void(0)" class="next">下一页</a>';
					}
					$(".pagesBox").html(pagehtml);
					$("#radishCoinDetailList").html(listhtml);
				} 
			}
		})
	}
}
/* 萝卜币明细 end */
/* 获取用户的交易消息 start */
function getMessageList(page) {
	if (UserModel != null && UserModel != undefined) {
		$.ajax({
			type : "post",
			data : {
				userId : UserModel.userId,
				page : page,
				r : Math.random()
			},
			url : ServerUrl + "mess/queryPage.do",
			async : false,
			dataType : "json",
			success : function(Mess, status) {
				if (Mess.success) {
					var listhtml = "";
					for (var i = 0; i < Mess.rows.length; i++) {
						listhtml += ('<li onclick="readMessage('+ Mess.rows[i].messId + ',this)">');
						listhtml += ('<span class="icon-solid-disc"></span>');
						var messDesc= "";
						if (Mess.rows[i].title!=null) {
							messDesc=Mess.rows[i].title;
						}
						if (messDesc.length>27) {
							messDesc=messDesc.substr(0,27)+"...";
						}
						if (Mess.rows[i].messType == 0) {
							listhtml += ('<span>系统公告</span>：<span class="messageInfo">'+messDesc+'</span>');
						} else {
							listhtml += ('<span>交易信息</span>：<span class="messageInfo">'+messDesc+'</span>');
						}
						listhtml += ('<p class="messageContent">'+Mess.rows[i].messDesc+'</p>');
						if (Mess.rows[i].seenType == 0) {
							listhtml += ('<span id="msg_'+ Mess.rows[i].messId + '" class="unRead">未读</span>');
						}
						listhtml += ('<span class="icon-right-arrow"></span>');
						listhtml += ('<em>'+Mess.rows[i].createTime+'</em>');
						listhtml += ('</li>');
					}
					var pagesize = 5;
					var pagecount = Math.ceil(Mess.total / pagesize);
					var pagehtml = "";
					if (page > 1) {
						pagehtml += '<a href="javascript:void(0)" onclick="getMessageList('+ (page - 1) + ')" class="prev">上一页</a>';
					} else {
						pagehtml += '<a href="javascript:void(0)" class="prev">上一页</a>';
					}
					var start,end;
					start = page - 6 / 2;
					if (start < 0){
						start = 0;
					}
					end = start + 6;
					if (end > pagecount){
						start = pagecount - 6;
						end = pagecount;
					}
					if(start<0){
						start=0;
					}
					for(var i=start;i<end;i++)  {
						if (page == (i + 1)) {
							pagehtml += '<a href="javascript:void(0)" onclick="getMessageList('
									+ (i + 1)+ ')" class="cur">'+ (i + 1) + "</a>";
						} else {
							pagehtml += '<a href="javascript:void(0)" onclick="getMessageList('
									+ (i + 1)+ ')">'+ (i + 1)+ "</a>";
						}
					}
					if (page < pagecount) {
						pagehtml += '<a href="javascript:void(0)" onclick="getMessageList('
								+ (page + 1)+ ')" class="next">下一页</a>';
					} else {
						pagehtml += '<a href="javascript:void(0)" class="next">下一页</a>';
					}
					$(".pagesBox").html(pagehtml);
					$("#messageList").html(listhtml);
				} 
			}
		})
	}
}
/* 获取用户的交易消息 end */
/* 阅读交易消息 start */
/*function readMessage(mid, o) {
	if (UserModel != null && UserModel != undefined) {
		$.ajax({
			type : "post",
			data : {
				userId : UserModel.userId,
				mId : mid,
				r : Math.random()
			},
			url : ServerUrl + "mess/messSeen.do",
			async : false,
			dataType : "json",
			success : function(Mess, status) {
				if (Mess.success) {
					$("#msg_" + mid).hide();
					if ($(o).hasClass("icon-right-arrow")) {
						$(o).removeClass("icon-right-arrow").addClass("icon-down-arrow");
						$(o).parents("li").css("height","auto");
						$(o).parents("li").find(".messageContent").show();
					} else {
						$(o).removeClass("icon-down-arrow").addClass("icon-right-arrow");
						$(o).parents("li").css("height","25px");
						$(o).parents("li").find(".messageContent").hide();
					}
					return false;
				} else {
					$(".warningPopWin,.mask").show();
					$(".warningPopWin .content>p").html(Mess.message);
				}
			}
		})
	}
}*/
function readMessage(mid, o) {
	if (UserModel != null && UserModel != undefined) {
		$.ajax({
			type : "post",
			data : {
				userId : UserModel.userId,
				mId : mid,
				r : Math.random()
			},
			url : ServerUrl + "mess/messSeen.do",
			async : false,
			dataType : "json",
			success : function(Mess, status) {
				if (Mess.success) {
					$("#msg_" + mid).hide();
					if ($(o).find(".icon-right-arrow").length) {
						$(o).find(".icon-right-arrow").addClass("icon-down-arrow").removeClass("icon-right-arrow");
						$(o).css("height","auto");
						$(o).find(".messageContent").show();
					} else {
						$(o).find(".icon-down-arrow").addClass("icon-right-arrow").removeClass("icon-down-arrow");
						$(o).css("height","25px");
						$(o).find(".messageContent").hide();
					}
				} else {
					$(".warningPopWin,.mask").show();
					$(".warningPopWin .content>p").html(Mess.message);
				}
			}
		})
	}
}
/* 阅读交易消息 end */
/* 安全设置 start */
function getSafeSetting() {
	if (UserModel != null && UserModel != undefined) {
		$("#mobile_bound").html(UserModel.mobile.substr(0, 3)+ "****"+ UserModel.mobile.substr(UserModel.mobile.length - 4,4));
		$.ajax({
			type : "post",
			data : {
				userId : UserModel.userId,
				r : Math.random()
			},
			url : ServerUrl + "bankCard/queryByUser.do",
			async : false,
			dataType : "json",
			success : function(Mess, status) {
				if (Mess.success) {
					$("#bankBoundState").html("已绑定");
					$("#changeBoundState").html("解绑").attr("href","javascript:onCacelBankCard()").removeAttr("target");
				} else {
					$("#bankBoundState").html("未绑定");
					$("#changeBoundState").html("去绑定").attr("href",ServerUrl+ "huifu/doBankCardHuiFu.do?userId="+ UserModel.userId);
				}
			}
		});
	}else {
		$(".warningPopWin,.mask").show();
		$(".warningPopWin .content>p").html("请先登录");
		$(".warningPopWin .closeBtn").on("click",function(){
			location.href = "../login.html";
		});
	}
}
/* 安全设置 end */
/* 修改手机号码 start */
function changeMobilePopWin(){
	$(".changeForm").hide();
	$(".mobileChangePopWin .popWinTitle").html("更换手机");
	$(".mobileChangePopWin,.mask").show();
	$("#changeMobileForm01").show();
}
function changeMobileStep01(){
	if (UserModel != null && UserModel != undefined) {
		var phone = removeStrSpace($("#phone_cm").val());
		var mobileVCode = removeStrSpace($("#mobileVCode_cm").val());
		var pwd = removeStrSpace($("#password_cm").val());
		var message = "";
		if (pwd == "") {
			message += "-请输入登录密码<br>";
		}
		if (phone == "" ) {
			message += "-请输入原手机号码<br>";
		}
		if (mobileVCode == "") {
			message += "-请输入原手机号验证码<br>";
		}
		if (message == "") {
			$.ajax({
				type : "post",
				data : {
					passWord:hex_md5(pwd),
					mobile : phone,
					userId : UserModel.userId,
					validCode : mobileVCode,
					r : Math.random()
				},
				url : ServerUrl + "user/vaildUserForUpdateMobile1.do",
				async : false,
				dataType : "json",
				success : function(Mess, status) {
					if (Mess.success) {
						$("#changeMobileForm01").hide();
						$("#changeMobileForm02").show();
					} else {
						alert(Mess.message);
					}
				}
			})
		} else {
			alert(message);
		}
	} else {
		$(".warningPopWin,.mask").show();
		$(".warningPopWin .content>p").html("请先登录");
		$(".warningPopWin .closeBtn").on("click",function(){
			location.href = "../login.html";
		});
	}
}
function changeMobileStep02(){
	if (UserModel != null && UserModel != undefined) {
		var newPhone = removeStrSpace($("#newPhone_cm").val());
		var newMobileVCode = removeStrSpace($("#newMobileVCode_cm").val());
		var message = "";
		if (newPhone == "" ) {
			message += "-请输入新手机号码\n";
		}
		if (newMobileVCode == "") {
			message += "-请输入新手机号验证码\n";
		}
		if (message == "") {
			$.ajax({
				type : "post",
				data : {
					mobile : newPhone,
					userId : UserModel.userId,
					validCode : newMobileVCode,
					r : Math.random()
				},
				url : ServerUrl + "user/updateUserMobile.do",
				async : false,
				dataType : "json",
				success : function(Mess, status) {
					if (Mess.success) {
						$(".mobileChangePopWin").hide();
						$(".warningPopWin").show();
						$(".warningPopWin .content>p").html("手机号码更改成功");
						$("#mobile_bound").html(newPhone.substr(0, 3) + "****"+ newPhone.substr(newPhone.length - 4, 4));
					} else {
						alert(Mess.message);
					}
				}
			});
		} else {
			alert(message);
		}
	} else {
		$(".warningPopWin,.mask").show();
		$(".warningPopWin .content>p").html("请先登录");
		$(".warningPopWin .closeBtn").on("click",function(){
			location.href = "../login.html";
		});
	}
}
/* 修改手机号码 end */
/* 更换手机·发送验证码 start */
function sendMVCode_cm(o, name) {
	var phone = removeStrSpace($("#" + name).val());
	var ph = /^1[345789]\d{9}$/gi;
	var message = "";
	if (phone == "") {
		message += "-请输入手机号码\n";
	} else if (!ph.test(phone)) {
		message += "-请输入正确手机号码\n";
	}
	if (message == "") {
		$.ajax({
			type : "post",
			data : {
				mobile : phone,
				r : Math.random()
			},
			url : ServerUrl + "user/queryMobileVaild.do",
			async : true,
			dataType : "json",
			success : function(Mess, status) {
				alert(Mess.message);
				time(o);
			}
		})
	} else {
		alert(message);
	}
}
/* 更换手机·发送验证码 end */
/* 修改登录密码 start */
function changePwdPopWin(){
	$(".changeForm").hide();
	$(".mobileChangePopWin .popWinTitle").html("修改登录密码");
	$(".mobileChangePopWin,.mask").show();
	$("#changeLoginPwd").show();
}
function updatePass() {
	if (UserModel != null && UserModel != undefined) {
		var mobile = removeStrSpace($("#phone_pwd").val());
		var code = removeStrSpace($("#mobileVCode_pwd").val());
		var pwd1 = $("#password01_pwd").val();
		var pwd2 = $("#password02_pwd").val();
		var message = "";
		var ph = /^1[345789]\d{9}$/gi;
		var message = "";
		if (mobile == "") {
			message += "-请输入手机号码\n";
		} else {
			if (!ph.test(mobile)) {
				message += "-请输入正确手机号码\n";
			}
		}
		if (pwd1 == "") {
			message += "-请输入密码\n";
		}
		if (code == "") {
			message += "-请输入验证码\n";
		}
		if (pwd1 != pwd2) {
			message += "-两次密码输入不一致";
		}
		if (message == "") {
			$.ajax({
				type : "post",
				data : {
					mobile : mobile,
					newPassword : hex_md5(pwd1),
					validCode : code,
					r : Math.random()
				},
				url : ServerUrl + "user/sendPassByMobile.do",
				async : false,
				dataType : "json",
				success : function(Mess, status) {
					if (Mess.success) {
						$(".mobileChangePopWin").hide();
						$.cookie("cookie_uid", null);
						$(".warningPopWin").show();
						$(".warningPopWin .content>p").html("密码修改成功");
						$(".warningPopWin .closeBtn").on("click",function(){
							location.href = "../login.html";
						});
					} else {
						alert(Mess.message)
					}
				}
			});
		} else {
			alert(message);
		}
	} else {
		$(".warningPopWin,.mask").show();
		$(".warningPopWin .content>p").html("请先登录");
		$(".warningPopWin .closeBtn").on("click",function(){
			location.href = "../login.html";
		});
	}
}
/* 修改登录密码 end */
/* 活动中心列表 start */
function getActivityList(page) {
	if (UserModel != null && UserModel != undefined) {
		$.ajax({
			type : "post",
			data : {
				page : page,
				r : Math.random()
			},
			url : ServerUrl + "activity/queryPage.do",
			async : true,
			dataType : "json",
			success : function(Mess, status) {
				if (Mess.success) {
					var listhtml = "";
					for (var i = 0; i < Mess.rows.length; i++) {
						listhtml += ("<li>");
						listhtml += ("<h3>"+Mess.rows[i].activityTitle+"</h3>");
						listhtml += ("<p><em>活动时间："+Mess.rows[i].startTime+"</em></p>");
						listhtml += ('<img src="'+ PicUrl+ Mess.rows[i].activityPicForPc+'">');
						var _pHtml = Mess.rows[i].activityContent;
						_pHtml = _pHtml.replace(/<img.*>.*<\/img>/ig, "");
						_pHtml = _pHtml.replace(/<img.*\/>/ig, "");
						listhtml += (_pHtml);
						listhtml += ('<a href="'+ Mess.rows[i].activityUrl + '" target="_blank">查看详情&gt;&gt;</a>');
						listhtml += ("</li>");
					}
					var pagesize = 5;
					var pagecount = Math.ceil(Mess.total / pagesize);
					var pagehtml = "";
					if (page > 1) {
						pagehtml += '<a href="javascript:void(0)" onclick="getActivityList('+ (page - 1) + ')" class="prev">上一页</a>'
					} else {
						pagehtml += '<a href="javascript:void(0)" class="prev">上一页</a>'
					}
					var start,end;
					start = page - 6 / 2;
					if (start < 0){
						start = 0;
					}
					end = start + 6;
					if (end > pagecount){
						start = pagecount - 6;
						end = pagecount;
					}
					if(start<0){
						start=0;
					}
					for(var i=start;i<end;i++)  {
						if (page == (i + 1)) {
							pagehtml += '<a href="javascript:void(0)" onclick="getActivityList('
									 + (i + 1)+ ')" class="cur">'+ (i + 1) + "</a>";
						} else {
							pagehtml += '<a href="javascript:void(0)" onclick="getActivityList('
									 + (i + 1)+ ')">'+ (i + 1)+ "</a>";
						}
					}
					if (page < pagecount) {
						pagehtml += '<a href="javascript:void(0)" onclick="getActivityList('
								+ (page + 1)+ ')" class="next">下一页</a>';
					} else {
						pagehtml += '<a href="javascript:void(0)" class="next">下一页</a>';
					}
					$(".pagesBox").html(pagehtml);
					$("#activityList").html(listhtml);
				} 
			}
		});
	}else {
		$(".warningPopWin,.mask").show();
		$(".warningPopWin .content>p").html("请先登录");
		$(".warningPopWin .closeBtn").on("click",function(){
			location.href = "../login.html";
		});
	}
}
/* 活动中心列表 end */
/* 开户 start */
function regUserAccount(userid) {
	if (userid != "") {
		window.open(ServerUrl + "huifu/doRegistHuiFu.do?userId="+ UserModel.userId)
	}
}
/* 开户 end */
/* 我的账户页 end */

/* 产品详情页 start */
/* 获取产品详细信息 start */
function getProductDetail() {
	var gid = 0;
	gid = GetQueryString("gid");
	$.ajax({
		type:"POST",
		data:{
			goodId:gid,
			r:Math.random()
		},
		url:ServerUrl + "good/queryById.do",
		async:false,
		dataType:"json",
		success:function(Mess, textStatus, jqXHR) {
			if (Mess.success) {
				$(".productName").html(Mess.rows.goodName);
				$("#projectType").html(Mess.rows.gcName);
				var _surplusMoney=Mess.rows.surplusMoney;
				if(Mess.rows.gcId==13){
					_surplusMoney= Mess.rows.surplusMoney-(Mess.rows.buyMoney-Mess.rows.openMoney);
				}
				var valuesTime = (Mess.rows.valuesTime).substr(0,10); //起息时间yyyy-MM-dd格式
				var valueTime = (Mess.rows.valueTime).substr(0,10);   //结息时间yyyy-MM-dd格式
				var valuedTime = (Mess.rows.valuedTime).substr(0,10); //到账时间yyyy-MM-dd格式
				getServerCurTime();
				var _flag;
				if (Mess.rows.gcId==11 || Mess.rows.gcId==13) {
					_flag=dateCompare(now,valueTime);
				}else if (Mess.rows.gcId==5 || Mess.rows.gcId==10) {
					_flag=dateCompare(now,valuesTime);
				}
				if(_surplusMoney>0 && _flag<0){
					_surplusMoney = (_surplusMoney / 10000).toFixed(2) + "万";
				}else{
					_surplusMoney = "0.00万";
				}
				$(".surplusMoney").html(_surplusMoney);
				$(".payLabel").html(Mess.rows.payLabel);
				$("#salesProgress").html((Mess.rows.buyPercent*100).toFixed(2)+"%");
				$(".payMethod").html(Mess.rows.backType == 0 ? "到期本息自动返还至账户" : "到期红包收益自动返还至账户");
				$(".interestSettlementTime").html(Mess.rows.valueTime);
				$(".paymentTime").html(Mess.rows.valuedTime);
				$(".saleTime").html(Mess.rows.createTime.substr(0,10));
				/* 根据产品类型调整网页头部信息排版 start */
				if(Mess.rows.gcId == 10){
					var fundraisehtml='<p><span><strong id="fundraiseSurplus"></strong>天</span></p><p>募集期剩余</p>';
					$("#changeBox02").html(fundraisehtml);
					$.ajax({
						url:ServerUrl+"R_D_T/R_D_Time.do",
						type:"post",
						dataType:"json",
						success:function(_mss){
							var _nowArr=(_mss.rows[1]).split("-");
							var nowTime=new Date(_nowArr.join("/"));
							var _raiseTime =Mess.rows.raiseTime;
							var _createArr=(Mess.rows.createTime.substr(0, 10)).split("-");
							var _createTime=new Date(_createArr.join("/"));
							if (_raiseTime<=0) {
								$("#fundraiseSurplus").html("0");
								$("#investMoney").attr("readonly", "readonly");
								$(".gotoBuyIndex").attr("disabled", true).addClass("notAllowBuyIndex");
							}else{
								var _surplus=_raiseTime*24*3600*1000-(nowTime.getTime()-_createTime.getTime());
								if (_surplus<=0) {
									$("#fundraiseSurplus").html("0");
									$("#investMoney").attr("readonly", "readonly");
									$(".gotoBuyIndex").attr("disabled", true).addClass("notAllowBuyIndex");
								}else{
									var _surplusDays=Math.ceil(parseFloat(_surplus/(24*3600*1000)));
									$("#fundraiseSurplus").html(_surplusDays);
								}
							}
						}
					});
				}else if(Mess.rows.gcId == 13){
					$(".projectProgress").hide();
					var changehtml01='<p><span><strong>100</strong>元</span></p><p>起投金额</p><p class="addInfo">实际天数与起息规则有关</p>';
					$("#changeBox01").html(changehtml01);
					var changehtml02='<p><span><strong class="openMoney">'+Mess.rows.openMoney+'</strong>元</span></p><p>开放额度</p>';
					$("#changeBox02").html(changehtml02);
					var changehtml03='<p><span><strong class="castMoney">'+(Mess.rows.buyMoney-Mess.rows.surplusMoney).toFixed(2)+'</strong>元</span></p><p>累计金额</p>';
					$("#changeBox03").html(changehtml03);
					var changehtml04='<p><span><strong class="castPersonCount">'+Mess.rows.buyUserCount+'</strong>人</span></p><p>累计人数</p>';
					$(".downPart .progressBar").html(changehtml04).css({
						"background-image":"none"
					});
					$("#_goodType").val("6");
				}
				/* 根据产品类型调整网页头部信息排版 end */
				/* 理财期限和起息or起售日期 start */
				var _manageTime=Mess.rows.manageTime;
				if (Mess.rows.manageTime<0) {
					_manageTime=0;
				}
				/* 区别出定期产品 start */
				if (Mess.rows.gcId == 10) {
					$(".valuesTime").html(Mess.rows.valuesTime);
					_manageTime=Mess.rows.investTime;
				}else{
					$(".valuesTime").html(Mess.rows.valuesTime+"(购买成功即起息)");
				}
				/* 区别出定期产品 end */
				$(".investTime").html(_manageTime);
				/* 理财期限和起息or起售日期 end */
				/* 年化收益率 start */
				$("#_proceeds").val(Mess.rows.proceeds);	// 预存储信息
				var proceeds = Mess.rows.proceeds + "";
				var p1 = "0";
				var p2 = "0";
				if (proceeds.indexOf(".") > -1) {
					var proceedslist = proceeds.split(".");
					p1 = proceedslist[0];
					p2 = proceedslist[1];
				} else {
					p1 = proceeds;
					p2 = "00"
				}
				var annualYield=p1+"."+p2;
				$(".annualYield").html(annualYield);
				/* 年化收益率 end */
				/* 判断用户是否可以购买新手产品 start */
				if (Mess.rows.gcId == 11) {
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
					            if (mss.rows.couponFlg==1) {
									$("#investMoney").attr("readonly", "readonly");
									$(".gotoBuyIndex").attr("disabled", true).addClass("notAllowBuyIndex");
									$(".popWin:eq(0),.mask").show();
									$(".popWin:eq(0) .content>p").html("新手标产品每人限购一次");
								}
					        }
					    });
					}
				}
				/* 判断用户是否可以购买新手产品 end */
				/* 立即购买 start */
				if (Mess.rows.gcId != 11 && _surplusMoney < 100 && _surplusMoney > 0) {
					$("#investMoney").val(_surplusMoney);
					$("#investMoney").attr("readonly", "readonly");
				}else{
					$("#investMoney").on("blur",function(){
						var n = /^\d+(\.\d+)?$/;
						var _val=parseFloat($(this).val());
						if (n.test($(this).val()) && (_val%100==0)){
							if($("#_goodType").val()=="6" && parseInt($(this).val())>100000){
								$(this).val(100000);
								$(".popWin:eq(0),.mask").show();
								$(".popWin:eq(0) .content>p").html("活期产品每人每次限购10万元");
							}
							if (parseInt($(this).val()) > _surplusMoney) {
								$(this).val(_surplusMoney);
							}
							$("#investMoney+em").attr("class","icon-check-right");
						}else{
							$(this).val("");
							$("#investMoney+em").attr("class","icon-check-error");
						}
					});	
				}
				$("#selectAll").on("click",function() {
					if ($(this).is(":checked")) {
						if (Mess.rows.gcId==13 && _surplusMoney>100000) {
							_surplusMoney=100000;
						}
						$("#investMoney").val(_surplusMoney);
						$("#investMoney+em").attr("class","icon-check-right");
					} else {
						$("#investMoney").val("");
						$("#investMoney+em").attr("class","icon-check-error");
					}
				});
				/* 立即购买 end */
				/* 项目进度 start */
				$.ajax({
					url:ServerUrl+"R_D_T/R_D_Time.do",
					type:"post",
					dataType:"json",
					success:function(_mss){
						var _nowArr=(_mss.rows[1]).split("-");
						var _nowTime=new Date(_nowArr.join("/"));
						var _createArr=(Mess.rows.createTime.substr(0,10)).split("-");
						var _createTime=new Date(_createArr.join("/"));
						var _valuesArr=(Mess.rows.valuesTime).split("-");
						var _valuesTime=new Date(_valuesArr.join("/"));
						var _valueArr=(Mess.rows.valueTime).split("-");
						var _valueTime=new Date(_valueArr.join("/"));
						var _valuedArr=(Mess.rows.valuedTime).split("-");
						var _valuedTime=new Date(_valuedArr.join("/"));
						if ((_nowTime.getTime()-_createTime.getTime())>=0 && (_nowTime.getTime()-_valuesTime.getTime())<0) {
							$("#progress-bar ul>li:eq(0)>.icon-solid-disc").addClass("cur");
							var _ratio=parseFloat((_nowTime.getTime()-_createTime.getTime())*17/(_valuesTime.getTime()-_createTime.getTime()));
							$("#progress-bar_ratio").css("width",_ratio+"%");
						}else if ((_nowTime.getTime()-_valuesTime.getTime())>=0 && (_nowTime.getTime()-_valueTime.getTime())<0) {
							$("#progress-bar ul>li:eq(0)>.icon-solid-disc,#progress-bar ul>li:eq(1)>.icon-solid-disc").addClass("cur");
							var _ratio=parseFloat((_nowTime.getTime()-_valuesTime.getTime())*63/(_valueTime.getTime()-_valuesTime.getTime()))+17;
							$("#progress-bar_ratio").css("width",_ratio+"%");
						}else if ((_nowTime.getTime()-_valueTime.getTime())>=0 && (_nowTime.getTime()-_valuedTime.getTime())<0) {
							$("#progress-bar ul>li:eq(0)>.icon-solid-disc,#progress-bar ul>li:eq(1)>.icon-solid-disc,#progress-bar ul>li:eq(2)>.icon-solid-disc").addClass("cur");
							var _ratio=parseFloat((_nowTime.getTime()-_valueTime.getTime())*20/(_valuedTime.getTime()-_valueTime.getTime()))+80;
							$("#progress-bar_ratio").css("width",_ratio+"%");
						}else if ((_nowTime.getTime()-_valuedTime.getTime())>=0) {
							$("#progress-bar .icon-solid-disc").addClass("cur");
							$("#progress-bar_ratio").css("width","100%");
						}
					}
				});
				/* 项目进度 end */
				/* 收益小助手 start */
				$(".calcBtn").on("click",function(){
					$("#investDays_calc").trigger("blur");
					$("#investMoney_calc").trigger("blur");
					var a=($("#investDays_calc+span").attr("class")=="icon-check-right");
					var b=($("#investMoney_calc+span").attr("class")=="icon-check-right");
					if (a && b) {
						var investDays=$("#investDays_calc").val();
						var investMoney=$("#investMoney_calc").val();
						$("#bankIncomeBar").height((0.7*100/15)+"px");
						$("#radishIncomeBar").height((Mess.rows.proceeds*100/15)+"px");
						$("#bankIncome").html((0.007*parseInt(investMoney)/365*investDays).toFixed(2)+"元");
						$("#radishIncome").html(((Mess.rows.proceeds / 100)*parseInt(investMoney)/365*investDays).toFixed(2)+"元");
					}else{
						$("#bankIncomeBar").height("0px");
						$("#radishIncomeBar").height("0px");
						$("#bankIncome").html("");
						$("#radishIncome").html("");
					}
				});
				$("#investDays_calc").on("blur",function(){
					var _n= /^\d+$/;
					if (_n.test($("#investDays_calc").val())){
						$("#investDays_calc+span").attr("class","icon-check-right");
					}else{
						$("#investDays_calc+span").attr("class","icon-check-error");						
					}
				});	
				$("#investMoney_calc").on("blur",function(){
					var n = /^\d+(\.\d+)?$/;
					if (n.test($("#investMoney_calc").val())){
						$("#investMoney_calc+span").attr("class","icon-check-right");
					}else{
						$("#investMoney_calc+span").attr("class","icon-check-error");						
					}
				});	
				/* 收益小助手 end */
				$("#billPhoto>img").attr("src",PicUrl+Mess.rows.safeLabel);
				progressLoad(Math.floor(Mess.rows.buyPercent*100));
				getProductLog(gid, 1,Mess.rows.gcId);
			}
		}
	})
}
/* 获取产品详细信息 end */
/* 圆形进度条 start */
var _progressNum=0;
var _progressTimer;
function progressLoad(progressNum){
	if (progressNum>=0&&progressNum<=100) {
		_progressTimer=setInterval(function(){
			if (_progressNum<progressNum) {
				_progressNum++;
				$(".progressBar").css({"background-position":"-"+_progressNum*81+"px"+" center"});
			}else{
				clearInterval(_progressTimer);
			}
		},15);
	}else{
		return false;
	}
}
/* 圆形进度条 end */
/* 获取产品交易记录 start */
function getProductLog(gId, page,gcId) {
	$.ajax({
		type : "POST",
		data : {
			page : page,
			gcId: gcId,
			goodId : gId,
			r : Math.random()
		},
		url : ServerUrl + "buyOrder/queryPageEnding2.do",
		async : true,
		dataType : "json",
		success : function(Mess, textStatus, jqXHR) {
			if (Mess.success) {
				var listhtml = "";
				var buyState=["未支付","已投标","已放款","已还款","处理失败"];
				for (var i = 0; i < Mess.rows.length; i++) {
					listhtml += "<tr><td>"
							+ Mess.rows[i].buyOrderNo.substr(0, 3)+ "****"+ Mess.rows[i].buyOrderNo.substr(Mess.rows[i].buyOrderNo.length - 4,4)
							+ '</td><td><span class="cur">'
							+ (Mess.rows[i].speedMoney / 10000).toFixed(2)
							+ "万</span></td><td>手动投资</td><td>"+buyState[Mess.rows[i].buyOrder]+"</td><td>"
							+ Mess.rows[i].createTime + "</td></tr>";
				}
				var pagesize = 5;
				var pagecount = Math.ceil(Mess.total / pagesize);
				var pagehtml = "";
				if (page > 1) {
					pagehtml += '<a href="javascript:void(0)" onclick="getProductLog('
							+ gId+ ","+ (page - 1)+ ','+gcId+')" class="prev">上一页</a>';
				} else {
					pagehtml += '<a href="javascript:void(0)" class="prev">上一页</a>';
				}
				var start,end;
				start = page - 6 / 2;
				if (start < 0){
					start = 0;
				}
				end = start + 6;
				if (end > pagecount){
					start = pagecount - 6;
					end = pagecount;
				}
				if(start<0){
					start=0;
				}
				for(var i=start;i<end;i++) {
					if (page == (i + 1)) {
						pagehtml += '<a href="javascript:void(0)" onclick="getProductLog('
								+ gId+ ","+ (i + 1)+ ','+gcId+')" class="cur">' + (i + 1) + "</a>";
					} else {
						pagehtml += '<a href="javascript:void(0)" onclick="getProductLog('
								+ gId+ ","+ (i + 1)+ ','+gcId+')">'+ (i + 1)+ "</a>";
					}
				}
				if (page < pagecount) {
					pagehtml += '<a href="javascript:void(0)" onclick="getProductLog('
							+ gId+ ","+ (page + 1)+ ','+gcId+')" class="next">下一页</a>';
				} else {
					pagehtml += '<a href="javascript:void(0)" class="next">下一页</a>';
				}
				$(".pagesBox").html(pagehtml);
				$("#logList").html(listhtml);
			}
		}
	});
}
/* 获取产品交易记录 end */
/* 产品购买 start */
function onBuy() {
	var money = $("#investMoney").val();
	var proceeds = $("#_proceeds").val(); 
	proceeds = parseFloat(proceeds);
	var surplusMoney = $(".surplusMoney").val();
	var investTime = $(".investTime").html(); 
	surplusMoney = parseFloat(surplusMoney);
	var gid = 0;
	var gid = GetQueryString("gid");
	if (gid == 0 || gid == undefined) {
		$(".popWin:eq(0),.mask").show();
		$(".popWin:eq(0) .content>p").html("请重新选择商品");
		$(".popWin:eq(0) .closeBtn").on("click",function(){
			location.href = "../invest/toFinance.html";
		});
		return;
	}
	if (money != "") {
		if (UserModel != null && UserModel.userId > 0) {
			if (UserModel.isAutonym == 0) {
				var prohtml = '您还未开户，开户方可进行投资。<br><a class="cur" href="javascript:void(0);" onclick="regUserAccount('
						+ UserModel.userId + ')">立即开户，马上赚钱</a>';
				$(".popWin:eq(0),.mask").show();
				$(".popWin:eq(0) .content>p").html(prohtml);
				$(".popWin:eq(0) .closeBtn").on("click",function(){
					location.reload();
				});
			} else {
				$(".gotoBuyIndex").val("提交中...").attr("disabled", true).addClass("notAllowBuyIndex");
				$.ajax({
					type : "post",
					data : {
						uId : UserModel.userId,
						goodId : gid,
						money : money,
						r : Math.random()
					},
					url : ServerUrl + "buyOrder/saveNotBenXi.do",
					async : false,
					dataType : "json",
					success : function(Mess, status) {
						if (Mess.success) {
							$(".paymentPopWin,.mask").show();
							$(".paymentPopWin .closeBtn").on("click",function(){
								location.reload();
							});
							$(".paymentPopWin").animate({
								"top" : "50%",
								"opacity" : "1"
							}, 400).show().css({
								"margin-top" : -($(".paymentPopWin").height())/2 + "px"
							});
							$("#paymentIframe").attr("src",ServerUrl + "huifu/doPay.do?userId="+ UserModel.userId+ "&buyOrderId="+ Mess.rows.buyOrderId);
							$("#paymentIframe").attr("index",Mess.rows.buyOrderId);
							$(".gotoBuyIndex").val("立即购买").attr("disabled", false).removeClass("notAllowBuyIndex");
						} else {
							$(".gotoBuyIndex").val("立即购买").attr("disabled", false).removeClass("notAllowBuyIndex");
							$(".popWin:eq(0),.mask").show();
							$(".popWin:eq(0) .content>p").html(Mess.message);
						}
					}
				});
			}
		} else {
			$(".popWin:eq(0),.mask").show();
			$(".popWin:eq(0) .content>p").html("请先登录");
			$(".popWin:eq(0) .closeBtn").on("click",function(){
				var a = location.href;
				location.href = "../login.html?ref=" + a;
			});
		}
	}else{
		$(".popWin:eq(0),.mask").show();
		$(".popWin:eq(0) .content>p").html("请输入购买金额");
	}
}
/* 产品购买 end */

/* 忘记密码页 start */
/* 忘记密码·第一步 start */
function onForgetStep1() {
	var phone = removeStrSpace($("#phone").val());
	var code = removeStrSpace($("#mobileVCode").val());
	var message = "";
	var ph = /^1[345789]\d{9}$/gi;
	var message = "";
	if (phone == "") {
		message += "-请输入手机号码<br>"
	} else if (!ph.test(phone)) {
		message += "-请输入正确手机号码<br>"
	}
	if (code == "") {
		message += "-请输入验证码<br>"
	}
	if (message == "") {
		$(".forgetpwdStep01").hide();
		$(".forgetpwdStep02").show()
	} else {
		$(".popWin,.mask").show();
		$(".popWin .content>p").html(message);
	}
}
/* 忘记密码·第一步 end */
/* 忘记密码·第二步 start */
function onForgetStep2() {
	var pwd1 = $("#password01").val();
	var pwd2 = $("#password02").val();
	var phone = removeStrSpace($("#phone").val());
	var code = removeStrSpace($("#mobileVCode").val());
	var message = "";
	if (pwd1 == "") {
		message += "-请输入新密码<br>"
	} else if (pwd1.length < 6) {
		message += "-密码长度不能少于6位<br>"
	}
	if (pwd1 != pwd2) {
		message += "-两次密码输入不一致"
	}
	if (message == "") {
		$(".submitBtn02").val("提交中...").attr("disabled", true);
		$.ajax({
			type : "post",
			data : {
				mobile : phone,
				newPassword : hex_md5(pwd1),
				validCode : code,
				r : Math.random()
			},
			url : ServerUrl + "user/sendPassByMobile.do",
			async : true,
			dataType : "json",
			success : function(Mess, status) {
				$(".submitBtn02").val("确认修改").attr("disabled", false);
				if (Mess.success) {
					$(".popWin,.mask").show();
					$(".popWin .content>p").html('您的密码已经修改成功！<a href="../index.html">返回首页</a>');
				} else {
					$(".popWin,.mask").show();
					$(".popWin .content>p").html(Mess.message);
					$(".popWin .closeBtn").on("click",function(){
						if (Mess.message.indexOf("验证码") > -1) {
							$(".forgetpwdStep01").show();
							$(".forgetpwdStep02").hide();
						}	
					});
				}
			}
		})
	} else {
		$(".popWin,.mask").show();
		$(".popWin .content>p").html(message);
	}
}
/* 忘记密码·第二步 end */
/* 忘记密码页 end */

/*首页 start*/
function indexInit(){
	getNewNotice_index();
	getProductList_index();
	getNewsList_index();
	getQA_index();
}
/*首页·最新公告+平台公告 start*/
function getNewNotice_index() {
	$.ajax({
		type : "POST",
		data : {
			page : 1,
			contentType : 1,
			r : Math.random()
		},
		url : ServerUrl + "news/queryByTypePage.do",
		async : true,
		dataType : "json",
		success : function(Mess, textStatus, jqXHR) {
			if (Mess.success) {
				var prohtml = ('<a href="about/platformDetail.html?id='+ Mess.rows[1].nId + '">'+ Mess.rows[1].newsTitle + "</a>");
				$("#newInfoTitle").html(prohtml);
				$("#newInfoTime").html(Mess.rows[1].createTime);
				// banner底部的公告
				var listhtml="";
				for (var i = 0; i < Mess.rows.length; i++) {
					if (i > 9) {
						break;
					}
					if ((Mess.rows[i].newsTitle).length>15) {
						var newsTitle=(Mess.rows[i].newsTitle).substr(0,15)+"...";
					} else{
						var newsTitle=Mess.rows[i].newsTitle;
					}
					listhtml += '<li><a href="about/platformDetail.html?id='+ Mess.rows[1].nId + '">·&nbsp;'+newsTitle+'</a></li>';
				}
				$("#platformNoticeNew").html(listhtml);
			}
		}
	});
}
/*首页·最新公告+平台公告 end*/
/* 首页·获取项目列表 start */
function getProductList_index() {
	$.ajax({
		type : "POST",
		data : {
			goodClassId : 11,
			page : 1,
			procedflg : -1,
			invertFlg : -1,
			r : Math.random()
		},
		url : ServerUrl + "good/queryPage1.do",
		async : true,
		dataType : "json",
		success : function(Mess, textStatus, jqXHR) {
			if (Mess.success) {
				$(".novice_index .productName").html(Mess.rows[0].goodName);
				$(".novice_index .cash").html(Mess.rows[0].payLabel.substr(0,12));
				$(".novice_index .yieldRate").html(Mess.rows[0].proceeds+"%");
				var _manageTime=Mess.rows[0].manageTime;
				if (Mess.rows[0].manageTime<0) {
					_manageTime=0;
				}
				$(".novice_index .dueTime").html("期限"+_manageTime+"天（实际天数与起息规则有关）");
				$(".novice_index .progressBar span").html(Mess.rows[0].buyPercent*100+"%");
				progressLoad(Math.floor(Mess.rows[0].buyPercent*100));
				var valuesTime = (Mess.rows[0].valuesTime).substr(0,10); //起息时间yyyy-MM-dd格式
				var valueTime = (Mess.rows[0].valueTime).substr(0,10);   //结息时间yyyy-MM-dd格式
				var valuedTime = (Mess.rows[0].valuedTime).substr(0,10); //到账时间yyyy-MM-dd格式
				getServerCurTime();
				var _surplusMoney=Mess.rows[0].surplusMoney;
				if(_surplusMoney>0 && dateCompare(now,valueTime)<0){
					_surplusMoney = (_surplusMoney / 10000).toFixed(2) + "万";
				}else{
					_surplusMoney = "0.00万";
				}
				$(".novice_index .surplusMoney").html("可购金额："+_surplusMoney+"元");
				if(parseFloat(_surplusMoney)>0&&dateCompare(now,valueTime)<0){
					$(".novice_index .gotoBuyIndex").attr("href","invest/productDetails.html?gid="+ Mess.rows[0].goodId+"&gcId=11");
				} else if(dateCompare(now,valuedTime)>=0) {
					$(".novice_index .gotoBuyIndex").html("已 还 款").addClass("notAllowBuyIndex");
				} else if(dateCompare(now,valuedTime)<0 && dateCompare(now,valueTime)>=0) {
					$(".novice_index .gotoBuyIndex").html("还 款 中").addClass("notAllowBuyIndex");
				} else {
					$(".novice_index .gotoBuyIndex").html("已 售 罄").addClass("notAllowBuyIndex");
				}
			}
		}
	});
	$.ajax({
		type : "POST",
		data : {
			goodClassId : 13,
			page : 1,
			procedflg : -1,
			invertFlg : -1,
			r : Math.random()
		},
		url : ServerUrl + "good/queryPage1.do",
		async : true,
		dataType : "json",
		success : function(Mess, textStatus, jqXHR) {
			if (Mess.success) {
				$(".current_index .yieldRate").html(Mess.rows[0].proceeds+"%");
				$(".current_index .progressBar span").html(Mess.rows[0].buyPercent*100+"%");
				var valuesTime = (Mess.rows[0].valuesTime).substr(0,10); //起息时间yyyy-MM-dd格式
				var valueTime = (Mess.rows[0].valueTime).substr(0,10);   //结息时间yyyy-MM-dd格式
				var valuedTime = (Mess.rows[0].valuedTime).substr(0,10); //到账时间yyyy-MM-dd格式
				getServerCurTime();
				var _surplusMoney= Mess.rows[0].surplusMoney-(Mess.rows[0].buyMoney-Mess.rows[0].openMoney);
				if (dateCompare(now,valueTime)>=0) {
					_surplusMoney=(_surplusMoney/10000).toFixed(2)+ "万";
				}else{
					_surplusMoney="0.00万";
				}
				$(".current_index .surplusMoney").html(_surplusMoney);
				if(parseFloat(_surplusMoney)>0&&dateCompare(now,valueTime)<0){
					$(".current_index .gotoBuyIndex").attr("href","invest/productDetails.html?gid="+ Mess.rows[0].goodId+"&gcId=13");
				} else if(dateCompare(now,valuedTime)>=0) {
					$(".current_index .gotoBuyIndex").html("已 还 款").addClass("notAllowBuyIndex");
				} else if(dateCompare(now,valuedTime)<0 && dateCompare(now,valueTime)>=0) {
					$(".current_index .gotoBuyIndex").html("还 款 中").addClass("notAllowBuyIndex");
				} else {
					$(".current_index .gotoBuyIndex").html("已 售 罄").addClass("notAllowBuyIndex");
				}
			} 
		}
	});
	$.ajax({
		type : "POST",
		data : {
			goodClassId : 10,
			page : 1,
			procedflg : -1,
			invertFlg : -1,
			r : Math.random()
		},
		url : ServerUrl + "good/queryPage1.do",
		async : true,
		dataType : "json",
		success : function(Mess, textStatus, jqXHR) {
			if (Mess.success) {
				var listhtml='<li><h3>定期产品</h3><p>锁定期是150天，150天后可以提现。提现是T+3节假日顺延。</p><a href="invest/toFinance.html?gcId=10">查看更多</a></li>';
				for (var i = 0; i < Mess.rows.length; i++) {
					if (i>2) {
						break;
					}
					listhtml += '<li>';
					listhtml += '<p class="productName">'+Mess.rows[i].goodName+'</p>';
					listhtml += '<p><span><strong>'+Mess.rows[i].proceeds+'</strong>%</span></p>';
					listhtml += '<p><em>预计年化收益</em></p>';
					listhtml += '<p><i>投资期限 '+ Mess.rows[i].investTime+' 天</i></p>';
					var valuesTime = (Mess.rows[i].valuesTime).substr(0,10); //起息时间yyyy-MM-dd格式
					var valueTime = (Mess.rows[i].valueTime).substr(0,10);   //结息时间yyyy-MM-dd格式
					var valuedTime = (Mess.rows[i].valuedTime).substr(0,10); //到账时间yyyy-MM-dd格式
					getServerCurTime();
					if(Mess.rows[i].surplusMoney>0&&dateCompare(now,valuesTime)<0){
						listhtml += '<a href="invest/productDetails.html?gid='+Mess.rows[i].goodId+'&gcId=10 class="gotoBuyIndex">立即购买</a>';
					} else if(dateCompare(now,valuedTime)>=0) {
						listhtml += '<a href="javascript:void(0);" class="gotoBuyIndex notAllowBuyIndex">已 还 款</a>';
					} else if(dateCompare(now,valuedTime)<0 && dateCompare(now,valueTime)>=0) {
						listhtml += '<a href="javascript:void(0);" class="gotoBuyIndex notAllowBuyIndex">还 款 中</a>';
					} else {
						listhtml += '<a href="javascript:void(0);" class="gotoBuyIndex notAllowBuyIndex">已 售 罄</a>';
					}
					listhtml += '</li>';
				}
				$(".fixedDeposit_index").html(listhtml);
			} 
		}
	});
	$.ajax({
		type : "POST",
		data : {
			goodClassId : 5,
			page : 1,
			procedflg : -1,
			invertFlg : -1,
			r : Math.random()
		},
		url : ServerUrl + "good/queryPage1.do",
		async : true,
		dataType : "json",
		success : function(Mess, textStatus, jqXHR) {
			if (Mess.success) {
				var prohtml='';
				for (var i = 0; i < Mess.rows.length; i++) {
					if (i>4) {
						break;
					}
					prohtml += '<tr>';
					prohtml += '<td><p><strong>'+Mess.rows[i].goodName+'</strong></p><p class="cash">'+Mess.rows[i].payLabel.substr(0,16)+'</p></td>';
					prohtml += '<td><p><span><b>'+Mess.rows[i].proceeds+'</b>%</span></p><p>预计年化收益</p></td>';
					var _manageTime=Mess.rows[i].manageTime;
					if (_manageTime<0) {
						_manageTime=0;
					}
					prohtml += '<td><p><i>'+_manageTime+'天</i></p><p>投资期限</p></td>';
					var ratio= Mess.rows[i].buyPercent*100+"%";
					var valuesTime = (Mess.rows[i].valuesTime).substr(0,10); //起息时间yyyy-MM-dd格式
					var valueTime = (Mess.rows[i].valueTime).substr(0,10);   //结息时间yyyy-MM-dd格式
					var valuedTime = (Mess.rows[i].valuedTime).substr(0,10); //到账时间yyyy-MM-dd格式
					getServerCurTime();
					if (dateCompare(now,valuesTime)<0) {
						prohtml += '<td><p><i>'+Mess.rows[i].surplusMoney+'元</i></p><p>可投金额</p></td>';
						prohtml += '<td><p class="progressBar"><em style="width:'+ratio+';"></em></p>';
					}else{
						prohtml += '<td><p><i>0.00元</i></p><p>可投金额</p></td>';
						prohtml += '<td><p class="progressBar"><em style="width:100%;"></em></p>';
					}
					if(Mess.rows[i].surplusMoney>0&&dateCompare(now,valuesTime)<0){
						prohtml += '<p><a href="invest/productDetails.html?gid='+Mess.rows[i].goodId+'&gcId=5 class="gotoBuyIndex">立即抢购</a></p></td>';
					} else if(dateCompare(now,valuedTime)>=0) {
						prohtml += '<p><a href="javascript:void(0);" class="gotoBuyIndex notAllowBuyIndex">已 还 款</a></p></td>';
					} else if(dateCompare(now,valuedTime)<0 && dateCompare(now,valueTime)>=0) {
						prohtml += '<p><a href="javascript:void(0);" class="gotoBuyIndex notAllowBuyIndex">还 款 中</a></p></td>';
					} else {
						prohtml += '<p><a href="javascript:void(0);" class="gotoBuyIndex notAllowBuyIndex">已 售 罄</a></p></td>';
					}
					prohtml += '</tr>';
				}
				$("#taelsSeedlingNew").html(prohtml);
			} 
		}
	});
}
/* 首页·获取项目列表 end */
/* 首页·相关新闻 start */
function getNewsList_index() {
	$.ajax({
		type : "post",
		data : {
			page : 1,
			contentType : 0,
			r : Math.random()
		},
		url : ServerUrl + "news/queryByTypePage.do",
		async : true,
		dataType : "json",
		success : function(Mess, status) {
			var listhtml = "";
			if (Mess.success) {
				for (var i = 0; i < Mess.rows.length; i++) {
					if (i > 2) {
						break
					}
					listhtml += ("<li>");
					listhtml += ('<img src="'+ PicUrl + Mess.rows[i].newsIcon + '">');
					if ((Mess.rows[i].newsTitle).length>14) {
						var newsTitle=(Mess.rows[i].newsTitle).substr(0,14)+"...";
					} else{
						var newsTitle=Mess.rows[i].newsTitle;
					}
					listhtml += ('<p class="reportsTitle"><a href="about/platformDetail.html?id='+ Mess.rows[i].nId+ '">'+ newsTitle + '</a></p>');
					var con = Mess.rows[i].newsGuide.replace(/<\/?[^>]*>/g, "");
					if (con.length > 30) {
						con = con.substr(0, 30)+"...";
					}
					listhtml += ('<p class="reportsInfo">'+con+'</p>');
					listhtml += ("</li>");
				}
				$("#mediaReportsNew").html(listhtml);
			}
		}
	})
}
/* 首页·相关新闻 end */
/* 首页·理财问答 start */
function getQA_index() {
	$.ajax({
		type : "POST",
		data : {
			qcId : -1,
			page : 1,
			r : Math.random()
		},
		url : ServerUrl + "question/queryPage.do",
		async : true,
		dataType : "json",
		success : function(Mess, textStatus, jqXHR) {
			if (Mess.success) {
				var listhtml = "";
				var indexArr={};
				for (var i = 0; i < Mess.rows.length; i++) {
					if (i > 1) {
						break;
					}else{
						if(indexArr[Mess.rows[i].qcId]==undefined){
							indexArr[Mess.rows[i].qcId]=1;
						}else{
							indexArr[Mess.rows[i].qcId]++;
						}
					}
					listhtml += ("<li>");
					listhtml += ('<p class="question"><a href="help/financialQA.html?qcId='+Mess.rows[i].qcId+'&index='+indexArr[Mess.rows[i].qcId]+'">'+Mess.rows[i].question+'</a></p>');
					if(Mess.rows[i].answer.length>23){
						listhtml += ('<p class="answer">'+(Mess.rows[i].answer).substr(0,23)+'...</p>');
					}else{
						listhtml += ('<p class="answer">'+Mess.rows[i].answer+'</p>');
					}
					listhtml += ("</li>");
				}
				$("#financialQAHot").html(listhtml);
			}
		}
	});
}
/* 首页·理财问答 end */
/*首页 end*/

/* 比较两个日期的大小 start */
function dateCompare(date1,date2){
	date1 = date1.replace(/\-/gi,"/");
	date2 = date2.replace(/\-/gi,"/");
	var time1 = new Date(date1).getTime();
	var time2 = new Date(date2).getTime();
	if(time1 > time2){
		return 1;
	}else if(time1==time2){
		return 0;
	}else{
		return -1;
	}
}
/* 比较两个日期的大小 end */

/* 获取服务器当前时间 start */
var now;
function getServerCurTime(){
	$.ajax({
		url:ServerUrl+"R_D_T/R_D_Time.do",
		type:"post",
		dataType:"json",
		success:function(_mss){
			now=_mss.rows[1];
		}
	});
}
/* 获取服务器当前时间 end */