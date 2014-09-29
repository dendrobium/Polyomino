//==  GAME UTILS  ============================================================//

var resetStorage = false;
var version = "0.92"; //to be used to reset testing computers

function initGame(){
	dragging = snapping             = false;
	currentlyAnimating              = true;
	triggerDetectSquares            = true;
	spawnNewPoly = polyMoved        = false;
	gameWon  = gameWonOverlayShown  = false;
	gameLost = gameLostOverlayShown = false;
	comboActiveCtr                  = 0;
	score                           = goalScore;
	maxCombo                        = parseInt(localStorage.getItem("maxCombo")) || 0;
	maxComboScore                   = parseInt(localStorage.getItem("maxComboScore")) || 0;
	shapeCountAllTime               = JSON.parse(localStorage.getItem("shapeCount")) || shapeCountCurrentGame;

	selection = new grid(gridSize);
	for(var i=0;i<selection.size;++i)for(var j=0;j<selection.size;++j)
		selection.setCell(i,j,0);
}

function newGame(){
  gameState = GAME_STATE_SETUP;
  console.log("game.newGame()  gameLevel="+gameLevel);
	board = new grid(gridSize);
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j)
		board.setCell(i,j,new cell());

	inactiveEvtLs = [];
	activeEvtLs = [];

	blockId   = 0;
	goalScore = 0;
  gameMaxShapeLevel = 1;
  orderOfLastMerge = 1;
  initGameShapeCounts();

	initGame();

  spawnLevel();

	saveGame();
	timeStarted = new Date().getTime();
	localStorage.setItem("time", timeStarted);
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
				c.cemented = s.cemented;
				board.setCell(i,j,c);
			}
			blockId   = parseInt(localStorage.getItem("blockId"));
			goalScore = parseInt(localStorage.getItem("score"));
			timeStarted = parseInt(localStorage.getItem("time"));
			var testscoreFuncVersion = localStorage.getItem("scoreFuncVersion");
      gameMaxShapeLevel = localStorage.getItem("gameMaxShapeLevel");
      gameLevel = localStorage.getItem("gameLevel");

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
	if ((gameState === GAME_STATE_PLAYING) && (!hasCemented())) {
    gameState = GAME_STATE_ROUND_OVER;
    gameWonEvt(0);
  }
  if(typeof(Storage) !== "undefined") {
		localStorage.setItem("board",            JSON.stringify(board));
		localStorage.setItem("blockId",          blockId);
		localStorage.setItem("score",            goalScore);
		localStorage.setItem("scoreFuncVersion", scoreFuncVersion);
		localStorage.setItem("highScore",        highScore);
		localStorage.setItem("maxComboScore", maxComboScore);
		localStorage.setItem("maxCombo", maxCombo);
		localStorage.setItem("gameMaxShapeLevel", gameMaxShapeLevel);
    localStorage.setItem("gameLevel", gameLevel);
	}
}

function gameOver(){
	// TODO: spin off animation event, bool for temp control override (click to continue?)
}

//==  SCORE RELATED  =========================================================//

function addToScore(squareOrder,pieceOrder,combo){
	var points = Math.floor(Math.pow(squareOrder*squareOrder*pieceOrder, combo*0.5+0.5));
	goalScore += points;

	if(combo > maxCombo)maxCombo = combo;
	if(combo > 1)currentComboScore += points;
	else currentComboScore = points;
	if(currentComboScore > maxComboScore)maxComboScore = currentComboScore;
	var totalScore = parseInt(localStorage.getItem("totalScore"));
	localStorage.setItem("totalScore", totalScore + points);
	currentlyAnimating = true;
}
var scoreFuncVersion = btoa(addToScore.toString());

//==  ENTRY FUNCTION  ========================================================//

window.onload = function(){

	// setup controls and canvas element
	canvas = document.getElementById("canvas");
	drawNames();
	gfx = canvas.getContext("2d");
	tick=new Date().getTime();
	window.onresize();  // determine grid/cell size
	//setupInstruction(); // setup instructions based on grid size
	setupControls();

	// see if first-time visitor and needs instructions
	if(typeof(Storage) !== "undefined"){
		if(resetStorage){
			localStorage.clear();
		}

		var versionNum = localStorage.getItem("version");
		if(version !== versionNum){
			if(!localStorage.getItem("version"))
				localStorage.setItem("version",          version);
			if(!localStorage.getItem("scoreFuncVersion"))
				localStorage.setItem("scoreFuncVersion", scoreFuncVersion);
			if(!localStorage.getItem("highScore"))
				localStorage.setItem("highScore",        0);
			if(!localStorage.getItem("bestTime"))
				localStorage.setItem("bestTime",         "N/A");
			if(!localStorage.getItem("totalScore"))
				localStorage.setItem("totalScore",       0);
			if(!localStorage.getItem("highestOrder"))
				localStorage.setItem("highestOrder",     "N/A");
			if(!localStorage.getItem("totalMerges"))
				localStorage.setItem("totalMerges",      0);
			for(var i = 2; i < 9; i++)
				if(!localStorage.getItem("of"+i))
					localStorage.setItem("#of"+i,          0);

			drawInstructions = true;
			newGame();
		}
		else{ //previous visitor; try to load game
			if(!loadGame())
				newGame();
		}
	} else { //they have no local storage: assume 1st time visitor
		drawInstructions = true;
		newGame();
	}

	render();
}
