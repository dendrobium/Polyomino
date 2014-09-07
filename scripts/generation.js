/***********************************************************************************************
   _______  _______  _        _______  _______  _______ __________________ _______  _
  (  ____ \(  ____ \( (    /|(  ____ \(  ____ )(  ___  )\__   __/\__   __/(  ___  )( (    /|
  | (    \/| (    \/|  \  ( || (    \/| (    )|| (   ) |   ) (      ) (   | (   ) ||  \  ( |
  | |      | (__    |   \ | || (__    | (____)|| (___) |   | |      | |   | |   | ||   \ | |
  | | ____ |  __)   | (\ \) ||  __)   |     __)|  ___  |   | |      | |   | |   | || (\ \) |
  | | \_  )| (      | | \   || (      | (\ (   | (   ) |   | |      | |   | |   | || | \   |
  | (___) || (____/\| )  \  || (____/\| ) \ \__| )   ( |   | |   ___) (___| (___) || )  \  |
  (_______)(_______/|/    )_)(_______/|/   \__/|/     \|   )_(   \_______/(_______)|/    )_)
**************************************************************************************************/

var CELL_EMPTY = -1;
var CELL_VISITED = -2;
var CELL_NONEXISTANT_ID = -3;

//=======================================================================================
function placeStartingPolys() {
//=======================================================================================
  //console.log("placeStartingPolys()");
  //var orderList;
  var delay = 0;

//  var catagory = Math.random();
//  if (catagory < .25) {
//    //Spawn 2 cemented Tetrominos and 3 cemented Trominos
//    var x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, bounds;
//    if (Math.random() < 0.5) {
//      x1 = rInt(3);
//      x2 = (gridSize - 3) + rInt(3);
//      y1 = rInt(gridSize);
//      y2 = rInt(gridSize);
//
//      bounds = spawnBlock(4, true, ++delay, x1, y1);
//      //console.log("    spawned order 4: bounds= (" + bounds.minX + ", " + bounds.minY + ") - (" + bounds.maxX + ", " + bounds.maxY + ")");
//
//      if (bounds.minY < gridSize / 2) y3 = bounds.maxY + 1; else y3 = bounds.minY - 1;
//      x3 = rInt(3);
//
//      bounds = spawnBlock(4, true, ++delay, x2, y2);
//      //console.log("    spawned order 4: bounds= (" + bounds.minX + ", " + bounds.minY + ") - (" + bounds.maxX + ", " + bounds.maxY + ")");
//
//      if (bounds.minY < gridSize / 2) y4 = bounds.maxY + 1; else y4 = bounds.minY - 1;
//      x4 = (gridSize - 3) + rInt(3);
//    }
//    else {
//      y1 = rInt(3);
//      y2 = (gridSize - 3) + rInt(3);
//      x1 = rInt(gridSize);
//      x2 = rInt(gridSize);
//
//      bounds = spawnBlock(4, true, ++delay, x1, y1);
//      // console.log("    spawned order 4: bounds= (" + bounds.minX + ", " + bounds.minY + ") - (" + bounds.maxX + ", " + bounds.maxY + ")");
//
//
//      if (bounds.minX < gridSize / 2) x3 = bounds.maxX + 1;
//      else                            x3 = bounds.minX - 1;
//      y3 = rInt(3);
//
//      bounds = spawnBlock(4, true, ++delay, x2, y2);
//      //console.log("    spawned order 4: bounds= (" + bounds.minX + ", " + bounds.minY + ") - (" + bounds.maxX + ", " + bounds.maxY + ")");
//
//      if (bounds.minX < gridSize / 2) x4 = bounds.maxX + 1;
//      else                            x4 = bounds.minX - 1;
//      y4 = (gridSize - 3) + rInt(3);
//    }
//
//    bounds = spawnBlock(4, true, ++delay, 5, 5);
//    if (bounds.minX < gridSize / 2) x5 = bounds.maxX + 1;
//    else                            x5 = bounds.minX - 1;
//    y5 = 5 + rInt(3);
//
//    spawnBlock(3, true, ++delay, x3, y3);
//    spawnBlock(3, true, ++delay, x4, y4);
//    spawnBlock(3, true, ++delay, x5, y5);
//  }
//
//
//  else if (catagory < 0.5) {
//    //Spawn 5 cemented Tetrominos
//
//    spawnBlock(4, true, ++delay, rInt(3), rInt(3));
//    spawnBlock(4, true, ++delay, (gridSize - 3) + rInt(3), rInt(3));
//    spawnBlock(4, true, ++delay, rInt(3), (gridSize - 3) + rInt(3));
//    spawnBlock(4, true, ++delay, (gridSize - 3) + rInt(3), (gridSize - 3) + rInt(3));
//    spawnBlock(4, true, ++delay, 5 + rInt(2), 5 + rInt(2));
//  }
//
//  else if (catagory < .75) {
//    //Spawn 10 cemented Trominos
//
//    var x = 0;
//    var y = rInt(gridSize);
//
//    for (var i = 0; i < 10; i++) {
//
//      var bounds = spawnBlock(3, true, ++delay, x, y);
//      if (bounds === false) {
//        bounds = spawnBlock(3, true, ++delay);
//      }
//      x = bounds.maxX + 1;
//      if (x > 9) {
//        bounds = spawnBlock(3, true, ++delay);
//      }
//
//      var goingUp = true;
//      if (Math.random() < 0.5) goingUp = false;
//
//      if (bounds.minY - 1 < 0) goingUp = false;
//      else if (bounds.maxY + 1 > 10) goingUp = true;
//      y = bounds.maxY + 1;
//      if (goingUp) y = bounds.minY - 1;
//    }
//  }
//
//  else if (catagory < .9) {
//    //Spawn 1 cemented Pentomino + 2 random tris or teras
//    spawnBlock(5, true, ++delay, 5, 5);
//
//    var x1, y1, x2, y2;
//    if (Math.random() < 0.5) {
//      x1 = 0;
//      x2 = (gridSize - 1);
//      y1 = rInt(gridSize);
//      y2 = rInt(gridSize);
//    }
//    else {
//      y1 = 0;
//      y2 = (gridSize - 1);
//      x1 = rInt(gridSize);
//      x2 = rInt(gridSize);
//    }
//    var catagory2 = Math.random();
//    if (catagory2 < .33) {
//      spawnBlock(3, true, ++delay, x1, y1);
//      spawnBlock(3, true, ++delay, x2, y2);
//    }
//    else if (catagory2 < .66) {
//      spawnBlock(4, true, ++delay, x1, y1);
//      spawnBlock(3, true, ++delay, x2, y2);
//    }
//    else {
//      spawnBlock(4, true, ++delay, x1, y1);
//      spawnBlock(4, true, ++delay, x2, y2);
//    }
//  }
//  else {
//    //Spawn 2 cemented Pentomino
//    var x1, y1, x2, y2;
//    if (Math.random() < 0.5) {
//      x1 = 0;
//      x2 = (gridSize - 1);
//      y1 = rInt(gridSize);
//      y2 = rInt(gridSize);
//    }
//    else {
//      y1 = 0;
//      y2 = (gridSize - 1);
//      x1 = rInt(gridSize);
//      x2 = rInt(gridSize);
//    }
//
//    spawnBlock(5, true, ++delay, x1, y1);
//    spawnBlock(5, true, ++delay, x2, y2);
//  }
//
//
//

  spawnBlock(1, false, delay, 4,4);
  spawnBlock(1, false, delay, 5,4);
  spawnBlock(1, false, delay, 6,4);

  spawnBlock(1, false, delay, 4,5);
  spawnBlock(1, false, delay, 6,5);

  spawnBlock(1, false, delay, 4,6);
  spawnBlock(1, false, delay, 5,6);
  spawnBlock(1, false, delay, 6,6);


  for (var i=0; i<6; i++) {
    if (Math.random() < .5) spawnBlock(2, false, ++delay);
    else spawnBlock(1, false, ++delay);
  }
  currentlyAnimating = true;
}




