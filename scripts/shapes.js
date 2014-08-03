
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

var POLYONIMO_NAME = new Array(DEDECOMINO + 1);
    POLYONIMO_NAME[MONOMINO]   = "Monomino";
    POLYONIMO_NAME[DOMINO]     = "Domino";
    POLYONIMO_NAME[TROMINO]    = "Tromino";
    POLYONIMO_NAME[TETROMINO]  = "Tetromino";
    POLYONIMO_NAME[PENTOMINO]  = "Pentomino";
    POLYONIMO_NAME[HEXOMINO]   = "Hexomino";
    POLYONIMO_NAME[HEPTOMINO]  = "Heptomino";
    POLYONIMO_NAME[OCTOMINO]   = "Octomino";
    POLYONIMO_NAME[NONOMINO]   = "Nonomino";
    POLYONIMO_NAME[DECOMINO]   = "Decomino";
    POLYONIMO_NAME[DEDECOMINO] = "Dedecomino";

var MAX_ORDER = OCTOMINO;
var MAX_ORDER_OF_SHAPE_IDENTIFICATION = TROMINO;
var SHAPE = new Array(MAX_ORDER_OF_SHAPE_IDENTIFICATION + 1);
var gamePolyominoCount = new Array(MAX_ORDER + 1);
var gameShapeCount = new Array(MAX_ORDER_OF_SHAPE_IDENTIFICATION + 1);
var SHAPE_ROTATION_MASK = [1, 2, 4, 8];


function initShapes() {

	// console.log("initShapes()");
	// Each SHAPE[order] is the list of nonflip polyominos of that order.
	// Each SHAPE[order][shapeNum] defines a row of the shape.
	// Each SHAPE[order][shapeNum][row][col] defines a cell in the shape.
	//    The values of the cell are bit flags: 1|2|4|8 for each of the 4 possible rotations of that shape.

  SHAPE[MONOMINO] = [[[1]]];

  SHAPE[DOMINO] = [[[3,1], [2,0]]];

	SHAPE[TROMINO]   = [[[ 3,3,3], [ 1, 0,0], [1,0,0]],
                      [[11,7,0], [13,14,0], [0,0,0]]];




//  SHAPE[TETROMINO] = [[1,1,1,1],[1,1,3],[1,3,2],[3,3],[1,3,1]];
//
//	SHAPE[PENTOMINO] = [
//		[1,1,1,1,1], [6,3,2], [1,1,1,3], [3,3,1],
//		[1,1,3,2],   [7,2,2], [7,5],     [1,1,7],
//		[3,6,4],     [2,7,2], [1,3,1,1], [3,2,6]
//	];
//
//	SHAPE[HEXOMINO] = [
//		[1,1,1,1,1,1], [3,1,1,1,1], [1,3,1,1,1], [1,1,3,1,1], [2,3,1,1,1],
//		[3,3,1,1],     [3,1,3,1],   [3,1,1,3],   [1,3,3,1],   [7,1,1,1],
//		[1,7,1,1],     [7,2,2,2],   [6,3,2,2],   [6,2,3,2],   [6,2,2,3],
//		[2,6,3,2],     [2,7,2,2],   [2,7,1,1],   [2,3,1,3],   [2,2,3,1,1],
//		[2,3,3,1],     [3,3,3],     [4,7,2,2],   [7,6,2],     [4,6,3,2],
//		[4,7,1,1],     [6,3,1,1],   [7,5,1],     [5,7,1],     [5,7,2],
//		[6,2,3,1],     [1,3,7],     [2,7,3],     [4,7,3],     [4,6,3,1]
//	];

	//== POLYOMINO GAME COUNTS
	for (var order = MONOMINO; order <= MAX_ORDER; order++) {
		gamePolyominoCount[order] = 0;
    if (order > MAX_ORDER_OF_SHAPE_IDENTIFICATION) break;

    //console.log("shapes.initShapes():	order="+order);
		gameShapeCount[order] = new Array(SHAPE[order].length);
		for (var shapeNum = 0; shapeNum <SHAPE[order].length; shapeNum++) {
			gameShapeCount[order][shapeNum] = 0;
		}
	}
}



//=======================================================================================
function identifyShape(myMatrix, order, id) {
//=======================================================================================
  if (order < 2) return;
  if (order === 2) {
    gamePolyominoCount[DOMINO]++;
    return;
  }


  if (order > TROMINO) return;

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


  for (var shape = 0; shape < SHAPE[order].length; shape++) {

    for (var orientation = 0; orientation < SHAPE_ROTATION_MASK.length; orientation++) {
      var mask = SHAPE_ROTATION_MASK[orientation];

      if (doesShapeFitMask(myMatrix, id, order, shape, mask, minX, minY)) {
        gamePolyominoCount[order]++;
        gameShapeCount[order][shape]++;
        console.log("shapes.identifyShape():	gamePolyominoCount[" + order + "][" + shape + "]=" + gameShapeCount[order][shape]);
        return;
      }
    }
  }
  console.log("shapes.identifyShape("+order+"):	***ERROR*** failed to identify shape");
}





//=======================================================================================
 function doesShapeFitMask(myMatrix, id, order, shapeNum, mask, minX, minY) {
//=======================================================================================
   //console.log("shapes.doesShapeFitMask(order="+order+", shapeNum="+shapeNum+", mask="+mask+", minX="+minX+", minY="+minY);
   for (var x = 0; x < myMatrix.length; x++) {
     for (var y = 0; y < myMatrix[x].length; y++) {
       if (myMatrix[x][y] === id) {

         //console.log("     SHAPE["+order+"]["+shapeNum+"]["+(y - minY)+"]["+(x - minX)+"]="+SHAPE[order][shapeNum][y - minY][x - minX] +
         //  "  & " + mask + " = " +((SHAPE[order][shapeNum][y - minY][x - minX]) & mask));
         if (((SHAPE[order][shapeNum][y - minY][x - minX]) & mask) === 0) return false;
       }
     }
   }
   return true;
 }
