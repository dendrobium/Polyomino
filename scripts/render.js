var interpolate = function(val,goal,mult){
	var origVal = val;
	val += (goal-val)*mult*elapsed;
	if(origVal < goal && val > goal)val = goal;
	if(origVal > goal && val < goal)val = goal;
	return val;
};

function interpColor(c1,c2,interp){
	rgb(c1.r+(c2.r-c1.r)*interp,
	    c1.g+(c2.g-c1.g)*interp,
	    c1.b+(c2.b-c1.b)*interp);
}

function renderGridRaw(g,offset,usePrimary){
	var cs = cellSize;

	for(var i=0;i<g.size;++i)for(var j=0;j<g.size;++j){
		var c = g.getCell(i,j);
		if(!c.occupied)continue;

		if(usePrimary){
			if(Math.floor(c.order)===0)rgb(polyColor[c.order].primary.r,polyColor[c.order].primary.g,polyColor[c.order].primary.b);
			else interpColor(polyColor[Math.floor(c.order)].primary,polyColor[Math.ceil(c.order)].primary,c.order%1);
		}else{
			if(Math.floor(c.order)===0)rgb(polyColor[c.order].secondary.r,polyColor[c.order].secondary.g,polyColor[c.order].secondary.b);
			else interpColor(polyColor[Math.floor(c.order)].secondary,polyColor[Math.ceil(c.order)].secondary,c.order%1);
		}

		renderRect(i*cs+offset,j*cs+offset,(i+1)*cs-offset,(j+1)*cs-offset);
		var right = g.getCell(i+1,j);
		if(right && right.occupied && right.id === c.id)
			renderRect((i+1)*cs-offset-1,j*cs+offset,(i+1)*cs+offset+1,(j+1)*cs-offset);
		var down = g.getCell(i,j+1);
		if(down && down.occupied && down.id === c.id)
			renderRect(i*cs+offset,(j+1)*cs-offset-1,(i+1)*cs-offset,(j+1)*cs+offset+1);
	}
}

