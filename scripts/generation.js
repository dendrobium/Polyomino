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
  var delay = 0;

  var spawnGrid = matrix(gridSize,gridSize,CELL_EMPTY);
  spawnStartingBlock(spawnGrid, 1, false, delay, 3,3);
  spawnStartingBlock(spawnGrid, 1, false, delay, 4,3);
  spawnStartingBlock(spawnGrid, 1, false, delay, 5,3);

  spawnStartingBlock(spawnGrid, 1, false, delay, 3,4);
  spawnStartingBlock(spawnGrid, 1, false, delay, 5,4);

  spawnStartingBlock(spawnGrid, 1, false, delay, 3,5);
  spawnStartingBlock(spawnGrid, 1, false, delay, 4,5);
  spawnStartingBlock(spawnGrid, 1, false, delay, 5,5);



  var r = Math.random();
  var loc;
  if (r < 0.5) {
    loc = getRandomCoordinatesInRegion(spawnGrid, NORTHEAST);
    if (loc != null) spawnStartingBlock(spawnGrid, 4, true, ++delay, loc.x, loc.y);

    loc = getRandomCoordinatesInRegion(spawnGrid, NORTHWEST);
    if (loc != null) spawnStartingBlock(spawnGrid, 4, true, ++delay, loc.x, loc.y);

    loc = getRandomCoordinatesInRegion(spawnGrid, WEST);
    if (loc != null) spawnStartingBlock(spawnGrid, 3, true, ++delay, loc.x, loc.y);

    loc = getRandomCoordinatesInRegion(spawnGrid, EAST);
    if (loc != null) spawnStartingBlock(spawnGrid, 3, true, ++delay, loc.x, loc.y);
  }
  else if (r < 1.15) {
    loc = getRandomCoordinatesInRegion(spawnGrid, SOUTHEAST);
    if (loc != null) spawnStartingBlock(spawnGrid, 4, true, ++delay, loc.x, loc.y);

    loc = getRandomCoordinatesInRegion(spawnGrid, SOUTHWEST);
    if (loc != null) spawnStartingBlock(spawnGrid, 4, true, ++delay, loc.x, loc.y);


    loc = getRandomCoordinatesInRegion(spawnGrid, WEST);
    if (loc != null) spawnStartingBlock(spawnGrid, 3, true, ++delay, loc.x, loc.y);

    loc = getRandomCoordinatesInRegion(spawnGrid, EAST);
    if (loc != null) spawnStartingBlock(spawnGrid, 3, true, ++delay, loc.x, loc.y);
  }


  var numBlocks = rInt(4)+3;
  var count = 0;
  var x, y;
  while (count < numBlocks)
  {
    x = rInt(gridSize);
    y = rInt(gridSize);
    if (x == 4 && y == 4) continue;
    if (spawnGrid[x][y] != CELL_EMPTY) continue;
    count++;
    spawnStartingBlock(spawnGrid, 2, true, ++delay, x, y);
  }

  var singleBlockSpawnCount = 0;
  for (var i=0; i<8; i++) {
    if ((singleBlockSpawnCount < 2) || (Math.random() > 0.5)) {

      loc = getRandomCoordinatesNearEdge(spawnGrid);
      if (loc != null) {
        spawnStartingBlock(spawnGrid, 1, false, ++delay, loc.x, loc.y);
        singleBlockSpawnCount++;
      }
    }
  }
  currentlyAnimating = true;
}

//=======================================================================================
function getRandomCoordinatesInRegion(spawnGrid, region) {
//=======================================================================================

  var x = rInt(3);
  var y = rInt(3);
  for (var i = 0; i < 9; i++) {

    var xx = x;
    var yy = y;
    if (region === NORTH) xx = x + 3;
    else if (region === NORTHEAST) xx = x + 6;
    else if (region === EAST) {
      xx = x + 6;
      yy = y + 3;
    }
    else if (region === SOUTHEAST) {
      xx = x + 6;
      yy = y + 6;
    }
    else if (region === SOUTH) {
      xx = x + 3;
      yy = y + 6;
    }
    else if (region === SOUTHWEST) yy = y + 6;
    else if (region === WEST) yy = y + 3;
    if (spawnGrid[xx][yy] === CELL_EMPTY) return {x: xx, y: yy}

    x++;
    if (x >= 3) {
      x = 0;
      y++;
      if (y >= 3) y = 0;
    }
  }

  //console.log("generation.getRandomCoordinatesInRegion(region="+region+") could not find location");
  return null;
}

//=======================================================================================
function getRandomCoordinatesNearEdge(spawnGrid) {
//=======================================================================================

  for (var i = 0; i < 50; i++) {

    var x = rInt(2);
    var y = rInt(2);
    var r = Math.random();
    if (r < 0.25) x = x + 7;
    else if (r < 0.5) y = y + 7;
    else if (r < 0.75) {
      x = x + 7;
      y = y + 7;
    }
    if (spawnGrid[x][y] === CELL_EMPTY) return {x: x, y: y}
  }
  return null;
}

