
//==  EVENT HANDLER  =========================================================//

function keyframe(x){return keyframeSpeed*x;}

new_event = function(startTick,endTick,func,onEnd){
	inactiveEvtLs.push({
		startTick : tick+startTick,
		endTick   : tick+endTick,
		func      : func,
		onEnd     : onEnd
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

function uncementEvt(cell,uncementTick){
	new_event(uncementTick,uncementTick,null,function(){
		cell.cemented = false;
		triggerDetectSquares = true;
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


function gameWonEvt(){
	new_event(0,10,null,function(){
    gameWon = true;
		gameLevel++;
    gameState = GAME_STATE_ROUND_OVER;
		saveTime(new Date().getTime() - timeStarted);
    //newGame();
	});
}

function playStartEvent(myTick) {
  new_event(0,myTick,null,function(){
    gameState = GAME_STATE_PLAYING;
  });

}

//==  SLIDE-IN EVENTS  =======================================================//

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

//==  SLIDE-OUT EVENTS  ======================================================//

var slideOutEvt = new Array(4);

slideOutEvt[NORTH] = function(x,y,startTick,endTick,color){ // from bottom
	new_event(startTick,endTick,function(interp){
		rgb(color);
		renderRect(x*cellSize,(y+1)*cellSize-interp*cellSize,
		           (x+1)*cellSize,y*cellSize);
	},null);
}


slideOutEvt[SOUTH] = function(x,y,startTick,endTick,color){ // from top
	new_event(startTick,endTick,function(interp){
		rgb(color);
		renderRect(x*cellSize,(y+1)*cellSize,
		           (x+1)*cellSize,y*cellSize+interp*cellSize);
	},null);
}


slideOutEvt[WEST] = function(x,y,startTick,endTick,color){ // from right
	new_event(startTick,endTick,function(interp){
		rgb(color);
		renderRect((x+1)*cellSize-interp*cellSize,y*cellSize,
		           x*cellSize,(y+1)*cellSize);
	},null);
}

slideOutEvt[EAST] = function(x,y,startTick,endTick,color){ // from left
	new_event(startTick,endTick,function(interp){
		rgb(color);
		renderRect((x+1)*cellSize,y*cellSize,
		           x*cellSize+interp*cellSize,(y+1)*cellSize);
	},null);
}

//==  MISC SLIDE EVENTS  =====================================================//

function highlightEvt(x,y,startTick,endTick,color){
	new_event(startTick,endTick,function(){
		rgb(color);
		renderRect(x*cellSize,y*cellSize,
		          (x+1)*cellSize,(y+1)*cellSize);
	},null);
}

function fadeOutEvt(x,y,startTick,endTick,color){
	new_event(startTick,endTick,function(interp){
		gfx.fillStyle = "rgba("+Math.floor(255*color.r)+","+Math.floor(255*color.g)+","+Math.floor(255*color.b)+","+(1-interp)+")";
		renderRect(x*cellSize,y*cellSize,
		          (x+1)*cellSize,(y+1)*cellSize);
	},null);
}

//==  SQUARE TO POLY EVENTS  =================================================//

function bottomLineIn(x,y,order,startTick,endTick){
	new_event(startTick,endTick,function(interp){
	},null);
}

function boxInEvt(x,y,order,startTick,endTick,color){
	new_event(startTick,endTick,function(interp){
		rgb(color);
		renderRect(x*cellSize,y*cellSize,(x+order)*cellSize,(y+order*interp)*cellSize);
	},null);

}

function boxSustainEvt(x,y,order,startTick,endTick,color){
	new_event(startTick,endTick,function(){
		rgb(color);
		renderRect(x*cellSize,y*cellSize,(x+order)*cellSize,(y+order)*cellSize);
	},null);
}

//============================================================================//

function centeredText(string,x,y,size,spacing){
	gfx.font = "800 "+size+"px arial";
	var halfWidth = (gfx.measureText(string).width+(spacing*(string.length-1)))/2;
	for(var i=0;i<string.length;++i){
		gfx.fillText(string.charAt(i),x-halfWidth,y);
		x += gfx.measureText(string.charAt(i)).width+spacing;
	}
}

function textInEvt(x,y,order,startTick,endTick,text){
	new_event(startTick,endTick,function(interp){
		rgba(1,1,1,Math.sin(interp*Math.PI)*2-1);
		var fontSize = 22;
		var cellCenter = Math.floor((cellSize*order)/2);
		centeredText(text,x*cellSize+cellCenter,y*cellSize+cellCenter+fontSize/2-5/Math.tan(Math.PI*(interp-0.5)+Math.PI/2),fontSize,-1);
	},null);
}

//============================================================================//

function bottomSurroundIn(x,y,order,startTick,endTick){
	new_event(startTick,endTick,function(interp){
		rgb(1,1,1);
		var amt = interp*(order*cellSize+8)/2;
		var mid = x*cellSize+order*cellSize/2;
		renderRect(mid-amt,(y+order)*cellSize+2,
		           mid+amt,(y+order)*cellSize+4);
	},null);
}

function sideSurroundIn(x,y,order,startTick,endTick){
	new_event(startTick,endTick,function(interp){
		rgb(1,1,1);
		var amt = interp*(order*cellSize+8);
		renderRect(x*cellSize-4,(y+order)*cellSize+4-amt,
		           x*cellSize-2,(y+order)*cellSize+4);
		renderRect((x+order)*cellSize+2,(y+order)*cellSize+4-amt,
		           (x+order)*cellSize+4,(y+order)*cellSize+4);
	},null);
}

function topSurroundIn(x,y,order,startTick,endTick){
	new_event(startTick,endTick,function(interp){
		rgb(1,1,1);
		var amt = interp*(order*cellSize+8)/2;
		renderRect(x*cellSize-4,y*cellSize-4,
		           x*cellSize-4+amt,y*cellSize-2);
		renderRect((x+order)*cellSize+4-amt,y*cellSize-4,
		           (x+order)*cellSize+4,y*cellSize-2);
	},null);
}

function bottomSurroundSustain(x,y,order,startTick,endTick){
	new_event(startTick,endTick,function(){
		rgb(1,1,1);
		renderRect(x*cellSize-4,(y+order)*cellSize+2,
		           (x+order)*cellSize+4,(y+order)*cellSize+4);
	},null);
}

function sideSurroundSustain(x,y,order,startTick,endTick){
	new_event(startTick,endTick,function(){
		rgb(1,1,1);
		renderRect(x*cellSize-4,y*cellSize-4,
		           x*cellSize-2,(y+order)*cellSize+4);
		renderRect((x+order)*cellSize+2,y*cellSize-4,
		           (x+order)*cellSize+4,(y+order)*cellSize+4);
	},null);
}

function topSurroundSustain(x,y,order,startTick,endTick){
	new_event(startTick,endTick,function(){
		rgb(1,1,1);
		renderRect(x*cellSize-4,y*cellSize-4,
		           (x+order)*cellSize+4,y*cellSize-2);
	},null);
}

function bottomSurroundOut(x,y,order,startTick,endTick){
	new_event(startTick,endTick,function(interp){
		rgb(1,1,1);
		var amt = interp*(order*cellSize+8)/2;
		var mid = x*cellSize+order*cellSize/2;
		renderRect(x*cellSize-4,(y+order)*cellSize+2,
		           mid-amt,(y+order)*cellSize+4);
		renderRect((x+order)*cellSize+4,(y+order)*cellSize+2,
		           mid+amt,(y+order)*cellSize+4);
	},null);
}

function sideSurroundOut(x,y,order,startTick,endTick){
	new_event(startTick,endTick,function(interp){
		rgb(1,1,1);
		var amt = interp*(order*cellSize+8);
		renderRect(x*cellSize-4,(y+order)*cellSize+4-amt,
		           x*cellSize-2,y*cellSize-4);
		renderRect((x+order)*cellSize+2,(y+order)*cellSize+4-amt,
		           (x+order)*cellSize+4,y*cellSize-4);
	},null);
}

function topSurroundOut(x,y,order,startTick,endTick){
	new_event(startTick,endTick,function(interp){
		rgb(1,1,1);
		var amt = (1-interp)*(order*cellSize+8)/2;
		var mid = x*cellSize+order*cellSize/2;
		renderRect(mid-amt,y*cellSize-4,
		           mid+amt,y*cellSize-2);
	},null);
}
