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
	for(e in endLs)endLs[e].onEnd();

	// remove all expired events
	activeEvtLs = activeEvtLs.filter(function(e){return e.endTick > tick;});

	// process events
	for(evt in activeEvtLs){
		var e = activeEvtLs[evt];
		e.func(e.startTick,e.endTick);
	}
}

//==  EVENT TYPES  ===========================================================//

function animEvt(){
	// TODO: currentlyAnimating = true;
}

function setCellEvt(setTick,cell,occupied,id,order){
}

function unlockEvt(unlockTick,cell){
	// TODO: unlock cell
	// TODO: triggerDetectSquares = true;
}
