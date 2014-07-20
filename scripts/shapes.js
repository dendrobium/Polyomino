//Collection of predefined free polyoninos without holes

var MONOMINO = 1;
var DOMINO = 2;
var TROMINO = 3;
var TETROMINO = 4;
var PENTOMINO = 5;
var HEXOMINO = 6;
var HEPTOMINO = 7;
var OCTOMINO = 8;
var NONOMINO = 9;
var DECOMINO = 10;
var DEDECOMINO = 11;

//Useful for displaying player achievements
var POLYONIMO_NAME = new Array(DEDECOMINO + 1);
POLYONIMO_NAME[MONOMINO] = "Monomino";
POLYONIMO_NAME[DOMINO] = "Domino";
POLYONIMO_NAME[TROMINO] = "Tromino";
POLYONIMO_NAME[TETROMINO] = "Tetrominp";
POLYONIMO_NAME[PENTOMINO] = "Pentomino";
POLYONIMO_NAME[HEXOMINO] = "Hexomino";
POLYONIMO_NAME[HEPTOMINO] = "Heptomino";
POLYONIMO_NAME[OCTOMINO] = "Octomino";
POLYONIMO_NAME[NONOMINO] = "Nonomino";
POLYONIMO_NAME[DECOMINO] = "Decomino";
POLYONIMO_NAME[DEDECOMINO] = "Dedecomino";



var MAX_PREDEFINED_ORDER = HEXOMINO;
var SHAPE = new Array(MAX_PREDEFINED_ORDER + 1);
var gamePolyominoTotal = new Array(MAX_PREDEFINED_ORDER + 1);
var gameFreeShapeCount = new Array(MAX_PREDEFINED_ORDER + 1);

function initShapes() {

	//console.log("initShapes()");
	//Each list within SHAPE is the set of free polyoninos for that shape.
	//Each list within SHAPE[order] is a particular shape.
	//Each element of SHAPE[order][shapeNum] defines a row of the shape.
	//Within SHAPE[order][shapeNum][row], the columns are bit flags: 1|2|4|8|16|32|64
	//Thus, SHAPE[order][shapeNum][row] === 11 defines a row with blocks: XX X
	SHAPE[MONOMINO] = [[1]];
	SHAPE[DOMINO] = [[1,1]];
	SHAPE[TROMINO] = [[1,1,1], [1,3]];
	SHAPE[TETROMINO] = [[1,1,1,1],[1,1,3],[1,3,2],[3,3],[1,3,1]];

	SHAPE[PENTOMINO] = [
		[1,1,1,1,1],  [6,3,2],    [1,1,1,3],   [3,3,1],
		[1,1,3,2],    [7,2,2],    [7,5],       [1,1,7],
		[3,6,4],      [2,7,2],    [1,3,1,1],   [3,2,6]
	];

  SHAPE[HEXOMINO] = [
    [1,1,1,1,1,1], [3,1,1,1,1],  [1,3,1,1,1],  [1,1,3,1,1],  [2,3,1,1,1],
    [3,3,1,1],     [3,1,3,1],    [3,1,1,3],    [1,3,3,1],    [7,1,1,1],
    [1,7,1,1],     [7,2,2,2],    [6,3,2,2],    [6,2,3,2],    [6,2,2,3],
    [2,6,3,2],     [2,7,2,2],    [2,7,1,1],    [2,3,1,3],    [2,2,3,1,1],
    [2,3,3,1],     [3,3,3],      [4,7,2,2],    [7,6,2],      [4,6,3,2],
    [4,7,1,1],     [6,3,1,1],    [7,5,1],      [5,7,1],      [5,7,2],
    [6,2,3,1],     [1,3,7],      [2,7,3],      [4,7,3],      [4,6,3,1]
  ];

	//== POLYOMINO GAME COUNTS
	for (var order = MONOMINO; order <= MAX_PREDEFINED_ORDER; order++) {
		gamePolyominoTotal[order] = 0;
		gameFreeShapeCount[order] = new Array(SHAPE[order].length);
		for (var shapeNum = 0; shapeNum <SHAPE[order].length; shapeNum++) {
			//console.log("initShapes():		gameFreeShapeCount["+order+"]["+shapeNum+"]=0");
			gameFreeShapeCount[order][shapeNum] = 0;
		}
  }
}
