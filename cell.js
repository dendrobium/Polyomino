function newId(){return ++blockId;}

var cell = function(id,order){ // TODO: rename to cell
	this.locked   = false;
	this.occupied = false;
	this.id = id;
	this.order = order;
}

var event = function(cell,startTick,endTick,func,onEnd){
	this.c = cell;
	this.startTick = startTick;
	this.endTick = endTick;
	this.func  = func;  // TODO: must accept cell, start, end
	this.onEnd = onEnd; // TODO: must accept cell
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

/*

	setting animation vars
	setting active id order vars
	unlocking cell

*/
