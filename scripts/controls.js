var KEYCODE_TAB = 9
var KEYCODE_SPACE = 32
var KEYCODE_ENTER = 13


var mouse = {
	x:0,
	y:0,
	rawX:0,
	rawY:0
}

var evts = {
	lDown: false,
	lUp:   false,
	rDown: false //don't need a rUp
}

function processInputs(){
	calcMouseGridVars();
	handle_lDown();
	handle_lUp();
	handle_rDown();
	handle_drag();
}

function handle_lDown(){
	//check for lmb press
	if(!evts.lDown) return;
  //console.log("controls.handle_lDown()::  gameWon="+gameWon);
	evts.lDown = false;
	//check buttons
	for(var b in buttons){
		if(buttons[b].clickLogic(mouse.rawX, mouse.rawY))
			return;
	}
	if(drawMenu){
		setMenuDraw(false);
	}

	if(gameLost){
		gameLostOverlayShown = true;
		currentlyAnimating = true;
		return; //no game input after losing
	}
	if(gameWon){
    //console.log("     controls.handle_lDown()::  gameWonOverlayShown="+gameWonOverlayShown);
    //if( gameWonOverlayShown) {

      newGame();
//    }
//    else {
//
//      //or while gameWon screen shows
//      gameWonOverlayShown = true;
//      currentlyAnimating = true;
//      return;
//    }
	}
	if(drawInstructions){
		drawInstructions = false;
		currentlyAnimating = true;
		return;
	}

	if(dragging)return;
	var c = board.getCell(mouse.x/cellSize,mouse.y/cellSize);
  //console.log("Lifting cell with  id="+c.id);


  // verify locks
	if(!c || !c.occupied || c.locked || c.cemented)return;
	blockIdOfLastBlockPlaced = c.id;
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
		var b = board.getCell(i,j);
		if(b.id === c.id && b.locked)return;
	}

	// set lock and selected flags for selected cells
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
		var b = board.getCell(i,j);
		if(b.occupied && b.id === c.id){
			b.locked = b.selected = true;
			selection.setCell(i,j,selectionOpacity);
		}
	}

	// move selected piece onto floating layer,remove from board
	floating = new grid(board.size);
	for(var i=0;i<floating.size;++i)for(var j=0;j<floating.size;++j)
		floating.setCell(i,j,new cell());
	transferId = c.id;
	copyPiece(board,floating,transferId,true);

	mouseDX = mouse.x;
	mouseDY = mouse.y;
	calcMouseGridVars();
	floatX = (downGX-mouseGX)*cellSize;
	floatY = (downGY-mouseGY)*cellSize;
	goalFloatX = floatX;
	goalFloatY = floatY;
	hover = rot = goalRot = 0;

	dragging = true;
	currentlyAnimating = true;
}

function handle_lUp(){
	//check for rmb press
	if(!evts.lUp) return;
	evts.lUp = false;

	polyMoved = false;
	if(!dragging || snapping)return;

	placeX = downGX-mouseGX;
	placeY = downGY-mouseGY;

	// create transfer grid
	transfer = new grid(board.size);
	for(var i=0;i<transfer.size;++i)for(var j=0;j<transfer.size;++j)
		transfer.setCell(i,j,new cell());

	// create rotated grid
	var fSize = floating.size;
	rotated = [];
	for(var i=-fSize;i<fSize*2;++i){
		rotated[i] = [];
		for(var j=-fSize;j<fSize*2;++j)rotated[i][j] = new cell();
	}rotated.setCell = function(x,y,c){
		x = Math.floor(x);
		y = Math.floor(y);
		if(x<-fSize||y<-fSize||x>=fSize*2||y>=fSize*2)return;
		rotated[x][y] = c;
	};rotated.getCell = function(x,y){
		x = Math.floor(x);
		y = Math.floor(y);
		if(x<-fSize||y<-fSize||x>=fSize*2||y>=fSize*2)return null;
		return rotated[x][y];
	};

	// rotate and place piece into rotated
	for(var i=0;i<fSize;++i)for(var j=0;j<fSize;++j){
		var r,f = floating.getCell(i,j);
		var x = i-downGX;
		var y = j-downGY;
		switch(goalRot%4){
			case 3:r = rotated.getCell( y+downGX,-x+downGY);break;
			case 2:r = rotated.getCell(-x+downGX,-y+downGY);break;
			case 1:r = rotated.getCell(-y+downGX, x+downGY);break;
			default:r = rotated.getCell(i,j);break;
		}
		r.quickSet(f.occupied,f.id,f.order);
	}

	// check if rotated is dropped on original position
	if(downGX == mouseGX && downGY == mouseGY && (goalRot%4 === 0)){cancelMove();return;}
	var moved = false;
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
		if(board.getCell(i,j).selected && !(rotated.getCell(i+placeX,j+placeY).occupied))
			moved = true;
	}if(!moved){
		copyPiece(floating,transfer,transferId);
		goalFloatX = placeX*cellSize;
		goalFloatY = placeY*cellSize;
		snapping = true;
		return;
	}

	// make sure pieces in rotated arent dropped on existing pieces or locked (and unselected) cells
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
		var b = board.getCell(i,j);
		var f = rotated.getCell(i+placeX,j+placeY);
		if((b.occupied || (b.locked && !b.selected)) && (f && f.occupied)){cancelMove();return;}
	}

	// make sure pieces in rotated aren't out of bounds in board
	for(var i=-fSize;i<fSize*2;++i)for(var j=-fSize;j<fSize*2;++j)
	if(rotated.getCell(i,j).occupied){
		var x = i-placeX,y = j-placeY;
		if(x<0||y<0||x>=board.size||y>=board.size){cancelMove();return;}
	}

	// successful move, place new poly -----------------------------

	// move rotated to transfer, unlock old selection, add new locks to board
	deselectGrid(board);
	for(var i=0;i<transfer.size;++i)for(var j=0;j<transfer.size;++j){
		var c = rotated.getCell(i+placeX,j+placeY);
		if(!c.occupied)continue;
		transfer.getCell(i,j).quickSet(true,c.id,c.order);
		var b = board.getCell(i,j);
		b.locked = b.selected = true;
	}

	goalFloatX = placeX*cellSize;
	goalFloatY = placeY*cellSize;
	snapping = true;
	polyMoved = true;
}

