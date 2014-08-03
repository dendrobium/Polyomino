//render.js got too big, broke this into its own file for organization purposes

var gameWonOverlayShown; //set inside initGame
var gameLostOverlayShown; //set inside initGame
var drawInstructions = false;
var drawMenu = false;
var img_polyomino = new Image();
img_polyomino.src = "images/Polyomino.png";
function setMenuDraw(bool){
	newGameButton.enabled = instructionsButton.enabled = drawMenu = bool;
	currentlyAnimating = true;
}

function renderTopBar(){
	gfx.fillStyle = '#424242';
	gfx.fillRect(gridOffsetX, 4, gridPixelSize, gridOffsetY-8);
	menuButton.render();
	gfx.fillStyle = '#f0f0f0';
	//drawText("Polyomino", gridOffsetX+4, 44, "italic small-caps bold 40px arial");
	gfx.drawImage(img_polyomino, gridOffsetX+4, 6);
	drawText("score: ", 	gridOffsetX+gridPixelSize-130, 26, "small-caps bold 18px arial",false,true);
	drawText("high: ",  	gridOffsetX+gridPixelSize-130, 46, "small-caps bold 18px arial",false,true);
	drawText(score, 			gridOffsetX+gridPixelSize-130, 26, "small-caps bold 18px arial");
	drawText(highScore, 	gridOffsetX+gridPixelSize-130, 46, "small-caps bold 18px arial");
}


function renderMenu(){
	gfx.fillStyle = 'rgba(0,0,0,0.7)';
	gfx.fillRect(gridOffsetX+gridPixelSize-180, gridOffsetY, 180, 140);
	newGameButton.render();
	instructionsButton.render();
	trophiesButton.render();

	gfx.fillStyle = '#f0f0f0';
	drawText("New Game",     gridOffsetX+gridPixelSize-60, gridOffsetY+32,  "Bold 20px arial",false, true);
	drawText("Instructions", gridOffsetX+gridPixelSize-60, gridOffsetY+78,  "Bold 20px arial",false, true);
	drawText("Trophies",     gridOffsetX+gridPixelSize-60, gridOffsetY+120, "Bold 20px arial",false, true);
}



//==== Overlays ====//


var overlayRect = {x:0,y:0,w:0,h:0};

var img_3x3  = new Image();
var img_tro1 = new Image();
var img_tro2 = new Image();
img_3x3.src  = "images/Instructions_3x3.png";
img_tro1.src = "images/Instructions_Tro1.png";
img_tro2.src = "images/Instructions_Tro2.png";
function drawText(text, x, y, font, centered, rightAlign){
	gfx.font = font;
	if(centered){
		var w = gfx.measureText(text).width;
		gfx.fillText(text,x-w/2,y);
		return;
	}
	if(rightAlign){
		var w = gfx.measureText(text).width;
		gfx.fillText(text,x-w,y);
		return;
	}
	gfx.fillText(text, x, y);
}
function renderInstructionsOverlay(){
	if(!(img_3x3.complete && img_tro1.complete && img_tro2.complete))
		currentlyAnimating = true; //ensure images load
	var x = overlayRect.x;
	var y = overlayRect.y;
	var w = overlayRect.w;
	var h = overlayRect.h;
	var scale = w/500;
	var scale2 = h/750;
	var fontSize = 18 * scale;
	var leftMargin = fontSize/2;
	var lineHeight = scale2*20;
	gfx.fillStyle = "rgba(0,0,0,0.7)";
	gfx.fillRect(x, y, w, h);

	gfx.fillStyle = "#f0f0f0";
	gfx.fillRect(x+leftMargin, y+3*lineHeight-(fontSize/4),fontSize/4,fontSize/4);
	gfx.fillRect(x+leftMargin, y+4*lineHeight-(fontSize/4),fontSize/4,fontSize/4);
	gfx.fillRect(x+leftMargin, y+5*lineHeight-(fontSize/4),fontSize/4,fontSize/4);


	drawText("Instructions",                                             x+w/2,        y+2*lineHeight, (fontSize*1.7) + "px Arial Bold", true);
	drawText("Merge polyominos into larger ones by forming squares",     x+leftMargin*2, y+3*lineHeight, (fontSize*0.9)+"px Arial");
	drawText("Bigger squares = bigger polyominos!",                      x+leftMargin*2, y+4*lineHeight, (fontSize*0.9)+"px Arial");
	drawText("You cannot merge polyominos into ones of the same size or smaller", x+leftMargin*2, y+5*lineHeight, (fontSize*0.9)+"px Arial");

	drawText("Example Merge: Dominos into Tromino", x+w/2, y+7*lineHeight, fontSize+"px Arial Bold", true);

	//todo merge these images into one.
	gfx.drawImage(img_3x3, x+leftMargin, y+8*lineHeight, img_3x3.width*scale, img_3x3.height*scale);
	gfx.drawImage(img_tro1, x+leftMargin+2*fontSize+(img_3x3.width*scale), y+8*lineHeight, img_tro1.width*scale, img_tro1.height*scale);
	gfx.drawImage(img_tro2, x+leftMargin+4*fontSize+(img_3x3.width*scale)+(img_tro1.width*scale), y+8*lineHeight, img_tro2.width*scale, img_tro2.height*scale);

	y += img_3x3.height;

	gfx.fillRect(x+leftMargin, y+12*lineHeight-(fontSize*1.6),w-leftMargin*2, 1);
	gfx.fillRect(x+leftMargin, y+12*lineHeight+(fontSize*0.6),w-leftMargin*2, 1);
	drawText("Can you build a Hexomino? (6 squares)", x+w/2, y+12*lineHeight, (fontSize*1.3)+"px Arial bold italic", true);

	drawText("Controls",                                             		 x+w/2,        y+15*lineHeight, (fontSize*1.7) + "px Arial Bold", true);
	drawText("Mouse:",                                                   x+leftMargin, y+16*lineHeight, (fontSize*1.3) + "px Arial Bold");
	drawText("Left Click & Drag to pick up and move pieces",             x+leftMargin, y+17*lineHeight, fontSize+"px Arial");
	drawText("Right Click to rotate picked up piece",                    x+leftMargin, y+18*lineHeight, fontSize+"px Arial");

	drawText("Touch:",                                                   x+leftMargin, y+20*lineHeight, (fontSize*1.3) + "px Arial Bold");
	drawText("Tap & Drag to pick up and move pieces",          			     x+leftMargin, y+21*lineHeight, fontSize+"px Arial");
	drawText("Tap with a second finger to rotate picked up piece",       x+leftMargin, y+22*lineHeight, fontSize+"px Arial");

	drawText("Click or tap to close",                                    x+w/2, y+24*lineHeight, (0.8*fontSize)+"px Arial", true);

}

