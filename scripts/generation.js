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

//=======================================================================================
function placeStartingPolys() {
//=======================================================================================
  //var orderList = [8, 7, 6, 5, 4, 3, 2, 1];
  //Each number in orderList spawns, at the start of the game, a poly of that order.
  var orderList = [5, 4, 4, 3, 3, 2, 2, 2, 2, 1, 1];
  r = Math.random();
  if (r < 0.2) orderList = orderList.concat(5, 2, 1, 1, 1);
  else if (r < 0.4) orderList = orderList.concat(4, 2, 2);
  else if (r < 0.6) orderList = orderList.concat(3, 3, 2);
  else if (r < 0.8) orderList = orderList.concat(5, 1, 1, 1, 1);
  else orderList = orderList.concat(4, 2, 1, 1);
  //var orderList = [1, 1, 1, 1];

  //console.log("placeStartingPolys(): "+orderList);

  for (var i=0; i<orderList.length; i++) {
    spawnStartingPolys(orderList[i]);
  }
  currentlyAnimating = true;
}




//=======================================================================================
function spawnStartingPolys(order) {
//=======================================================================================
  //console.log("spawnStartingPolys("+order+")");

  //Normally, on a 10x10 board, this loop will only execute once.
  //  A few times it will execute twice.
  //However, if the board is made very small, say for debugging, it may become
  //  impossible to place the starting polys asked for in placeStartingPolys().
  //Therefore, to avoid infinite loop in such cases, after 3 trys, the
  //  requested order is reduced by 1.
  // If order reaches 0, then the function returns without haveing spawned anything.
  while (order >= 1) {
    for (var n = 0; n < 3; n++) {
      var done = spawnBlockInRandomLocation(order);
      if (done) return;
    }
    order = order - 1;
    //console.log("order ="+order);
  }
}





//=======================================================================================
function spawnMonoOrDomino() {
//=======================================================================================
  if (Math.random() < 0.25) spawnBlockInRandomLocation(1);
  else {

    //This will pick, with equal probability one empty space.
    //Then, starting in a random direction, it will look in each
    //   of the 4 directions until it can create a domino - or return false if it cannot.
    var done = spawnBlockInRandomLocation(2);
    if (!done) spawnBlockInRandomLocation(1);
  }
  currentlyAnimating = true;
  triggerDetectSquares = true;
}






//=======================================================================================
function spawnBlockInRandomLocation(order) {
//=======================================================================================
  //This function is called when:
  //  1) spawning starting polys.
  //  2) spawning mono or dominos when a block is moved.

  var spawnGrid = matrix(gridSize, gridSize, CELL_EMPTY);
  copyBoardToMatrix(spawnGrid, 0, 0, gridSize);

  var id = newId();
  //console.log("spawnBlockInRandomLocation("+order+"): id="+id);



  for (var i = 0; i < order; i++) {
    var cellAdded = appendRandomCellToPoly(spawnGrid, id);

    if (cellAdded === undefined) return false;
  }


  //Animate random first block in direction of a block attached to it.
  var dir = rInt(DIRECTION.length);
  var start = matrixGetRandomCoordinateWithGivenValue(spawnGrid, id);
  var next = getCoordinateOfCellInRandomDirectionWithGivenValue(spawnGrid, start.x,start.y, id);

  //console.log("    start= ("+start.x+", "+start.y+"),  next=("+next.x+", "+next.y+"), next.dir="+next.dir);

  if (next != undefined) dir =  next.dir;
  amimateBlockAggregationInBreathFirstOrder(start.x,start.y, dir, spawnGrid, order, 0, id);

  return true;
}





