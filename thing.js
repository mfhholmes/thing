"use strict";

function leftEdge(x,y){
	var self = this;
	self.x = x;
	self.y = y;
	self.draw = function(map){
		self.element = $("<div class='loc'></div>")
		.appendTo(map.element)
		.css({
			"background-image":"url(img/left.svg)",
			"height":map.mh,
			"width":map.mw,
			"left":self.x *map.mw,
			"top":self.y*map.mh
		});
	}
}
function topEdge(x,y){
	var self = this;
	self.x = x;
	self.y = y;
	self.draw = function(map){
		self.element = $("<div class='loc'></div>")
		.appendTo(map.element)
		.css({
			"background-image":"url(img/top.svg)",
			"height":map.mh,
			"width":map.mw,
			"left":self.x *map.mw,
			"top":self.y*map.mh
		});
	}
}
function rightEdge(x,y){
	var self = this;
	self.x = x;
	self.y = y;
	self.draw = function(map){
		self.element = $("<div class='loc'></div>")
		.appendTo(map.element)
		.css({
			"background-image":"url(img/right.svg)",
			"height":map.mh,
			"width":map.mw,
			"left":self.x *map.mw,
			"top":self.y*map.mh
		});
	}
}
function bottomEdge(x,y){
	var self = this;
	self.x = x;
	self.y = y;
	self.draw = function(map){
		self.element = $("<div class='loc'></div>");
		self.element.appendTo(map.element)
		.css({
			"background-image":"url(img/bottom.svg)",
			"height":map.mh,
			"width":map.mw,
			"left":self.x *map.mw,
			"top":self.y*map.mh
		});
	}
}
function newLoc(x,y){
	var self = this;
	self.x = x;
	self.y = y;
	self.draw = function(map){
		self.element = $("<div class='loc'></div>");
		self.element.appendTo(map.element)
			.css({"background-image":"url(img/empty.svg)",
				"z-index":"50",
				"height":map.mh,
				"width":map.mw,
				"left":self.x *map.mw,
				"top":self.y*map.mh
			});
		self.element.on("mouseover",function(){self.element.text (self.x+","+self.y)});
		self.element.on("mouseout",function(){self.element.text("")});			
	}		
}

function thing(){
	var self = this;
	self.drawables = [];
	self.actionables = [];
	self.map = {element:$("#map"),mh:50,mw:50};
	self.scale = 1;
	function init(mx,my){
		self.drawables = [];
		self.actionables = [];
		for(var x = 0;x<mx;x++){
			for(var y =0;y<my;y++){
				self.drawables.push(new newLoc(x,y)); 
				if(x == 0){self.drawables.push(new leftEdge(x,y))};
				if(x == mx-1){self.drawables.push(new rightEdge(x,y))};
				if(y == 0){self.drawables.push(new topEdge(x,y))};
				if(y == my-1){self.drawables.push(new bottomEdge(x,y))};
			}
		}
		//TODO: work out how to not set the width and height specifically
		self.map.element.width(mx * self.map.mw).height(my * self.map.mh);
	};
	init(12,8);

	function drawMap(){
		for(var x = 0; x < self.drawables.length;x++){
			if( "draw" in self.drawables[x]){
				self.drawables[x].draw(self.map);
			} else {
				console.log("undrawables in drawables, index:"+x);
			}
		}
	};
	drawMap();
};
var t = new thing();