function interpColor(c1,c2,interp){
	rgb(c1.r+(c2.r-c1.r)*interp,
	    c1.g+(c2.g-c1.g)*interp,
	    c1.b+(c2.b-c1.b)*interp);
}

function renderGridRaw(g,offset,usePrimary, overrideColor){
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


	// render everything if flagged
	if(!currentlyAnimating)return;
	currentlyAnimating = false;

	gfx.clearRect(0,0,canvasWidth,canvasHeight);
	gfx.save();
	gfx.translate(paneThickness,paneThickness);

	// //Removed to get rid of the optical illusion that Joel noticed; kept as a comment in case we want it back

	// // render internal grid lines
	// rgb(0.4,0.4,0.4);
	// var length = 4;
	// var lw = 1;
	// for(var i=1;i<board.size;++i)for(var j=1;j<board.size;++j){
	// 	renderRect(i*cellSize-length,j*cellSize-1,i*cellSize+length,j*cellSize+1);
	// 	renderRect(i*cellSize-1,j*cellSize-length,i*cellSize+1,j*cellSize+length);
	// }

	// // render edge grid lines
	// for(var i=1;i<board.size;++i){
	// 	renderRect(i*cellSize-length,-1,i*cellSize+length,1);
	// 	renderRect(i*cellSize-1,-1,i*cellSize+1,length);
	// 	renderRect(i*cellSize-length,gridSize*cellSize-1,i*cellSize+length,gridSize*cellSize+1);
	// 	renderRect(i*cellSize-1,gridSize*cellSize-length,i*cellSize+1,gridSize*cellSize+1);
	// }for(var j=1;j<board.size;++j){
	// 	renderRect(-1,j*cellSize-1,length,j*cellSize+1);
	// 	renderRect(-1,j*cellSize-length,1,j*cellSize+length);
	// 	renderRect(gridSize*cellSize-length,j*cellSize-1,gridSize*cellSize+1,j*cellSize+1);
	// 	renderRect(gridSize*cellSize-1,j*cellSize-length,gridSize*cellSize+1,j*cellSize+length);
	// }

	// // render corner grid lines
	// renderRect(-1,-1,length,1);
	// renderRect(-1,-1,1,length);
	// renderRect(gridSize*cellSize-length,-1,gridSize*cellSize+1,1);
	// renderRect(gridSize*cellSize-1,-1,gridSize*cellSize+1,length);
	// renderRect(-1,gridSize*cellSize-length,1,gridSize*cellSize+1);
	// renderRect(-1,gridSize*cellSize-1,length,gridSize*cellSize+1);
	// renderRect(gridSize*cellSize-length,gridSize*cellSize-1,gridSize*cellSize+1,gridSize*cellSize+1);
	// renderRect(gridSize*cellSize-1,gridSize*cellSize-length,gridSize*cellSize+1,gridSize*cellSize+1);

	// render grid cells
	// I (Ezra) added a shadow

	var shadowSize = 1;
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
		var x0 = i*cellSize+2;
		var y0 = j*cellSize+2;
		var x1 = (i+1)*cellSize-2;
		var y1 = (j+1)*cellSize-2;

		rgb(0.01, 0.01, 0.01);
		renderRect(x1, y1, x0, y1+shadowSize);
		renderRect(x1, y1+shadowSize, x1+shadowSize, y0);

		rgb(0.5, 0.5, 0.5);
		renderRect(x0, y1+shadowSize, x0-shadowSize, y0);
		renderRect(x1+shadowSize, y0-shadowSize, x0-shadowSize, y0);

		rgb(0.15,0.15,0.15);
		renderRect(x0,y0,x1,y1);
	}

	// render board and process events and animations
	renderGrid(board);
	tickParticles();
	processActiveEvents();

	// render floating layer
	if(dragging){
		currentlyAnimating = true;
		floatX += (goalFloatX-floatX)*0.3;
		floatY += (goalFloatY-floatY)*0.3;

		//render a "hole" where the floating one originated
		renderGridRaw(floating,1,false, "#505050");

		//render a shadow
		gfx.save();
		gfx.translate(-floatX+3, -floatY+3);
		renderGridRaw(floating,1,false, "#000000");
		gfx.restore();

		//render the floating layer itself
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

var firsttime = true;
window.onresize = function(){

	//Setup width/height to look good
	var offset = $('#canvas').offset();
	$('#game_div').width(Math.min(window.innerHeight - 2 * offset.top, window.innerWidth - 2 * offset.left));

	//force canvas to be square -- offset width is VERY important to preserve scale!!
  canvasWidth = canvasHeight =canvas.height = canvas.offsetHeight = canvas.width = canvas.offsetWidth;;

	//Don't want to do this while game is running!!
	if(firsttime){
		if( (canvasWidth - paneThickness*2)/gridSize < cellSizeThreshold ) gridSize = 8;
		else gridSize = 10;
		firsttime = false;
		goalOrder = (gridSize == 10) ? 6 : 5;
	}

	cellSize = Math.floor((canvasWidth - paneThickness*2)/gridSize);
	currentlyAnimating = true;
}
