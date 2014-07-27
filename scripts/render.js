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
	updateScoreBoxes();

	gfx.clearRect(0,0,canvasWidth,canvasHeight);
	gfx.save();
	gfx.translate(paneThickness,paneThickness);

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
}

// XXX: resize text if need be
var firsttime = true;
window.onresize = function(){
	//Enforces a square aspect ratio
	var offset = $('#canvas').offset();
	var inGameControlSpace = 40;
	offset.left = window.innerWidth * 0.02;
	var innerSize = Math.max(Math.min(window.innerWidth - offset.left, window.innerHeight - offset.top), minCanvasSize);

	$('#game_div').width(   innerSize - 2*offset.left);
	$('#canvas_div').width( innerSize - 2*offset.left);
	$('#canvas_div').height(innerSize - 2*offset.top);

	// force canvas to be square -- offset width is VERY important to preserve scale!!
	canvasWidth = canvasHeight = canvas.height = canvas.width = $('#canvas_div').width();
	cellSize = Math.floor((canvasWidth - paneThickness*2)/gridSize);
	currentlyAnimating = true;
}