//=======================================================================================
function squareToPoly(left,top,order) {
//=======================================================================================
  //console.log("squareToPoly("+left+","+top+","+order+") blockIdOfLastBlockPlaced="+blockIdOfLastBlockPlaced);

  var spawnGrid = matrix(order, order, CELL_EMPTY);

  var parentOrder = board.getCell(left,top).order;

	// TODO: move these to the bottom of squareToPoly() vvvvvvvvvvvv
	// calculate score, handle combos
	comboActiveEvt(order*100+1000); // TODO: CHANGE TIMING WITH NEW ANIMATION
	if(comboActiveCtr === 1)comboCtr = 1;
	else comboCtr++;
	addToScore(order, parentOrder, comboCtr);

	// check win condition
	if(order > goalOrder && !gameWon){
		gameWon = true;
		gameWonEvt(); // TODO: this needs to be scheduled with animations
	}
	// TODO ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  var childId = newId();
  var hasHoles = true;

  var lastCoordinate;

  while (hasHoles) {
    var filledCellCount = copyBoardToMatrix(spawnGrid, left, top, order, blockIdOfLastBlockPlaced, childId);

    var cellsNeeded = order - filledCellCount;
    //console.log("   Finished Copying Starting Cells: cellsNeeded="+cellsNeeded);

    for (var i = 0; i < cellsNeeded; i++) {
      lastCoordinate = appendRandomCellToPoly(spawnGrid, childId, lastCoordinate);
    }
    hasHoles = doesPolyHaveHoles(spawnGrid, order, childId);
  }

  for (var x = 0; x < order; x++) {
    for (var y = 0; y < order; y++) {

      var i = x + left;
      var j = y + top;

      var cell = board.getCell(i, j);
      cell.locked = true;
      unlockEvt(cell,keyframe(3));

      if (spawnGrid[x][y] === childId) {
        //console.log("    copy matrix: (" + x + ", " + y + ") ==> board: (" + i + ", " + j+")");
        cell.quickSet(true, childId, order);
      }
      else {
        cell.occupied = false;
      }
    }
  }


  for (var i = left; i < left + order; ++i)for (var j = top; j < top + order; ++j) {
    if (!board.getCell(i, j).occupied) {
      /* do stuff here (cells are at i*cellSize, j*cellSize) */
      var color = polyColor[order].primary;
      //x, y, startr, startg, startb, starta, startscale, endr, endg, endb, enda, endscale, border, gravity
      var x = i * cellSize + cellSize / 2;
      var y = j * cellSize + cellSize / 2;

      //new particle(x, y, 0,  0,  750,      color.r * 255, color.g * 255, color.b * 255, 1,      cellSize,    255,   255, 255,   0,     cellSize / 10, 1,       0);
      new particle(x, y, 0,  0,  750,      polyColor[order].primary, 1,      cellSize,    polyColor[order].secondary,   0,     cellSize / 10, 1,       0);

    }
  }
  beginSurroundEvt(left, top, order,0, order*100);
  surroundEvt(left, top,order,order*100,order*100+1000);

  saveGame();
}





//=======================================================================================
function appendRandomCellToPoly(spawnGrid, id, lastCoordinate) {
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


  var x = rInt(spawnGrid.length);
  var y = rInt(spawnGrid.length);
  //console.log("   appendRandomCellToPoly(id="+id+"): lastCoordinate="+lastCoordinate);
  if (lastCoordinate != undefined) {
    var tryMeFirst = getCoordinateOfCellInRandomDirectionWithGivenValue(spawnGrid, lastCoordinate.x, lastCoordinate.y, CELL_EMPTY);
    //console.log("        appendRandomCellToPoly(id="+id+"): lastCoordinate=("+lastCoordinate.x+ ", "+lastCoordinate.y);
    if (tryMeFirst != undefined) {
      //console.log("            appendRandomCellToPoly(id="+id+"):  tryMeFirst="+tryMeFirst.x, tryMeFirst.y);
      x = tryMeFirst.x;
      y = tryMeFirst.y;
    }
  }

  while (visitedCount < totalEmptyCells) {

    if (spawnGrid[x][y] === CELL_EMPTY) {

      if ((numCellsInPoly === 0) || (hasNeighborWithID(spawnGrid, x, y, id))) {
        spawnGrid[x][y] = id;
        //console.log("     appendRandomCellToPoly(id="+id+"): x="+x+ ", y="+y);
        return new Point(x,y);
      }

      spawnGrid[x][y] = CELL_VISITED;
      visitedCount++;
    }

    var x = rInt(spawnGrid.length);
    var y = rInt(spawnGrid.length);
  }

  return undefined;
}



