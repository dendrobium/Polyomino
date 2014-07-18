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



//=======================================================================================
function placeStartingPolys() {
//=======================================================================================
  //var orderList = [8, 7, 6, 5, 4, 3, 2, 1];
  //The poly orders in orderList make up the starting set.
  var orderList = [5, 4, 4, 3, 3, 2, 2, 2, 2, 1, 1];
  r = Math.random();
  if (r < 0.2) orderList = orderList.concat(5, 2, 1, 1, 1);
  else if (r < 0.4) orderList = orderList.concat(4, 2, 2);
  else if (r < 0.6) orderList = orderList.concat(3, 3, 2);
  else if (r < 0.8) orderList = orderList.concat(5, 1, 1, 1, 1);
  else orderList = orderList.concat(4, 2, 1, 1);

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
      var done = tryToSpawnBlockInRandomOpenLocation(order, false);
      if (done) return;
    }
    order = order - 1;
    console.log("order ="+order);
  }
}





//=======================================================================================
function spawnMonoOrDomino() {
//=======================================================================================
  if (Math.random() < 0.25) tryToSpawnBlockInRandomOpenLocation(1, true);
  else {

    //This will pick, with equal probability one empty space.
    //Then, starting in a random direction, it will look in each
    //   of the 4 directions until it can create a domino - or return false if it cannot.
    var done = tryToSpawnBlockInRandomOpenLocation(2, true);
    if (!done) tryToSpawnBlockInRandomOpenLocation(1, true);
  }
}






//=======================================================================================
function tryToSpawnBlockInRandomOpenLocation(order, scheduleAnimation) {
//=======================================================================================
  //This function is called when:
  //  1) spawning starting polys.
  //  2) spawning mono or dominos when a block is moved.

  //console.log("tryToSpawnBlockInRandomOpenLocation("+order+"),  scheduleAnimation="+scheduleAnimation);
  var spawnGrid = matrix(gridSize, gridSize, false);
  copyBoardToMatrix(spawnGrid, 0, 0, gridSize, false);


  //listX and listY will be a list of coordinates of all cells in the newly spawned block.
  var listX = new Array(order);
  var listY = new Array(order);

  //used to prevent 1xn bars (where n>3) from spawning at start of game.
  var maxX = 0;
  var minX = gridSize;
  var maxY = 0;
  var minY = gridSize;

  for (var i = 0; i <order; i++) {

    var addedCell = appendRandomCellToPoly(listX, listY, i, spawnGrid, gridSize);
    if (!addedCell) return false;
    //console.log("   Added Cell ["+i+"] ("+listX[i]+", "+listY[i]+")");
    if (listX[i] > maxX) maxX = listX[i];
    if (listX[i] < minX) minX = listX[i];
    if (listY[i] > maxY) maxY = listY[i];
    if (listY[i] < minY) minY = listY[i];
  }


  if (order >= 4) {
    //if bar in level 4 or 5, then retry
    if ((maxX == minX) || (maxY == minY)) return false;
  }


  //At this point, the location of the new ployomino is fully specified.
  //Variable spawnGrid is true for each occupied cell in the grid.
  //We need to add only the new cells to the board, so first set all cells to
  //  false, then loop through listX[i], listY[i] to add each cell in the new poly.
  matrixSet(spawnGrid, false);
  for (var i = 0; i <order; i++) {
    spawnGrid[listX[i]][listY[i]] = true;
    //console.log("   Spawn Cell ("+listX[i]+", "+listY[i]+")");
  }





  var id = newId();
  //console.log("copyMatrixToBoard(order="+order+", id="+id);
  var animationEntryX = listX[0];
  var animationEntryY = listY[0];
  for (var x = 0; x < gridSize; x++) {
    for (var y = 0; y < gridSize; y++) {

      if (spawnGrid[x][y]) {

        //console.log("  x="+x+", y="+ y);
        var myCell = board.getCell(x, y);
        myCell.quickSet(true, id, order);

        //TODO: get working this animation for monos and domos that spawn wiht each move.
//        if (scheduleAnimation) {
//          if (order === 2) {
//            myCell.locked = true;
//            quickSetEvt(myCell, true, id, order, keyframe(1));
//            highlightEvt(animationEntryX, animationEntryX, keyframe(1), keyframe(2));
//            fadeOutEvt(animationEntryX, animationEntryX, keyframe(2), keyframe(3));
//            unlockEvt(myCell, keyframe(3));
//            saveGameEvt(keyframe(3));
//          }
//          else {
//            myCell.locked = true;
//            quickSetEvt(myCell, true, id, order, keyframe(1));
//            fadeOutEvt(animationEntryX, animationEntryX, keyframe(1), keyframe(2));
//            unlockEvt(myCell, keyframe(2));
//            saveGameEvt(keyframe(3));
//          }
        //}
      }
    }
  }
  return true;
}




