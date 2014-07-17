//==  RULES  =================================================================//

bypassLoadGame     = true;
detectHighestOrder = true;
orderDecay         = true;
allowRotations     = true;
newPolyOnMerge     = true;
paneThickness      = 2;
gridSize           = 10;
largeGridSize      = gridSize;
smallGridSize      = gridSize;
cellSize           = 32; //may vary during runtime as the application SHOULD size grid cells according to window size.
initPieceCount     = 4;
dragSpeed          = 0.3;
hoverOffset        = 8;
keyframeSpeed      = 150;
goalOrder          = 6;  //for now, trying 6/5 with gridsize = 10/8, respectively
cellSizeThreshold  = 50; //may need tweaking

//==  POLYOMINO COLORS  ======================================================//

var polyColor = [
	{primary:{r:0.00000,g:0.00000,b:0.00000},secondary:{r:0.0000,g:0.0000,b:0.0000}}, // never used
	{primary:{r:0.38157,g:0.38430,b:0.33487},secondary:{r:0.5451,g:0.5490,b:0.4784}}, // monomino
	{primary:{r:0.23884,g:0.40075,b:0.18669},secondary:{r:0.4235,g:0.7020,b:0.3294}}, // domino
	{primary:{r:0.48859,g:0.52157,b:0.16197},secondary:{r:0.6980,g:0.7451,b:0.2314}}, // tromino
	{primary:{r:0.29410,g:0.41180,b:0.51370},secondary:{r:0.4549,g:0.6392,b:0.8000}}, // tetromino
	{primary:{r:0.46668,g:0.00000,b:0.00000},secondary:{r:0.6667,g:0.0000,b:0.0000}}, // pentomino
	{primary:{r:0.42350,g:0.32940,b:0.54900},secondary:{r:0.7115,g:0.5434,b:0.9188}}, // hexomino
	{primary:{r:0.64784,g:0.24157,b:0.00000},secondary:{r:0.9255,g:0.3451,b:0.0000}}, // heptomino
	{primary:{r:0.57372,g:0.40628,b:0.03297},secondary:{r:0.8196,g:0.5804,b:0.0471}}, // octomino
];

//==  GLOBAL VARS  ===========================================================//

var blockId,score;
var board,floating,transfer,transferId;
var mouse,dragging,snapping,mouseDX,mouseDY,downGX,downGY,mouseGX,mouseGY,placeX,placeY;
var goalFloatX,goalFloatY,floatX,floatY,hover,goalRot,rot;
var currentlyAnimating,triggerDetectSquares,spawnNewPoly,polyMoved;

var gameWon = false; // so that we don't continually trigger the game won screen if they keep building big polyominos
var highScore = 0;

var blockIdOfLastBlockPlaced;

//==  CANVAS VARS  ===========================================================//

var canvas = null;
var gfx = null;
var tick,elapsed;
var canvasWidth, canvasHeight;

//==  DEBUG OPTIONS  =========================================================//

var DEBUG_LOG_SHAPE_PROBABILITIES = false
