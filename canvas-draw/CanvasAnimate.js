(function(win){
	'use strict';
	
	var CanvasAnimate = function(){
		this.maps = []
		this.preDrawMap = []
		this.drawFunction = null;
		return this
	};
	
	CanvasAnimate.prototype = {
		init: function(){
			this.startTime = new Date().getTime();
			this.polling()
		}
		, add: function(obj){
			var maps = this.maps
			;
			maps.push(obj);
		}
		, stop: function(){
			cancelAnimationFrame(this.timer);
		}
		, polling: function(){
			var self = this
			, maps = this.maps
			, preDrawMap = this.preDrawMap
			, fn = function(){
				self.currentTime = new Date().getTime();
				var list = [];
				for(var i=0, l=maps.length; i<l; i++){
					var item = maps[i]
					, option = self.getOption(item);
					;
					if(option){
						list.push(option);
					}
				}
				self.preDrawMap = list;
				self.drawCallback();
				self.timer = requestAnimationFrame(fn);
			}
			;
			self.timer = requestAnimationFrame(fn);
		}
		, draw: function(fn){
			this.drawFunction = fn;
		}
		, drawCallback: function(){
			var fn = this.drawFunction
			;
			if(typeof fn=='function'){
				fn.call(null, this.preDrawMap);
			}
		}
		, getOption: function(obj){
			var animate = obj.animate || {}
			, keyframes = obj.keyframes || {}
			, op = obj.option || {}
			, startTime = this.startTime
			, currentTime = this.currentTime
			, delay = animate.delay || 0
			, delay = delay*1000
			, duration = animate.duration || 0
			, duration = duration*1000
			, count = animate.count || 1 //-1:infinite
			, count = count=='infinite' ? -1 : count
			, pList = []
			, timeLong = currentTime-startTime-delay
			, cycle = Math.floor(timeLong/duration)
			, timeThisFrame = timeLong%duration
			, timeFramePercent = 0
			, from = null
			, to = null
			, option = {}
			;
			// 未运行、时长为0、超过运行次数 则返回null
			if(timeLong<0 || !duration || (count>-1 && cycle>=count)){
				return null;
			}
			// 判断运行在的keyframe
			for(var p in keyframes){
				pList.push(Number(p));
			}
			if(pList.length<2){
				return null;
			}
			pList.sort(function(a, b){
				a-b
			});
			for(var i=0,l=pList.length-1; i<l; i++){
				var p = pList[i]
				, nextPer = pList[i+1]
				, fTime = p*duration/100
				, tTime = nextPer*duration/100
				;
				if(timeThisFrame>=fTime&&timeThisFrame<tTime){
					from = keyframes[p];
					to = keyframes[nextPer];
					/*
					if(!obj.__runed__){
						obj.__runed__ = 1
						timeFramePercent = 0
					}else{
						timeFramePercent = (timeThisFrame-fTime)/(tTime-fTime);
					}
					*/
					timeFramePercent = (timeThisFrame-fTime)/(tTime-fTime);
					break;
				}
			}
			// 通过取出的from, to计算当前时间运行的参数
			if(!from || !to){
				return null
			}
			
			var index = 0;
			for(var k in from){
				var v = from[k]
				, vTo = to[k]
				;
				if(v===undefined || vTo===undefined){
					continue;
				}
				option[k] = v + timeFramePercent*(vTo-v);
				index++
			}
			if(index>0){
				for(var k in op){
					option[k] = op[k]
				}
				option.type = obj.type;
				return option;
			}
		}
	}
	
	win.CanvasAnimate = CanvasAnimate;
	
})(window);