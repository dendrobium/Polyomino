//=======================================================================================
function spawnLevel() {
  var r = Math.random();

  if (!(gameLevel) || gameLevel < 2 || Math.random() < (0.5/gameLevel)) {
    if (r < 0.4) delay = level_1a();
    else if (r < 0.8) level_1b();
    else if (r < 0.9) level_1c();
    else level_1d();
  }

  else if (gameLevel === 2 || Math.random() < (1.0/gameLevel)) {
    if (r < 0.6) level_2a();
    else if (r < 0.8) level_2b();
    else level_2c();
  }

  else if (gameLevel === 3 || Math.random() < (1.0/gameLevel)) level_3();
  else level_4();

  currentlyAnimating = true;

}



//=======================================================================================
function level_1a() {
//=======================================================================================
  //console.log("level.level_1a()");

  var delay = 0;
  var spawnGrid = matrix(gridSize, gridSize, CELL_EMPTY);


  var domX = [[2, 3], [4,4], [3,4], [0,1], [1,2], [0,0], [2,2]];
  var domY = [[0, 0], [0,1], [2,2], [1,1], [3,3], [2,3], [1,2]];

  var dx = rInt(4);
  var dy = rInt(5);
  for (var i = 0; i < domX.length; i++) {
      domX[i][0] += dx;  domX[i][1] += dx;
      domY[i][0] += dy;  domY[i][1] += dy;
  }


  for (var i = 0; i < domX.length; i++) {
    makeBlock(spawnGrid, 2, true, domX[i], domY[i]);
  }

  var x, y;
  for (x = 0; x < gridSize; x++) {
    delay++;
    y = x;
    for (var n=0; n<3; n++) {

      y = (y + 3) % gridSize;
      if (spawnGrid[x][y] != CELL_EMPTY) continue;

      spawnStartingBlock(spawnGrid, 1, false, delay, x, y);
    }
  }


  var numFreeDominos = 16;
  var count = 0;
  while (count < numFreeDominos)
  {
    x = rInt(gridSize);
    y = rInt(gridSize);
    if (spawnGrid[x][y] != CELL_EMPTY) continue;

    var id = spawnStartingBlock(spawnGrid, 2, false, ++delay, x, y);
    if (id) count++;
  }
}




//=======================================================================================
function level_1b() {
//=======================================================================================
  //console.log("level.level_1b()");

  var delay = 0;
  var spawnGrid = matrix(gridSize, gridSize, CELL_EMPTY);

  var x=0;  var y=0; var x2= 0;
  for (var i = 0; i < 16; i++) {
    spawnStartingBlock(spawnGrid, 1, false, delay, x, y);
    var x2 = (x + 1) % gridSize;
    spawnStartingBlock(spawnGrid, 2, false, delay, x2, y);
    delay++;
    x = x + 5;
    if (x >= gridSize) {
      x = x + 2 - gridSize;
      if (x > 4) x = x - 5;
      y++;

    }
  }

  var count = 0;
  while (count < 9)
  {
    x = rInt(gridSize);
    y = rInt(gridSize);
    if (spawnGrid[x][y] != CELL_EMPTY) continue;
    var id = spawnStartingBlock(spawnGrid, 2, true, delay, x, y);
    if (id) count++;
  }
}



//=======================================================================================
function level_1c() {
//=======================================================================================
  //console.log("level.level_1()c");
  var delay = 0;

  var spawnGrid = matrix(gridSize, gridSize, CELL_EMPTY);

  var monoX = [0, 0, 1, 7, 8, 8,    4, 4, 4, 4, 4, 4, 4];
  var monoY = [7, 8, 8, 8, 8, 7,    0, 1, 2, 3, 6, 7, 8];

  for (var i = 0; i < monoX.length; i++) {
    spawnStartingBlock(spawnGrid, 1, false, delay, monoX[i], monoY[i]);
  }

  var domX = [[0, 1],[2, 3],[5, 6],[7, 8],  [0, 1],[2, 3],[5, 6],[7, 8],  [0, 0],[3, 3],[5, 5],[8, 8],  [0, 1],[1, 2],[2, 3],  [8, 7],[7, 6],[6, 5],  [3, 3],[4, 4],[5, 5]];
  var domY = [[0, 0],[0, 0],[0, 0],[0, 0],  [3, 3],[3, 3],[3, 3],[3, 3],  [1, 2],[1, 2],[1, 2],[1, 2],  [6, 6],[7, 7],[8, 8],  [6, 6],[7, 7],[8, 8],  [5, 6],[4, 5],[5, 6]];

  for (var i = 0; i < domX.length; i++) {
    makeBlock(spawnGrid, 2, true, domX[i], domY[i]);
  }
}



