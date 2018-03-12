$(document).ready(init);

function init(ev) {
	var fns = [
	  {start: 100, end: 800, init: init1, enter: enter1},
		{start: 1526, end: 2526, init: init3, enter: enter3},
		{start: 3176, end: 3876, init: init4, enter: enter4},
		{start: 4526, end: 5226, init: init5, enter: enter5}
  ];
	
	player(fns);
}

function initialize(fn) {
	player(fn);
}

function player(fn) {
	$(window).on('scroll', wheel);
	
	wheel();
	
	function wheel() {
		var st = $(window).scrollTop();
		var vh = document.documentElement.clientHeight;

		for (var i = 0; i < fn.length; i++) {
			if ((fn[i].start > st + vh) || (fn[i].end < st)) {
				fn[i].status = false;
			} else {
				if (fn[i].status) continue;
				else {
					fn[i].init && fn[i].init();
					if ((fn[i].start < Math.round(st + vh / 2))) {
						fn[i].enter && fn[i].enter();
					  fn[i].status = true;
					}
				}
			}
		}
	}
}

function init1() {
	$('.page1').each(function(index, element) {
		var _this = this;
		
		// 初始化
		~function () {
			$(_this).css('opacity', 0);
			$(_this).find('.fl').removeClass('a-fadeinL');
			$(_this).find('.event_01').removeClass('a-fadeinR');
		}();
	});
}

function enter1() {
	// 动画队列
	$('.page1').each(function(index, element) {
		var _this = this;
		~function () {
			$(_this).css('opacity', 1);
			$(_this).find('.fl').addClass('a-fadeinL');
			$(_this).find('.event_01').addClass('a-fadeinR');
		}();
  });
}

function init3() {
	$('.event_02').each(function(index, element) {
		var _this = this;
		
		// 初始化
		~function () {
			$(_this).css('opacity', 0);
			$(_this).removeClass('a-fadeinL');
		}();
	});
}

function enter3() {
	$('.event_02').each(function(index, element) {
		var _this = this;
		~function () {
			$(_this).css('opacity', 1);
			$(_this).addClass('a-fadeinL');
		}();
	});
}

function init4() {
	$('.event_07').each(function(index, element) {
		var _this = this;
		
		// 初始化
		~function () {	
			$(_this).css('opacity', 0);
			$(_this).removeClass('a-fadeinR');
		}();
	});
}

function enter4() {
	$('.event_07').each(function(index, element) {
		var _this = this;
		~function () {
			$(_this).css('opacity', 1);
			$(_this).addClass('a-fadeinR');
		}();
	});
}

function init5() {
	$('.event_08').each(function(index, element) {
		var _this = this;
		
		// 初始化
		~function () {	
			$(_this).css('opacity', 0);
			$(_this).removeClass('a-fadeinL');
		}();
	});
}

function enter5() {
	$('.event_08').each(function(index, element) {
		var _this = this;
		~function () {
			$(_this).css('opacity', 1);
			$(_this).addClass('a-fadeinL');
		}();
	});
}
$(function() {
    $.stellar({
        horizontalScrolling: false,
        verticalOffset: 40
    });
});