//=============For 10x10 ===========================================================
//function placeStartingPolys() {
//=======================================================================================
//
//  var orderList;
//  var delay = 0;
//
//  if (Math.random() < 0.25) {
//    //Spawn 2 cemented Tetrominos and 2 cemented Trominos
//    var x1, y1, x2, y2, x3, y3, x4, y4;
//    if (Math.random() < 0.5) {
//      x1 = rInt(3);
//      x2 = (gridSize - 3) + rInt(3);
//      y1 = rInt(gridSize);
//      y2 = rInt(gridSize);
//
//      var bounds = spawnBlock(4, true, ++delay, x1, y1);
//      //console.log("    spawned order 4: bounds= (" + bounds.minX + ", " + bounds.minY + ") - (" + bounds.maxX + ", " + bounds.maxY + ")");
//
//      if (bounds.minY < gridSize / 2) y3 = bounds.maxY + 1; else y3 = bounds.minY - 1;
//      x3 = rInt(3);
//
//      bounds = spawnBlock(4, true, ++delay, x2, y2);
//      //console.log("    spawned order 4: bounds= (" + bounds.minX + ", " + bounds.minY + ") - (" + bounds.maxX + ", " + bounds.maxY + ")");
//
//      if (bounds.minY < gridSize / 2) y4 = bounds.maxY + 1; else y4 = bounds.minY - 1;
//      x4 = (gridSize - 3) + rInt(3);
//    }
//    else {
//      y1 = rInt(3);
//      y2 = (gridSize - 3) + rInt(3);
//      x1 = rInt(gridSize);
//      x2 = rInt(gridSize);
//
//      var bounds = spawnBlock(4, true, ++delay, x1, y1);
//      // console.log("    spawned order 4: bounds= (" + bounds.minX + ", " + bounds.minY + ") - (" + bounds.maxX + ", " + bounds.maxY + ")");
//
//
//      if (bounds.minX < gridSize / 2) x3 = bounds.maxX + 1;
//      else                          x3 = bounds.minX - 1;
//      y3 = rInt(3);
//
//      bounds = spawnBlock(4, true, ++delay, x2, y2);
//      //console.log("    spawned order 4: bounds= (" + bounds.minX + ", " + bounds.minY + ") - (" + bounds.maxX + ", " + bounds.maxY + ")");
//
//      if (bounds.minX < gridSize / 2) x4 = bounds.maxX + 1;
//      else                          x4 = bounds.minX - 1;
//      y4 = (gridSize - 3) + rInt(3);
//    }
//
//    spawnBlock(3, true, ++delay, x3, y3);
//    spawnBlock(3, true, ++delay, x4, y4);
//  }
//
//
//  else if (Math.random() < 0.5) {
//    //Spawn 4 cemented Tetrominos
//
//    spawnBlock(4, true, ++delay, rInt(3), rInt(3));
//    spawnBlock(4, true, ++delay, (gridSize - 3) + rInt(3), rInt(3));
//    spawnBlock(4, true, ++delay, rInt(3), (gridSize - 3) + rInt(3));
//    spawnBlock(4, true, ++delay, (gridSize - 3) + rInt(3), (gridSize - 3) + rInt(3));
//  }
//
//  else if (Math.random() < .75) {
//    //Spawn 8 cemented Trominos
//
//    var x = 0;
//    var y = rInt(gridSize);
//
//    for (var i=0; i<8; i++) {
//
//      var bounds = spawnBlock(3, true, ++delay, x, y);
//      if (bounds === false) {
//        bounds = spawnBlock(3, true, ++delay);
//      }
//      x = bounds.maxX + 1;
//      if (x > 9) {
//        bounds = spawnBlock(3, true, ++delay);
//      }
//
//      var goingUp = true;
//      if (Math.random() < 0.5) goingUp = false;
//
//      if (bounds.minY - 1 < 0) goingUp = false;
//      else if (bounds.maxY + 1 > 9) goingUp = true;
//      y = bounds.maxY + 1;
//      if (goingUp) y = bounds.minY - 1;
//    }
//  }
//
//  else {
//    //Spawn 1 cemented Pentomino
//    spawnBlock(5, true, ++delay, gridSize / 2, gridSize / 2);
//  }
//
//
//  for (var i=0; i<12; i++) {
//    if (Math.random() < .3) spawnBlock(2, false, ++delay);
//    else if (Math.random() < .5) spawnBlock(1, false, ++delay);
//  }
//  currentlyAnimating = true;
//}




