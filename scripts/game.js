function newGame(){
	boardMain = new grid(gridSize);
  boardFloating = new grid(gridSize);
	for(var i=0;i<gridSize;++i)for(var j=0;j<gridSize;++j) {
    boardMain.setCell(i, j, new cell());
    boardFloating.setCell(i, j, new cell());
  }

	initShapes();
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

	updateScoreBoxes();
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
			boardMain = new grid(gridSize);
      boardFloating = new grid(gridSize);
			for(var i=0;i<gridSize;++i)for(var j=0;j<gridSize;++j){
        boardMain .setCell(i, j, new cell());
        boardMain [i][j].occupied = storedboard[i][j].occupied;
        boardMain [i][j].id = storedboard[i][j].id;
        boardMain [i][j].order = storedboard[i][j].order;

        boardFloating.setCell(i, j, new cell());
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
	}
	catch(e){ return false}
	return false;
}

function saveGame(){
	if(typeof(Storage) !== "undefined") {
		localStorage.setItem("board", JSON.stringify(boardMain));
		localStorage.setItem("blockId", blockId);
		localStorage.setItem("score", score);
		localStorage.setItem("scoreFuncVersion", scoreFuncVersion);
		localStorage.setItem("highScore", highScore);
	}
}

function setupInstruction(){
	var txt = "Can you reach the " + ((gridSize === 10) ? "hexomino" : "pentomino") + "? (contains " + ((gridSize === 10) ? '6' : '5') +  " squares)";
	document.getElementById("inst_inner").innerHTML = txt;
}

function clearContainer(container){
	while(container.firstChild){
		container.removeChild(container.firstChild);
	}
}

//IMPORTANT: If you update the score function, increment this!
var scoreFuncVersion = 2;

function addToScore(ord){
	score += (ord*ord) * scoreCombo; //dummy score function. May be updated!
	scoreTick = tick;

	//TODO show points on-board (particles? some other effect?)
	if(score > highScore){
		highScore = score;
	}
	updateScoreBoxes();
}

function updateScoreBoxes(){
	document.querySelector(".highscore").textContent = highScore;
	document.querySelector(".score").textContent = score;
}


//Will run on DOM load
$(function(){

	//Set up controls and canvas element
	canvas = document.getElementById("canvas");
	gfx = canvas.getContext("2d");
	setupControls();

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

	updateScoreBoxes();
	render();
});
