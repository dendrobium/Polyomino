function getMousePos(evt){
	var rect = canvas.getBoundingClientRect();
	return{x:evt.clientX-rect.left,y:evt.clientY-rect.top};
}

function calcMouseGridVars(){
	downGX  = Math.floor(mouseDX/cellSize);
	downGY  = Math.floor(mouseDY/cellSize);
	mouseGX = Math.floor(mouse.x/cellSize);
	mouseGY = Math.floor(mouse.y/cellSize);
}

// TODO: add locks
var cancelMove = function(){
	placeX = placeY = 0;
	goalFloatX = goalFloatY = 0;
	snapping = true;
	placeAfterSnap = false;
};

// TODO: lock cells being picked up
canvas.addEventListener("mousedown",function(e){
	mouse = getMousePos(e);
	if(dragging)return;
	var c = board.getCell(mouse.x/cellSize,mouse.y/cellSize);
	if(!c || !c.occupied || c.locked)return;

	// move selected piece onto floating layer,remove from board
	dragging = true;
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

	currentlyAnimating = true;
});

canvas.addEventListener("mousemove",function(e){
	mouse = getMousePos(e);
	if(!dragging||snapping)return;
	calcMouseGridVars();
	goalFloatX = (downGX-mouseGX)*cellSize+hoverOffset;
	goalFloatY = (downGY-mouseGY)*cellSize+hoverOffset;
});

canvas.addEventListener("mouseout",function(e){
	if(!dragging||snapping)return;
	cancelMove();
});

// TODO: consider locked cells
canvas.addEventListener("mouseup",function(e){
	mouse = getMousePos(e);
	if(!dragging||snapping)return;

	calcMouseGridVars();
	placeX = downGX-mouseGX;
	placeY = downGY-mouseGY;

	// check if floating is dropped on original position
	if(downGX == mouseGX && downGY == mouseGY){cancelMove();return;}

	// make sure pieces in floating arent dropped on existing pieces or locked cells
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j)
	if((board.getCell(i,j).occupied || board.getCell(i,j).locked) &&
	   (floating.getCell(i+placeX,j+placeY) &&
	    floating.getCell(i+placeX,j+placeY).occupied)
	  ){cancelMove();return;}

	// make sure pieces in floating aren't out of bounds in board
	for(var i=0;i<floating.size;++i)for(var j=0;j<floating.size;++j)
	if(floating.getCell(i,j).occupied){
		var x = i-placeX;
		var y = j-placeY;
		if(x<0||y<0||x>=floating.size||y>=floating.size){cancelMove();return;}
	}

	// successful move, place new poly
	// TODO: add locks
	goalFloatX = (downGX-mouseGX)*cellSize;
	goalFloatY = (downGY-mouseGY)*cellSize;
	snapping = true;
	placeAfterSnap = true;
});