//=======================================================================================
function spawnMonoOrDomino() {
//=======================================================================================
  var order = 1 + Math.floor(Math.abs(rInt(gameMaxShapeLevel) - rInt(gameMaxShapeLevel)));
  if ((order === 1) && (Math.random() < .5)) order = 2;

  if (order > gameMaxShapeLevel) order = gameMaxShapeLevel; //This should never be true.

  var spawnGrid = matrix(gridSize, gridSize, CELL_EMPTY);
  var filledCount = copyBoardToMatrix(spawnGrid, 0, 0, gridSize);
  var emptyCount = gridSize*gridSize - filledCount;
  if (emptyCount < 10) {
    if (Math.random() < .5) order = 1; else order = 2;
  }
  while (order*order > emptyCount) {
    order--;
    if (order < 2) {
      order = 1;
      break;
    }
  }

  var done = false;
  while (!done)
  { done = spawnBlock(order, false, 0);
    order--;
    if (order < 1) return;
  }
  currentlyAnimating = true;
  triggerDetectSquares = true;
  saveGame();
}






//=======================================================================================
function spawnBlock(order, cement, delay, x0, y0) {
//=======================================================================================
  //This function is called when:
  //  1) spawning starting polys.
  //  2) spawning mono or dominos when a block is moved.

  var id = newId();
  //console.log("spawnBlock(order="+order+", cement="+cement+", x0="+x0+", y0="+y0+"): id="+id);


  var spawnGrid = matrix(gridSize, gridSize, CELL_EMPTY);
  copyBoardToMatrix(spawnGrid, 0, 0, gridSize);

//  //If (x0,y0) is undefined, then try to find a large empty area for spawning
//  if (x0 == undefined) {
//    var startCell = tryToFindGoodRandomSpawnPoint(spawnGrid, order);
//    x0 = startCell.x;
//    y0 = startCell.y;
//    //x0 = rInt(spawnGrid.length);
//    //y0 = rInt(spawnGrid.length);
//  }


  var cellsNeeded = order;
  var minX=99, maxX=0, minY=99, maxY=0;


  if (x0 != undefined) {
    //for robustness.....
    if ((x0 >=0) && (y0 >= 0) && (x0 < gridSize) && (y0 < gridSize)) {
      if (spawnGrid[x0][y0] === CELL_EMPTY) {

        spawnGrid[x0][y0] = id;
        cellsNeeded = order - 1;
        minX = x0, maxX = x0, minY = y0, maxY = y0;
      }
    }
  }



  for (var i = 0; i < cellsNeeded; i++) {
    var cellAdded = appendRandomCellToPoly(spawnGrid, id, order);

    if (cellAdded === undefined) return false;

    if (cellAdded.x < minX) minX = cellAdded.x;
    if (cellAdded.y < minY) minY = cellAdded.y;
    if (cellAdded.x > maxX) maxX = cellAdded.x;
    if (cellAdded.y > maxY) maxY = cellAdded.y;
  }

  if (doesPolyHaveHoles(spawnGrid, order, id)) return false;


  //Animate random first block in direction of a block attached to it.
  var dir = rInt(DIRECTION.length);
  var start = matrixGetRandomCoordinateWithGivenValue(spawnGrid, id);
  var next = getCoordinateOfCellInRandomDirectionWithGivenValue(spawnGrid, start.x,start.y, id);

  //console.log("    start= ("+start.x+", "+start.y+"),  next=("+next.x+", "+next.y+"), next.dir="+next.dir);

  if (next != undefined) dir =  next.dir;
  if (delay === undefined) delay = 0;
  delay *= 100;
  animateBlockAggregationInBreathFirstOrder(start.x,start.y, dir, spawnGrid, order, 0, id, cement, delay);
  return { id:id, minX:minX, minY:minY, maxX:maxX, maxY:maxY};
}