//=======================================================================================
function level_1d() {
//=======================================================================================
  //console.log("level.level_1()c");
  var delay = 0;

  var spawnGrid = matrix(gridSize, gridSize, CELL_EMPTY);

  var monoX = [2, 6,  4,4,4,4,  3,5,  0,2,6,8,1,7,    0,1,7,8,   3,4,5];
  var monoY = [1, 1,  0,1,2,3,  5,5,  8,8,8,8,7,7,    4,4,4,4,   7,7,7];

  var locked = true;
  for (var i = 0; i < monoX.length; i++) {
    if (i>17) locked = false;
    spawnStartingBlock(spawnGrid, 1, locked, delay++, monoX[i], monoY[i]);
  }


  var domX = [[3,3],[5,5],[3,3],[5,5],  [1,2],[6,7],    [0,1],[0,1],[7,8],[7,8], [2,3],[5,6],[2,2],[6,6]];
  var domY = [[0,1],[0,1],[2,3],[2,3],  [2,2],[2,2],    [3,3],[5,5],[3,3],[5,5], [4,4],[4,4],[5,6],[5,6]];

  for (var i = 0; i < domX.length; i++) {
    makeBlock(spawnGrid, 2, true, domX[i], domY[i]);
  }
}


//=======================================================================================
function level_2a() {
//=======================================================================================
    //console.log("level.level_2()");
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
}


//=======================================================================================
  function level_2b() {
//=======================================================================================
    //console.log("level.level_1()");
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
  }


//=======================================================================================
function level_2c() {
//=======================================================================================
  //console.log("level.level_1()");
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
}



//=======================================================================================
function level_3() {
//=======================================================================================
  //console.log("level.level_3()");
  var delay = 0;

  var spawnGrid = matrix(gridSize,gridSize,CELL_EMPTY);

  var monoX = [3,4,5,3,5,3,4,5]
  var monoY = [3,3,3,4,4,5,5,5]

  for (var i=0; i<monoX.length; i++) {
    spawnStartingBlock(spawnGrid, 1, false, delay,  monoX[i],monoY[i]);
  }

  if ( Math.random() < 0.5) {
    var dir = 4 + rInt(4)
    var loc = getRandomCoordinatesInRegion(spawnGrid, dir);
    if (loc != null) spawnStartingBlock(spawnGrid, 4, true, ++delay, loc.x, loc.y);
    loc = getRandomCoordinatesInRegion(spawnGrid, dir);
    if (loc != null) spawnStartingBlock(spawnGrid, 3, true, ++delay, loc.x, loc.y);

    loc = getRandomCoordinatesInRegion(spawnGrid, dir - 4);
    if (loc != null) spawnStartingBlock(spawnGrid, 2, true, ++delay, loc.x, loc.y);
    loc = getRandomCoordinatesInRegion(spawnGrid, dir - 4);
    if (loc != null) spawnStartingBlock(spawnGrid, 2, true, ++delay, loc.x, loc.y);

    dir = dir + 1;
    if (dir > 7) dir = 4;
    loc = getRandomCoordinatesInRegion(spawnGrid, dir);
    if (loc != null) spawnStartingBlock(spawnGrid, 4, true, ++delay, loc.x, loc.y);
    loc = getRandomCoordinatesInRegion(spawnGrid, dir);
    if (loc != null) spawnStartingBlock(spawnGrid, 3, true, ++delay, loc.x, loc.y);
  }
  else {

    var x = rInt(2);
    var y = rInt(2);
    spawnStartingBlock(spawnGrid, 4, true, ++delay, x, y);

    x = rInt(2)+7;   y = rInt(2);
    spawnStartingBlock(spawnGrid, 4, true, ++delay, x, y);

    x = rInt(2);   y = rInt(2)+7;
    spawnStartingBlock(spawnGrid, 4, true, ++delay, x, y);

    x = rInt(2)+7;   y = rInt(2)+7;
    spawnStartingBlock(spawnGrid, 4, true, ++delay, x, y);
  }

  var singleBlockSpawnCount = 0;
  for (var i=0; i<10; i++) {
    if ((singleBlockSpawnCount < 4) || (Math.random() > 0.5)) {

      loc = getRandomCoordinatesNearEdge(spawnGrid);
      if (loc != null) {
        spawnStartingBlock(spawnGrid, 1, false, ++delay, loc.x, loc.y);
        singleBlockSpawnCount++;
      }
    }
  }
}

