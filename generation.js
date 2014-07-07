// Used to generate a monomino or domino only
function placeNewPoly(){
	// generate list of empty cells, verify a cell can be placed
	var emptyLs = [];
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
		var c = board.getCell(i,j);
		if(c && !c.locked && !c.occupied)emptyLs.push({cell:c,x:i,y:j});
	}if(emptyLs.length === 0)return;

	// select cell to drop monomino
	var entry = emptyLs[rInt(emptyLs.length)];
	var c = entry.cell;
	var id = newId();

	// if (lazily) possible, generate domino
	var dominoGenerated = false;
	var dir = rInt(4);

	var genDomino = function(i,j){
		var d = board.getCell(i,j);
		if(!d || d.locked || d.occupied)return;
		dominoGenerated = true;

		// setup domino animation
		slideInEvt[dir](i,j,keyframe(1),keyframe(2));
		quickSetEvt(d,true,id,2,keyframe(2));
		fadeOutEvt(i,j,keyframe(2),keyframe(3));
		unlockEvt(d,keyframe(3));
	}

	switch(dir){
		case 0:genDomino(entry.x,entry.y-1);break;
		case 1:genDomino(entry.x,entry.y+1);break;
		case 2:genDomino(entry.x-1,entry.y);break;
		case 3:genDomino(entry.x+1,entry.y);break;
	}

	// setup remaining animation
	slideInEvt[dir](entry.x,entry.y,keyframe(0),keyframe(1));
	if(dominoGenerated){
		quickSetEvt(c,true,id,2,keyframe(1));
		highlightEvt(entry.x,entry.y,keyframe(1),keyframe(2));
		fadeOutEvt(entry.x,entry.y,keyframe(2),keyframe(3));
		unlockEvt(c,keyframe(3));
	}else{
		quickSetEvt(c,true,id,1,keyframe(1));
		fadeOutEvt(entry.x,entry.y,keyframe(1),keyframe(2));
		unlockEvt(c,keyframe(2));
	}
}

// TODO: consider animations
// Used to generate domino through polyomino.
// this function assumes no cell locks are set to true
function squareToPoly(x,y,order){

	// XXX Luke, this isn't maybe the best way to do scores but I wanted to have something to work with
	addScoreEvt(order);
	if(order > goalOrder && !gameWon){
		gameWon = true;
		gameWonEvt();
	}

	var filled = new grid(order);
	for(var i=0;i<filled.size;++i)for(var j=0;j<filled.size;++j)filled.setCell(i,j,false);

	// clear everything in bounding box
	for(var i=x;i<x+order;++i)for(var j=y;j<y+order;++j)
		board.getCell(i,j).occupied = false;

	// generate random polyomino
	var i = x+rInt(order);
	var j = y+rInt(order);
	var c = board.getCell(i,j);
	c.quickSet(true,newId(),order);
	filled.setCell(i-x,j-y,true);
	for(var count=1;count<order;++count)while(true){
		i = x+rInt(order);
		j = y+rInt(order);
		var b = board.getCell(i,j);
		if(b.occupied)continue;

		var u = filled.getCell(i-x  ,j-y-1);
		var d = filled.getCell(i-x  ,j-y+1);
		var l = filled.getCell(i-x-1,j-y  );
		var r = filled.getCell(i-x+1,j-y  );
		if(!(u||d||l||r))continue;
		b.quickSet(true,c.id,order);
		filled.setCell(i-x,j-y,true);
		break;
	}

	// assure poly has no holes, if not, recurse on squareToPoly
	var holes = new grid(order+2);
	for(var i=0;i<holes.size;++i)for(var j=0;j<holes.size;++j)
		holes.setCell(i,j,false);
	for(var i=0;i<order;++i)for(var j=0;j<order;++j)
		holes.setCell(i+1,j+1,filled.getCell(i,j));

	var recurse = function(x,y){
		var c = holes.getCell(x,y);
		if(!(c===false))return;
		holes.setCell(x,y,true);
		recurse(x  ,y-1);
		recurse(x  ,y+1);
		recurse(x-1,y  );
		recurse(x+1,y  );
	};recurse(0,0);

	var recurseFlag = false;
	for(var i=0;i<holes.size;++i)for(var j=0;j<holes.size;++j)
		if(!holes.getCell(i,j)){
			squareToPoly(x,y,order);
			recurseFlag = true;
		}
	if(recurseFlag)return;

	// XXX [ezra]: for(var i=x;i<x+order;++i)for(var j=y;j<y+order;++j)
	// XXX [ezra]: if(!board.getCell(i,j).occupied){
	// XXX [ezra]:   /* do stuff here (cells are at i*cellSize, j*cellSize) */
	// XXX [ezra]:   slideInEvt[0](i,j,0,1000); // example
	// XXX [ezra]: }
	for(var i=x;i<x+order;++i)for(var j=y;j<y+order;++j)
		if(!board.getCell(i,j).occupied){
		  /* do stuff here (cells are at i*cellSize, j*cellSize) */
		  var color = polyColor[board.getCell(i,j).order].primary;
		  new particle(i*cellSize+cellSize/2, j*cellSize+cellSize/2, 0, 0, 750, color.r*255, color.g*255, color.b*255, 1, cellSize, 255, 255, 255, 0, cellSize/10, 1, 0);

		}

	beginSurroundEvt(x,y,order,0,order*100);
	surroundEvt(x,y,order,order*100,order*100+1000);
}