//=======================================================================================
function appendRandomCellToPoly(listX, listY, spawnedCellCount, spawnGrid, size) {
//=======================================================================================
  //console.log("   appendRandomCellToPoly(spawnedCellCount="+spawnedCellCount+", size="+size);

  if (spawnedCellCount == 0) {
      //pick a random location within the grid.
      // If the place is empty, then:
      //     1) add it to the list of cells in the new poly
      //     2) mark its place in the spawnGrid as true.
      //     3) return true.
      // If the place is not empty, then step through cell by cell until either
      //    an empty space is found or size*size cells have been checked.
      var x = rInt(size);
      var y = rInt(size);

      for (var i=0; i<size*size; i++) {

        if (!spawnGrid[x][y]) {
          listX[0] = x;
          listY[0] = y;
          spawnGrid[x][y] = true;
          return true;
        }


        x = x + 1;
        if (x >= size) {
          x = 0;
          y = y + 1;
          if (y >= size) y = 0;
        }
      }
      return false;
  }


  var idx = 0;
  if (spawnedCellCount > 1) idx = rInt(spawnedCellCount);
  for (var n = 0; n < spawnedCellCount; n++) {
    x = listX[idx];
    y = listY[idx];

    var dir = rInt(4);
    for (var i = 0; i < 4; i++) {
      var xx = x;
      var yy = y;
      if (dir === 0) yy = y - 1;
      else if (dir === 1) xx = x + 1;
      else if (dir === 2) yy = y + 1;
      else xx = x - 1;

      if ((xx >= 0) && (yy >= 0) && (xx < size) && (yy < size)) {
        if (!spawnGrid[xx][yy]) {

          //console.log("    Added cell xx=" + xx + ", yy=" + yy + ", spawnedCellCount=" + spawnedCellCount);
          listX[spawnedCellCount] = xx;
          listY[spawnedCellCount] = yy;
          spawnGrid[xx][yy] = true;
          return true;
        }
      }

      dir = (dir + 1) % 4;
    }
    idx = (idx + 1) % spawnedCellCount;
  }

  return false;
}




