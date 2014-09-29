//=======================================================================================
function level_1() {
//=======================================================================================
  console.log("level.level_1()");
  var delay = 0;

  var spawnGrid = matrix(gridSize,gridSize,CELL_EMPTY);

  var monoX = [0,0,0,0,8,8,8,8,1,3,5,7,1,3,5,7, 2,4,6,2,4,6,2,4,6];
  var monoY = [1,3,5,7,1,3,5,7,0,0,0,0,8,8,8,8, 2,2,2,4,4,4,6,6,6];

  for (var i=0; i<monoX.length; i++) {
    spawnStartingBlock(spawnGrid, 1, false, delay,  monoX[i],monoY[i]);
  }

  var count = 0;
  var x, y;
  while (count < 16)
  {
    //console.log("   " + count + ", x="+x+", y="+y);
    x = rInt(gridSize);
    y = rInt(gridSize);
    if (spawnGrid[x][y] != CELL_EMPTY) continue;

    var id = spawnStartingBlock(spawnGrid, 2, true, ++delay, x, y);
    if (id != null) {
      count++;

    }
  }
  currentlyAnimating = true;
}

//=======================================================================================
function level_2() {
//=======================================================================================
  var r = Math.random();
  if (r < 0.6) level_2a();
  else if (r < 0.8) level_2b();
  else level_2c();
}


//=======================================================================================
function level_2a() {
//=======================================================================================
    console.log("level.level_2()");
    var delay = 0;

    var spawnGrid = matrix(gridSize, gridSize, CELL_EMPTY);


    for (var dir = 0; dir < 8; dir++) {
      var loc = getRandomCoordinatesInRegion(spawnGrid, dir);
      if (loc != null) spawnStartingBlock(spawnGrid, 3, true, ++delay, loc.x, loc.y);

      loc = getRandomCoordinatesInRegion(spawnGrid, dir);
      if (loc != null) spawnStartingBlock(spawnGrid, 2, true, ++delay, loc.x, loc.y);
    }

    var monoCount = 6 + rInt(6)
    var count = 0;
    while (count < monoCount) {
      var x = rInt(gridSize);
      var y = rInt(gridSize);
      if (spawnGrid[x][y] != CELL_EMPTY) continue;
      spawnStartingBlock(spawnGrid, 1, false, ++delay, x, y);
      count++;
    }
    currentlyAnimating = true;
}


//=======================================================================================
  function level_2b() {
//=======================================================================================
    console.log("level.level_1()");
    var delay = 0;

    var spawnGrid = matrix(gridSize, gridSize, CELL_EMPTY);

    var triX = [[4, 4, 4], [4, 4, 4], [1, 2, 3], [5, 6, 7], [2, 3, 2], [5, 6, 6], [2, 3, 2], [5, 6, 6] ];
    var triY = [[0, 1, 2], [4, 5, 6], [3, 3, 3], [3, 3, 3], [1, 1, 2], [1, 1, 2], [4, 5, 5], [5, 5, 4] ];

    for (var i = 0; i < triX.length; i++) {
      makeBlock(spawnGrid, 3, true, triX[i], triY[i]);
    }

    var monoCount = 6 + rInt(6)
    var count = 0;
    while (count < monoCount) {
      var x = rInt(gridSize);
      var y = rInt(gridSize);
      if (spawnGrid[x][y] != CELL_EMPTY) continue;
      spawnStartingBlock(spawnGrid, 1, false, ++delay, x, y);
      count++;
    }
    currentlyAnimating = true;
  }


//=======================================================================================
function level_2c() {
//=======================================================================================
  console.log("level.level_1()");
  var delay = 0;

  var spawnGrid = matrix(gridSize, gridSize, CELL_EMPTY);

  var triX = [[3,4,5], [1,2,3],  [5,6,7],  [0,1,2], [6,7,8], [1,1,2], [6,7,7]];
  var triY = [[2,2,2], [4,4,4],  [4,4,4],  [6,6,6], [6,6,6], [1,2,1], [1,1,2]];

  var domX = [[4,4], [1,2], [6,7]];
  var domY = [[0,1], [5,5], [5,5]];

  for (var i = 0; i < triX.length; i++) {
    makeBlock(spawnGrid, 3, true, triX[i], triY[i]);
  }
  for (var i = 0; i < domX.length; i++) {
    makeBlock(spawnGrid, 2, true, domX[i],domY[i]);
  }


  var monoCount = 6 + rInt(6)
  var count = 0;
  while (count < monoCount) {
    var x = rInt(gridSize);
    var y = rInt(gridSize);
    if (spawnGrid[x][y] != CELL_EMPTY) continue;
    spawnStartingBlock(spawnGrid, 1, false, ++delay, x, y);
    count++;
  }
  currentlyAnimating = true;
}



//=======================================================================================
function level_3() {
//=======================================================================================
  console.log("level.level_3()");
  var delay = 0;

  var spawnGrid = matrix(gridSize,gridSize,CELL_EMPTY);

  var monoX = [3,4,5,3,5,3,4,5]
  var monoY = [3,3,3,4,4,5,5,5]

  for (var i=0; i<monoX.length; i++) {
    spawnStartingBlock(spawnGrid, 1, false, delay,  monoX[i],monoY[i]);
  }

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
function spawnStartingBlock(spawnGrid, order, cement, delay, x, y) {
//=======================================================================================
  var id = newId();

  var cellsNeeded = addCellAlongPathDepthFirst(spawnGrid, id, x, y, order);

  //If it was not possible to make the block, then clear all its parts from grid
  if (cellsNeeded > 0) {
    for (var x = 0; x < gridSize; x++) {
      for (var y = 0; y < gridSize; y++) {
        if (spawnGrid[x][y] === id) spawnGrid[x][y] = CELL_EMPTY;
      }
    }
    return null;
  }

  var animateGrid = matrixCopy(spawnGrid);
  animateSpawn(order, animateGrid, id, cement, delay);
  return id;

}

//=======================================================================================
function addCellAlongPathDepthFirst(spawnGrid, id, x, y, cellsNeeded) {
//=======================================================================================

  //console.log("   addCellAlongPathDepthFirst(x="+x+", y="+y+", cellsNeeded="+cellsNeeded+")");
  if (x < 0 || y < 0) return cellsNeeded;
  if (x >= gridSize || y >= gridSize) return cellsNeeded;

  if (spawnGrid[x][y] != CELL_EMPTY) return cellsNeeded;

  //console.log("      adding (x="+x+", y="+y+")");
  cellsNeeded--;
  spawnGrid[x][y] = id;
  if (cellsNeeded <=0) return 0;

  var dir = rInt(DIRECTION.length);

  for(var i=0; i<DIRECTION.length; i++) {

    var xx = x + DIRECTION[dir].deltaX;
    var yy = y + DIRECTION[dir].deltaY;
    cellsNeeded = addCellAlongPathDepthFirst(spawnGrid, id, xx, yy, cellsNeeded);

    if (cellsNeeded <= 0) return 0;

    dir++;
    if (dir >= DIRECTION.length) dir = 0;
  }
  return cellsNeeded;
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
function makeBlock(spawnGrid, order, cemented, listX, listY)
{
//=======================================================================================

  var id = newId();
  for (var i = 0; i < order; i++) {

    spawnGrid[listX[i]][listY[i]] = id;
    var myCell = board.getCell(listX[i], listY[i]);
    myCell.id = id;
    myCell.order = order;
    myCell.cemented = cemented;
    myCell.occupied = true;
    myCell.locked = false;
  }
}