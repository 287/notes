(function(win){
	'use strict';
	
	var CanvasDraw = function(dom){
		this.init(dom);
	};
	
	CanvasDraw.prototype = {
		dom : null
		, ctx : null
		, init : function(dom){
			this.dom = dom;
			if(typeof dom=='string'){
				this.dom = document.querySelector(this.dom);
			}
			this.ctx = this.dom.getContext("2d");
		}
		, clear : function(){
			this.ctx.clearRect(0, 0, this.dom.width, this.dom.height);
		}
		, draw : function(op){
			var ctx = this.ctx
			, op = op||{}
			;
			if(op.stroke){
				ctx.stroke();
			}
			if(op.fill){
				ctx.fill();
			}
		}
		, setOption : function(op){
			var parseItem = function(vMap, kMap, limit){
				limit = limit || 3;
				for(var i=0; i<limit; i++){
					var tV = vMap[i]
					, tK = kMap[i]
					;
					if(tV!=undefined){
						ctx[tK] = tV;
					}
				}
			}
			, ctx = this.ctx
			, map = {
				fill: function(v, k){
					if(/(linear|radial|repeat|\.(jpg|png|bmp|jpeg|webp))/i.test(v)){
						var list = v.replace(/^\s+|\s+$/g, '').split(/\s+/)
						type = list[0]
						;
						switch(type){
							case 'linear':
							case 'radial':
								var f = list[1].split(',')
								t = list[2].split(',')
								;
								v = type=='linear' ? ctx.createLinearGradient(f[0], f[1], t[0], t[1]) : ctx.createRadialGradient(f[0], f[1], f[2], t[0], t[1], t[2]);
								for(var i=3, l=list.length; i<l; i++){
									var index = list[i].indexOf(',')
									, d = Number(list[i].substr(0, index))
									, c = list[i].substr(index+1)
									, d = d>1 ? d/100 : d
									;
									
									v.addColorStop(d, c);
								}
								
							break; default :
								var img = document.querySelector(type)
								;
								v = ctx.createPattern(img, list[1]);
						}
					}
					ctx.fillStyle = v;
				}
				, stroke: function(v, k){
					ctx.strokeStyle = v;
				}
				, strokeWidth: function(v, k){
					ctx.lineWidth = v;
				}
				, shadow: function(v, k){
					var vMap = v.split(/\s+/)
					, kMap = ['shadowColor', 'shadowBlur', 'shadowOffsetX', 'shadowOffsetY']
					;
					parseItem(vMap, kMap, 4);
				}
			}
			;
			for(var k in op){
				var v = op[k]
				, fn = map[k]
				;
				if(v!==undefined && fn!==undefined){
					fn.call(null, v, k);
				}
			}
		}
		, circle : function(po, op){
			var x = po[0]
			, y = po[1]
			, r = po[2]
			, ctx = this.ctx
			;
			this.setOption(op);
			
			ctx.beginPath();
			ctx.arc(x, y, r, 0, 2*Math.PI);
			
			this.draw(op);
			
			return this;
		}
		, hotspot : function(arr, op){
			var rs = dataHandle.levelSplit(arr, {levelCount:3})
			, arr = rs.data
			, levelData = {}
			, levelMax = 0
			, levelRMap = {1:20, 2:15, 3:10, 4:5}
			, levelCMap = {1:'#3CFF00', 2:'#FFD600', 3:'#FF0000', 4:'#3CFF00'}
			;
			for(var i=0, l=arr,length; i<l; i++){
				var item = arr[i]
				, level = item.level
				;
				if(!levelData[level]){
					levelData[level] = [];
					levelMax = level>levelMax ? level : levelMax;
				}
				levelData[level].push(item);
			}
			for(var level=1; level<=levelMax; level++){
				var levelItem = levelData[level];
				for(var i=0, l=levelItem,length; i<l; i++){
					var item = levelItem[i]
					, levelR = levelRMap[level]
					, levelC = levelCMap[level]
					, pos = item.pos.slice(0).push(levelR)
					;
					
					this.circle(pos, {fill:levelC})
				}
			}
		}
	};
	
	win.CanvasDraw = CanvasDraw;
	
})(window);