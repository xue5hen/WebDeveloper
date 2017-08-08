// 网页中的图片属性配置示例
/*
<img src="小图地址"
	class="LightBox-images" 	// 与data-role任选其一即可
	data-role="lightbox" 	// 与class任选其一即可
	data-source="大图地址" 
	data-group="图片分组" 
	data-id="图片id"
	data-caption="图片描述"
/>
*/

;(function($){
	var LightBox=function(){
		var self=this;
		// 创建遮罩和弹出框
		this.popupMask=$('<div id="LightBox-mask">');
		this.popupWin=$('<div id="LightBox-popup">');
		// 保存BODY
		this.bodyNode=$(document.body);
		// 渲染剩余的DOM，并且插入到BODY
		this.renderDOM();
		this.picViewArea=this.popupWin.find("div.LightBox-pic-view");	// 图片预览区
		this.popupPic=this.popupWin.find("img.LightBox-image");	// 图片
		this.picCaptionArea=this.popupWin.find("div.LightBox-pic-caption")	// 图片描述区域
		this.prevBtn=this.popupWin.find("span.LightBox-prev-btn");
		this.nextBtn=this.popupWin.find("span.LightBox-next-btn");
		this.captionText=this.popupWin.find("p.LightBox-pic-desc");	// 图片描述
		this.currentIndex=this.popupWin.find("span.LightBox-of-index");	// 图片当前索引
		this.closeBtn=this.popupWin.find("span.LightBox-close-btn");	// 关闭按钮
		// 准备开发事件委托，获取组数据
		this.groupName=null;
		this.groupData=[];	// 放置同一组数据
		this.bodyNode.delegate("*[data-role=lightbox]","click",function(e){
			// 阻止事件冒泡
			e.stopPropagation();
			var currentGroupName=$(this).attr("data-group");
			if (currentGroupName!=self.groupName) {
				self.groupName=currentGroupName;
				// 根据当前组名获取同一组数据
				self.getGroup();
			}
			// 初始化弹窗
			self.initPopup($(this));
		});
		// 关闭弹窗
		this.popupMask.click(function(){
			$(this).fadeOut();
			self.popupWin.fadeOut();
			self.clear=false;
		});
		this.closeBtn.click(function(){
			self.popupMask.fadeOut();
			self.popupWin.fadeOut();
			self.clear=false;
		});
		// 绑定上下切换按钮事件
		this.flag=true;
		this.nextBtn.hover(function(){
			if (!$(this).hasClass("disabled")&&self.groupData.length>1) {
				$(this).addClass("LightBox-next-btn-show");
			}
		},function(){
			if (!$(this).hasClass("disabled")&&self.groupData.length>1) {
				$(this).removeClass("LightBox-next-btn-show");
			}
		}).click(function(e){
			if (!$(this).hasClass("disabled")&&self.flag) {
				self.flag=false;
				e.stopPropagation();
				self.goto("next");
			}
		});
		this.prevBtn.hover(function(){
			if (!$(this).hasClass("disabled")&&self.groupData.length>1) {
				$(this).addClass("LightBox-prev-btn-show");
			}
		},function(){
			if (!$(this).hasClass("disabled")&&self.groupData.length>1) {
				$(this).removeClass("LightBox-prev-btn-show");
			}
		}).click(function(e){
			if (!$(this).hasClass("disabled")&&self.flag) {
				self.flag=false;
				e.stopPropagation();
				self.goto("prev");
			}
		});
		// 绑定窗口调整事件
		var timer=null;
		this.clear=false;
		$(window).resize(function(){
			if (self.clear) {
				window.clearTimeout(timer);
				timer=window.setTimeout(function(){
					self.loadPicSize(self.groupData[self.index].src);
				},500);	
			}
		}).keyup(function(e){
			var keyValue=e.which;
			if (self.clear) {
				if (keyValue==38 || keyValue==37) {
					self.prevBtn.click();
				}else if (keyValue==40 || keyValue==39) {
					self.nextBtn.click();
				}	
			}
		});
	};
	LightBox.prototype={
		goto:function(dir){
			if (dir==="next") {
				this.index++;
				if (this.index>=(this.groupData.length-1)) {
					this.nextBtn.addClass("disabled").removeClass("LightBox-next-btn-show");
				};
				if (this.index!=0) {
					this.prevBtn.removeClass("disabled");
				};
				var src=this.groupData[this.index].src;
				this.loadPicSize(src);
			}else if (dir==="prev") {
				this.index--;
				if (this.index<=0) {
					this.prevBtn.addClass("disabled").removeClass("LightBox-prev-btn-show");
				};
				if (this.index!=(this.groupData.length-1)) {
					this.nextBtn.removeClass("disabled");
				}
				var src=this.groupData[this.index].src;
				this.loadPicSize(src);
			}
		},
		showMaskAndPopup:function(sourceSrc,currentId){
			var self=this;
			this.popupPic.hide();
			this.picCaptionArea.hide();
			this.popupMask.fadeIn();
			var winWidth=$(window).width(),
				winHeight=$(window).height();
			this.popupWin.css({
				width:winWidth/2,
				height:winHeight/2,
				marginLeft:-(winWidth/4),
				top:-(winHeight)
			}).fadeIn().animate({
				top:(winHeight/4)
			},function(){
				// 加载图片
				self.loadPicSize(sourceSrc);
			});
			// 根据当前点击的元素ID获取在当前组别里的索引
			this.index=this.getIndexOf(currentId);
			var groupDataLength=this.groupData.length;
			if (groupDataLength>1) {
				if (this.index===0) {
					this.prevBtn.addClass("disabled");
					this.nextBtn.removeClass("disabled");
				}else if (this.index===(groupDataLength-1)) {
					this.prevBtn.removeClass("disabled");
					this.nextBtn.addClass("disabled");
				}else{
					this.prevBtn.removeClass("disabled");
					this.nextBtn.removeClass("disabled");
				}
			}else{
				this.prevBtn.addClass("disabled");
				this.nextBtn.addClass("disabled");
			}
		},
		loadPicSize:function(sourceSrc){
			var self=this;
			self.popupPic.css({width:"auto",height:"auto"}).hide();
			self.picCaptionArea.hide();
			this.preLoading(sourceSrc,function(){
				self.popupPic.attr("src",sourceSrc);
				var picWidth=self.popupPic.width(),
					picHeight=self.popupPic.height();
				self.changePic(picWidth,picHeight);
			});
		},
		changePic:function(picWidth,picHeight){
			var self=this;
			var winWidth=$(window).width(),
				winHeight=$(window).height();
			// 如果图片的宽高大于浏览器视口的宽高比，则判断是否溢出
			var scale=Math.min(winWidth/(picWidth+10),winHeight/(picHeight+10),1);
			picWidth=picWidth*scale;
			picHeight=picHeight*scale;
			this.popupWin.animate({
				width:picWidth-10,
				height:picHeight-10,
				marginLeft:-(picWidth/2),
				top:(winHeight-picHeight)/2
			},function(){
				self.popupPic.css({
					width:picWidth-10,
					height:picHeight-10
				}).fadeIn();
				self.picCaptionArea.fadeIn();
				self.flag=true;
				self.clear=true;
			});
			// 设置描述文字和当前索引
			this.captionText.text(this.groupData[this.index].caption);
			this.currentIndex.text("当前索引:"+(this.index+1)+" of "+this.groupData.length);
		},
		preLoading:function(src,callback){
			var img=new Image();
			if (!!window.ActiveXObject) {
				img.onreadystatechange=function(){
					if (this.readyState=="complete") {
						callback();
					}
				};
			}else{
				img.onload=function(){
					callback();
				};
			}
			img.src=src;
		},
		getIndexOf:function(currentId){
			var index=0;
			$(this.groupData).each(function(i){
				index=i;
				if (this.id===currentId) {
					return false;
				}
			});
			return index;
		},
		initPopup:function(currentObj){
			var self=this,
				sourceSrc=currentObj.attr("data-source"),
				currentId=currentObj.attr("data-id");
			this.showMaskAndPopup(sourceSrc,currentId);
		},
		getGroup:function(){
			var self=this;
			// 根据当前的组别名称获取同一组数据
			var groupList=this.bodyNode.find(".LightBox-images,*[data-group="+this.groupName+"]");
			// 清空数组数据
			self.groupData.length=0;
			groupList.each(function(){
				self.groupData.push({
					src:$(this).attr("data-source"),
					id:$(this).attr("data-id"),
					caption:$(this).attr("data-caption")
				});
			});
		},
		renderDOM:function(){
			var strDom='<div class="LightBox-pic-view">'+
							'<span class="LightBox-btn LightBox-prev-btn"></span>'+
							'<img class="LightBox-image" src="">'+
							'<span class="LightBox-btn LightBox-next-btn"></span>'+
						'</div>'+
						'<div class="LightBox-pic-caption">'+
							'<div class="LightBox-caption-area">'+
								'<p class="LightBox-pic-desc">图片标题</p>'+
								'<span class="LightBox-of-index">当前索引：0 of 0</span>'+
							'</div>'+
							'<span class="LightBox-close-btn"></span>'+
						'</div>';
			// 插入到this.popupWin
			this.popupWin.html(strDom);
			// 把遮罩和弹出框插入到BODY
			this.bodyNode.append(this.popupMask,this.popupWin);
		}
	};
	window["LightBox"]=LightBox;
})(jQuery);
