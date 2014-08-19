
/*============================================================================*\
		   _  ______  ______  _____  __  __  __________
		  / |/ / __ \/_  __/ /  _/ |/ / / / / / __/ __/
		 /    / /_/ / / /   _/ //    / / /_/ /\ \/ _/
		/_/|_/\____/ /_/   /___/_/|_/  \____/___/___/

\*============================================================================*/

// Collection of predefined free polyoninos without holes

var MONOMINO   = 1;
var DOMINO     = 2;
var TROMINO    = 3;
var TETROMINO  = 4;
var PENTOMINO  = 5;
var HEXOMINO   = 6;
var HEPTOMINO  = 7;
var OCTOMINO   = 8;
var NONOMINO   = 9;
var DECOMINO   = 10;
var DEDECOMINO = 11;

// Useful for displaying player achievements

var POLYOMINO_NAME = new Array(DEDECOMINO + 1);
    POLYOMINO_NAME[MONOMINO]   = "Monomino";
    POLYOMINO_NAME[DOMINO]     = "Domino";
    POLYOMINO_NAME[TROMINO]    = "Tromino";
    POLYOMINO_NAME[TETROMINO]  = "Tetromino";
    POLYOMINO_NAME[PENTOMINO]  = "Pentomino";
    POLYOMINO_NAME[HEXOMINO]   = "Hexomino";
    POLYOMINO_NAME[HEPTOMINO]  = "Heptomino";
    POLYOMINO_NAME[OCTOMINO]   = "Octomino";
    POLYOMINO_NAME[NONOMINO]   = "Nonomino";
    POLYOMINO_NAME[DECOMINO]   = "Decomino";
    POLYOMINO_NAME[DEDECOMINO] = "Dedecomino";

var MAX_ORDER = OCTOMINO;
var MAX_ORDER_OF_SHAPE_IDENTIFICATION = HEXOMINO;
var SHAPE = new Array(MAX_ORDER_OF_SHAPE_IDENTIFICATION + 1);
var gamePolyominoCount = new Array(MAX_ORDER + 1);
var gameShapeCount = new Array(MAX_ORDER_OF_SHAPE_IDENTIFICATION + 1);


//One-Sided Polyominos
// Each SHAPE[order] is the list of One-Sided polyominos of that order.
// Each SHAPE[order][shapeNum] defines the cells of that shape.
// Each SHAPE[order][shapeNum][col] defines a column in the cell as a .
//    set of bit flags for each row: 1|2|4|8|16 for each row.



SHAPE[MONOMINO] = [[1]];

SHAPE[DOMINO] = [[1,1]];

SHAPE[TROMINO] = [[1,1,1], [3,1]];

SHAPE[TETROMINO] = [[1,1,1,1],[1,1,3],[3,1,1],[1,3,2],[2,3,1],[3,3],[1,3,1]];

SHAPE[PENTOMINO] = [
	[1,1,1,1,1], [6,3,2],   [2,3,6],   [1,1,1,3], [3,1,1,1], [3,3,1], [1,3,3],
	[1,1,3,2],   [2,3,1,1], [7,2,2],   [7,5],     [1,1,7],
	[3,6,4],     [2,7,2],   [1,3,1,1], [1,1,3,1], [3,2,6], [6,2,3]
];

SHAPE[HEXOMINO] = [
	[1,1,1,1,1,1], [3,1,1,1,1], [1,1,1,1,3], [1,3,1,1,1], [1,1,1,3,1], [1,1,3,1,1], [3,1,1,3],
	[3,3,1,1],     [1,1,3,3],   [3,1,3,1],   [1,3,1,3],   [1,3,3,1],   [1,7,5],     [5,7,1],
  [7,1,1,1],     [1,1,1,7],   [1,7,1,1],   [1,1,7,1],   [6,3,2,2],   [2,2,3,6],   [2,7,2,2],
  [6,2,2,3],     [3,2,2,6],   [6,2,3,2],   [2,3,2,6],   [2,6,3,2],   [2,3,6,2],   [3,3,3],
  [2,7,1,1],     [1,1,7,2],   [2,3,1,3],   [3,1,3,2],   [2,2,3,1,1], [1,1,3,2,2], [5,7,2],
  [2,3,3,1],     [1,3,3,2],   [4,7,2,2],   [2,2,7,4],   [7,6,2],     [2,6,7],     [1,3,7],
  [4,6,3,2],     [2,3,6,4],   [4,7,1,1],   [1,1,7,4],   [6,3,1,1],   [1,1,3,6],
  [7,5,1],       [1,5,7],     [6,2,3,1],   [1,3,2,6],   [3,7,2],     [7,2,2,2],
  [4,6,3,1],     [1,3,6,4],   [2,3,1,1,1], [1,1,1,3,2], [3,7,4],     [4,7,3]
];


//== POLYOMINO GAME COUNTS
for (var order = MONOMINO; order <= MAX_ORDER; order++) {
  gamePolyominoCount[order] = 0;
  if (order > MAX_ORDER_OF_SHAPE_IDENTIFICATION) break;

  //console.log("Shape: Possible one-sided " + POLYOMINO_NAME[order] + " = " + getPossibleOneSidedCount(order));

  gameShapeCount[order] = new Array(SHAPE[order].length);
  for (var shapeNum = 0; shapeNum <SHAPE[order].length; shapeNum++) {
    gameShapeCount[order][shapeNum] = 0;
  }
}

