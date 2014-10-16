"use strict";


function thingmap(){
	var self = this;
	self.drawables = [];
	self.things = [];
	self.map = {element:$("#map"),mh:50,mw:50,maxX:0,maxY:0};
	self.ticker = [];
	self.scale = 1;
	self.init = function (mx,my){
		self.map.maxX = mx-1;
		self.map.maxY = my-1;
		self.drawables = [];
		self.actionables = [];
		for(var x = 0;x<mx;x++){
			for(var y =0;y<my;y++){
				self.drawables.push(new location(x,y)); 
				if(x == 0){self.drawables.push(new leftEdge(x,y))};
				if(x == mx-1){self.drawables.push(new rightEdge(x,y))};
				if(y == 0){self.drawables.push(new topEdge(x,y))};
				if(y == my-1){self.drawables.push(new bottomEdge(x,y))};
			}
		}
		//TODO: work out how to not set the width and height specifically
		self.map.element.width(mx * self.map.mw).height(my * self.map.mh);
	};

	self.drawMap = function (){
		for(var x = 0; x < self.drawables.length;x++){
			if( "draw" in self.drawables[x]){
				self.drawables[x].draw(self.map);
			} else {
				console.log("undrawables in drawables, index:"+x);
			}
		}
	};

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
	function location(x,y){
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
			self.element.on("mouseenter",function(){self.element.text(self.x+","+self.y)});
			self.element.on("mouseout",function(){self.element.text("")});			
		}		
	}
	self.addThing = function(thing,x,y){
		self.things.push(thing);
		if("draw" in thing){
			thing.x = x;
			thing.y = y;
			self.drawables.push(thing);
		}
	}
};

//Thing is a thing
function thing (name){
	var self = this;
	self.name = name;
	self.x = 0;
	self.y = 0;
	self.deltax = 1;
	self.deltay = 0;
	self.draw = function(map){
		self.map = map;
		self.element = $("<div class='thing'></div>");
		self.element.appendTo(map.element)
			.css({"background-image":"url(img/thing.svg)",
				"z-index":"100",
				"height":map.mh,
				"width":map.mw, 
				"left":self.x * map.mw,
				"top":self.y * map.mh
			});
		self.element.on("mouseenter",function(){self.element.text(self.name)});
		self.element.on("mouseout",function(){self.element.text("")});			
	};
	self.tick = function(){

		//randomly change direction
		if(Math.random()>0.95){self.deltax = 1;}
		if(Math.random()>0.95){self.deltax = -1;}
		if(Math.random()>0.95){self.deltay = 1;}
		if(Math.random()>0.95){self.deltay = -1;}
		if(Math.random()>0.95){self.deltax = 0;}
		if(Math.random()>0.95){self.deltay = 0;}
		
		// check the bounds
		if((self.x >= self.map.maxX && self.deltax > 0) || (self.x<=0 && self.deltax <0) ){self.deltax *= -1;}
		if((self.y >= self.map.maxY && self.deltay > 0) || (self.y<=0 && self.deltay <0) ){self.deltay *= -1;}

		self.x += self.deltax;
		self.y += self.deltay;
		self.element.animate({
			"left":self.x * self.map.mw,
			"top":self.y * self.map.mh
		},250,"linear");
	}
}

function start(tmap){
	tmap.ticker.push(setInterval(function(){tick(tmap)},250));
	$("#btnStart").text("stop").on("click",function(t){return function(){stop(t);}}(tmap));
}

function stop(tmap){
	for(var i=0;i<tmap.ticker.length;i++){
		window.clearInterval(tmap.ticker[i]);
	}
	tmap.ticker = [];
	$("#btnStart").text("start").on("click",function(t){return function(){start(t);}}(tmap));
}
function tick(tmap){
	for(var i=0;i<tmap.things.length;i++){
		tmap.things[i].tick();
	}
}
var t = new thingmap();
t.init(12,8);
t.addThing(new thing("thing"),6,4);
t.drawMap();
start(t);
