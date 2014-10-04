//=======================================================================================
/*
      ___           ___                         ___                       ___
     /\  \         /\  \                       /\  \                     /|  |
    |::\  \       /::\  \         ___         /::\  \       ___         |:|  |
    |:|:\  \     /:/\:\  \       /\__\       /:/\:\__\     /\__\        |:|  |
  __|:|\:\  \   /:/ /::\  \     /:/  /      /:/ /:/  /    /:/__/      __|:|__|
 /::::|_\:\__\ /:/_/:/\:\__\   /:/__/      /:/_/:/__/___ /::\  \     /::::\__\_____
 \:\~~\  \/__/ \:\/:/  \/__/  /::\  \      \:\/:::::/  / \/\:\  \__  ~~~~\::::/___/
  \:\  \        \::/__/      /:/\:\  \      \::/~~/~~~~   ~~\:\/\__\     |:|~~|
   \:\  \        \:\  \      \/__\:\  \      \:\~~\          \::/  /     |:|  |
    \:\__\        \:\__\          \:\__\      \:\__\         /:/  /      |:|__|
     \/__/         \/__/           \/__/       \/__/         \/__/       |/__/
 */
//=======================================================================================




//=======================================================================================
function matrix(rows, columns, defaultValue){
//=======================================================================================
  var arr = new Array(rows);
  for (var i=0; i<rows; i++) {
    arr[i] = new Array(columns);
    for (var j=0; j<columns; j++) {
      arr[i][j] = defaultValue;
    }
  }
  return arr;
}


//=======================================================================================
function matrixToString(myMatrix){
//=======================================================================================
  var str = "[";
  for (var y=0; y<myMatrix.length; y++) {
    str += "[";
    for (var x=0; x<myMatrix[y].length; x++) {
      str += myMatrix[x][y] + " ";
    }
    str += "]";
  }
  str += "]";
  return str;
}

//=======================================================================================
function matrixCopy(srcMatrix){
//=======================================================================================
  var arr = new Array(srcMatrix.length);
  for (var i=0; i<srcMatrix.length; i++) {
    arr[i] = new Array(srcMatrix[i].length);
    for (var j=0; j<srcMatrix[i].length; j++) {
      arr[i][j] = srcMatrix[i][j];
    }
  }
  return arr;
}






//=======================================================================================
function matrixSet(myMatrix, value) {
//=======================================================================================
  for (var i = 0; i < myMatrix.length; i++) {
    for (var j = 0; j < myMatrix[i].length; j++) {
      myMatrix[i][j] = value;
    }
  }
}


//=======================================================================================
function matrixReplace(myMatrix, oldValue, newValue) {
//=======================================================================================
  var replaceCount = 0;
  for (var i = 0; i < myMatrix.length; i++) {
    for (var j = 0; j < myMatrix[i].length; j++) {
      if (myMatrix[i][j] === oldValue) {
        myMatrix[i][j] = newValue;
        replaceCount++
      }
    }
  }
  return replaceCount;
}


//=======================================================================================
function matrixRecursiveFillOfConnectedCells(myMatrix, x, y, searchValue, replaceValue) {
//=======================================================================================
  if (myMatrix[x][y] != searchValue) return;

  myMatrix[x][y] = replaceValue;

  for (var dir = 0; dir < DIRECTION.length; dir++) {

    var xx = x + DIRECTION[dir].deltaX;
    var yy = y + DIRECTION[dir].deltaY;

    if ((xx < 0) || (yy < 0) || (xx >= myMatrix.length) || (yy >= myMatrix.length)) continue;
    matrixRecursiveFillOfConnectedCells(myMatrix, xx, yy, searchValue, replaceValue);
  }
}




//=======================================================================================
function matrixGetRandomCoordinateWithGivenValue(myMatrix, value) {
//=======================================================================================
  var x = rInt(myMatrix.length);
  var y = rInt(myMatrix[0].length);

  for (var i = 0; i < myMatrix.length; i++) {
    for (var j = 0; j < myMatrix[i].length; j++) {
      if (myMatrix[x][y] === value) return {x:x,y:y};
      x++;
      //Javascript is very slow at modulus, so do (x + 1) % length the dumb way:
      if (x >= myMatrix.length) {
        x = 0;
        y++;
        if (y >= myMatrix[i].length) y = 0;
      }
    }
  }
  return undefined;
}



//=======================================================================================
function countNeighbor4WithID(myMatrix, x, y, id) {
//=======================================================================================
  var neighbor4Count = 0;
  for (var dir = 0; dir < DIRECTION.length; dir++) {

    var xx = x + DIRECTION[dir].deltaX;
    var yy = y + DIRECTION[dir].deltaY;

    if ((xx < 0) || (yy < 0) || (xx >= myMatrix.length) || (yy >= myMatrix.length)) continue;

    if (myMatrix[xx][yy] === id) neighbor4Count++;
  }
  return neighbor4Count;
}