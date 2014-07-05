function keyframe(x){return keyframeSpeed*x;}

var event = function(startTick,endTick,func,onEnd){
	this.startTick = tick+startTick;
	this.endTick = tick+endTick;
	this.func  = func;
	this.onEnd = onEnd;
	inactiveEvtLs.push(this);
}

var inactiveEvtLs = [];
var activeEvtLs = [];
function processInactiveEvents(){
	var migrateLs = inactiveEvtLs.filter(function(e){return e.startTick <= tick;});
	inactiveEvtLs = inactiveEvtLs.filter(function(e){return e.startTick > tick;});
	activeEvtLs = activeEvtLs.concat(migrateLs);
	if(activeEvtLs.length > 0)currentlyAnimating = true;
}

function processActiveEvents(){
	// execute all onEnd functions
	var endLs = activeEvtLs.filter(function(e){return e.endTick <= tick;});
	for(e in endLs)if(endLs[e].onEnd)endLs[e].onEnd();

	// remove all expired events
	activeEvtLs = activeEvtLs.filter(function(e){return e.endTick > tick;});

	// process events
	for(evt in activeEvtLs){
		var e = activeEvtLs[evt];
		if(!e.func)continue;
		e.func((tick-e.startTick)/(e.endTick-e.startTick));
	}
}

//==  EVENT TYPES  ===========================================================//

function orderChangeEvt(cell,oldOrder,newOrder,startTick,endTick){
	cell.locked = true;
	new event(startTick,endTick,function(interp){
		cell.order = (newOrder-oldOrder)*interp+oldOrder;
		// TODO: do rgb interpolation, not hsv
	},function(){cell.order = newOrder;});
}

function unlockEvt(cell,unlockTick){
	cell.locked = true;
	new event(unlockTick,unlockTick,null,function(){
		cell.locked = false;
		triggerDetectSquares = true;
	});
}

function quickSetEvt(cell,occupied,id,order,setTick){
	cell.locked = true;
	new event(setTick,setTick,null,function(){
		cell.quickSet(occupied,id,order);
	});
}

//============================================================================//

// TODO: what about adjacent surrounds?
function beginSurroundEvt(x,y,order,startTick,endTick){
	new event(startTick,endTick,function(interp){
		var len = interp*interp*interp*order*cellSize+6;
		rgb(1,1,1);
		renderRect(x*cellSize-3,(y+order)*cellSize+3-len,x*cellSize-1,(y+order)*cellSize+3);
		renderRect(x*cellSize-3,y*cellSize-3,x*cellSize-3+len,y*cellSize-1);
		renderRect((x+order)*cellSize+3,y*cellSize-3,(x+order)*cellSize+1,y*cellSize-3+len);
		renderRect((x+order)*cellSize+3-len,(y+order)*cellSize+3,(x+order)*cellSize+3,(y+order)*cellSize+1);
	},null);
}

function surroundEvt(x,y,order,startTick,endTick){
	new event(startTick,endTick,function(interp){
		rgb(1,1,1);
		renderRect(x*cellSize-3,y*cellSize-3,x*cellSize-1,(y+order)*cellSize+3);
		renderRect(x*cellSize-3,y*cellSize-3,(x+order)*cellSize+3,y*cellSize-1);
		renderRect((x+order)*cellSize+3,y*cellSize-3,(x+order)*cellSize+1,(y+order)*cellSize+3);
		renderRect(x*cellSize-3,(y+order)*cellSize+3,(x+order)*cellSize+3,(y+order)*cellSize+1);
	},null);
}

//============================================================================//

var slideInEvt = [
	function(x,y,startTick,endTick){ // from bottom
		new event(startTick,endTick,function(interp){
			rgb(1,1,1);
			renderRect(x*cellSize,(y+1)*cellSize-interp*cellSize,
				   (x+1)*cellSize,(y+1)*cellSize);
		},null);
	},function(x,y,startTick,endTick){ // from top
		new event(startTick,endTick,function(interp){
			rgb(1,1,1);
			renderRect(x*cellSize,y*cellSize,
				   (x+1)*cellSize,y*cellSize+interp*cellSize);
		},null);
	},function(x,y,startTick,endTick){ // from right
		new event(startTick,endTick,function(interp){
			rgb(1,1,1);
			renderRect((x+1)*cellSize-interp*cellSize,y*cellSize,
				   (x+1)*cellSize,(y+1)*cellSize);
		},null);
	},function(x,y,startTick,endTick){ // from left
		new event(startTick,endTick,function(interp){
			rgb(1,1,1);
			renderRect(x*cellSize,y*cellSize,
				   x*cellSize+interp*cellSize,(y+1)*cellSize);
		},null);
	},
];


function highlightEvt(x,y,startTick,endTick){
	new event(startTick,endTick,function(){
		rgb(1,1,1);
		renderRect(x*cellSize,y*cellSize,
		           (x+1)*cellSize,(y+1)*cellSize);
	},null);
}

function fadeOutEvt(x,y,startTick,endTick){
	new event(startTick,endTick,function(interp){
		gfx.fillStyle = "rgba(255,255,255,"+(1-interp)+")";
		renderRect(x*cellSize,y*cellSize,
		           (x+1)*cellSize,(y+1)*cellSize);
	},null);
}