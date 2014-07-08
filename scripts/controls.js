function getMousePos(evt){
	var rect = canvas.getBoundingClientRect();
	return{x:evt.clientX-rect.left-paneThickness,y:evt.clientY-rect.top-paneThickness};
}

function calcMouseGridVars(){
	downGX	= Math.floor(mouseDX/cellSize);
	downGY	= Math.floor(mouseDY/cellSize);
	mouseGX = Math.floor(mouse.x/cellSize);
	mouseGY = Math.floor(mouse.y/cellSize);
}

var cancelMove = function(){
  unfloatPiece(false);
  placeX = placeY = 0;
	goalFloatX = goalFloatY = 0;
};

function touchHandler(event){
	var touches = event.changedTouches;
	var first   = touches[0];
	var type    = "";

	switch(event.type){
		case "touchstart" : type = "mousedown"; break;
		case "touchmove"  : type = "mousemove"; break;
		case "touchend"   : type = "mouseup";   break;
		default:return;
	}

	var simulatedEvent = document.createEvent("MouseEvent");
	simulatedEvent.initMouseEvent(type, true, true, window, 1,
	                              first.screenX, first.screenY,
	                              first.clientX, first.clientY, false,
	                              false, false, false, 0/*left*/, null);
	first.target.dispatchEvent(simulatedEvent);
	event.preventDefault();
}

function setupControls() {
  canvas.addEventListener("touchstart", touchHandler);
  canvas.addEventListener("touchmove", touchHandler);
  canvas.addEventListener("touchend", touchHandler);

  canvas.addEventListener("mousedown", function (event) {

    //console.log("mousedown:  dragging="+dragging+", snapping="+snapping);

    mouse = getMousePos(event);
    if (dragging)return;


    var c = boardMain.getCell(mouse.x / cellSize, mouse.y / cellSize);
    if (!c.occupied || c.locked) return;

    floatPiece(c.id);

    mouseDX = mouse.x;
    mouseDY = mouse.y;
    calcMouseGridVars();
    floatX = (downGX - mouseGX) * cellSize;
    floatY = (downGY - mouseGY) * cellSize;
    goalFloatX = floatX + hoverOffset;
    goalFloatY = floatY + hoverOffset;

    dragging = true;
    currentlyAnimating = true;
  });

  canvas.addEventListener("mousemove", function (e) {
    mouse = getMousePos(e);
    if (!dragging || snapping)return;
    calcMouseGridVars();
    goalFloatX = (downGX - mouseGX) * cellSize + hoverOffset;
    goalFloatY = (downGY - mouseGY) * cellSize + hoverOffset;
  });


  // I found that this was more annoying than helpful, honestly.
  //  I (Joel) know that the above I is not Joel. That leaves Ezra or Luke.
  //   Next time, attach a recording of your voice to the comment. Then I will know who I am and have
  //   reached Nirvana.
  //
  // canvas.addEventListener("mouseout",function(e){
  // 	if(!dragging||snapping)return;
  // 	cancelMove();
  // });

  canvas.addEventListener('contextmenu', function (event) {
    if (!dragging)return;

    //TODO: for now, I have rightclick rotate the floating block - while this rotate interface is used,
    //   we want to stop the browser from also displaying its rightclick menu.
    event.preventDefault();

    if (!userRotateBlock90()) cancelMove();

    return false;
  }, false);


  canvas.addEventListener("mouseup", function (event) {
    mouse = getMousePos(event);

    if (!dragging || snapping)return;

    if (event.button === MOUSE_RIGHT_BUTTON) return;
    dragging = false;

    calcMouseGridVars();
    placeX = downGX - mouseGX;
    placeY = downGY - mouseGY;

    // check if floating is dropped on original position
    // This is not true with rotation:
    //if(downGX == mouseGX && downGY == mouseGY){cancelMove();return;}
    if (!isMoveValid()) { //console.log("mouseup:  isMoveValid() == false");
      cancelMove();
      return;
    }

    // make sure pieces in floating arent dropped on existing pieces or locked (and unselected) cells
//		for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
//			var b = board.getCell(i,j);
//			var f = floating.getCell(i+placeX,j+placeY);
//			if((b.occupied || (b.locked && !b.selected)) && (f && f.occupied)){cancelMove();return;}
//		}
//
//		// make sure pieces in floating aren't out of bounds in board
//		for(var i=0;i<floating.size;++i)for(var j=0;j<floating.size;++j)
//		if(floating.getCell(i,j).occupied){
//			var x = i-placeX,y = j-placeY;
//			if(x<0||y<0||x>=floating.size||y>=floating.size){cancelMove();return;}
//		}

    // successful move, place new poly -----------------------------
    unfloatPiece(true)
    goalFloatX = (downGX - mouseGX) * cellSize;
    goalFloatY = (downGY - mouseGY) * cellSize;
    placeNewPoly();
  });
}

function userRotateBlock90() {

  //console.log("controls.userRotateBlock90()");


  //Searching a mostly empty copy of the board for cells of a block seems to Joel like a CS152
  //   approch (or a left-over from Luke's epic two day prototype).
  var maxX = 0;
  var maxY = 0;
  var minX = MAX_POLYOMINO_ORDER;
  var minY = MAX_POLYOMINO_ORDER;

  var anyCellOfFloatingBlock;
  for (var x = 0; x < gridSize; x++)    for (var y = 0; y < gridSize; y++) {
    var cell = boardFloating.getCell(x, y);
    if (!cell || !cell.occupied) continue;

    anyCellOfFloatingBlock = cell;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  var order = anyCellOfFloatingBlock.order;
  var id = anyCellOfFloatingBlock.id;
  var rotationGrid = matrix(order, order, false);

  //console.log("   ==> order="+order+", id="+id+ ", range=("+minX+", "+minY+") - ("+maxX+", "+maxY+")");

  for (var x = 0; x < gridSize; x++)    for (var y = 0; y < gridSize; y++) {
    var floatingCell = boardFloating.getCell(x, y);
    if (!floatingCell.occupied) continue;

    rotationGrid[x - minX][y - minY] = true;
    floatingCell.occupied = false;
  }

  rotationGrid = gridRotate90(rotationGrid, order);

  for (var x = 0; x < order; x++)    for (var y = 0; y < order; y++) {
    if (rotationGrid[x][y]) {
      rotationGrid[x][y] = true;
      var xx = x + minX;
      var yy = y + minY;
      if (xx < 0) return false;
      if (yy < 0) return false;
      if (xx >= gridSize) return false;
      if (yy >= gridSize) return false;
      boardFloating.getCell(xx, yy).quickSet(true, id, order);
    }
  }
  return true;
}



