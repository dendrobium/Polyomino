function recurse(visited,x,y,c,f){
	var e = getInactiveCell(x,y);
	if(!e || c.id !== e.id)return;
	if(visited.getCell(x,y))return;
	visited.setCell(x,y,true);
	if(f)f(e);
	recurse(visited,x  ,y-1,c,f);
	recurse(visited,x  ,y+1,c,f);
	recurse(visited,x-1,y  ,c,f);
	recurse(visited,x+1,y  ,c,f);
};

// TODO: consider animations
function recalculateIds(){
	var visited = new grid(board.size);
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
		var c = getInactiveCell(i,j);
		if(!c)continue;
		recurse(visited,i,j,c);
		var id = newId();
		for(var x=0;x<board.size;++x)for(var y=0;y<board.size;++y){
			var chk = getInactiveCell(x,y);
			if(chk&&chk.id === c.id&&!visited.getCell(x,y))
				chk.id = id;
		}
	}
}

// TODO: consider animations
function recalculateOrder(){
	for(var i=0;i<board.size;++i)for(var j=0;j<board.size;++j){
		var c = getInactiveCell(i,j);
		if(!c)continue;

		// determine real order of cell
		var count = 0;
		recurse(new grid(board.size,board.size),
		        i,j,c,function(e){++count;});

		// if counted order doesnt match assigned order,reassign
		if(count === c.order)continue;
		recurse(new grid(board.size,board.size),
		        i,j,c,function(e){e.order = count;});
	}
}

function detectSquares(){
	var squareCount = 0;

	// initialize squares grid
	var squares = new grid(board.size);
	for(var i=0;i<squares.size;++i)for(var j=0;j<squares.size;++j)
		squares.setCell(i,j,0);

	// scan 1, detect any squares on the board
	for(var x=0;x<board.size;++x)
	outer:for(var y=0;y<board.size;++y){
		var c = getInactiveCell(x,y);
		if(c){
			// determine largest possible square order
			var minOrder = c.order+1;
			var maxOrder = minOrder;
			for(;Math.min(x+maxOrder,y+maxOrder)<=board.size;++maxOrder){
				var testC = getInactiveCell(x,y);
				if(!testC || testC.order !== c.order)break;
			}if(!upgradeHighestOrder)maxOrder = minOrder+1;

			// for each possible order (smallest to largest)
			inner:for(var order=minOrder;order!=maxOrder;++order){
				// scan for square
				for(var i=x;i<x+order;++i)for(var j=y;j<y+order;++j){
					var e = getInactiveCell(i,j);
					if(!e)continue inner;
					if(e.order !== c.order)continue inner;
				}

				// if square exists, write to squares grid
				for(var i=x;i<x+order;++i)for(var j=y;j<y+order;++j)
					if(squares.getCell(i,j)<order)squares.setCell(i,j,order);
			}
		}
	}


	// scan 2, detect largest squares on squares grid
	for(var x=0;x<squares.size;++x)
	outer:for(var y=0;y<squares.size;++y){
		var c = squares.getCell(x,y);
		if(c<=0)continue;
		for(var i=x;i<x+c;++i)for(var j=y;j<y+c;++j)
			if(squares.getCell(i,j) != c)continue outer;
		for(var i=x;i<x+c;++i)for(var j=y;j<y+c;++j)
			squares.setCell(i,j,0);
		squareToPoly(x,y,c);
		++squareCount;
	}

	// placing these here rather than right after squareToPoly allows for comboing
	recalculateIds();                 // TODO: consider animations
	if(doRecalculateOrder) //fromg gamerules.js
		recalculateOrder();               // TODO: consider animations
	if(squareCount>0)detectSquares(); // TODO: consider animations
}
