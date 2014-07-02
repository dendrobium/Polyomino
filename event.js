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
	// TODO: migrateLs = inactiveEvtLs.filter(startTick <= tick)
	// TODO: inactiveEvtLs = inactiveEvtLs.filter(startTick > tick)
	// TODO: activeEvtLs.concat(migrateLs)
	if(activeEvtLs.length > 0)currentlyAnimating = true;
}

function processActiveEvents(){
	// execute all onEnd functions
	var endLs = activeEvtLs.filter(function(e){return e.endTick <= tick;});
	for(e in endLs)endLs[e].onEnd();

	// remove all expired events
	activeEvtLs = activeEvtLs.filter(function(e){return e.endTick > tick;});

	// process events
	for(evt in activeEvtLs){
		var e = activeEvtLs[evt];
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
