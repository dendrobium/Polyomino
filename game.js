function newGame(){
	board = new grid(gridSize);
	active = new grid(gridSize);
	anim = new grid(gridSize);
	for(var i=0;i<anim.size;++i)for(var j=0;j<anim.size;++j)
		anim.setCell(i,j,[]);
	blockId = 0;
	score = 0;
	dragging = false;
	snapping = false;
	for(var i=0;i<4;++i)placeNewPoly();

	particleSystem = new ParticleSystem(document.getElementById("particles"));

	particleSystem.canvas.width  = canvas.width  = ww = gridSize*cellSize+8;
	particleSystem.canvas.height = canvas.height = wh = gridSize*cellSize+8;
}

(function main(){
	tick=new Date().getTime();
	newGame();
	render();
})();