//LUKE: Update starting polys and mono/domino animation here.
//=======================================================================================
function amimateBlockAggregationInBreathFirstOrder(x, y, entryDirection, spawnGrid, order, depth, id) {
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
  var slowDown = 1; //For debugging, increase to 5;
  quickSetEvt(myCell, true, id, order, keyframe((depth+1)*slowDown));

  slideInEvt[entryDirection](x, y,keyframe(depth*slowDown),keyframe((depth+1)*slowDown));
  fadeOutEvt(x, y, keyframe((depth+1)*slowDown), keyframe((depth+2)*slowDown));
  unlockEvt(myCell, keyframe((order+2)*slowDown));


  while(true) {
    var coordinate = getCoordinateOfCellInRandomDirectionWithGivenValue(spawnGrid, x, y, id);

    //If there is no place left to go, then back out of recursion.
    if (coordinate === undefined) return;

    amimateBlockAggregationInBreathFirstOrder(
      coordinate.x, coordinate.y, coordinate.dir, spawnGrid, order, depth + 1, id);

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
      return new PointAndDirection(xx, yy, dir);
    }
  }
  return undefined;
}




//=======================================================================================
function hasNeighborWithID(spawnGrid, x, y, id) {
//=======================================================================================
  for (var dir = 0; dir < DIRECTION.length; dir++) {

    var xx = x + DIRECTION[dir].deltaX;
    var yy = y + DIRECTION[dir].deltaY;

    if ((xx < 0) || (yy < 0) || (xx >= spawnGrid.length) || (yy >= spawnGrid.length)) continue;

    if (spawnGrid[xx][yy] === id) return true;
  }
  return false;
}






//=======================================================================================
function doesPolyHaveHoles(spawnGrid, order, id) {
//=======================================================================================
  //Only works for holes of size 1x1 - which is sufficient up through all octominoes
  // (there is one nonominoe with a 1x2 hole).
  if (order < 7) return false;
  for (var x = 0; x < order; x++) {
    for (var y = 0; y < order; y++) {
      if (spawnGrid[x][y] === id) {
        var foundOpening = false;
        for (var dir = 0; dir < DIRECTION.length; dir++) {

          var xx = x + DIRECTION[dir].deltaX;
          var yy = y + DIRECTION[dir].deltaY;

          if ((xx < 0) || (yy < 0) || (xx >= order) || (yy >= order)) {
            foundOpening = true;
            break;
          }
          if (!spawnGrid[xx][yy] === id) {
            foundOpening = true;
            break;
          }
        }
        if (!foundOpening) return true;
      }
    }
  }
  return false;
}





//=======================================================================================
function copyBoardToMatrix(myMatrix, left, top, size, onlyBlockId, childID) {
//=======================================================================================
  if(onlyBlockId === undefined) {
    //console.log("    copyBoardToMatrix: left=" + left + ", top=" + top + ", size=" + size);
  }
  else {
    //console.log("    copyBoardToMatrix: left=" + left + ", top=" + top + ", size=" + size + ", onlyBlockId=" + onlyBlockId + ", childID=" + childID);
  }
  var filledCellCount = 0;
  for (var x = left; x < left+size; x++) {
    for (var y = top; y < top+size; y++) {
      var myCell = board.getCell(x, y);
      var xx = x-left;
      var yy = y-top;
      myMatrix[xx][yy] = CELL_EMPTY;
      if (myCell.occupied || myCell.locked) {
        if (onlyBlockId === undefined) {
          myMatrix[xx][yy] = myCell.id;
          filledCellCount++;
        }
        else if (myCell.id === onlyBlockId) {
          myMatrix[xx][yy] = childID;
          filledCellCount++;
          //console.log("          id === onlyBlockID: x="+x+", y="+y+" ==>  xx=" + xx+", yy="+yy +", filledCellCount="+filledCellCount);
        }
      }
    }
  }
  return filledCellCount;
}

