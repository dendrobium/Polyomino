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
	{r:0.0000,g:0.0000,b:0.0000}, // Never used
	{r:0.5451,g:0.5490,b:0.4784}, // monomino
	{r:0.5451,g:0.2706,b:0.0745}, // domino
	{r:0.9020,g:0.6667,b:0.2784}, // tromino
	{r:0.6980,g:0.7451,b:0.2314}, // tetromino
	{r:0.3412,g:0.5725,b:0.2667}, // pentomino
	{r:0.2941,g:0.4118,b:0.5137}, // hexomino
	{r:0.4510,g:0.2510,b:0.4431}, // heptomino
	{r:0.7569,g:0.4000,b:0.3529}, // octomino
	{r:0.9255,g:0.3451,b:0.0000}, // nonomino
	{r:0.8196,g:0.5804,b:0.0471}, // decomino
	{r:0.6667,g:0.0000,b:0.0000}, // undecomino
	{r:0.7020,g:0.5686,b:0.4118}, // dodecomino
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
