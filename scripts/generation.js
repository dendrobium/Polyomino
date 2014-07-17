function placeStartingPolys() {

  //var orderList = [8, 7, 6, 5, 4, 3, 2, 1];
//  var orderList = [5, 4, 4, 3, 3, 2, 2, 2, 2, 1, 1];
//  r = Math.random();
//  if (r < 0.2) orderList = orderList.concat(5, 2, 1, 1, 1);
//  else if (r < 0.4) orderList = orderList.concat(4, 2, 2);
//  else if (r < 0.6) orderList = orderList.concat(3, 3, 2);
//  else if (r < 0.8) orderList = orderList.concat(5, 1, 1, 1, 1);
//  else orderList = orderList.concat(4, 2, 1, 1);

  orderList = [4, 3];

  console.log("placeStartingPolys(): "+orderList);

  for (var i=0; i<orderList.length; i++) {
    spawnStartingPolys(orderList[i]);
  }
  currentlyAnimating = true;
}


function spawnStartingPolys(order) {
  console.log("spawnStartingPolys("+order+")");

  //Normally, on a 10x10 board, this loop will only execute once.
  //  A few times it will execute twice.
  //However, if the board is made very small, say for debugging, it may become
  //  impossible.

  while (order >= 1) {
    for (var n = 0; n < 3; n++) {
      var done = tryToSpawnBlockInRandomOpenLocation(order, false);
      if (done) return;
    }
    order = order - 1;
    console.log("order ="+order);
  }
}

function spawnMonoOrDomino()
{
  if (Math.random() < 0.25) tryToSpawnBlockInRandomOpenLocation(1, true);
  else {
    var done = tryToSpawnBlockInRandomOpenLocation(2, true);
    if (!done) tryToSpawnBlockInRandomOpenLocation(1, true);
  }
}



function tryToSpawnBlockInRandomOpenLocation(order, scheduleAnimation) {

  console.log("tryToSpawnBlockInRandomOpenLocation("+order+"),  scheduleAnimation="+scheduleAnimation);
  var spawnGrid = matrix(gridSize, gridSize, false);
  copyBoardToMatrix(spawnGrid, 0, 0, gridSize, false);


  var listX = new Array(order);
  var listY = new Array(order);


  var filledCellCount = 0;
  var maxX = 0;
  var minX = gridSize;
  var maxY = 0;
  var minY = gridSize;

  for (var i = 0; i <order; i++) {

    var addedCell = appendRandomCellToPoly(listX, listY, i, spawnGrid, gridSize);
    if (!addedCell) return false;
    var idx = filledCellCount;
    filledCellCount++;
    console.log("   Added Cell #"+filledCellCount+" ("+listX[idx]+", "+listY[idx]+")");
    if (listX[idx] > maxX) maxX = listX[idx];
    if (listX[idx] < minX) minX = listX[idx];
    if (listY[idx] > maxY) maxY = listY[idx];
    if (listY[idx] < minY) minY = listY[idx];
  }


  if (order >= 4) {
    //if bar in level 4 or 5, then retry
    if ((maxX == minX) || (maxY == minY)) return false;
  }

  copyMatrixToBoard(spawnGrid, order, scheduleAnimation);
  return true;
}



