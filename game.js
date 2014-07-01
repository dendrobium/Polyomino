function newGame(){
	board = new grid(gridSize);
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j)
		board.setCell(i,j,new cell(i,j));
	blockId = 0;
	score = 0;
	dragging = false;
	snapping = false;
	for(var i=0;i<initPieceCount;++i)placeNewPoly();
	canvas.width  = ww = gridSize*cellSize+8;
	canvas.height = wh = gridSize*cellSize+8;
}

function gameOver(){
	// TODO
}

(function main(){
	tick=new Date().getTime();
	newGame();
	render();
})();
