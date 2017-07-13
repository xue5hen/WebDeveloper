var songs=[{
	name:"玫瑰",
	author:"贰佰",
	src:"songs/玫瑰/玫瑰.mp3",
	img:"songs/玫瑰/玫瑰.jpg"
},{
	name:"笑傲江湖曲(琴箫合奏)",
	author:"胡伟立",
	src:"songs/笑傲江湖曲/笑傲江湖曲.mp3",
	img:"songs/笑傲江湖曲/笑傲江湖曲.jpg"
},{
	name:"只要为你活一天",
	author:"黄英华",
	src:"songs/只要为你活一天/只要为你活一天.mp3",
	img:"songs/只要为你活一天/只要为你活一天.jpg"
}];
var vm=new Vue({
	el:"#app",
	data:{
		index:0,
		songs:songs,
		total:songs.length,
		audioObj:new Audio(),
		playing:false,
		duration:0,
		timer:null,
		progresstime:0,
		progressslider:0
	},
	filters:{
		formatTime:function(value){
			var mm=Math.floor(value/60),
				ss=Math.floor(value%60);
			return mm+":"+(ss>9?ss:"0"+ss);
		}
	},
	methods:{
		init:function(){
			var _this=this;
			this.audioObj.onloadedmetadata=function(){
				_this.duration=_this.audioObj.duration;
				_this.play();
			};
			this.audioObj.onended=function(){
				clearInterval(_this.timer);
				_this.progresstime=0;
				_this.progressslider=0;
				_this.playing=false;
				_this.next();
			};
			this.load();
		},
		load:function(){
			clearInterval(this.timer);
			this.audioObj.src=this.songs[this.index].src;
		},
		prev:function(){
			// this.index=Math.max(--this.index,0);
			this.index= (--this.index+this.total)%this.total;
			this.load();
		},
		next:function(){
			// this.index=Math.min(++this.index,this.total-1);
			this.index= ++this.index%this.total;
			this.load();
		},
		play:function(){
			var _this=this;
			this.playing=true;
			this.audioObj.play();
			this.timer=setInterval(function(){
				_this.progresstime=_this.audioObj.currentTime;
				_this.progressslider=Math.floor((_this.progresstime/_this.duration)*360);
			},1000);
		},
		pause:function(){
			this.playing=false;
			this.audioObj.pause();
			clearInterval(this.timer);
		},
		changePlayState:function(){
			this.playing?this.pause():this.play();
		},
		end:function(){
			this.playing=false;
			clearInterval(this.timer);
		},
		setPosition:function(ev){
			console.log(ev.offsetX);
			this.progresstime=this.audioObj.currentTime=Math.floor((ev.offsetX/360)*this.duration);
			this.progressslider=ev.offsetX;
		}
	}
});
vm.init();