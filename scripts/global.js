//==  RULES  =================================================================//

bypassLoadGame     = false;
detectHighestOrder = true;
orderDecay         = true;
paneThickness      = 2;
gridSize           = 10;
var cellSize; //any value set here is overwritten in render.js, so do not set it here - it gives the false idea that changing it here will have an effect.
initPieceCount     = 4;
dragSpeed          = 0.3;
hoverOffset        = 4;
keyframeSpeed      = 150;
goalOrder          = 6;  //for now, trying 6/5 with gridsize = 10/8, respectively
cellSizeThreshold  = 50; //may need tweaking

//==  POLYOMINO COLORS  ======================================================//

var polyColor = [
	{primary:{r:0.0000,g:0.0000,b:0.0000},secondary:{r:0.00000,g:0.00000,b:0.00000}}, // never used
	{primary:{r:0.5451,g:0.5490,b:0.4784},secondary:{r:0.38157,g:0.38430,b:0.33487}}, // monomino
	{primary:{r:0.5451,g:0.2706,b:0.0745},secondary:{r:0.38157,g:0.18942,b:0.05214}}, // domino
	{primary:{r:0.9020,g:0.6667,b:0.2784},secondary:{r:0.63140,g:0.46668,b:0.19487}}, // tromino
	{primary:{r:0.6980,g:0.7451,b:0.2314},secondary:{r:0.48859,g:0.52157,b:0.16197}}, // tetromino
	{primary:{r:0.3412,g:0.5725,b:0.2667},secondary:{r:0.23884,g:0.40075,b:0.18669}}, // pentomino
	{primary:{r:0.2941,g:0.4118,b:0.5137},secondary:{r:0.20586,g:0.28825,b:0.35959}}, // hexomino
	{primary:{r:0.4510,g:0.2510,b:0.4431},secondary:{r:0.31570,g:0.17570,b:0.31017}}, // heptomino
	{primary:{r:0.7569,g:0.4000,b:0.3529},secondary:{r:0.52983,g:0.27999,b:0.24702}}, // octomino
	{primary:{r:0.9255,g:0.3451,b:0.0000},secondary:{r:0.64784,g:0.24157,b:0.00000}}, // nonomino
	{primary:{r:0.8196,g:0.5804,b:0.0471},secondary:{r:0.57372,g:0.40628,b:0.03297}}, // decomino
	{primary:{r:0.6667,g:0.0000,b:0.0000},secondary:{r:0.46668,g:0.00000,b:0.00000}}, // undecomino
	{primary:{r:0.7020,g:0.5686,b:0.4118},secondary:{r:0.49139,g:0.39802,b:0.28825}}  // dedecomino
];

var MAX_POLYOMINO_ORDER = polyColor.length - 1;

var MOUSE_LEFT_BUTTON = 1;
var MOUSE_RIGHT_BUTTON = 2;



//==  GLOBAL VARS  ===========================================================//

var boardMain, boardFloating;
var blockId; //TODO: Why is blockId a global variable? if it has some special meaning
             // such as the blockId of the corrently floating block, then name it in a way that
             // this is clear (i.e. floatingBlockId). If it is realy a local variable, then declare it locally.
var score;
var mouse,dragging,snapping,mouseDX,mouseDY,downGX,downGY,mouseGX,mouseGY;
var floatingBlockID = -1;

var goalFloatX,goalFloatY,floatX,floatY,placeX,placeY;

var currentlyAnimating;
var triggerDetectSquares;


var gameWon = false; // so that we don't continually trigger the game won screen if they keep building big polyominos
var highScore = 0;
var scoreTick = 0;  // XXX: this is unnecessary, see addScoreEvt definition
var scoreCombo = 0; // XXX: this is unnecessary, see addScoreEvt definition
var saveFlag = false;

//==  CANVAS VARS  ===========================================================//

var canvas = null;
var gfx = null;
var tick,elapsed;
var canvasWidth, canvasHeight;

//== DEBUG OPTIONS ===========================================================//
var DEBUG_LOG_SHAPE_PROBABILITIES = true;