//=======================================================================================
  function spawnStartingBlock(spawnGrid, order, cement, delay, x0, y0) {
//=======================================================================================
    var id = newId();

    spawnGrid[x0][y0] = id;
    //console.log("generation.spawnStartingBlock(order="+order+", x0="+x0+", y0="+y0+")");
    //console.log("    spawnGrid="+ matrixToString(spawnGrid));

    for (var i = 1; i < order; i++) {
      var cellAdded = appendRandomCellToPoly(spawnGrid, id, order);

      if (cellAdded === undefined) {
        order = i;
      }
      else {
        //spawnGrid[cellAdded.x][cellAdded.y] = id;
        //console.log("    x="+cellAdded.x+", y="+cellAdded.y);
      }
    }


    var animateGrid = matrixCopy(spawnGrid);
    animateSpawn(order, animateGrid, id, cement, delay);
    return id;
  }









//=======================================================================================
function spawnPoly() {
//=======================================================================================

  //console.log("spawnPoly() orderOfLastMerge=" +orderOfLastMerge +", gameMaxShapeLevel="+gameMaxShapeLevel);
  var order = 1;
  var r = Math.random();
  if (r < .3) order = 1;
  else if (r < .8) order = 2;
  else {
    r = Math.random();
    if (r < 0.05) order = 3;
    else if (r < 0.08) order = 4;
    else if (r < 0.7) order = orderOfLastMerge;
    else order = gameMaxShapeLevel;
  }
  if (order > gameMaxShapeLevel) order = gameMaxShapeLevel;

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
  //  2) spawning a poly when a block is moved.

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



  animateSpawn(order, spawnGrid, id, cement, delay);
  identifyShape(spawnGrid, order, id);
  return { id:id, minX:minX, minY:minY, maxX:maxX, maxY:maxY};
}


//=======================================================================================
  function animateSpawn(order, spawnGrid, id, cement, delay) {
//=======================================================================================


    //Animate random first block in direction of a block attached to it.
    var dir = rInt(DIRECTION.length);
    var start = matrixGetRandomCoordinateWithGivenValue(spawnGrid, id);
    var next = getCoordinateOfCellInRandomDirectionWithGivenValue(spawnGrid, start.x, start.y, id);

    if (next != undefined) dir = next.dir;
    if (delay === undefined) delay = 0;
    delay *= 100;
    animateBlockAggregationInBreathFirstOrder(start.x, start.y, dir, spawnGrid, order, 0, id, cement, delay);

  }

////=======================================================================================
//function tryToFindGoodRandomSpawnPoint(spawnGrid, order) {
////=======================================================================================
//
//  console.log("tryToFindGoodRandomSpawnPoint("+order+") ENTER");
//  var spawnGrid = matrix(gridSize, gridSize, CELL_EMPTY);
//  var filledCount = copyBoardToMatrix(spawnGrid, 0, 0, gridSize);
//  var emptyCount = gridSize * gridSize - filledCount;
//
//
//  var personalSpace = order;
//  var maxTrys = 10, tryCount = 0;
//  var x0, y0;
//  while (personalSpace >= 0) {
//
//    var visitedCount = 0;
//    var emptyCount = 0;
//
//    for (var x = 0; x < spawnGrid.length; x++) {
//      for (var y = 0; y < spawnGrid.length; y++) {
//        if (spawnGrid[x][y] === CELL_VISITED) spawnGrid[x][y] = CELL_EMPTY;
//        if (spawnGrid[x][y] === CELL_EMPTY) {
//          emptyCount++;
//          x0 = x;
//          y0 = y;
//        }
//      }
//    }
//
//    console.log("   ...x0="+x0+", y0="+y0+", emptyCount="+emptyCount);
//
//    if (emptyCount < 2) return {x: x0, y: y0};
//
//    if (maxTrys > emptyCount) maxTrys = emptyCount;
//
//    while (tryCount < maxTrys) {
//
//      var x = rInt(spawnGrid.length);
//      var y = rInt(spawnGrid.length);
//
//      if (spawnGrid[x][y] === CELL_EMPTY) {
//        spawnGrid[x][y] = CELL_VISITED;
//        x0 = x;
//        y0 = y;
//        tryCount++;
//        console.log("   ...trying ("+x+", "+y+") with personalSpace="+ personalSpace);
//        if (hasPersonalSpace(spawnGrid, x, y, personalSpace)) return {x: x0, y: y0};
//      }
//    }
//
//    personalSpace--;
//  }
//  return {x: x0, y: y0};
//}



//
////=======================================================================================
//function hasPersonalSpace(spawnGrid, x, y, personalSpace) {
////=======================================================================================
//
//  if (personalSpace === 0) return true;
//  var x1 = Math.max(x-personalSpace, 0);
//  var x2 = Math.min(x+personalSpace, gridSize-1);
//  var y1 = Math.max(y-personalSpace, 0);
//  var y2 = Math.min(x+personalSpace, gridSize-1);
//
//  for (var xx = x1; xx <= x2; xx++) {
//    for (var yy = y1; yy <= y2; yy++) {
//
//      if ((spawnGrid[xx][yy] != CELL_EMPTY) && (spawnGrid[xx][yy] != CELL_VISITED)) {
//        console.log("     ...Found neighbor in space["+personalSpace+"] ("+xx+", "+yy+")");
//        return false;
//      }
//    }
//  }
//  return true;
//}




//=======================================================================================
function squareToPoly(left,top,order) {
//=======================================================================================
  orderOfLastMerge = order;
  if (order > gameMaxShapeLevel) gameMaxShapeLevel = order;

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
