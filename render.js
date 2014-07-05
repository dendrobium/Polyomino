function renderGridRaw(g,value,offset){
	var cs = cellSize;

	for(var i=0;i<g.size;++i)for(var j=0;j<g.size;++j){
		var c = g.getCell(i,j);
		if(!c.occupied)continue;
		rgb(polyColor[c.order].r,polyColor[c.order].g,polyColor[c.order].b);
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
	renderGridRaw(g,0.6,1);
	renderGridRaw(g,1,3);
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

	gfx.clearRect(0,0,ww,wh);
	gfx.save();
	gfx.translate(paneThickness,paneThickness);

	// render internal grid lines
	rgb(0.2,0.2,0.2);
	for(var i=1;i<board.size;++i)for(var j=1;j<board.size;++j){
		renderRect(i*cellSize-4,j*cellSize-1,i*cellSize+4,j*cellSize+1);
		renderRect(i*cellSize-1,j*cellSize-4,i*cellSize+1,j*cellSize+4);
	}

	// render edge grid lines
	for(var i=1;i<board.size;++i){
		renderRect(i*cellSize-4,-1,i*cellSize+4,1);
		renderRect(i*cellSize-1,-1,i*cellSize+1,4);
		renderRect(i*cellSize-4,gridSize*cellSize-1,i*cellSize+4,gridSize*cellSize+1);
		renderRect(i*cellSize-1,gridSize*cellSize-4,i*cellSize+1,gridSize*cellSize+1);
	}for(var j=1;j<board.size;++j){
		renderRect(-1,j*cellSize-1,4,j*cellSize+1);
		renderRect(-1,j*cellSize-4,1,j*cellSize+4);
		renderRect(gridSize*cellSize-4,j*cellSize-1,gridSize*cellSize+1,j*cellSize+1);
		renderRect(gridSize*cellSize-1,j*cellSize-4,gridSize*cellSize+1,j*cellSize+4);
	}

	// render corner grid lines
	renderRect(-1,-1,4,1);
	renderRect(-1,-1,1,4);
	renderRect(gridSize*cellSize-4,-1,gridSize*cellSize+1,1);
	renderRect(gridSize*cellSize-1,-1,gridSize*cellSize+1,4);
	renderRect(-1,gridSize*cellSize-4,1,gridSize*cellSize+1);
	renderRect(-1,gridSize*cellSize-1,4,gridSize*cellSize+1);
	renderRect(gridSize*cellSize-4,gridSize*cellSize-1,gridSize*cellSize+1,gridSize*cellSize+1);
	renderRect(gridSize*cellSize-1,gridSize*cellSize-4,gridSize*cellSize+1,gridSize*cellSize+1);

	// render grid cells
	rgb(0.02,0.02,0.02);
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j)
		renderRect(i*cellSize+2,j*cellSize+2,(i+1)*cellSize-2,(j+1)*cellSize-2);


	// render board and process events and animations
	renderGrid(board);
	processActiveEvents();

	// render floating layer
	if(dragging){
		currentlyAnimating = true;
		floatX += (goalFloatX-floatX)*0.3;
		floatY += (goalFloatY-floatY)*0.3;

		gfx.save();
		gfx.translate(-floatX,-floatY);
		// gfx.translate(Math.round(-floatX),Math.round(-floatY)); // no anti-alias version
		//   if you want some sort of transparency going on in the floating layer, you need to use this or there will be artifacts
		renderGrid(floating);
		gfx.restore();

		// break animation if snapping is complete
		if(snapping &&
		   Math.abs(floatX-goalFloatX)<0.5 &&
		   Math.abs(floatY-goalFloatY)<0.5){
			movePiece(floating,board,floating.getCell(mouseDX/cellSize,mouseDY/cellSize).id,placeX,placeY);
			deselectGrid(board);
			dragging = snapping = false;
			triggerDetectSquares = true;
		}
	}

	gfx.restore();
}
