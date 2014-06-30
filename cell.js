function newId(){return ++blockId;}

var polyCell = function(id,order){
	this.locked = false; // if true, no interactions besides rendering, nothing pushed onto eventLs
//	this.eventLs = [];   // animations, spawning, despawning etc... goes in here
	                     // XXX: how does animations work...

//	this.addEvent = function(e){}
	this.processEvents = function(){}

//	this.active = false; // if true, id and order are valid
	this.id = id;
	this.order = order;
}

/*

	events:
		must have trigger tick

	setting animation vars
	setting active id order vars
	unlocking cell

*/
