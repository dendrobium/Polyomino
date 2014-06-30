var cancelMove = function(){
	for(var i=0;i<floating.size;++i)for(var j=0;j<floating.size;++j)
	goalFloatX = goalFloatY = 0;
	snapping = true;
};

function calcMouseGridVars(){
	downGX  = Math.floor(mouseDX/cellSize);
	downGY  = Math.floor(mouseDY/cellSize);
	mouseGX = Math.floor(mouse.x/cellSize);
	mouseGY = Math.floor(mouse.y/cellSize);
}

function getMousePos(evt){
	var rect = canvas.getBoundingClientRect();
	return{x:evt.clientX-rect.left,y:evt.clientY-rect.top};
}

// TODO: consider locked cells
canvas.addEventListener("mousedown",function(e){
	mouse = getMousePos(e);
	if(dragging)return;
	var c = getInactiveCell(mouse.x/cellSize,mouse.y/cellSize);
	if(!c)return;

	// move selected piece onto floating layer,remove from board
	dragging = true;
	var id = c.id;
	var order = c.order;
	floating = new grid(board.size);
	movePiece(board,floating,c.id,0,0);

	mouseDX = mouse.x;
	mouseDY = mouse.y;
	calcMouseGridVars();
	floatX = goalFloatX = (downGX-mouseGX)*cellSize;
	floatY = goalFloatY = (downGY-mouseGY)*cellSize;

	render();
});

canvas.addEventListener("mousemove",function(e){
	mouse = getMousePos(e);
	if(!dragging||snapping)return;
	calcMouseGridVars();
	goalFloatX = (downGX-mouseGX)*cellSize;
	goalFloatY = (downGY-mouseGY)*cellSize;
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
	var offsetX = downGX-mouseGX;
	var offsetY = downGY-mouseGY;

	// check if floating is dropped on original position
	if(downGX == mouseGX && downGY == mouseGY){cancelMove();return;}

	// make sure pieces in floating and board aren't overlapping
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j)
	if(board.getCell(i,j))
	if(floating.getCell(i+offsetX,j+offsetY)){cancelMove();return;}

	// make sure pieces in floating aren't out of bounds in board
	for(var i=0;i<floating.size;++i)for(var j=0;j<floating.size;++j)
	if(floating.getCell(i,j)){
		var x = i-offsetX;
		var y = j-offsetY;
		if(x<0||y<0||x>=floating.size||y>=floating.size){cancelMove();return;}
	}

	// successful move, place new poly
	movePiece(floating,board,floating.getCell(mouseDX/cellSize,mouseDY/cellSize).id,offsetX,offsetY);
	placeNewPoly();
	dragging = false;
});
