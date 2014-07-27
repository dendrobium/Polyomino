function keyframe(x){return keyframeSpeed*x;}

new_event = function(startTick,endTick,func,onEnd){
	inactiveEvtLs.push({
		startTick : tick+startTick,
		endTick   : tick+endTick,
		func      : func,
		onEnd     : onEnd,
	});
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
	new_event(startTick,endTick,function(interp){
		cell.order =(newOrder-oldOrder)*interp+oldOrder;
	},function(){cell.order = newOrder;});
}

function unlockEvt(cell,unlockTick){
	cell.locked = true;
	new_event(unlockTick,unlockTick,null,function(){
		cell.locked = false;
		triggerDetectSquares = true;
	});
}

function quickSetEvt(cell,occupied,id,order,setTick){
	cell.locked = true;
	new_event(setTick,setTick,null,function(){
		cell.quickSet(occupied,id,order);
	});
}

function saveGameEvt(saveTick){
	new_event(saveTick,saveTick,null,saveGame);
}

function comboActiveEvt(decTick){
	++comboActiveCtr;
	new_event(decTick,decTick,null,function(){
		--comboActiveCtr;
	});
}

//============================================================================//

// TODO: what about adjacent surrounds?
function beginSurroundEvt(x,y,order,startTick,endTick){
	addEffect(new squareEffect(order,x*cellSize,y*cellSize,order*cellSize));
	new_event(startTick,endTick,function(interp){
		var len = interp*interp*interp*order*cellSize+6;
		rgb(1,1,1);
		renderRect(x*cellSize-3,(y+order)*cellSize+3-len,x*cellSize-1,(y+order)*cellSize+3);
		renderRect(x*cellSize-3,y*cellSize-3,x*cellSize-3+len,y*cellSize-1);
		renderRect((x+order)*cellSize+3,y*cellSize-3,(x+order)*cellSize+1,y*cellSize-3+len);
		renderRect((x+order)*cellSize+3-len,(y+order)*cellSize+3,(x+order)*cellSize+3,(y+order)*cellSize+1);
	},null);
}

function surroundEvt(x,y,order,startTick,endTick){
	new_event(startTick,endTick,function(interp){
		rgb(1,1,1);
		renderRect(x*cellSize-3,y*cellSize-3,x*cellSize-1,(y+order)*cellSize+3);
		renderRect(x*cellSize-3,y*cellSize-3,(x+order)*cellSize+3,y*cellSize-1);
		renderRect((x+order)*cellSize+3,y*cellSize-3,(x+order)*cellSize+1,(y+order)*cellSize+3);
		renderRect(x*cellSize-3,(y+order)*cellSize+3,(x+order)*cellSize+3,(y+order)*cellSize+1);
	},null);
}

//============================================================================//

var slideInEvt = new Array(4);

slideInEvt[NORTH] = function(x,y,startTick,endTick,color){ // from bottom
	new_event(startTick,endTick,function(interp){
		rgb(color);
		renderRect(x*cellSize,(y+1)*cellSize-interp*cellSize,
		           (x+1)*cellSize,(y+1)*cellSize);
	},null);
}


slideInEvt[SOUTH] = function(x,y,startTick,endTick,color){ // from top
	new_event(startTick,endTick,function(interp){
		rgb(color);
		renderRect(x*cellSize,y*cellSize,
		           (x+1)*cellSize,y*cellSize+interp*cellSize);
	},null);
}


slideInEvt[WEST] = function(x,y,startTick,endTick,color){ // from right
	new_event(startTick,endTick,function(interp){
		rgb(color);
		renderRect((x+1)*cellSize-interp*cellSize,y*cellSize,
		           (x+1)*cellSize,(y+1)*cellSize);
	},null);
}

slideInEvt[EAST] = function(x,y,startTick,endTick,color){ // from left
	new_event(startTick,endTick,function(interp){
		rgb(color);
		renderRect(x*cellSize,y*cellSize,
		           x*cellSize+interp*cellSize,(y+1)*cellSize);
	},null);
}

//============================================================================//

function highlightEvt(x,y,startTick,endTick,color){
	new_event(startTick,endTick,function(){
		rgb(color);
		renderRect(x*cellSize,y*cellSize,
		          (x+1)*cellSize,(y+1)*cellSize);
	},null);
}

function unhoverEvt(x,y,startTick,endTick,color){
	new_event(startTick,endTick,function(interp){
		rgb(color);
		renderRect(Math.round(x*cellSize*(1-interp)),Math.round(y*cellSize*(1-interp)),
		          Math.round((x+1)*cellSize*(1-interp)),Math.round((y+1)*cellSize*(1-interp)));
	},null);
}

function fadeOutEvt(x,y,startTick,endTick,color){
	new_event(startTick,endTick,function(interp){

		gfx.fillStyle = "rgba("+Math.floor(255*color.r)+","+Math.floor(255*color.g)+","+Math.floor(255*color.b)+","+(1-interp)+")";
		renderRect(x*cellSize,y*cellSize,
		          (x+1)*cellSize,(y+1)*cellSize);
	},null);
}

//============================================================================//

function gameWonEvt(){
	new_event(0,10,null,function(){
		location = "#gameWon";
	});
}