//=======================================================================================
function tryToFindGoodRandomSpawnPoint(spawnGrid, order) {
//=======================================================================================

  console.log("tryToFindGoodRandomSpawnPoint("+order+") ENTER");
  var spawnGrid = matrix(gridSize, gridSize, CELL_EMPTY);
  var filledCount = copyBoardToMatrix(spawnGrid, 0, 0, gridSize);
  var emptyCount = gridSize * gridSize - filledCount;


  var personalSpace = order;
  var maxTrys = 10, tryCount = 0;
  var x0, y0;
  while (personalSpace >= 0) {

    var visitedCount = 0;
    var emptyCount = 0;

    for (var x = 0; x < spawnGrid.length; x++) {
      for (var y = 0; y < spawnGrid.length; y++) {
        if (spawnGrid[x][y] === CELL_VISITED) spawnGrid[x][y] = CELL_EMPTY;
        if (spawnGrid[x][y] === CELL_EMPTY) {
          emptyCount++;
          x0 = x;
          y0 = y;
        }
      }
    }

    console.log("   ...x0="+x0+", y0="+y0+", emptyCount="+emptyCount);

    if (emptyCount < 2) return {x: x0, y: y0};

    if (maxTrys > emptyCount) maxTrys = emptyCount;

    while (tryCount < maxTrys) {

      var x = rInt(spawnGrid.length);
      var y = rInt(spawnGrid.length);

      if (spawnGrid[x][y] === CELL_EMPTY) {
        spawnGrid[x][y] = CELL_VISITED;
        x0 = x;
        y0 = y;
        tryCount++;
        console.log("   ...trying ("+x+", "+y+") with personalSpace="+ personalSpace);
        if (hasPersonalSpace(spawnGrid, x, y, personalSpace)) return {x: x0, y: y0};
      }
    }

    personalSpace--;
  }
  return {x: x0, y: y0};
}




