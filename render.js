// XXX XXX XXX: fix to accomodate new grid structure
function renderGrid(g){
	var hue = function(order){return (order*goldenAngle)%1;}

	for(var i=0;i<g.size;++i)for(var j=0;j<g.size;++j){
		var c = g.getCell(i,j);
		if(!c)continue;
		hsv(hue(c.order),1,0.6);
		renderRect(i*cellSize+1,j*cellSize+1,(i+1)*cellSize-1,(j+1)*cellSize-1);
		var right = g.getCell(i+1,j);
		if(right&&right.id === c.id)renderRect((i+1)*cellSize-2,j*cellSize+1,(i+1)*cellSize+2,(j+1)*cellSize-1);
		var down = g.getCell(i,j+1);
		if(down&&down.id === c.id)renderRect(i*cellSize+1,(j+1)*cellSize-2,(i+1)*cellSize-1,(j+1)*cellSize+2);
	}

	for(var i=0;i<g.size;++i)for(var j=0;j<g.size;++j){
		var c = g.getCell(i,j);
		if(!c)continue;
		hsv(hue(c.order),1,1);
		renderRect(i*cellSize+3,j*cellSize+3,(i+1)*cellSize-3,(j+1)*cellSize-3);
		var right = g.getCell(i+1,j);
		if(right&&right.id === c.id)renderRect((i+1)*cellSize-4,j*cellSize+3,(i+1)*cellSize+4,(j+1)*cellSize-3);
		var down = g.getCell(i,j+1);
		if(down&&down.id === c.id)renderRect(i*cellSize+3,(j+1)*cellSize-4,(i+1)*cellSize-3,(j+1)*cellSize+4);
	}
}

// XXX XXX XXX: fix to accomodate new grid structure
function render(){
	var currentTick = new Date().getTime();
	elapsed = currentTick-tick;
	tick = currentTick;
	var currentlyAnimating = false;
	var triggerDetectSquares = false;
	gfx.clearRect(0,0,ww,wh);
	gfx.save();
	gfx.translate(4,4);

	// render grid lines
	rgb(0.2,0.2,0.2);
	for(var i=1;i<board.size;++i)for(var j=1;j<board.size;++j){
		renderRect(i*cellSize-4,j*cellSize-1,i*cellSize+4,j*cellSize+1);
		renderRect(i*cellSize-1,j*cellSize-4,i*cellSize+1,j*cellSize+4);
	}

	// render grid cells
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
		rgb(0.02,0.02,0.02);
		renderRect(i*cellSize+2,j*cellSize+2,(i+1)*cellSize-2,(j+1)*cellSize-2);
	}

	// render board and animations
	renderGrid(board);

	// render floating layer
	if(dragging){
		currentlyAnimating = true;
		floatX += (goalFloatX-floatX)*0.3;
		floatY += (goalFloatY-floatY)*0.3;

		gfx.save();
		gfx.translate(-floatX,-floatY);
		renderGrid(floating);
		gfx.restore();

		// break animation if snapping is complete
		if(snapping &&
		   Math.abs(floatX-goalFloatX)<0.5 &&
		   Math.abs(floatY-goalFloatY)<0.5){
			movePiece(floating,board,floating.getCell(mouseDX/cellSize,mouseDY/cellSize).id,0,0);
			dragging = snapping = false;
		}
	}

	gfx.restore();
	if(triggerDetectSquares)detectSquares();
	if(currentlyAnimating)requestAnimationFrame(render);
}
