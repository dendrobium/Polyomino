function newGame(){
	board = new grid(gridSize);
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j)
		board.setCell(i,j,new cell());
	blockId = 0;
	score = 0;
	dragging = false;
	snapping = false;
	currentlyAnimating = true;
	triggerDetectSquares = true;
	for(var i=0;i<initPieceCount;++i)placeNewPoly();

	// uncomment to test colors
	// for(var i=0;i<gridSize;++i){
	// 	var id = newId();
	// 	for(var j=0;j<=i;++j)
	// 		board.getCell(i,j).quickSet(true,id,i+1);
	// }


}

function gameOver(){
	// TODO: spin off animation event, bool for temp control override (click to continue?)
}

bypassLoad = false;
function loadGame(){
	if(bypassLoad)
		return false;
	try { //try... catch to protect against corrupted savegames
		if(typeof(Storage) !== "undefined") {
			var storedboard = JSON.parse(localStorage.getItem("board"));
			if(!storedboard)
				return false;
			board = new grid(gridSize);
			for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
				board.setCell(i, j, new cell());
				board[i][j].occupied = storedboard[i][j].occupied;
				board[i][j].id = storedboard[i][j].id;
				board[i][j].order = storedboard[i][j].order;
			}
			blockId = localStorage.getItem("blockId");
			score = localStorage.getItem("score");
			dragging = false;
			snapping = false;
			currentlyAnimating = true;
			triggerDetectSquares = true;
			return true;
		}
	}
	catch(e){ return false}
	return false;
}

function saveGame(){
	if(typeof(Storage) !== "undefined") {
		localStorage.setItem("board", JSON.stringify(board));
		localStorage.setItem("blockId", blockId);
		localStorage.setItem("score", score);
	}
}

function setupInstruction(){
	var txt = "Can you reach the " + ((gridSize === 10) ? "hexomino" : "pentomino") + "? (contains " + ((gridSize === 10) ? '6' : '5') +  " squares)";
	document.getElementById("inst_inner").innerHTML = txt;
}

(function main(){
	tick=new Date().getTime();

	//determine grid/cell size
	window.onresize();

	//setup instructions based on grid size
	setupInstruction();

	//see if first-time visitor and needs instructions
	if(typeof(Storage) !== "undefined"){
		var visited = localStorage.getItem("visited");
		if(!visited)
			location = "#instructions";
		else
			location = "#close";
		localStorage.setItem("visited", true);
	}

	if(!loadGame())
		newGame();

	render();
})();