//TODO: div w/ social stuff
function renderGameLostOverlay(){
	var x = overlayRect.x;
	var y = overlayRect.y;
	var w = overlayRect.w;
	var h = overlayRect.h*0.5; //don't need as much space
	var scale = w/500;
	var scale2 = h/750;
	var fontSize = 18 * scale;
	var leftMargin = fontSize/2;
	var lineHeight = scale2*20;
	gfx.fillStyle = "rgba(0,0,0,0.7)";
	gfx.fillRect(x, y, w, h);

	gfx.fillStyle = "rgba(255,255,255,1)";
	drawText("Game Over",            x+w/2, y+15*lineHeight, (fontSize*1.7) + "px Arial Bold", true);
	drawText("Your Score: " + score, x+w/2, y+20*lineHeight, (fontSize)+"px Arial Bold", true);
	drawText("Click or tap to close",x+w/2, y+30*lineHeight, (0.8*fontSize)+"px Arial", true);
}

function renderGameWonOverlay(){
	var x = overlayRect.x;
	var y = overlayRect.y;
	var w = overlayRect.w;
	var h = overlayRect.h*0.5; //don't need as much space
	var scale = w/500;
	var scale2 = h/750;
	var fontSize = 18 * scale;
	var leftMargin = fontSize/2;
	var lineHeight = scale2*20;
	gfx.fillStyle = "rgba(0,0,0,0.7)";
	gfx.fillRect(x, y, w, h);

	gfx.fillStyle = "rgba(255,255,255,1)";
	drawText("You Won!",            x+w/2, y+15*lineHeight, (fontSize*1.7) + "px Arial Bold", true);
	drawText("Your Score: " + score, x+w/2, y+20*lineHeight, (fontSize)+"px Arial Bold", true);
	drawText("Click or tap to close",x+w/2, y+30*lineHeight, (0.8*fontSize)+"px Arial", true);
}

//==== Button Class ====//


var buttons = [];
//x, y, render, and callback are all functions
function CButton(x, y, width, height, render, callback){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.render = render;
	this.callback = callback;
	this.enabled = false;

	this.clickLogic = function(x, y){
		if(!this.enabled)
			return false;
		if(x < (this.x()+this.width) && x >= this.x() &&
			 y < (this.y()+this.height) && y >= this.y()){
			this.callback();
			return true;
			console.log("button clicked");
		}
	}

	buttons.push(this);
}
var menuButton = new CButton(
	function(){return gridOffsetX+gridPixelSize-44; },
	function(){return 12; },
	36,36,
	function(){
		gfx.fillStyle = '#808080';
		gfx.fillRect(this.x(), this.y(), this.width, this.height);

		gfx.fillStyle = '#f0f0f0';

		//Menu Icon
		gfx.fillRect(this.x()+4, this.y()+8,  28, 4);
		gfx.fillRect(this.x()+4, this.y()+16, 28, 4);
		gfx.fillRect(this.x()+4, this.y()+24, 28, 4);
	},
	function(){
		setMenuDraw(!drawMenu);
	});

menuButton.enabled = true;

var newGameButton = new CButton(function(){return gridOffsetX+gridPixelSize-44},
																function(){return gridOffsetY+8},
																100, 36,
																function(){
																	gfx.fillStyle = '#808080';
																	gfx.fillRect(this.x(), this.y(), this.width, this.height);
																},
																function(){newGame(); setMenuDraw(false);});

var instructionsButton = new CButton(function(){return gridOffsetX+gridPixelSize-44},
																		function(){return gridOffsetY+52},
																		100, 36,
																		function(){
																			gfx.fillStyle = '#808080';
																			gfx.fillRect(this.x(), this.y(), this.width, this.height);
																		},
																		function(){drawInstructions = true; setMenuDraw(false);});


var trophiesButton = new CButton(function(){return gridOffsetX+gridPixelSize-44},
																function(){return gridOffsetY+96},
																100, 36,
																function(){
																	gfx.fillStyle = '#808080';
																	gfx.fillRect(this.x(), this.y(), this.width, this.height);
																},
																function(){ console.log("foo");  setMenuDraw(false); /* TODO show trophies */});