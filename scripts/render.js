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

    if(c.cemented) {
      rgb(0.5, 0.5, 0.5);
    }
		else if(usePrimary){
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
function render(){
	requestAnimationFrame(render);
	var currentTick = new Date().getTime();
	elapsed = currentTick-tick;
	tick = currentTick;
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

//==== Resizing ====//

window.onresize = function(){
	gridOffsetY   = 60;
	var gridMarginY = 60; //will be used soon, don't remove
	var gridPaddingY = 20;

	canvasWidth   = canvas.width  = window.innerWidth;
	canvasHeight  = canvas.height = window.innerHeight-gridMarginY;
	document.getElementById("cvs_div").style.width = canvasWidth+"px";
	document.getElementById("cvs_div").style.height = canvasHeight+"px";
	document.getElementById("social_div").style.width = canvasWidth+"px";
	document.getElementById("social_div").style.height = gridMarginY+"px";
	document.getElementById("social_div").style.top = canvasHeight+"px";


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

