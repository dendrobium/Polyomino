//==  GAME UTILS  ============================================================//

var resetStorage = false;

function initGame(){
	dragging             = false;
	snapping             = false;
	currentlyAnimating   = true;
	triggerDetectSquares = true;
	spawnNewPoly         = false;
	gameWon              = false;
	gameLost             = false;
	comboActiveCtr       = 0;
	gameWonOverlayShown  = false;
	gameLostOverlayShown = false;
	polyMoved            = false;
	comboActiveCtr       = 0;
	score                = 0;
}

function newGame(){
	board = new grid(gridSize);
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j)
		board.setCell(i,j,new cell());

	inactiveEvtLs = [];
	activeEvtLs = [];

	blockId   = 0;
	goalScore = 0;

	initGame();
	placeStartingPolys();
	updateScoreBoxes();
	saveGame();
}

function loadGame(){
	if(bypassLoadGame)return false;
	try{
		if(typeof(Storage) !== "undefined") {
			var storedBoard = JSON.parse(localStorage.getItem("board"));
			if(!storedBoard)
				return false;
			//console.log(storedBoard);
			board = new grid(gridSize);
			for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
				var s = storedBoard[i][j];
				var c = new cell();
				c.quickSet(s.occupied,s.id,s.order);
				board.setCell(i,j,c);
			}
			blockId   = parseInt(localStorage.getItem("blockId"));
			goalScore = parseInt(localStorage.getItem("score"));
			var testscoreFuncVersion = localStorage.getItem("scoreFuncVersion");
			if(scoreFuncVersion === testscoreFuncVersion)
				highScore = parseInt(localStorage.getItem("highScore"));
			else
				highScore = 0;
			initGame();
			return true;
		}
	}catch(e){return false;}
	return false;
}

function saveGame(){
	if(typeof(Storage) !== "undefined") {
		localStorage.setItem("board",            JSON.stringify(board));
		localStorage.setItem("blockId",          blockId);
		localStorage.setItem("score",            goalScore);
		localStorage.setItem("scoreFuncVersion", scoreFuncVersion);
		localStorage.setItem("highScore",        highScore);
	}
}

function gameOver(){
	// TODO: spin off animation event, bool for temp control override (click to continue?)
}

//==  SCORE RELATED  =========================================================//

function addToScore(squareOrder,pieceOrder,multiplier){
	goalScore += Math.floor(Math.pow(squareOrder*squareOrder*pieceOrder, multiplier*0.5+0.5));
	currentlyAnimating = true;
}
var scoreFuncVersion = btoa(addToScore.toString());

//==  ENTRY FUNCTION  ========================================================//

$(function(){

	// setup controls and canvas element
	canvas = document.getElementById("canvas");
	gfx = canvas.getContext("2d");
	window.onresize();  // determine grid/cell size
	//setupInstruction(); // setup instructions based on grid size
	setupControls();

	// see if first-time visitor and needs instructions
	if(typeof(Storage) !== "undefined"){
		if(resetStorage){
			localStorage.clear();
		}

		var visited = localStorage.getItem("visited");
		if(!visited){
			localStorage.setItem("visited",          true);
			localStorage.setItem("scoreFuncVersion", scoreFuncVersion);
			localStorage.setItem("highScore",        0);

			// XXX: direct user to instructions
			drawInstructions = true;
		}
	} else { //they have no local storage: assume 1st time visitor
		drawInstructions = true;
	}

	// setup game
	var success = loadGame();
	//console.log(success);
	if(!success)
		newGame();

	// begin game
	tick=new Date().getTime();
	render();
});
