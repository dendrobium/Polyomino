function renderGridRaw(g,value,offset){
	//var hue = function(order){return(order*goldenAngle)%1;}


	var cs = cellSize;
    var goodColors = [
        "#000000", //Never used
        "#8B8C7A", //Stone  (monomino)
        "#8B4513", //Bark (domino)
        "#FFBD4F", //Orange (tromino)
        "#B2B14C", //Olive (tetromino)
        "#579244", //Moss (pentomino)
        "#708090", //Slate (hexomino)
        "#BE0028", //DarkRed (octomino)
        "#AD79AB", //Mauve(nonomino)
        "#9932CC", //Purple (decomino)
        "#E3A6EC", //Iilac (undecomino)
        "#CCCCCC"  //Light Gray  (dodecomino)
    ];

	for(var i=0;i<g.size;++i)for(var j=0;j<g.size;++j){
		var c = g.getCell(i,j);
		if(!c.occupied)continue;
		//hsv(hue(c.order),1,value);
        gfx.fillStyle=goodColors[c.order];
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

	// render grid lines
	rgb(0.2,0.2,0.2);

    //renderRect(-2,1,board.size*cellSize+2,board.size*cellSize-1)
    //Why does the above line cause not just a board outline to be drawn, but all internal grid boxes?
	for(var i=0;i<=board.size;++i)for(var j=0;j<=board.size;++j){
		renderRect(i*cellSize-4,j*cellSize-1,i*cellSize+4,j*cellSize+1);
		renderRect(i*cellSize-1,j*cellSize-4,i*cellSize+1,j*cellSize+4);
	}

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


showFlipPolyominoIcon()