//=======================================================================================
function hasPersonalSpace(spawnGrid, x, y, personalSpace) {
//=======================================================================================

  if (personalSpace === 0) return true;
  var x1 = Math.max(x-personalSpace, 0);
  var x2 = Math.min(x+personalSpace, gridSize-1);
  var y1 = Math.max(y-personalSpace, 0);
  var y2 = Math.min(x+personalSpace, gridSize-1);

  for (var xx = x1; xx <= x2; xx++) {
    for (var yy = y1; yy <= y2; yy++) {

      if ((spawnGrid[xx][yy] != CELL_EMPTY) && (spawnGrid[xx][yy] != CELL_VISITED)) {
        console.log("     ...Found neighbor in space["+personalSpace+"] ("+xx+", "+yy+")");
        return false;
      }
    }
  }
  return true;
}




//=======================================================================================
function squareToPoly(left,top,order) {
//=======================================================================================
	if(blockIdOfLastBlockPlaced === undefined) blockIdOfLastBlockPlaced = CELL_NONEXISTANT_ID;
	var spawnGrid = matrix(order,order,CELL_EMPTY);
	var parentOrder = board.getCell(left,top).order;

	// generate new poly
	var childId = newId();
	while(true){
		var filledCellCount = copyBoardToMatrix(spawnGrid,left,top,order,blockIdOfLastBlockPlaced,childId);
		var cellsNeeded = order-filledCellCount;
		for(var i=0;i<cellsNeeded;++i)appendRandomCellToPoly(spawnGrid,childId,order);
		if(!doesPolyHaveHoles(spawnGrid,order,childId))break;
	}

	// init animation events
	var dirGrid = new grid(order);
	var depthGrid = new grid(order);
	var maxDepth = 0;
	var count = order;
	for(var x=0;x<order;++x)for(var y=0;y<order;++y){
		if(spawnGrid[x][y] === childId)depthGrid.setCell(x,y,0);
	}

	// calculate animation events
	while(count < order*order){
		var x = rInt(order);
		var y = rInt(order);
		if(depthGrid.getCell(x,y) === null){
			var dirChk = shuffle([NORTH,SOUTH,EAST,WEST]),depth;
			for(var i in dirChk)if((depth=depthGrid.getCell(x+DIRECTION[dirChk[i]].deltaX,y+DIRECTION[dirChk[i]].deltaY))!==null){
				++depth;
				dirGrid.setCell(x,y,dirChk[i]);
				depthGrid.setCell(x,y,depth);
				if(depth > maxDepth)maxDepth = depth;
				++count;
				break;
			}
		}
	}

	// create animation events
	var boxInKF0 = 0;
	var boxInKF1 = 200;
	var boxInKF2 = boxInKF1 + 200;
	var endKF = boxInKF2+keyframe(maxDepth+1);
	boxInEvt(      left,top,order,boxInKF0,boxInKF1,polyColor[order].secondary);
	boxSustainEvt( left,top,order,boxInKF1,boxInKF2,polyColor[order].secondary);
	boxInEvt(      left,top,order,boxInKF1,boxInKF2,polyColor[order].primary);


	for(var x=0;x<order;++x)for(var y=0;y<order;++y){
		var depth = depthGrid.getCell(x,y);
		highlightEvt(x+left,y+top,boxInKF2,boxInKF2+keyframe(maxDepth-depth),polyColor[order].primary);
		if(depth !== 0){
			slideOutEvt[dirGrid.getCell(x,y)](x+left,y+top,boxInKF2+keyframe(maxDepth-depth),
			                                               boxInKF2+keyframe(maxDepth-depth+1),polyColor[order].primary);
		}else{
			fadeOutEvt(x+left,y+top,boxInKF2+keyframe(maxDepth),endKF,polyColor[order].primary);
		}

		var boardCell = board.getCell(x+left,y+top);
		if(spawnGrid[x][y] === childId)quickSetEvt(board.getCell(x+left,y+top),true,childId,order,boxInKF2);
		else quickSetEvt(board.getCell(x+left,y+top),false,null,null,boxInKF2);
		uncementEvt(boardCell,boxInKF2);
		unlockEvt(boardCell,endKF);
	}

	bottomSurroundIn( left,top,order,0  ,100);
	sideSurroundIn(   left,top,order,100,300);
	topSurroundIn(    left,top,order,300,400);

	bottomSurroundSustain( left,top,order,100,endKF-400);
	sideSurroundSustain(   left,top,order,300,endKF-300);
	topSurroundSustain(    left,top,order,400,endKF-100);

	bottomSurroundOut( left,top,order,endKF-400,endKF-300);
	sideSurroundOut(   left,top,order,endKF-300,endKF-100);
	topSurroundOut(    left,top,order,endKF-100,endKF-0);

	// calculate score, handle combos, check win condition, update stats
	comboActiveEvt(endKF);
	if(comboActiveCtr === 1)comboCtr = 1;
	else comboCtr++;
	var points = addToScore(order,parentOrder,comboCtr);
	if(order >= goalOrder && !gameWon)gameWonEvt(endKF);
	identifyShape(spawnGrid,order,childId);
	savePolyominoStats(order,null); // TODO: need to tell it the shape later on... or make a new function for that
	saveGameEvt(endKF);
}





