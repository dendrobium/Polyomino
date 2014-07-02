function newGame(){
	board = new grid(gridSize);
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j)
		board.setCell(i,j,new cell());
	blockId = 0;
	score = 0;
	dragging = false;
	snapping = false;
	currentlyAnimating = true;
	for(var i=0;i<initPieceCount;++i)placeNewPoly();

	particleSystem = new ParticleSystem(document.getElementById("particles"));
	particleSystem.canvas.width = canvas.width  = ww = gridSize*cellSize+paneThickness*2;
	particleSystem.canvas.width = canvas.height = wh = gridSize*cellSize+paneThickness*2;
}

function gameOver(){
	// TODO: spin off animation event, bool for temp control override (click to continue?
}

(function main(){
	tick=new Date().getTime();
	newGame();
	render();
})();
