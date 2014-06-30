// TODO: verify something can even be placed (low grid size, high init piece count size)
function placeNewPoly(){
	// TODO: generate list of empty cells
	// TODO: if emptyCells length === 0, return | XXX: endgame considerations? (thats currently in detectSquares)
	// TODO: x,y = random cell in list

	var x,y;
	while(true){
		x = rInt(board.size);
		y = rInt(board.size);
		if(!board.getCell(x,y))break;
	}

	var id = newId();
	board.setCell(x,y,new cell(id,1));
	var formDomino = function(i,j,dir){
		if(board.getCell(i,j) === null){
			board.setCell(i,j,new cell(id,2));
			board.getCell(x,y).order = 2;
		}
	}

	switch(rInt(4)){
		case 0:formDomino(x,y-1,UP);break;
		case 1:formDomino(x,y+1,DOWN);break;
		case 2:formDomino(x-1,y,LEFT);break;
		case 3:formDomino(x+1,y,RIGHT);break;
	}

	detectSquares();
}

// TODO: consider animations
function squareToPoly(x,y,order){
	outer:while(true){
		var filled = new grid(order,order);

		// clear everything in bounding box
		for(var i=x;i<x+order;++i)for(var j=y;j<y+order;++j)
			board.setCell(i,j,null);

		// generate random polyomino
		var id = newId();
		var i=x+rInt(order);
		var j=y+rInt(order);
		board.setCell(i,j,new cell(id,order));
		filled.setCell(i-x,j-y,true);
		for(var count=1;count<order;++count)while(true){
			i=x+rInt(order);
			j=y+rInt(order);
			if(board.getCell(i,j))continue;
			var u = filled.getCell(i-x  ,j-y-1);
			var d = filled.getCell(i-x  ,j-y+1);
			var l = filled.getCell(i-x-1,j-y  );
			var r = filled.getCell(i-x+1,j-y  );
			if(!(u||d||l||r))continue;
			board.setCell(i,j,new cell(id,order));
			filled.setCell(i-x,j-y,true);
			break;
		}

		// assure poly has no holes
		var recurse = function(x,y){
			var c = filled.getCell(x,y);
			if(c||c===undefined)return;
			filled.setCell(x,y,true);
			recurse(x  ,y-1);
			recurse(x  ,y+1);
			recurse(x-1,y  );
			recurse(x+1,y  );
		};

		while(true){
			i=rInt(order);
			j=rInt(order);
			if(!filled.getCell(i,j))break;
		}recurse(i,j);

		for(var i=0;i<order;++i)for(var j=0;j<order;++j)
			if(!filled.getCell(i,j))continue outer;
		break;
	}
}
