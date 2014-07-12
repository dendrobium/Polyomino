function interpColor(c1,c2,interp){
	rgb(c1.r+(c2.r-c1.r)*interp,
	    c1.g+(c2.g-c1.g)*interp,
	    c1.b+(c2.b-c1.b)*interp);
}

function renderGridRaw(g,offset,usePrimary,overrideColor){
	var cs = cellSize;

	for(var i=0;i<g.size;++i)for(var j=0;j<g.size;++j){
		var c = g.getCell(i,j);
		if(!c.occupied)continue;

		if(overrideColor){
			gfx.fillStyle = overrideColor;
		}else if(usePrimary){
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
	renderGridRaw(g,1,true);
	renderGridRaw(g,3,false);
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


	// render everything if flagged
	if(!currentlyAnimating)return;
	currentlyAnimating = false;

	gfx.clearRect(0,0,canvasWidth,canvasHeight);
	gfx.save();
	gfx.translate(paneThickness,paneThickness);

	var cs = cellSize;

	rgb(0.28,0.28,0.28);
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
		renderRect(i*cs+1,j*cs+1,(i+1)*cs-1,(j+1)*cs-1);
	}

	// render board and process events and animations
	renderGrid(board);
	tickParticles();
	processActiveEvents();

	// render floating layer
	if(dragging){
		currentlyAnimating = true;
		var goalHover = snapping?0:hoverOffset;
		floatX += (goalFloatX-floatX)*0.3;       // TODO: scale this by elapsed, clamp
		floatY += (goalFloatY-floatY)*0.3;       // TODO: scale this by elapsed, clamp
		hover  += (goalHover-hover)*0.3;         // TODO: scale this by elapsed, clamp
		rot    += ((goalRot*Math.PI/2)-rot)*0.3; // TODO: scale this by elapsed, clamp

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
		}
	}

	gfx.restore();
}

// XXX: resize text if need be
var firsttime = true;
window.onresize = function(){
	document.getElementById('header_div').style.fontSize = (window.innerWidth < 480) ? "30px" : "48px";

	// Setup width/height to look good
	var offset = $('#canvas').offset();
	var inGameControlSpace = 40;
	$('#game_div').width(Math.min(window.innerHeight - 2 * offset.top, window.innerWidth - 2 * offset.left));
	$('#game_div').height(Math.min(window.innerHeight - 2 * offset.top, window.innerWidth - 2 * offset.left));

	// force canvas to be square -- offset width is VERY important to preserve scale!!
	canvasWidth = canvasHeight = canvas.height = canvas.width = $('#canvas_div').width();

	// Don't want to do this while game is running!!
	if(firsttime){
		// XXX: why is grid size a function of how large the window is?
		// XXX: you can lose save states because of this (play game in small window, resize to large window, refresh)
		if( (canvasWidth - paneThickness*2)/gridSize < cellSizeThreshold ) gridSize = smallGridSize;
		else gridSize = largeGridSize;
		firsttime = false;
		goalOrder = (gridSize == largeGridSize) ? 6 : 5;
	}

	cellSize = Math.floor((canvasWidth - paneThickness*2)/gridSize);
	currentlyAnimating = true;
}