function appendRandomCellToPoly(listX, listY, spawnedCellCount, spawnGrid, size)
{

  console.log("   appendRandomCellToPoly(spawnedCellCount="+spawnedCellCount+", size="+size);

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




// TODO: consider animations
// Used to generate domino through polyomino.
// this function assumes no cell locks are set to true
function squareToPoly(left,top,order) {
  console.log("squareToPoly("+left+","+top+","+order+") blockIdOfLastBlockPlaced="+blockIdOfLastBlockPlaced);
  // XXX: Luke, this isn't maybe the best way to do scores but I wanted to have something to work with
  // XXX: this doesn't need to be an event, as adding a number to score doesn't need to happen at a later time... [also, seed notes in addScoreEvt definition]
  addToScore(order);
  if (order > goalOrder && !gameWon) {
    gameWon = true;
    gameWonEvt();
  }

  var originalGrid = matrix(order, order, false);
  var spawnGrid = matrix(order, order, false);

  copyBoardToMatrix(originalGrid, left, top, order, blockIdOfLastBlockPlaced);

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
        console.log("   Starting Cell: ("+x+", "+y+")");
      }
    }
    var cellsNeeded = order - filledCellCount;
    console.log("   Finished Copying Starting Cells: cellsNeeded="+cellsNeeded);

    for (var i = 0; i < cellsNeeded; i++) {

      appendRandomCellToPoly(listX, listY, filledCellCount, spawnGrid, order);
      filledCellCount++;
      console.log("   Added Cell #"+filledCellCount+" ("+listX[filledCellCount-1]+", "+listY[filledCellCount-1]+")");
    }

    hasHoles = doesPolyHaveHoles(spawnGrid, order);
  }

  var filled = new grid(order);

  blockIdOfLastBlockPlaced = newId();
  for (var x = 0; x < order; x++) {
    for (var y = 0; y < order; y++) {

      var i = x + left;
      var j = y + top;

      var cell = board.getCell(i, j);

      if (spawnGrid[x][y]) {
        var i = x + left;
        var j = y + top;
        console.log("    copy matrix: (" + x + ", " + y + ") ==> board: (" + i + ", " + j+")");
        var cell = board.getCell(i, j);
        cell.quickSet(true, blockIdOfLastBlockPlaced, order);
        filled.setCell(x, y, true);
      }
      else {
        board.getCell(x, y).occupied = false;
        filled.setCell(x, y, false);
      }
    }
  }


  for (var i = left; i < left + order; ++i)for (var j = top; j < top + order; ++j) {
    if (!board.getCell(i, j).occupied) {
      /* do stuff here (cells are at i*cellSize, j*cellSize) */
      var color = polyColor[board.getCell(i, j).order].primary;
      new particle(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, 0, 0, 750, color.r * 255, color.g * 255, color.b * 255, 1, cellSize, 255, 255, 255, 0, cellSize / 10, 1, 0);
    }
  }


}