function renderGrid(g){
	renderGridRaw(g,1,false);
	renderGridRaw(g,3,true);
}
var a = 0;
function render(){
	requestAnimationFrame(render);
	var currentTick = new Date().getTime();
	elapsed = currentTick-tick;
	tick = currentTick;
	document.getElementById("foo").innerHTML = a;
	a++;
	// preprocess event list
	processInactiveEvents();

	// detect squares if flagged
	if(triggerDetectSquares){
		detectSquares();
		currentlyAnimating = true;
	}triggerDetectSquares = false;

	// place new poly
	if(spawnNewPoly){
		spawnMonoOrDomino();
		currentlyAnimating = true;
	}spawnNewPoly = false;

	// render everything if flagged
	if(!currentlyAnimating)return;
	currentlyAnimating = false;

	score = Math.ceil(interpolate(score,goalScore,0.0001));
	if(score > highScore)highScore = score;
	if(score != goalScore)currentlyAnimating = true;

	gfx.clearRect(0,0,canvasWidth,canvasHeight);
	renderTopBar();
	gfx.fillStyle = '#424242';
	gfx.fillRect(gridOffsetX, gridOffsetY, gridPixelSize, gridPixelSize);
	gfx.save();
	gfx.translate(paneThickness+gridOffsetX,paneThickness+gridOffsetY);

	var cs = cellSize;

	rgb(0.28,0.28,0.28);
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
		renderRect(i*cs+1,j*cs+1,(i+1)*cs-1,(j+1)*cs-1);
	}

	if(debugMode){
		rgb(0.3,0.3,0.3);
		for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j)
			renderRect(i*cs+4,j*cs+4,(i+1)*cs-4,(j+1)*cs-4);
	}

	// render board and process events and animations
	renderGrid(board);
	tickParticles();
	processActiveEvents();

	// render floating layer
	if(dragging){
		currentlyAnimating = true;
		var goalHover = snapping?0:hoverOffset;

		floatX = interpolate(floatX,goalFloatX       ,0.016);
		floatY = interpolate(floatY,goalFloatY       ,0.016);
		hover  = interpolate(hover ,goalHover        ,0.014);
		rot    = interpolate(rot   ,goalRot*Math.PI/2,0.014);

		// render shadow
		gfx.save();
		gfx.translate(-floatX,-floatY);
		gfx.translate((downGX+0.5)*cs,(downGY+0.5)*cs);
		gfx.rotate(rot);
		gfx.translate((downGX+0.5)*-cs,(downGY+0.5)*-cs);
		gfx.fillStyle = "rgba(0,0,0,0.3)";
		for(var i=0;i<floating.size;++i)for(var j=0;j<floating.size;++j)
		if(floating.getCell(i,j).occupied)
			renderRect(i*cs,j*cs,(i+1)*cs,(j+1)*cs);
		gfx.restore();

		// render floating grid
		gfx.save();
		gfx.translate(-hover,-hover);
		gfx.translate(-floatX,-floatY);
		gfx.translate((downGX+0.5)*cs,(downGY+0.5)*cs);
		gfx.rotate(rot);
		gfx.translate((downGX+0.5)*-cs,(downGY+0.5)*-cs);
		renderGrid(floating);
		gfx.restore();

		// break animation if snapping is complete
		if(snapping &&
			Math.abs(floatX-goalFloatX)<0.5 &&
			Math.abs(floatY-goalFloatY)<0.5 &&
			Math.abs(hover -goalHover )<0.5 &&
		        Math.abs(rot-(goalRot*Math.PI/2))<0.01){
			copyPiece(transfer,board,transferId,true);
			deselectGrid(board);
			dragging = snapping = false;
			triggerDetectSquares = true;
			if(polyMoved)spawnNewPoly = true;
			polyMoved = false;
		}
	}

	gfx.restore();
	if(drawMenu)
		renderMenu();
	if(drawInstructions)
		renderInstructionsOverlay();
	else if(gameLost && !gameLostOverlayShown)
		renderGameLostOverlay();
	else if(gameWon && !gameWonOverlayShown){
		renderGameWonOverlay();
		drawGameWonOverlay = true;
	}
}
var gameWonOverlayShown; //set inside initGame
var gameLostOverlayShown; //set inside initGame
var drawInstructions = false;
var drawMenu = false;
function setMenuDraw(bool){
	newGameButton.enabled = instructionsButton.enabled = drawMenu = bool;
	currentlyAnimating = true;
}
var buttons = [];
//x, y, render, and callback are all functions
function CButton(x, y, size, render, callback){
	this.x = x;
	this.y = y;
	this.size = size;
	this.render = render;
	this.callback = callback;
	this.enabled = false;

	this.clickLogic = function(x, y){
		if(!this.enabled)
			return false;
		if(x < (this.x()+this.size) && x >= this.x() &&
			 y < (this.y()+this.size) && y >= this.y()){
			this.callback();
			return true;
			console.log("button clicked");
		}
	}

	buttons.push(this);
}
var menuButton = new CButton(function(){return gridOffsetX+gridPixelSize-44; },
														 function(){return 12; },
														 36,
														 function(){
															gfx.fillStyle = '#808080';
															gfx.fillRect(this.x(), this.y(), this.size, this.size);

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
																36,
																function(){
																	gfx.fillStyle = '#808080';
																	gfx.fillRect(this.x(), this.y(), this.size, this.size);
																},
																function(){newGame();});

var instructionsButton = new CButton(function(){return gridOffsetX+gridPixelSize-44},
																		function(){return gridOffsetY+52},
																		36,
																		function(){
																			gfx.fillStyle = '#808080';
																			gfx.fillRect(this.x(), this.y(), this.size, this.size);
																		},
																		function(){drawInstructions = true;});


var trophiesButton = new CButton(function(){return gridOffsetX+gridPixelSize-44},
																function(){return gridOffsetY+96},
																36,
																function(){
																	gfx.fillStyle = '#808080';
																	gfx.fillRect(this.x(), this.y(), this.size, this.size);
																},
																function(){ console.log("foo"); /* TODO show trophies */});
function renderTopBar(){
	gfx.fillStyle = '#424242';
	gfx.fillRect(gridOffsetX, 4, gridPixelSize, gridOffsetY-8);
	menuButton.render();

	gfx.fillStyle = '#f0f0f0';

	drawText("Polyomino", gridOffsetX+4, 44, "italic small-caps bold 40px arial");
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


//==== Resizing ====//

window.onresize = function(){
	gridOffsetY   = 60;
	var gridMarginY = 0; //will be used soon, don't remove
	var gridPaddingY = 40;

	canvasWidth   = canvas.width  = window.innerWidth;
	canvasHeight  = canvas.height = window.innerHeight-gridMarginY;


	cellSize      = Math.floor((Math.min(window.innerWidth, window.innerHeight-gridPaddingY-gridOffsetY-gridMarginY)+paneThickness*2)/gridSize);
	gridPixelSize = cellSize * gridSize + paneThickness*2;
	gridOffsetX   = window.innerWidth/2 - gridPixelSize/2;

	overlayRect.w = 0.8  * gridPixelSize;
	overlayRect.h = 0.9  * gridPixelSize;
	overlayRect.x = 0.1  * gridPixelSize + gridOffsetX;
	overlayRect.y = 0.05 * gridPixelSize + gridOffsetY;
	//cellSize = Math.floor((gridPixelSize - paneThickness*2)/gridSize);
	currentlyAnimating = true;
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