function handle_drag(){
	//if dragging, update goalx and goaly
	if(!dragging||snapping)return;
	goalFloatX = (downGX-mouseGX)*cellSize;
	goalFloatY = (downGY-mouseGY)*cellSize;
}

function handle_rDown(){
	//check for rmb press
	if(!evts.rDown) return;
	evts.rDown = false;
	if(drawMenu)setMenuDraw(false);
	if(!allowRotations)return;
	if(!dragging||snapping)return;
	++goalRot;
}

function getMouseFromEvent(evt){
	var rect = canvas.getBoundingClientRect();
	mouse.x = evt.clientX-rect.left-paneThickness-gridOffsetX;
	mouse.y = evt.clientY-rect.top-paneThickness-gridOffsetY;
	mouse.rawX = evt.clientX-rect.left;
	mouse.rawY = evt.clientY-rect.top;
}

function calcMouseGridVars(){
	downGX	= Math.floor(mouseDX/cellSize);
	downGY	= Math.floor(mouseDY/cellSize);
	mouseGX = Math.floor(mouse.x/cellSize);
	mouseGY = Math.floor(mouse.y/cellSize);
}

function cancelMove(){
	copyPiece(floating,transfer,transferId);
	goalFloatX = goalFloatY = 0;
	switch(goalRot%4){
		case 1:goalRot -= 1;break;
		case 2:goalRot -= 2;break;
		case 3:goalRot += 1;break;
	}snapping = true;
};

//'g' for "global"
var gTouches = [null, null];
function touchHandler(event){
	if(!modeTrophies)
		event.preventDefault(); //allow touch scrolling in trophy mode
	var first   = event.changedTouches[0];
	var id = 0;
	if(gTouches[0] === null || gTouches[0] === first.identifier){
		gTouches[0] = first.identifier;
		id = 0;
	}
	else if(gTouches[1] === null || gTouches[1] === first.identifier){
		gTouches[1] = first.identifier;
		id = 1;
	}
	else return;

	switch(event.type){
		case "touchstart" :
			if(id == 0) evts.lDown = true;
			else if(id == 1) evts.rDown = true;
			break;
		case "touchend"   :
			if(id == 0) evts.lUp = true;
			gTouches[id] = null;
			break;
	}

	if(first.identifier == 0){
		getMouseFromEvent(first);
	}
}

function setupControls(){
	canvas.addEventListener("touchstart" , touchHandler);
	canvas.addEventListener("touchmove"  , touchHandler);
	canvas.addEventListener("touchend"   , touchHandler);

	document.addEventListener('keydown',function(e){

    console.log("controls.keydown() charCode="+ e.charCode + ", keyCode="+ e.keyCode);

    //Stackoverflow says space keycode is not 32 on all systems and in all browsers and that some use the
    // usual enter key code (13).
    if((e.keyCode === KEYCODE_SPACE) ||  (e.keyCode === KEYCODE_ENTER))  {
      if(!dragging||snapping)return;
      ++goalRot;
    }

		else if(e.keyCode === KEYCODE_TAB){
			e.preventDefault();
			if(debugMode){
				debugMouseDown = false;
				currentlyAnimating = true;
				triggerDetectSquares = true;
				recalculateOrder();
				saveGame();
			}else{
				if(dragging && !snapping)cancelMove();
			}debugMode = !debugMode;
			currentlyAnimating = true;
		}
	},false);

	canvas.addEventListener("mousedown",function(e){
		if(e.which === 2)debugMouseDown = !debugMouseDown;
		if(debugMode){
			calcMouseGridVars();
			switch(e.which){
				case 1:
					debugMouseDown = true;
					debugNewId = newId();
					debugPlace = true;
					board.getCell(mouseGX,mouseGY).quickSet(true,debugNewId,1);
					currentlyAnimating = true;
					break;
				case 3:
					debugMouseDown = true;
					debugPlace = false;
					board.getCell(mouseGX,mouseGY).quickSet(false);
					currentlyAnimating = true;
					break;
			}return;
		}
		if(e.which === 1)
			evts.lDown = true;
		else if(e.which === 3)
			evts.rDown = true;
	});

	canvas.addEventListener("mousemove",function(e){
		getMouseFromEvent(e);

		if(debugMode){
			if(!debugMouseDown)return;
			calcMouseGridVars();
			if(debugPlace)board.getCell(mouseGX,mouseGY).quickSet(true,debugNewId,1);
			else board.getCell(mouseGX,mouseGY).quickSet(false);
			currentlyAnimating = true;
			return;
		}
	});

	canvas.addEventListener("mouseup",function(e){
		if(debugMode){
			if(!debugMouseDown)return;
			debugMouseDown = false;
			currentlyAnimating = true;
			triggerDetectSquares = true;
			recalculateOrder();
			saveGame();
			return;
		}


		if(!(e.which === 1))return;
		evts.lUp = true;
	});

	canvas.addEventListener("mouseout",function(){
		debugMouseDown = false;
		currentlyAnimating = true;
		recalculateOrder();
		saveGame();
	});

	// prevents right-click menu
	canvas.addEventListener("contextmenu",function(e){e.preventDefault();return false;});
}