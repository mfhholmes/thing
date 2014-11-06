"use strict";

var ticklength = 250;

function thingmap(){
	var self = this;
	self.drawables = [];
	self.things = [];
	self.map = {element:$("#map"),mh:50,mw:50,maxX:0,maxY:0};
	self.init = function (mx,my,cellwidth,cellheight){
		self.map.maxX = mx-1;
		self.map.maxY = my-1;
		self.map.mh = cellheight;
		self.map.mw = cellwidth;
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
		self.things[thing.name] = thing;
		if("draw" in thing){
			thing.x = x;
			thing.y = y;
			self.drawables.push(thing);
		}
		return thing;
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
	self.ticking = false;
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
		},ticklength-1,"linear", function(){
			if(self.ticking)self.tick();
		});
	}
}

//this is a controlled thing - it is controlled by keyboard wasd
function controlledThing(name){
	var self = this;
	self.name = name;
	self.x = 0;
	self.y = 0;
	self.draw = function(map){
		self.map = map;
		self.element = $("<div class='controlledThing thing'></div>");
		self.element.appendTo(map.element)
			.css({"background-image":"url(img/controlledThing.svg)",
				"z-index":"100",
				"height":map.mh,
				"width":map.mw, 
				"left":self.x * map.mw,
				"top":self.y * map.mh
			});
		self.element.on("mouseenter",function(){self.element.text(self.name)});
		self.element.on("mouseout",function(){self.element.text("")});			
		$(document).on("keydown",function(e){
			switch(e.which){
				case(87):{//"w"
					if(self.y>0){
						self.y -=1;
						self.tick();
					}
					break;
				}
				case(83):{//"s"
					if(self.y<self.map.maxY){
						self.y+=1;
						self.tick();
					}
					break;
				}
				case(65):{//"a"
					if(self.x>0){
						self.x-=1;
						self.tick();
					}
					break;
				}
				case(68):{//"d"
					if(self.x<self.map.maxX){
						self.x+=1;
						self.tick();
					}
					break;
				}
				default:{
					return;
				}
			}
		});
	}
	self.tick = function(){
		self.element.stop(true,false);
		self.element.animate({
			"left":(self.x ) * self.map.mw,
			"top":(self.y ) * self.map.mh
		},ticklength,"linear");
	}
}

function followerthing(name){
	var self = this;
	self.name = name;
	self.x = 0;
	self.y = 0;
	self.nextx = 0;
	self.nexty = 0;
	self.ticking = false;
	self.draw = function(map){
		self.map = map;
		self.element = $("<div class='followerThing thing'></div>");
		self.element.appendTo(map.element)
			.css({"background-image":"url(img/followerThing.svg)",
				"z-index":"100",
				"height":map.mh,
				"width":map.mw, 
				"left":self.x * map.mw,
				"top":self.y * map.mh
			});
		self.element.on("mouseenter",function(){self.element.text(self.name)});
		self.element.on("mouseout",function(){self.element.text("")});			
	}
	self.tick = function(){
		if (typeof(self.target)==="undefined")return;
		var dx = self.target.x - self.x;
		var dy = self.target.y - self.y;
		self.nextx = 0;
		self.nexty = 0;
		if(dx > 1)self.nextx = 1;
		if(dx < -1)self.nextx = -1;
		if(dy > 1)self.nexty = 1;
		if(dy < -1)self.nexty = -1;
		if(self.nextx != 0 || self.nexty != 0){
			self.element.animate({
				"left":(self.x + self.nextx) * self.map.mw,
				"top":(self.y+self.nexty) * self.map.mh
			},ticklength-1,"linear",function(){
				self.x = self.x + self.nextx;
				self.y = self.y + self.nexty;
				self.nextx =0;
				self.nexty = 0;
				if(self.ticking)self.tick();
			});
		} else {
			window.setTimeout(function(){self.tick();},ticklength);
		}
	}
}

function start(tmap){
	for(var thingname in tmap.things){
		if("ticking" in tmap.things[thingname]){
			tmap.things[thingname].ticking = true;
			tmap.things[thingname].tick();
		}
	}
	$("#btnStart").text("stop").on("click",function(t){return function(){stop(t);}}(tmap));
}

function stop(tmap){
	for(var thingname in tmap.things){
		tmap.things[thingname].ticking = false;
	}
	$("#btnStart").text("start").on("click",function(t){return function(){start(t);}}(tmap));
}
var t = new thingmap();
t.init(24,16,25,25);
t.addThing(new thing("thing"),6,4);
t.addThing(new controlledThing("you"),5,5);
t.addThing(new followerthing("follower1"),12,12).target = t.things["thing"];
t.addThing(new followerthing("follower2"),12,12).target = t.things["you"];

t.drawMap();
start(t);