//  var order = 6;
//  for (var n=0; n<SHAPE[order].length; n++) {
//    var myMatrix = getMatrixWithShape(order, n);
//
//    console.log("\n\n\n");
//    for (var y = 0; y < order; y++) {
//      var str = n+":"+y+"   ";
//      for (var x = 0; x < SHAPE[order][n].length; x++) {
//        if (myMatrix[x][y]) str += "#"; else str += " ";
//      }
//      console.log(str);
//    }
//  }



//=======================================================================================
function getPossibleOneSidedCount(order) {
//=======================================================================================
  if ((order < 1) || (order > HEXOMINO)) return 0;
  return SHAPE[order].length;
}


//=======================================================================================
function getMatrixWithShape(order, shapeIdx) {
//=======================================================================================
  if ((order < 1) || (order > HEXOMINO)) return undefined;
  if ((shapeIdx < 0) || (shapeIdx > SHAPE[order].length)) return undefined;

  var myGrid = matrix(order, order, false);
  for (var x = 0; x < order; x++) {
    var mask = 1;
    for (var y = 0; y < order; y++) {

      if (x >= SHAPE[order][shapeIdx].length) continue;
      if (((SHAPE[order][shapeIdx][x]) & mask) > 0) myGrid[x][y] = true;
      //console.log("     SHAPE x=" + x + " y=" + y +" mask="+mask);
      mask *= 2;
    }
  }
  return myGrid;
}



//=======================================================================================
function identifyShape(myMatrix, order, id) {
//=======================================================================================
  if (order < 2) return;
  if (order === 2) {
    gamePolyominoCount[DOMINO]++;
    gameShapeCount[DOMINO][0]++;
    return;
  }

  if (order > MAX_ORDER_OF_SHAPE_IDENTIFICATION) return;

  var minX = myMatrix.length-1;
  var minY = myMatrix.length-1;

  for (var x = 0; x < myMatrix.length; x++) {
      for (var y = 0; y < myMatrix[x].length; y++) {
      if (myMatrix[x][y] === id) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
      }
    }
  }

  var tmpGrid = matrix(order, order, false);
  for (var x = minX; x < order; x++) {
    for (var y = minY; y < order; y++) {
      if (myMatrix[x][y] === id) tmpGrid[x - minX][y - minY] = true;
    }
  }


  for (var shape = 0; shape < SHAPE[order].length; shape++) {

    for (var orientation = 0; orientation < 4; orientation++) {
      if (isShape(tmpGrid, id, order, shape)) {
        gamePolyominoCount[order]++;
        gameShapeCount[order][shape]++;
        console.log("shapes.identifyShape():	gamePolyominoCount[" + order + "][" + shape + "]=" + gameShapeCount[order][shape]);
        return;
      }
      rotate90(tmpGrid, order);
    }
  }
  console.log("shapes.identifyShape("+order+"):	***ERROR*** failed to identify shape");
}




//=======================================================================================
function isShape(myMatrix, id, order, shapeIdx) {
//=======================================================================================
  //console.log("shapes.isShape(order="+order+", shapeIdx="+shapeIdx);
  //console.log("  myMatrix="+matrixToString(myMatrix));

  for (var x = 0; x < order; x++) {
    var mask = 1;
    for (var y = 0; y < order; y++) {
      //console.log("     SHAPE x=" + x + " y=" + y);
      if (myMatrix[x][y]) {
       // console.log("     SHAPE[order="+order+"][shapeIdx="+shapeIdx+"][x="+x+"]="+SHAPE[order][shapeIdx][x] +
       //   "  & " + mask + " = " +((SHAPE[order][shapeIdx][x]) & mask));
        if (x >= SHAPE[order][shapeIdx].length) return false;
        if (((SHAPE[order][shapeIdx][x]) & mask) === 0) return false;
      }
      mask *= 2;
    }
  }
  return true;
}



//=======================================================================================
function rotate90(orgGrid, order) {
//=======================================================================================
  var tmpGrid = matrix(order, order, false);
  //console.log("  rotate90 A: orgGrid="+matrixToString(orgGrid));
  for (var x = 0; x < order; x++) {
    for (var y = 0; y < order; y++) {
      tmpGrid[(order - 1) - y][x] = orgGrid[x][y];
    }
  }


  //console.log("  rotate90 B: tmpGrid="+matrixToString(tmpGrid));

  var minX = order;
  var minY = order;

  for (var x = 0; x < order; x++) {
    for (var y = 0; y < order; y++) {
      if (tmpGrid[x][y]) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
      }
    }
  }

  //console.log("  rotate90 C: minX="+minX +", minY="+minY);
  for (var x = 0; x < order; x++) {
    for (var y = 0; y < order; y++) {
      if (((minX+x) >= order) || ((minY+y) >= order)) orgGrid[x][y] = false;
      else orgGrid[x][y] = tmpGrid[minX+x][minY+y];
    }
  }
  //console.log("  rotate90 D: orgGrid="+matrixToString(orgGrid));
}