//=======================================================================================
function appendRandomCellToPoly(spawnGrid, id, order) {
//=======================================================================================

  var visitedCount = 0;
  var totalEmptyCells = 0;
  var numCellsInPoly = 0;

  for (var x = 0; x < spawnGrid.length; x++) {
    for (var y = 0; y < spawnGrid.length; y++) {

      if (spawnGrid[x][y] === CELL_VISITED) spawnGrid[x][y] = CELL_EMPTY;
      if (spawnGrid[x][y] === CELL_EMPTY) totalEmptyCells++;
      else if (spawnGrid[x][y] === id) numCellsInPoly++;
    }
  }

  var skipWhen2NeighborsProbability = 0;
  if (order === 4) skipWhen2NeighborsProbability = 0.1;
  else if (order >= 5) skipWhen2NeighborsProbability = 0.5;

  while (visitedCount < totalEmptyCells) {
    var x = rInt(spawnGrid.length);
    var y = rInt(spawnGrid.length);

    var skipForMoreEvenShapeDistribution = false;
    if (spawnGrid[x][y] === CELL_EMPTY) {

      //If (numCellsInPoly === 0), then this is the first cell of the poly
      //   so okay to spawn in any empty cell. Otherwise, only spawn if cell
      //   is connected to a cell of the correct id.
      if (numCellsInPoly === 0) {
        spawnGrid[x][y] = id;
        return {x:x,y:y};
      }

      var neighborCount = countNeighbor4WithID(spawnGrid, x, y, id);

      if (neighborCount > 0) {
        if ((neighborCount === 2) && (Math.random() < skipWhen2NeighborsProbability)) skipForMoreEvenShapeDistribution = true;
        //else if ((neighborCount === 3) && (Math.random() < 0.5)) skipForMoreEvenShapeDistribution = true;
        else {
          spawnGrid[x][y] = id;
          return {x: x, y: y};
        }
      }

      if (!skipForMoreEvenShapeDistribution) {
        spawnGrid[x][y] = CELL_VISITED;
        visitedCount++;
      }
    }
  }
  return undefined;
}



