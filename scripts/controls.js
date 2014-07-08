function getMousePos(evt){
	var rect = canvas.getBoundingClientRect();
	return{x:evt.clientX-rect.left-paneThickness,y:evt.clientY-rect.top-paneThickness};
}

function calcMouseGridVars(){
	downGX	= Math.floor(mouseDX/cellSize);
	downGY	= Math.floor(mouseDY/cellSize);
	mouseGX = Math.floor(mouse.x/cellSize);
	mouseGY = Math.floor(mouse.y/cellSize);
}

var cancelMove = function(){
	placeX = placeY = 0;
	goalFloatX = goalFloatY = 0;
	snapping = true;
};

function touchHandler(event)
{
	var touches = event.changedTouches,
			first = touches[0],
			type = "";

	switch(event.type)
	{
			case "touchstart": type = "mousedown"; break;
			case "touchmove":	type="mousemove"; break;
			case "touchend":	 type="mouseup"; break;
			default: return;
	}

	var simulatedEvent = document.createEvent("MouseEvent");
	simulatedEvent.initMouseEvent(type, true, true, window, 1,
															first.screenX, first.screenY,
															first.clientX, first.clientY, false,
															false, false, false, 0/*left*/, null);
	first.target.dispatchEvent(simulatedEvent);
	event.preventDefault();
}


function setupControls(){
	canvas.addEventListener("touchstart", touchHandler);
	canvas.addEventListener("touchmove", touchHandler);
	canvas.addEventListener("touchend", touchHandler);

	canvas.addEventListener("mousedown",function(e){
		mouse = getMousePos(e);
		if(dragging)return;
		var c = board.getCell(mouse.x/cellSize,mouse.y/cellSize);
		if(!c || !c.occupied || c.locked)return;

		// set lock and selected flags for selected cells
		for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
			var b = board.getCell(i,j);
			if(b.id === c.id)b.locked = b.selected = true;
		}

		// move selected piece onto floating layer,remove from board
		floating = new grid(board.size);
		for(var i=0;i<floating.size;++i)for(var j=0;j<floating.size;++j)
			floating.setCell(i,j,new cell());
		movePiece(board,floating,c.id,0,0);

		mouseDX = mouse.x;
		mouseDY = mouse.y;
		calcMouseGridVars();
		floatX = (downGX-mouseGX)*cellSize;
		floatY = (downGY-mouseGY)*cellSize;
		goalFloatX = floatX+hoverOffset;
		goalFloatY = floatY+hoverOffset;

		dragging = true;
		currentlyAnimating = true;
	});

	canvas.addEventListener("mousemove",function(e){
		mouse = getMousePos(e);
		if(!dragging||snapping)return;
		calcMouseGridVars();
		goalFloatX = (downGX-mouseGX)*cellSize+hoverOffset;
		goalFloatY = (downGY-mouseGY)*cellSize+hoverOffset;
	});


	// I found that this was more annoying than helpful, honestly.
	//
	// canvas.addEventListener("mouseout",function(e){
	// 	if(!dragging||snapping)return;
	// 	cancelMove();
	// });

	canvas.addEventListener("mouseup",function(e){
		mouse = getMousePos(e);
		if(!dragging||snapping)return;

		calcMouseGridVars();
		placeX = downGX-mouseGX;
		placeY = downGY-mouseGY;

		// check if floating is dropped on original position
		if(downGX == mouseGX && downGY == mouseGY){cancelMove();return;}

		// make sure pieces in floating arent dropped on existing pieces or locked (and unselected) cells
		for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
			var b = board.getCell(i,j);
			var f = floating.getCell(i+placeX,j+placeY);
			if((b.occupied || (b.locked && !b.selected)) && (f && f.occupied)){cancelMove();return;}
		}

		// make sure pieces in floating aren't out of bounds in board
		for(var i=0;i<floating.size;++i)for(var j=0;j<floating.size;++j)
		if(floating.getCell(i,j).occupied){
			var x = i-placeX,y = j-placeY;
			if(x<0||y<0||x>=floating.size||y>=floating.size){cancelMove();return;}
		}

		// successful move, place new poly -----------------------------

		// unlock and deselect original cells, add new locks
		deselectGrid(board);
		for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
			var b = board.getCell(i,j);
			var f = floating.getCell(i+placeX,j+placeY);
			if(f && f.occupied)b.locked = b.selected = true;
		}

		goalFloatX = (downGX-mouseGX)*cellSize;
		goalFloatY = (downGY-mouseGY)*cellSize;
		snapping = true;
		placeNewPoly();
	});
}

