//==  RULES  =================================================================//

doRecalculateOrder    = true;
upgradeHighestOrder   = true;
gridSize              = 8;
cs                    = 32; // cell size

//==  CONSTANTS  =============================================================//

var UP    = 0;
var DOWN  = 1;
var LEFT  = 2;
var RIGHT = 3;

var IN      = 0;
var OUT     = 1;
var OUTFADE = 2;

var goldenAngle = 0.381966;

//==  GLOBAL VARS  ===========================================================//

var board,floating,active,anim;
var blockId,score;
var mouse,dragging,snapping,mouseDX,mouseDY,downGX,downGY,mouseGX,mouseGY;
var goalFloatX,goalFloatY,floatX,floatY;

//==  CANVAS VARS  ===========================================================//

var canvas = document.getElementById("canvas");
var gfx = canvas.getContext("2d");
var tick,elapsed;
var ww,wh;
