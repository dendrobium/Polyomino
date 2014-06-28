function notAnimating(x,y){
	var c = anim.getCell(x,y);
	c = c[c.length-1];
	if(!c)return true;
	if(c.inOutFade === IN || c.inOutFade === OUT)return false;
	return true;
}

function renderGrid(g){
	var hue = function(order){return (order*goldenAngle)%1;}

	for(var i=0;i<g.size;++i)for(var j=0;j<g.size;++j){
		var c = g.getCell(i,j);
		if(c && notAnimating(i,j)){
			hsv(hue(c.order),1,0.6);
			renderRect(i*cs+1,j*cs+1,(i+1)*cs-1,(j+1)*cs-1);
			var right = g.getCell(i+1,j);
			if(right&&right.id === c.id)renderRect((i+1)*cs-2,j*cs+1,(i+1)*cs+2,(j+1)*cs-1);
			var down = g.getCell(i,j+1);
			if(down&&down.id === c.id)renderRect(i*cs+1,(j+1)*cs-2,(i+1)*cs-1,(j+1)*cs+2);
		}
	}

	for(var i=0;i<g.size;++i)for(var j=0;j<g.size;++j){
		var c = g.getCell(i,j);
		if(c && notAnimating(i,j)){
			hsv(hue(c.order),1,1);
			renderRect(i*cs+3,j*cs+3,(i+1)*cs-3,(j+1)*cs-3);
			var right = g.getCell(i+1,j);
			if(right&&right.id === c.id)renderRect((i+1)*cs-4,j*cs+3,(i+1)*cs+4,(j+1)*cs-3);
			var down = g.getCell(i,j+1);
			if(down&&down.id === c.id)renderRect(i*cs+3,(j+1)*cs-4,(i+1)*cs-3,(j+1)*cs+4);
		}
	}
}

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
		renderRect(i*cs-4,j*cs-1,i*cs+4,j*cs+1);
		renderRect(i*cs-1,j*cs-4,i*cs+1,j*cs+4);
	}

	// render grid cells
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
		rgb(0.02,0.02,0.02);
		renderRect(i*cs+2,j*cs+2,(i+1)*cs-2,(j+1)*cs-2);
	}

	// render board and animations
	renderGrid(board);
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
		var cLs = anim.getCell(i,j);
		var c = cLs[cLs.length-1];
		if(!c)continue;
		currentlyAnimating = true;
		if(tick>c.end){
			cLs.pop();
			c = cLs[cLs.length-1];
			if(!c){
				active.setCell(i,j,null);
				triggerDetectSquares = true;
				continue;
			}
		}

		switch(c.inOutFade){
			case IN:
				if(tick>c.begin){
					rgb(1,1,1);
					var interp = (tick-c.begin)/(c.end-c.begin);
					switch(c.direction){
						case UP:   renderRect(i*cs,(j+1)*cs-interp*cs,(i+1)*cs,(j+1)*cs);break;
						case DOWN: renderRect(i*cs,j*cs,(i+1)*cs,j*cs+interp*cs);break;
						case LEFT: renderRect((i+1)*cs-interp*cs,j*cs,(i+1)*cs,(j+1)*cs);break;
						case RIGHT:renderRect(i*cs,j*cs,i*cs+interp*cs,(j+1)*cs);break;
					}
				}break;
			case OUT:
				if(tick<c.begin){
					rgb(1,1,1);
				}else{
				}break;
			case OUTFADE:
				if(tick<c.begin)rgb(1,1,1);
				else{
					var interp = 1-(tick-c.begin)/(c.end-c.begin);
					gfx.fillStyle = "rgba(255,255,255,"+interp+")";
				}renderRect(i*cs,j*cs,(i+1)*cs,(j+1)*cs);
				break;
		}
	}

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
			for(var i=0;i<floating.size;++i)for(var j=0;j<floating.size;++j)
			if(floating.getCell(i,j))
				active.setCell(i,j,null);
			movePiece(floating,board,floating.getCell(mouseDX/cs,mouseDY/cs).id,0,0);
			dragging = snapping = false;
		}
	}

	gfx.restore();
	if(triggerDetectSquares)detectSquares();
	if(currentlyAnimating)requestAnimationFrame(render);
}