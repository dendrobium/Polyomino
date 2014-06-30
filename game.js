function newGame(){
	board = new grid(gridSize);
	blockId = 0;
	score = 0;
	dragging = false;
	snapping = false;
	for(var i=0;i<initPieceCount;++i)placeNewPoly();
	detectSquares();
	canvas.width  = ww = gridSize*cellSize+8;
	canvas.height = wh = gridSize*cellSize+8;
}

(function main(){
	tick=new Date().getTime();
	newGame();
	render();
})();
