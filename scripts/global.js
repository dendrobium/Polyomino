//==  RULES  =================================================================//

bypassLoadGame     = false;
detectHighestOrder = true;
orderDecay         = true;
allowRotations     = true;
newPolyOnMerge     = false;
paneThickness      = 2;
gridSize           = 9;
largeGridSize      = gridSize;
smallGridSize      = gridSize;
cellSize           = 32; // may vary during runtime as the application SHOULD size grid cells according to window size.
initPieceCount     = 4;
dragSpeed          = 0.3;
hoverOffset        = 8;
keyframeSpeed      = 100;
goalOrder          = 6;
selectionOpacity   = 0.25;
orderOfLastMerge   = 1;

//==  POLYOMINO COLORS  ======================================================//

var polyColor = [
	{primary:{r:0.00000, g:0.00000, b:0.00000}, secondary:{r:0.0000, g:0.0000, b:0.0000}}, // never used
	{primary:{r:0.38157, g:0.38430, b:0.33487}, secondary:{r:0.5451, g:0.5490, b:0.4784}}, // monomino
	{primary:{r:0.23884, g:0.40075, b:0.18669}, secondary:{r:0.4000, g:0.6706, b:0.3098}}, // domino
	{primary:{r:0.48859, g:0.52157, b:0.16197}, secondary:{r:0.6980, g:0.7451, b:0.2314}}, // tromino
	{primary:{r:0.29410, g:0.41180, b:0.51370}, secondary:{r:0.4549, g:0.6392, b:0.8000}}, // tetromino
	{primary:{r:0.46668, g:0.00000, b:0.00000}, secondary:{r:0.6667, g:0.0000, b:0.0000}}, // pentomino
	{primary:{r:0.42350, g:0.32940, b:0.54900}, secondary:{r:0.7115, g:0.5434, b:0.9188}}, // hexomino
	{primary:{r:0.64784, g:0.24157, b:0.00000}, secondary:{r:0.9255, g:0.3451, b:0.0000}}, // heptomino
	{primary:{r:0.57372, g:0.40628, b:0.03297}, secondary:{r:0.8196, g:0.5804, b:0.0471}}, // octomino
	{primary:{r:0.50980, g:0.21180, b:0.20000}, secondary:{r:0.8706, g:0.3608, b:0.3412}}, // nonomino
	{primary:{r:0.05490, g:0.61570, b:0.65100}, secondary:{r:0.0706, g:0.8157, b:0.8627}}  // decomino
];

//==  GLOBAL VARS  ===========================================================//

var blockId, score, goalScore;
var board, floating, selection, transfer, transferId;
var mouse, dragging, snapping, mouseDX, mouseDY, downGX, downGY, mouseGX, mouseGY, placeX, placeY;
var goalFloatX, goalFloatY, floatX, floatY, hover, goalRot, rot;
var currentlyAnimating, triggerDetectSquares, spawnNewPoly, polyMoved;
var blockIdOfLastBlockPlaced;
var comboActiveCtr, comboCtr, maxCombo, currentComboScore, maxComboScore;
var gameWon, gameLost;
var highScore = 0; //in case first time visitor
var timeStarted; //for fastest-game detection

//== GRID DIRECTION ==========================================================//

var NORTH = 0;
var EAST  = 1;
var SOUTH = 2;
var WEST  = 3;
var DIRECTION = new Array(4);
    DIRECTION[NORTH] = {deltaX: 0, deltaY:-1};
    DIRECTION[EAST]  = {deltaX: 1, deltaY: 0};
    DIRECTION[SOUTH] = {deltaX: 0, deltaY: 1};
    DIRECTION[WEST]  = {deltaX:-1, deltaY: 0};
var NORTHEAST = 4, SOUTHEAST = 5, SOUTHWEST = 6, NORTHWEST = 7;

//==  DEBUG VARS  ============================================================//

	/*+- DELETE on deployment version ------------------ DELETE -+*/

var DEBUG_LOG_SHAPE_PROBABILITIES = false;
var debugMode = false;
var debugMouseDown = false;
var debugNewId;
var debugPlace;

//==  CANVAS VARS  ===========================================================//

var canvas = null;
var gfx = null;
var tick, elapsed;
var canvasWidth, canvasHeight;
var minGridPixelSize = 500;
var gridOffsetX = 0;
var gridOffsetY = 0;
var gridPixelSize = 500;
var minCanvasSize = 300;