//=======================================================================================
function level_4() {
//=======================================================================================
  //console.log("level.level_1a()");

  var delay = 0;
  var spawnGrid = matrix(gridSize, gridSize, CELL_EMPTY);


  var x1, x2, x3, y1, y2, y3;

  var r = Math.random();
  x1 = rInt(gridSize);
  if (x1 < gridSize / 2) {
    x2 = x1 + 1;
    x3 = x1 + 2;
  }
  else {
    x2 = x1 - 1;
    x3 = x1 - 2;
  }

  if (r < 0.25) {
    y1 = y2 = y3 = 0;
  }
  else if (r < 0.5) {
    y1 = y2 = y3 = gridSize-1;
  }
  else {
    y1 = x1;
    y2 = x2;
    y3 = x3;
    if (r < 0.5) {
      x1 = x2 = x3 = 0;
    }
    else {
      x1 = x2 = x3 = gridSize-1;
    }
  }

  //console.log("level.level_4(): x=["+x1+", "+x2+", "+x3+"]  y=[" +y1+", "+y2+", "+y3+"]");

  var id = newId();
  spawnGrid[x1][y1] = id;
  spawnGrid[x2][y2] = id;
  addCellAlongPathDepthFirst(spawnGrid, id, x3, y3, 3);



  var animateGrid = matrixCopy(spawnGrid);
  animateSpawn(5, animateGrid, id, true, delay);

  var count=0;
  while (count < 10)
  {
    x = rInt(gridSize);
    y = rInt(gridSize);
    if (spawnGrid[x][y] != CELL_EMPTY) continue;

    var id = spawnStartingBlock(spawnGrid, 1, false, ++delay, x, y);
    if (id) count++;
  }
}

////=======================================================================================
//function level_4() {
////=======================================================================================
//  //console.log("level.level_1a()");
//
//  var delay = 0;
//  var spawnGrid = matrix(gridSize, gridSize, CELL_EMPTY);
//
//
//  var pentX, pentY;
//  var r = Math.random();
//  if (r < 0.25) {
//    pentX = [[0,0,1,1,1], [1,2,3,4,2], [0,0,0,1,2], [3,4,2,3,4],  [5,2,3,4,5]];
//    pentY = [[0,1,1,2,3], [0,0,0,0,1], [2,3,4,4,4], [1,1,2,2,2],  [2,3,3,3,3]];
//  }
//  else if (r < 0.5) {
//    pentX = [[0,1,2,3,3],[0,0,0,0,0],[1,1,1,1,2],[2,2,2,3,4],[3,4,4,4,5]];
//    pentY = [[0,0,0,0,1],[1,2,3,4,5],[1,2,3,4,4],[1,2,3,3,3],[2,2,1,0,0]];
//  }
//  else if (r < 0.75){
//    pentX = [[0,0,1,2,2], [0,1,1,1,2], [2,3,3,3,4], [5,6,6,7,7], [7,8,8,8,8]];
//    pentY = [[7,8,8,8,7], [6,6,7,5,5], [6,6,7,8,8], [8,8,7,7,6], [8,8,7,6,5]];
//  }
//  else {
//    pentX = [[5,6,6,7,8], [6,6,7,7,8], [7,7,8,8,8], [8,7,7,7,6], [8,8,8,7,6]];
//    pentY = [[0,0,1,0,0], [3,2,2,1,1], [3,4,2,3,4], [5,5,6,7,6], [6,7,8,8,8]];
//  }
//  var cementedOneBlock = false;
//  var cementThis = false;
//  for (var i = 0; i < pentX.length; i++) {
//    if (cementedOneBlock) cementThis = false;
//    else if ((Math.random() < 0.2) || (i >= (pentX.length -1))) {
//      cementThis = true;
//      cementedOneBlock = true;
//    }
//    makeBlock(spawnGrid, 5, cementThis, pentX[i], pentY[i]);
//  }
//
//  var count=0;
//  while (count < 10)
//  {
//    x = rInt(gridSize);
//    y = rInt(gridSize);
//    if (spawnGrid[x][y] != CELL_EMPTY) continue;
//
//    var id = spawnStartingBlock(spawnGrid, 1, false, ++delay, x, y);
//    if (id) count++;
//  }
//}








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