function movePiece(from,to,id,offsetX,offsetY){
	for(var i=0;i<from.size;++i)for(var j=0;j<from.size;++j){
		var c = from.getCell(i+offsetX,j+offsetY);
		if(!c)continue;
		if(c.id !== id)continue;
		to.setCell(i,j,c);
		from.setCell(i+offsetX,j+offsetY,null);
	}
}

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

canvas.addEventListener("mouseup",function(e){
	mouse = getMousePos(e);
	if(!dragging||snapping)return;

	calcMouseGridVars();
	var offsetX = downGX-mouseGX;
	var offsetY = downGY-mouseGY;

	var revert = function(){
		for(var i=0;i<floating.size;++i)for(var j=0;j<floating.size;++j)
		if(floating.getCell(i,j))
			active.setCell(i,j,true);
		goalFloatX = goalFloatY = 0;
		snapping = true;
	};

	// check if floating is dropped on original position
	if(downGX == mouseGX && downGY == mouseGY){revert();return;}

	// make sure pieces in floating and board aren't overlapping
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j)
	if(board.getCell(i,j))
	if(floating.getCell(i+offsetX,j+offsetY)){revert();return;}

	// make sure pieces in floating aren't out of bounds in board
	for(var i=0;i<floating.size;++i)for(var j=0;j<floating.size;++j)
	if(floating.getCell(i,j)){
		var x = i-offsetX;
		var y = j-offsetY;
		if(x<0||y<0||x>=floating.size||y>=floating.size){revert();return;}
	}

	// successful move, place new poly
	movePiece(floating,board,floating.getCell(mouseDX/cellSize,mouseDY/cellSize).id,offsetX,offsetY);
	placeNewPoly();
	dragging = false;
});
