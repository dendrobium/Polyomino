//render.js got too big, broke this into its own file for organization purposes

var gameWonOverlayShown; //set inside initGame
var gameLostOverlayShown; //set inside initGame
var drawInstructions = false;
var drawMenu = false;
var img_polyomino = new Image();
img_polyomino.src = "images/Polyomino.png";
function setMenuDraw(bool){
	newGameButton.enabled = instructionsButton.enabled = trophiesButton.enabled = drawMenu = bool;
	currentlyAnimating = true;
}

function renderTopBar(){
	gfx.fillStyle = '#424242';
	gfx.fillRect(gridOffsetX, 4, gridPixelSize, gridOffsetY-8);
	menuButton.render();
	gfx.fillStyle = '#f0f0f0';
	gfx.drawImage(img_polyomino, gridOffsetX+8, 12);
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
}

//==== Overlays ====//

var overlayRect = {x:0,y:0,w:0,h:0};

var img_3x3  = new Image();
img_3x3.src  = "images/Instructions_3x3.png";
function renderInstructionsOverlay(){
	if(!img_3x3.complete)
		currentlyAnimating = true; //ensure images load
	var x = overlayRect.x;
	var y = overlayRect.y;
	var w = overlayRect.w;
	var h = overlayRect.h;
	var scale = w/500;
	var scale2 = h/750;
	var fontSize = 18 * scale;
	var leftMargin = fontSize/2;
	var lineHeight = scale2*25;
	gfx.fillStyle = "rgba(0,0,0,0.7)";
	gfx.fillRect(x, y, w, h);

	gfx.fillStyle = "#f0f0f0";
	//gfx.fillRect(x+leftMargin, y+3*lineHeight-(fontSize/4),fontSize/4,fontSize/4);
	//gfx.fillRect(x+leftMargin, y+4*lineHeight-(fontSize/4),fontSize/4,fontSize/4);
	//gfx.fillRect(x+leftMargin, y+5*lineHeight-(fontSize/4),fontSize/4,fontSize/4);


	drawText("Instructions",                           x+w/2, y+2*lineHeight, (fontSize*1.8) + "px Arial Bold", true);
	drawText("Merge shapes OF THE SAME COLOR by covering",     x+leftMargin*2, y+3*lineHeight, fontSize+"px Arial");
  drawText("  a square of grid spaces LONGER and WIDER ",     x+leftMargin*2, y+4*lineHeight, fontSize+"px Arial");
  drawText("  than the shapes used to cover that square.", x+leftMargin*2, y+5*lineHeight, fontSize+"px Arial");

  var imgWidth = img_3x3.width*scale;
  var imgHeight = img_3x3.height*scale;
  var left = (x+leftMargin);
	gfx.drawImage(img_3x3, left, y+6*lineHeight, imgWidth, imgHeight);

	y += img_3x3.height;

	gfx.fillRect(x+leftMargin, y+8*lineHeight-(fontSize*1.6),w-leftMargin*2, 1);
	gfx.fillRect(x+leftMargin, y+8*lineHeight+(fontSize*0.6),w-leftMargin*2, 1);
	drawText("TO WIN: Merge ALL BOLTED shapes on board.", x+w/2, y+8*lineHeight, (fontSize*1.3)+"px Arial bold italic", true);

	drawText("Mouse Controls:",                                          x+leftMargin, y+11*lineHeight, (fontSize*1.3) + "px Arial Bold");
	drawText("   Left Click & Drag to lift and move pieces.",            x+leftMargin, y+12*lineHeight, fontSize+"px Arial");
	drawText("   Right Click (or spacebar) to rotate a lifted piece.",   x+leftMargin, y+13*lineHeight, fontSize+"px Arial");

	drawText("Touch Controls:",                                          x+leftMargin, y+15*lineHeight, (fontSize*1.3) + "px Arial Bold");
	drawText("   Tap & Drag to pick up and move pieces",          			 x+leftMargin, y+16*lineHeight, fontSize+"px Arial");
	drawText("   Tap with a second finger to rotate picked up piece",    x+leftMargin, y+17*lineHeight, fontSize+"px Arial");

	drawText("Click or tap to close",                                    x+w/2, y+19*lineHeight, (0.8*fontSize)+"px Arial", true);
}

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

  var msg = "You have made a "+ POLYOMINO_NAME[gameMaxShapeLevel]+"!"
  //if (currentBoardLevel < 1) {
  //  msg = "You have finished the tutorial."
  //}

	gfx.fillStyle = "rgba(255,255,255,1)";
	//drawText("Congratulations!",            x+w/2, y+12*lineHeight, (fontSize*1.7) + "px Arial Bold", true);
  //drawText(msg,            x+w/2, y+17*lineHeight, (fontSize) + "px Arial Bold", true);
  //drawText("Your Score: " + score, x+w/2, y+20*lineHeight, (fontSize)+"px Arial Bold", true);
  //drawText("Click or tap to close",x+w/2, y+30*lineHeight, (0.8*fontSize)+"px Arial", true);
  drawText("Congratulations!",            x+w/2, y+12*lineHeight, (fontSize*1.7) + "px Arial Bold", true);
  drawText(msg,            x+w/2, y+17*lineHeight, (fontSize) + "px Arial Bold", true);
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

var newGameButton = new CButton(function(){
		return gridOffsetX+gridPixelSize-175},
		function(){return gridOffsetY+8},
		170, 36,
		function(){
			gfx.fillStyle = '#808080';
			gfx.fillRect(this.x(), this.y(), this.width, this.height);
						gfx.fillStyle = '#f0f0f0';
			drawText("New Game",       this.x()+85, gridOffsetY+32,  "Bold 20px arial",true, false);
		},
		function(){
			newGame();
			setMenuDraw(false);
		}
	);

var instructionsButton = new CButton(function(){
		return gridOffsetX+gridPixelSize-175},
		function(){return gridOffsetY+52},
		170, 36,
		function(){
			gfx.fillStyle = '#808080';
			gfx.fillRect(this.x(), this.y(), this.width, this.height);
						gfx.fillStyle = '#f0f0f0';
			drawText("Instructions",   this.x()+85, gridOffsetY+78,  "Bold 20px arial",true, false);
		},
		function(){
			drawInstructions = true;
			setMenuDraw(false);
		}
	);


var trophiesButton = new CButton(function(){
		return gridOffsetX+gridPixelSize-175},
		function(){return gridOffsetY+96},
		170, 36,
		function(){
			gfx.fillStyle = '#808080';
			gfx.fillRect(this.x(), this.y(), this.width, this.height);
			gfx.fillStyle = '#f0f0f0';
			drawText("Statistics",     this.x()+85, gridOffsetY+120, "Bold 20px arial", true, false);
		},
		function(){
			modeTrophies = true;
			setMenuDraw(false);
			menuButton.enabled = false;
			trophiesReturnToGameButton.enabled = true;
			trophiesAnimating = true;
			onresize();
		}
	);

var trophiesReturnToGameButton = new CButton(
		function(){return gridOffsetX+gridPixelSize-178;},
		function(){return 12;},
		170, 36,
		function(){
			gfx.fillStyle = '#808080';
			gfx.fillRect(this.x(), this.y(), this.width, this.height);
			gfx.fillStyle = '#f0f0f0';
			drawText("Back",     this.x()+85, 35, "Bold 20px arial", true, false);
		},
		function(){
			modeTrophies = false;
			menuButton.enabled = true;
			trophiesReturnToGameButton.enabled = false;
			onresize();
		}
	);
