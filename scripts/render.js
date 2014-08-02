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

	// draw cement "bolts"
	var cs = cellSize;
	for(var i=0;i<g.size;++i)for(var j=0;j<g.size;++j){
		var c = g.getCell(i,j);
		if(!c.occupied || !c.cemented)continue;
		var u  = g.getCell(i  ,j-1);u=u?u.id===c.id:false;
		var d  = g.getCell(i  ,j+1);d=d?d.id===c.id:false;
		var l  = g.getCell(i-1,j  );l=l?l.id===c.id:false;
		var r  = g.getCell(i+1,j  );r=r?r.id===c.id:false;
		var ul = g.getCell(i-1,j-1);ul=ul?ul.id===c.id:false;
		var ur = g.getCell(i+1,j-1);ur=ur?ur.id===c.id:false;
		var dl = g.getCell(i-1,j+1);dl=dl?dl.id===c.id:false;
		var dr = g.getCell(i+1,j+1);dr=dr?dr.id===c.id:false;

		rgb(0.25,0.25,0.25);
		if(!u&&!l||u&&l&&!ul)renderRect( i   *cs+4, j   *cs+4, i   *cs+10, j   *cs+10); // top left
		if(!u&&!r||u&&r&&!ur)renderRect((i+1)*cs-4, j   *cs+4,(i+1)*cs-10, j   *cs+10); // top right
		if(!d&&!l||d&&l&&!dl)renderRect( i   *cs+4,(j+1)*cs-4, i   *cs+10,(j+1)*cs-10); // bottom left
		if(!d&&!r||d&&r&&!dr)renderRect((i+1)*cs-4,(j+1)*cs-4,(i+1)*cs-10,(j+1)*cs-10); // bottom right

		rgb(0.5,0.5,0.5);
		if(!u&&!l||u&&l&&!ul)renderRect( i   *cs+6, j   *cs+6, i   *cs+8, j   *cs+8); // top left
		if(!u&&!r||u&&r&&!ur)renderRect((i+1)*cs-6, j   *cs+6,(i+1)*cs-8, j   *cs+8); // top right
		if(!d&&!l||d&&l&&!dl)renderRect( i   *cs+6,(j+1)*cs-6, i   *cs+8,(j+1)*cs-8); // bottom left
		if(!d&&!r||d&&r&&!dr)renderRect((i+1)*cs-6,(j+1)*cs-6,(i+1)*cs-8,(j+1)*cs-8); // bottom right
	}
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
	rgb(0.26,0.26,0.26);
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

	// render selection
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
		var s = selection.getCell(i,j);
		if(s === 0)continue;
		var b = board.getCell(i,j);
		if(!b.selected){
			s = interpolate(s,0,0.01);
			if(s<0.01)s = 0;
			selection.setCell(i,j,s);
		}else currentlyAnimating = true;
		rgba(polyColor[b.order].secondary.r,polyColor[b.order].secondary.g,polyColor[b.order].secondary.b,s);
		renderRect(i*cs,j*cs,(i+1)*cs,(j+1)*cs);
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
		rgba(0,0,0,0.3);
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
	var gridMarginY = 0; //will be used soon, don't remove
	var gridPaddingY = 40;

	canvasWidth   = canvas.width  = window.innerWidth;
	canvasHeight  = canvas.height = window.innerHeight-gridMarginY;

	cellSize      = Math.floor((Math.min(window.innerWidth, window.innerHeight-gridPaddingY-gridOffsetY-gridMarginY)+paneThickness*2)/gridSize);
	gridPixelSize = cellSize * gridSize + paneThickness*2;
	gridOffsetX   = Math.floor(window.innerWidth/2) - gridPixelSize/2;

	overlayRect.w = 0.8  * gridPixelSize;
	overlayRect.h = 0.9  * gridPixelSize;
	overlayRect.x = 0.1  * gridPixelSize + gridOffsetX;
	overlayRect.y = 0.05 * gridPixelSize + gridOffsetY;
	//cellSize = Math.floor((gridPixelSize - paneThickness*2)/gridSize);
	currentlyAnimating = true;
}

