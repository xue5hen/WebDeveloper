/*
 * 调用方法：
 * 1）Tab.init($(".tab"));
 * 2）$(".tab").tab();
*/
;(function($){
	var Tab=function(tab){
		var _this_=this;
		// 保存组件
		this.tab=tab;
		// 默认配置参数
		this.config={
			// 触发事件的事件类型
			"triggerType":"mouseover",
			// 切换特效
			"effect":"default",
			// 默认展示第几个Tab
			"invoke":1,
			// 是否自动切换，配置参数为切换时间间隔
			"auto":3000
		};
		// 如果有参数配置，则扩展替换
		if (this.getConfig) {
			$.extend(this.config,this.getConfig());
		}
		// 保存tab标签列表
		this.tabItems=this.tab.find("ul.tab-nav li");
		this.contentItems=this.tab.find("div.content-wrap div.content-item");
		// 保存配置参数
		var config=this.config;
		if (config.triggerType=="click") {
			this.tabItems.bind("click",function(){
				_this_.invoke($(this));
			});
		}else{
			config.triggerType="mouseover";
			this.tabItems.mouseover(function(){
				var _self=$(this);
				this.timer=window.setTimeout(function(){
					_this_.invoke(_self);
				},300);
			}).mouseout(function(){
				window.clearTimeout(this.timer);
			});
		}
		if (config.auto) {
			this.timer=null;
			this.loop=0;
			this.autoPlay();
			this.tab.hover(function(){
				clearInterval(_this_.timer);
			},function(){
				_this_.autoPlay();
			});
		}
		if (config.invoke>1) {
			this.invoke(this.tabItems.eq(config.invoke-1));
		}
	};
	Tab.prototype={
		// 自动间隔时间切换
		autoPlay:function(){
			var _this_=this,
				tabItems=this.tabItems,
				tabLength=tabItems.size(),
				config=this.config;
			this.timer=setInterval(function(){
				_this_.loop=(++_this_.loop)%tabLength;
				_this_.invoke(tabItems.eq(_this_.loop));
			},config.auto);
		},
		// 事件驱动函数
		invoke:function(currentTab){
			var _this_=this,
				index=currentTab.index(),
				effect=this.config.effect;
			// tab选中状态
			currentTab.addClass("active").siblings().removeClass("active");
			// 切换对应的内容区域
			if (effect=="fade") {
				_this_.contentItems.eq(index).fadeIn().siblings().fadeOut();
			}else{
				_this_.contentItems.eq(index).addClass("active").siblings().removeClass("active");
			}
			if (this.config.auto) {
				this.loop=index;
			}
		},
		// 获取配置参数
		getConfig:function(){
			// 获取tab节点上的data-config
			var config=this.tab.data("config");
			return config?config:null;
		}
	};
	Tab.init=function(tabs){
		var _this_=this;
		tabs.each(function(){
			new _this_($(this));
		});
	};
	$.fn.extend({tab:function(){
		this.each(function(){
			new Tab($(this));
		});
		return this;
	}});
	window.Tab=Tab;
})(jQuery);