//LUKE: Update starting polys and mono/domino animation here.
//=======================================================================================
function animateBlockAggregationInBreathFirstOrder(x, y, entryDirection, spawnGrid, order, depth, id, cement, delay) {
//=======================================================================================
  //Breath first Recersive walk through each cell of block to set animation timings at
  //  recersion level. Recersivaly walk each cell.

  //Note: since each recersive call needs its own x, y and entryDirection, these values cannot be
  //   passed in as a sthructure (which is passed by reference).

  //console.log("amimateBlockAggregationInBreathFirstOrder(x="+x +
  //  ", y=" + y + ", dir="+ entryDirection + ", order=" + order + ", depth=" + depth + ", id=" + id);


  //mark this cell as no longer needing to be visited.
  spawnGrid[x][y] = CELL_VISITED;

  var myCell = board.getCell(x, y);
  myCell.locked = true;
  if (cement) {
    //console.log("cemented[" + x + "][" + y + "] id=" + myCell.id);
    myCell.cemented = true;
  }

  var color = polyColor[order];
  slideInEvt[entryDirection](x, y, delay+keyframe(depth),delay+keyframe(depth+1),color.secondary);
  highlightEvt(x, y, delay+keyframe(depth+1), delay+keyframe(order+order),color.secondary);
  slideInEvt[entryDirection](x, y, delay+keyframe(depth+order),delay+keyframe(depth+order+1),color.primary);
  highlightEvt(x, y, delay+keyframe(depth+order+1), delay+keyframe(order+order),color.primary);
  quickSetEvt(myCell, true, id, order, delay+keyframe(order+order));
  fadeOutEvt(x, y, delay+keyframe(order+order), delay+keyframe(order+order+2),color.primary);
  unlockEvt(myCell, delay+keyframe(order+order+2));

  while(true) {
    var coordinate = getCoordinateOfCellInRandomDirectionWithGivenValue(spawnGrid, x, y, id);

    //If there is no place left to go, then back out of recursion.
    if (coordinate === undefined) return;

    animateBlockAggregationInBreathFirstOrder(
      coordinate.x, coordinate.y, coordinate.dir, spawnGrid, order, depth + 1, id,  cement, delay);

  }
}


//=======================================================================================
function getCoordinateOfCellInRandomDirectionWithGivenValue(myGrid, x, y, value) {
//=======================================================================================
  //Return the coordinates of a cell in a random direction from (x,y) of booleanGrid that
  //   has a grid value equal to the given state (either true or false).
  //
  //Also return the direction (0=NORTH, 1=EAST, ...) of movement.
  //
  //Return null if no direction as a cell with value === state.
  //
  //Starting with a random direction, try all 4 directions in clockwise order.
  //Note: since only one direction is returned per call and since each call starts
  //      with a random direction, the clockwise order adds no bias.
  //
  //This function assumes:
  //   1) booleanGrid is a square, 2D matrix of defined boolean values.

  if ((x === undefined) || (y === undefined)) return undefined;

  var dir = rInt(DIRECTION.length);
  for (var i = 0; i < DIRECTION.length; i++) {

    //Luke says Javascript is very slow at modulus, so do (dir + 1) % 4 the dumb way:
    dir++;
    if (dir >= DIRECTION.length) dir = 0;

    var xx = x + DIRECTION[dir].deltaX;
    var yy = y + DIRECTION[dir].deltaY;



    if ((xx < 0) || (yy < 0)) continue;
    if ((xx >= myGrid.length) || (yy >= myGrid.length)) continue;

    //console.log("      from ("+x+", "+y+")  looking at: grid["+xx + "][" + yy+"]="+
    //  myGrid[xx][yy]+ " in dir="+dir + ", value="+value);

    if (myGrid[xx][yy] === value)
    { //console.log("    myGrid[xx][yy] === value");
      return {x:xx,y:yy,dir:dir};
    }
  }
  return undefined;
}