//=======================================================================================
function squareToPoly(left,top,order) {
//=======================================================================================
  //console.log("squareToPoly("+left+","+top+","+order+") blockIdOfLastBlockPlaced="+blockIdOfLastBlockPlaced);

  var originalGrid = matrix(order, order, false);
  var spawnGrid = matrix(order, order, false);

  var orderOfLastBlockPlaced = copyBoardToMatrix(originalGrid, left, top, order, blockIdOfLastBlockPlaced);

  // XXX: Luke, this isn't maybe the best way to do scores but I wanted to have something to work with
  // XXX: this doesn't need to be an event, as adding a number to score doesn't need to happen at a later time... [also, seed notes in addScoreEvt definition]
  addToScore(order, orderOfLastBlockPlaced);
  if (order > goalOrder && !gameWon) {
    gameWon = true;
    gameWonEvt();
  }

  var listX = new Array(order);
  var listY = new Array(order);

  var hasHoles = true;

  while (hasHoles) {

    var filledCellCount = 0;

    for (var x = 0; x < order; x++) for (var y = 0; y < order; y++) {
      spawnGrid[x][y] = originalGrid[x][y];
      if (spawnGrid[x][y]) {
        listX[filledCellCount] = x;
        listY[filledCellCount] = y;
        filledCellCount++;
        //console.log("   Starting Cell: ("+x+", "+y+")");
      }
    }
    var cellsNeeded = order - filledCellCount;
    //console.log("   Finished Copying Starting Cells: cellsNeeded="+cellsNeeded);


    for (var i = 0; i < cellsNeeded; i++) {

      appendRandomCellToPoly(listX, listY, filledCellCount, spawnGrid, order);
      filledCellCount++;
      //console.log("   Added Cell #"+filledCellCount+" ("+listX[filledCellCount-1]+", "+listY[filledCellCount-1]+")");
    }

    hasHoles = doesPolyHaveHoles(spawnGrid, order);
  }

  var id = newId();
  for (var x = 0; x < order; x++) {
    for (var y = 0; y < order; y++) {

      var i = x + left;
      var j = y + top;

      var cell = board.getCell(i, j);

      if (spawnGrid[x][y]) {
        //console.log("    copy matrix: (" + x + ", " + y + ") ==> board: (" + i + ", " + j+")");
        cell.quickSet(true, id, order);
      }
      else {
        cell.occupied = false;
        cell.locked = true;
        unlockEvt(cell,keyframe(3));
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

      //    particle(x, y, vx, vy, lifetime, startr,        startg,        startb,        starta, startscale,  endr, endg, endb, enda,   endscale,      border,  gravity){
      //new particle(x, y, 0,  0,  750,      color.r * 255, color.g * 255, color.b * 255, 1,      cellSize,    255,   255, 255,   0,     cellSize / 10, 1,       0);
      new particle(x, y, 0,  0,  750,      color.r * 255, color.g * 255, color.b * 255, 1,      cellSize,    255,   255, 255,   0,     cellSize / 10, 1,       0);

    }
  }
  beginSurroundEvt(left, top, order,0, order*100);
  surroundEvt(left, top,order,order*100,order*100+1000);

  saveGame();
}




//=======================================================================================
function doesPolyHaveHoles(spawnGrid, order) {
//=======================================================================================
  if (order < 7) return false;
  for (var x = 0; x < order; x++) {
    for (var y = 0; y < order; y++) {
      if (!spawnGrid[x][y]) {
        var foundOpening = false;
        for (var i = 0; i < 4; i++) {
          var xx = x;
          var yy = y;
          if (dir === 0) yy = y - 1;
          else if (dir === 1) xx = x + 1;
          else if (dir === 2) yy = y + 1;
          else xx = x - 1;

          if ((xx >= 0) || (yy >= 0) || (xx < order) || (yy < order)) {
            foundOpening = true;
            break;
          }
          if (!spawnGrid[xx][yy]) {
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
function copyBoardToMatrix(myMatrix, left, top, size, onlyBlockId) {
//=======================================================================================
  var orderOfOneBlockInCopy;
  //console.log("    copyBoardToMatrix: left="+left+", top="+top+", size="+size+", onlyBlockId="+onlyBlockId);
  for (var x = left; x < left+size; x++) {
    for (var y = top; y < top+size; y++) {
      var myCell = board.getCell(x, y);
      orderOfOneBlockInCopy = myCell.order;
      //console.log("    copyBoardToMatrix: boardCell ("+x+", "+y+")");
      var xx = x-left;
      var yy = y-top;
      myMatrix[xx][yy] = false;
      if (myCell.occupied || myCell.locked) {
        //console.log("    copyBoardToMatrix: boardCell ("+x+", "+y+") ==> matrix ("+xx+", "+yy+") id="+myCell.id);
        if (onlyBlockId === false) {
          myMatrix[xx][yy] = true;
        }
        else if (myCell.id === onlyBlockId) {
          myMatrix[xx][yy] = true;
        }
      }
    }
  }
  return orderOfOneBlockInCopy;
}

