//==  RULES  =================================================================//

detectHighestOrder = true;
orderDecay         = true;
paneThickness      = 4;
gridSize           = 8;
cellSize           = 32;
initPieceCount     = 4;
dragSpeed          = 0.3;
hoverOffset        = 4;
keyframeSpeed      = 150;

//==  POLYOMINO COLORS  ======================================================//

var polyColor = [
	{primary:{r:0.0000,g:0.0000,b:0.0000},secondary:{r:0.00000,g:0.00000,b:0.00000}}, // Never used
	{primary:{r:0.5451,g:0.5490,b:0.4784},secondary:{r:0.27255,g:0.27450,b:0.23920}}, // monomino
	{primary:{r:0.5451,g:0.2706,b:0.0745},secondary:{r:0.27255,g:0.13530,b:0.03725}}, // domino
	{primary:{r:0.9020,g:0.6667,b:0.2784},secondary:{r:0.45100,g:0.33335,b:0.13920}}, // tromino
	{primary:{r:0.6980,g:0.7451,b:0.2314},secondary:{r:0.34900,g:0.37255,b:0.11570}}, // tetromino
	{primary:{r:0.3412,g:0.5725,b:0.2667},secondary:{r:0.17060,g:0.28625,b:0.13335}}, // pentomino
	{primary:{r:0.2941,g:0.4118,b:0.5137},secondary:{r:0.14705,g:0.20590,b:0.25685}}, // hexomino
	{primary:{r:0.4510,g:0.2510,b:0.4431},secondary:{r:0.22550,g:0.12550,b:0.22155}}, // heptomino
	{primary:{r:0.7569,g:0.4000,b:0.3529},secondary:{r:0.37845,g:0.20000,b:0.17645}}, // octomino
	{primary:{r:0.9255,g:0.3451,b:0.0000},secondary:{r:0.46275,g:0.17255,b:0.00000}}, // nonomino
	{primary:{r:0.8196,g:0.5804,b:0.0471},secondary:{r:0.40980,g:0.29020,b:0.02355}}, // decomino
	{primary:{r:0.6667,g:0.0000,b:0.0000},secondary:{r:0.33335,g:0.00000,b:0.00000}}, // undecomino
	{primary:{r:0.7020,g:0.5686,b:0.4118},secondary:{r:0.35100,g:0.28430,b:0.20590}}, // dodecomino
];

// var goldenAngle = 0.381966;
// var hue = function(order){return(order*goldenAngle)%1;}
// hsv(hue(c.order),1,value);

//==  GLOBAL VARS  ===========================================================//

var board,floating;
var blockId,score;
var mouse,dragging,snapping,mouseDX,mouseDY,downGX,downGY,mouseGX,mouseGY;
var goalFloatX,goalFloatY,floatX,floatY,placeX,placeY;
var currentlyAnimating,triggerDetectSquares;

//==  CANVAS VARS  ===========================================================//

var canvas = document.getElementById("canvas");
var gfx = canvas.getContext("2d");
var tick,elapsed;
var ww,wh;