//=======================================================================================
function doesPolyHaveHoles(spawnGrid, order, id) {
//=======================================================================================
  if (order < 7) return false;

  var tmpGrid = matrixCopy(spawnGrid);
  var polyCells = 0;
  var emptyCells = 0;

  for (var x = 0; x < tmpGrid.length; x++) {
    for (var y = 0; y < tmpGrid[x].length; y++) {
      if (tmpGrid[x][y] === id) {
        polyCells++;
      }
      else {
        tmpGrid[x][y] = CELL_EMPTY;
        emptyCells++
      }
    }
  }

  if (polyCells != order) {
    throw new Error(
        "generation.js::doesPolyHaveHoles(order=" + order + "id=" + id + ") there are only " +
        "polyCells in grid with matching ID");
  }


  //Since shapes that touch the edge can seperate the grid into disconnected parts,
  //  start the recursion on all places along the edge.
  for (var x = 0; x < tmpGrid.length; x++) {
    if (tmpGrid[x][0] === CELL_EMPTY) {
      matrixRecursiveFillOfConnectedCells(tmpGrid, x, 0, CELL_EMPTY, CELL_VISITED);
    }
    var y = tmpGrid[x].length - 1;
    if (tmpGrid[x][y] === CELL_EMPTY) {
      matrixRecursiveFillOfConnectedCells(tmpGrid, x, y, CELL_EMPTY, CELL_VISITED);
    }
  }
  for (var y = 0; y < tmpGrid.length; y++) {
    if (tmpGrid[0][y] === CELL_EMPTY) {
      matrixRecursiveFillOfConnectedCells(tmpGrid, 0, y, CELL_EMPTY, CELL_VISITED);
    }
    var x = tmpGrid.length - 1;
    if (tmpGrid[x][y] === CELL_EMPTY) {
      matrixRecursiveFillOfConnectedCells(tmpGrid, x, y, CELL_EMPTY, CELL_VISITED);
    }
  }


  var holeCount = matrixReplace(tmpGrid, CELL_EMPTY, CELL_VISITED);

  if (holeCount > 0) {
    //console.log("Found " + POLYONIMO_NAME[order] + " with " + holeCount +" holes");
    return true;
  }
  return false;
}



//=======================================================================================
function copyBoardToMatrix(myMatrix, left, top, size, onlyBlockId, childID) {
//=======================================================================================
  var filledCount = 0;
  for (var x = left; x < left+size; x++) {
    for (var y = top; y < top+size; y++) {
      var myCell = board.getCell(x, y);
      var xx = x-left;
      var yy = y-top;
      myMatrix[xx][yy] = CELL_EMPTY;
      if (myCell.occupied || myCell.locked) {
        if (onlyBlockId === undefined) {
          myMatrix[xx][yy] = myCell.id;
          filledCount++;
          //console.log("          Found Cell: board.getCell("+x+", "+y+")="+myCell.id+":  ==>  xx=" + xx+", yy="+yy +", filledCellCount="+filledCellCount);

        }
        else if (myCell.id === onlyBlockId) {
          myMatrix[xx][yy] = childID;
          filledCount++;
          //console.log("          id === onlyBlockID: x="+x+", y="+y+" ==>  xx=" + xx+", yy="+yy +", filledCellCount="+filledCellCount);
        }
      }
    }
  }
  return filledCount;
}
