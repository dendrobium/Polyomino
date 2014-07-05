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
	"#000000", // Never used
	"#8B8C7A", // Stone  (monomino)
	"#8B4513", // Bark (domino)
	"#FFBD4F", // Orange (tromino)
	"#B2B14C", // Olive (tetromino)
	"#579244", // Moss (pentomino)
	"#708090", // Slate (hexomino)
	           // TODO: (heptomino)
	"#BE0028", // DarkRed (octomino)
	"#AD79AB", // Mauve(nonomino)
	"#9932CC", // Purple (decomino)
	"#E3A6EC", // Iilac (undecomino)
	"#CCCCCC", // Light Gray  (dodecomino)
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