function doesPolyHaveHoles(spawnGrid, order) {
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

//beginSurroundEvt(left, top,order,0,order*100);
//surroundEvt(left, top,order,order*100,order*100+1000);addToScore
//saveGame();
//}


/*


 if (spawnedCellCount >= order) {
 if (order >= 4) {
 //if bar in level 4 or 5, then retry
 if ((maxX == minX) || (maxY == minY)) return false;
 }
 }
 var maxX = x;
 var minX = x;
 var maxY = y;
 var minY = y;

 spawnGrid[x][y] = true;
 var addedCell = false;

 while (spawnedCellCount < order) {
 var idx = 0;
 if (spawnedCellCount > 1) idx = rInt(spawnedCellCount);
 for (var n = 0; n < spawnedCellCount; n++) {
 x = listx[idx];
 y = listy[idx];

 appendRandomCell(listX, listY, spawnedCellCount, spawnGrid, size)

 if (xx > maxX) maxX = xx;
 if (xx < minX) minX = xx;
 if (yy > maxY) maxY = yy;
 if (yy < minY) minY = yy;

 if (spawnedCellCount >= order) {
 if (order >= 4) {
 //if bar in level 4 or 5, then retry
 if ((maxX == minX) || (maxY == minY)) return false;
 }
 }
 */
// generate random polyomino
//if (order <= MAX_PREDEFINED_ORDER) spawnBiasedRandomPoly(filled, order, left, top);
//else {
//		var i = left + rInt(order);
//		var j = top + rInt(order);
//		var c = board.getCell(i, j);
//		c.quickSet(true, newId(), order);
//		filled.setCell(i - left, j - top, true);
//		for (var count = 1; count < order; ++count) {
//			while (true) {
//				i = left + rInt(order);
//				j = top + rInt(order);
//				var b = board.getCell(i, j);
//				if (b.occupied)continue;
//
//				var u = filled.getCell(i - left, j - top - 1);
//				var d = filled.getCell(i - left, j - top + 1);
//				var l = filled.getCell(i - left - 1, j - top);
//				var r = filled.getCell(i - left + 1, j - top);
//				if (!(u || d || l || r))continue;
//				b.quickSet(true, c.id, order);
//				filled.setCell(i - left, j - top, true);
//				break;
//			}
//		}



//function spawnBiasedRandomPoly(filled, order, left, top) {
//	var spawnGrid = matrix(order, order, false);
//
//	var shapeIdx = 0;
//	var r = Math.random();
//
//  if (DEBUG_LOG_SHAPE_PROBABILITIES) {
//    console.log("\ngeneration.spawnBiasedRandomPoly(order="+order+", left="+left+", top="+top+")");
//    console.log("	==> random number[0->1)=" + r);
//  }
//
//	var sumSquare = 0;
//	for(var i=0; i<SHAPE[order].length; i++) {
//		//console.log("gamePolyominoTotal["+order+"]="+gamePolyominoTotal[order] +
//		//"gameFreeShapeCount["+order+"]["+i+"]="+gameFreeShapeCount[order][i]);
//		var diff = 1 + (gamePolyominoTotal[order] - gameFreeShapeCount[order][i]);
//		sumSquare += diff*diff;
//	}
//
//
//	var cumulativeSum = 0;
//	for(var i=0; i<SHAPE[order].length; i++) {
//		var diff = 1 + (gamePolyominoTotal[order] - gameFreeShapeCount[order][i]);
//
//		cumulativeSum += (diff * diff)/sumSquare;
//    if (DEBUG_LOG_SHAPE_PROBABILITIES) {
//      console.log("	==> sumSquare=" + sumSquare + ", diff=" + diff + ", cumulativeSum=" + cumulativeSum);
//    }
//		if (r < cumulativeSum) {
//			shapeIdx = i;
//			break;
//		}
//	}
//
//	gameFreeShapeCount[order][shapeIdx]++;
//	gamePolyominoTotal[order]++;
//
//	setBaseShape(spawnGrid, order, SHAPE[order][shapeIdx]);
//	spawnGrid = gridRotateRandom(spawnGrid, order);
//	spawnGrid = gridFlipRandom(spawnGrid, order);
//	spawnGrid = gridTranslateRandom(spawnGrid, order);
//
//
//
//  copyMatrixToFilled(spawnGrid, filled, order, left, top);
//
//}



function copyMatrixToBoard(myMatrix, order, scheduleAnimation) {

  var blockCount = 0;
  var id = newId();
  console.log("copyMatrixToBoard(order="+order+", id="+id);
  var entryX = 0;
  var entryY = 0;
  for (var x = 0; x < gridSize; x++) {
    for (var y = 0; y < gridSize; y++) {

      if (myMatrix[x][y]) {

        //console.log("  x="+x+", y="+ y);
        var myCell = board.getCell(x, y);
        myCell.quickSet(true, id, order);


        if (scheduleAnimation) {
          blockCount++;
          if (blockCount === 1) {
//            quickSetEvt(myCell, true, id, order, keyframe(1));
//		        fadeOutEvt(entryX,entryY,keyframe(1),keyframe(2));
//		        unlockEvt(myCell,keyframe(2));
//		        saveGameEvt(keyframe(3));
//            entryX = myCell.x;
//            entryY = myCell.y;
          }
          else {
//            quickSetEvt(myCell, true, id, order, keyframe(1));
//            highlightEvt(entryX, entryY, keyframe(1), keyframe(2));
//            fadeOutEvt(entryX, entryY, keyframe(2), keyframe(3));
//            unlockEvt(myCell, keyframe(3));
//            saveGameEvt(keyframe(3));
          }
        }
      }
    }
  }
}

//	if(dominoGenerated){

//	}else{
//		quickSetEvt(c,true,id,1,keyframe(1));
//		fadeOutEvt(entry.x,entry.y,keyframe(1),keyframe(2));
//		unlockEvt(c,keyframe(2));
//		saveGameEvt(keyframe(3));

function copyBoardToMatrix(myMatrix, left, top, size, onlyBlockId) {

  //console.log("    copyBoardToMatrix: left="+left+", top="+top+", size="+size+", onlyBlockId="+onlyBlockId);
  for (var x = left; x < left+size; x++) {
    for (var y = top; y < top+size; y++) {
      var myCell = board.getCell(x, y);
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
}

