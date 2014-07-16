function newGame(){
	board = new grid(gridSize);
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j)
		board.setCell(i,j,new cell());

	blockId = 0;
	score = 0;
	// TODO: should highScore be considered here? its only ever defined in loadGame
	dragging = false;
	snapping = false;
	currentlyAnimating = true;
	triggerDetectSquares = true;
	spawnNewPoly = false; // TODO: LOADGAME
	placeStartingPolys();
	updateScoreBoxes();
	saveGame();
}

function gameOver(){
	// TODO: spin off animation event, bool for temp control override (click to continue?)
}

function loadGame(){
	if(bypassLoadGame)return false;
	try{
		if(typeof(Storage) !== "undefined") {
			var storedBoard = JSON.parse(localStorage.getItem("board"));
			if(!storedBoard)
				return false;
			board = new grid(gridSize);
			for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
				var s = storedBoard[i][j];
				var c = new cell();
				c.quickSet(s.occupied,s.id,s.order);
				board.setCell(i,j,c);
			}
			blockId = parseInt(localStorage.getItem("blockId"));
			score = parseInt(localStorage.getItem("score"));
			var testscoreFuncVersion = parseInt(localStorage.getItem("scoreFuncVersion"));
			if(scoreFuncVersion === testscoreFuncVersion)
				highScore = parseInt(localStorage.getItem("highScore"));
			else
				highScore = 0;
			dragging = false;
			snapping = false;
			currentlyAnimating = true;
			triggerDetectSquares = true;
			return true;
		}
	}catch(e){return false;}
	return false;
}

function saveGame(){
	if(typeof(Storage) !== "undefined") {
		localStorage.setItem("board", JSON.stringify(board));
		localStorage.setItem("blockId", blockId);
		localStorage.setItem("score", score);
		localStorage.setItem("scoreFuncVersion", scoreFuncVersion);
		localStorage.setItem("highScore", highScore);
	}
}

//function setupInstruction(){
	//var txt = "Can you reach the " + ((gridSize === 10) ? "<i>hexomino</i>" : "<i>pentomino</i>") + "? (contains " + ((gridSize === 10) ? '6' : '5') +  " squares)";
	//document.getElementById("inst_inner").innerHTML = txt;
//}

function clearContainer(container){
	while(container.firstChild){
		container.removeChild(container.firstChild);
	}
}

// IMPORTANT: If you update the score function, increment this!
// XXX: can't you compute the hash of the score function and use that instead?
var scoreFuncVersion = 2;

// TODO: combos
function addToScore(squareOrder,pieceOrder){
	score += (squareOrder*squareOrder*pieceOrder);
	if(score > highScore)highScore = score;
	updateScoreBoxes();
}

function updateScoreBoxes(){
	document.querySelector(".highscore").textContent = highScore;
	document.querySelector(".score").textContent = score;
}

$(function(){

	// setup controls and canvas element
	canvas = document.getElementById("canvas");
	gfx = canvas.getContext("2d");
	window.onresize();  // determine grid/cell size
	//setupInstruction(); // setup instructions based on grid size
	setupControls();

	// see if first-time visitor and needs instructions
	if(typeof(Storage) !== "undefined"){
		var visited = localStorage.getItem("visited");
		if(!visited)
			location = "#instructions";
		else
			location = "#close";
		localStorage.setItem("visited", true);
	}

	// setup game
	initShapes();
	if(!loadGame())newGame();
	updateScoreBoxes();

	// begin game
	tick=new Date().getTime();
	render();
});
