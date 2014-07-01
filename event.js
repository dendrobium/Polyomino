// XXX: what about cell-less events
var event = function(startTick,endTick,func,onEnd){
	this.startTick = startTick;
	this.endTick = endTick;
	this.func  = func;
	this.onEnd = onEnd;
	inactiveEvttLs.push(this);
}

var inactiveEvtLs = [];
var activeEvtLs = [];
function processInactiveEvents(){
	if(activeEvtLs.length > 0)currentlyAnimating = true;
}

function processActiveEvents(){

}

var eventLs = []; // TODO: make inactiveEvtLs and activeEvtLs
function processEvents(){
	// execute all onEnd functions
	var endLs = eventLs.filter(function(e){return e.endTick <= tick;});
	for(e in endLs)endLs[e].onEnd();

	// remove all expired events
	eventLs = eventLs.filter(function(e){return e.endTick > tick;});

	// process events
	for(evt in eventLs){
		var e = eventLs[evt];
		if(e.startTick > tick)continue;
		e.func(e.startTick,e.endTick);
	}
}

function animEvt(){
	// TODO: currentlyAnimating = true;
}

function setCellEvt(setTick,cell,occupied,id,order){
}

function unlockEvt(unlockTick,cell){
	// TODO: unlock cell
	// TODO: triggerDetectSquares = true;
}

/*
// XXX: what about cell-less events
var event = function(c,startTick,endTick,func,onEnd){
	this.c = c;
	this.startTick = startTick;
	this.endTick = endTick;
	this.func  = func;  // TODO: must accept cell, start, end
	this.onEnd = onEnd; // TODO: must accept cell
	eventLs.push(this);
}

var eventLs = [];
function processEvents(){
	// execute all onEnd functions
	var endLs = eventLs.filter(function(e){return e.endTick <= tick;});
	for(e in endLs)endLs[e].onEnd(endLs[e].c);

	// remove all expired events
	eventLs = eventLs.filter(function(e){return e.endTick > tick;});

	// process events
	for(evt in eventLs){
		var e = eventLs[evt];
		if(e.startTick > tick)continue;
		e.func(e.c,e.startTick,e.endTick);
	}
}

function animEvt(){
	// TODO: currentlyAnimating = true;
}

function setCellEvt(setTick,cell,occupied,id,order){
}

function unlockEvt(unlockTick,cell){
	// TODO: unlock cell
	// TODO: triggerDetectSquares = true;
}
*/
