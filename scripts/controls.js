function getMousePos(evt){
	var rect = canvas.getBoundingClientRect();
	return{x:evt.clientX-rect.left-paneThickness-gridOffsetX,y:evt.clientY-rect.top-paneThickness-gridOffsetY};
}

function getRawMousePos(evt){
	var rect = canvas.getBoundingClientRect();
	return{x:evt.clientX-rect.left,y:evt.clientY-rect.top};
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

function touchHandler(event){
	var touches = event.changedTouches;
	var first   = touches[0];
	var type    = "";

	switch(event.type){
		case "touchstart" : type = "mousedown";  console.log(event); break;
		case "touchmove"  : type = "mousemove"; break;
		case "touchend"   : type = "mouseup";   break;
		default:return;
	}
	var button = 0;
	if(first.identifier >= 1)
		button = 2;
	var simulatedEvent = document.createEvent("MouseEvent");
	simulatedEvent.initMouseEvent(type,true,true,window,1,
	                              first.screenX,first.screenY,
	                              first.clientX,first.clientY,false,
	                              false,false,false,button,null);
	first.target.dispatchEvent(simulatedEvent);
	event.preventDefault();
}

function setupControls(){
	canvas.addEventListener("touchstart" , touchHandler);
	canvas.addEventListener("touchmove"  , touchHandler);
	canvas.addEventListener("touchend"   , touchHandler);

	document.addEventListener('keydown',function(e){
		if(e.keyCode === 9){
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
		mouse = getMousePos(e);
		rawMouse = getRawMousePos(e);
		document.getElementById("foo").innerHTML = e.which;
		if(drawMenu){
			drawMenu = false;
			currentlyAnimating = true;
		}
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

		switch(e.which){
			case 1:
				//check buttons
				for(var b in buttons){
					if(buttons[b].clickLogic(rawMouse.x, rawMouse.y))
						return;
				}

				if(gameLost){
					gameLostOverlayShown = true;
					currentlyAnimating = true;
					return; //no game input after losing
				}
				if(gameWon && !gameWonOverlayShown){
					//or while gameWon screen shows
					gameWonOverlayShown = true;
					currentlyAnimating = true;
					return;
				}
				if(drawInstructions){
					drawInstructions = false;
					currentlyAnimating = true;
					return;
				}

				if(dragging)return;
				var c = board.getCell(mouse.x/cellSize,mouse.y/cellSize);
        if (c) blockIdOfLastBlockPlaced = c.id;


        // verify locks
				if(!c || !c.occupied || c.locked)return;
				for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
					var b = board.getCell(i,j);
					if(b.id === c.id && b.locked)return;
				}

				// set lock and selected flags for selected cells
				for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
					var b = board.getCell(i,j);
					if(b.occupied && b.id === c.id)b.locked = b.selected = true;
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
				return;
			case 3:
				if(!allowRotations)return;
				if(!dragging)return;
				++goalRot;
				return;
		}
	});

	canvas.addEventListener("mousemove",function(e){
		mouse = getMousePos(e);

		if(debugMode){
			if(!debugMouseDown)return;
			calcMouseGridVars();
			if(debugPlace)board.getCell(mouseGX,mouseGY).quickSet(true,debugNewId,1);
			else board.getCell(mouseGX,mouseGY).quickSet(false);
			currentlyAnimating = true;
			return;
		}

		if(!dragging||snapping)return;
		calcMouseGridVars();
		goalFloatX = (downGX-mouseGX)*cellSize;
		goalFloatY = (downGY-mouseGY)*cellSize;
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

		polyMoved = false;
		mouse = getMousePos(e);
		if(!(e.which === 1))return;
		if(!dragging || snapping)return;

		calcMouseGridVars();
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
