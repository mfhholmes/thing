"use strict";

function thing(){
	var self = this;
	self.locs = [];
	self.map = $("#map");
	self.scale = 1;
	self.mh = 50;
	self.mw = 50; 
	function init(mx,my){
		self.locs = [];
		self.locs.length =mx;
		for(var x = 0;x<self.locs.length;x++){
			self.locs[x] =[];
			self.locs[x].length = my;
			for(var y =0;y<self.locs[x].length;y++){
				self.locs[x][y] = [];
				self.locs[x][y].push("empty"); 
				if(x == 0){self.locs[x][y].push("left")};
				if(x == mx-1){self.locs[x][y].push("right")};
				if(y == 0){self.locs[x][y].push("top")};
				if(y == my-1){self.locs[x][y].push("bottom")};
			}
		}
		self.map.width(mx * self.mw).height(my * self.mh);
	};
	init(12,8);

	function drawloc(x,y){
		for(var i = 0; i < self.locs[x][y].length;i++){
			//var loc = $("<div class='loc'>"+x+","+y+"</div>");
			var loc = $("<div class='loc'></div>");
			loc.data("x",x).data("y",y);
			loc.height(self.mh).width(self.mw);
			loc.offset({left:(x * self.mw),top:(y*self.mh)});
			var v = self.locs[x][y][i];			
			switch(v){
				case "empty":{
					//empty
					loc.css({"background-image":"url(img/empty.svg)","z-index":"50"});
					loc.on("mouseover",function(){loc.text (x+","+y)});
					loc.on("mouseout",function(){loc.text("")});
					break;
				}
				case "top":{
					//top wall
					loc.css({"background-image":"url(img/top.svg)"});
					break;
				}
				case "bottom":{
					//bottom wall
					loc.css({"background-image":"url(img/bottom.svg)"});
					break;
				}
				case "left":{
					//left wall
					loc.css({"background-image":"url(img/left.svg)"});
					break;
				}
				case "right":{
					//right wall
					loc.css({"background-image":"url(img/right.svg)"});
					break;
				}
				default:{
					loc.css({"background-image":"url(img/unknown.svg)"});
				}
			}
			loc.appendTo(self.map);
		}
	};

	function drawMap(){
		for(var x = 0; x < self.locs.length;x++){
			for(var y = 0; y<self.locs[x].length;y++){
				drawloc(x,y);
			}
		}
	};
	drawMap();
};
var t = new thing();