function recurse(visited,x,y,c,f){
	var e = boardMain.getCell(x,y);
	if(!e || !e.occupied || e.locked)return;
	if(c.id !== e.id)return;
	if(visited.getCell(x,y))return;
	visited.setCell(x,y,true);
	if(f)f(e);
	recurse(visited,x  ,y-1,c,f);
	recurse(visited,x  ,y+1,c,f);
	recurse(visited,x-1,y  ,c,f);
	recurse(visited,x+1,y  ,c,f);
};

//opens game-over dialog if game is lost; otherwise returns
function checkGameOver(){
	for(var i=0;i<gridSize;++i)for(var j=0;j<gridSize;++j)
		if(!boardMain[i][j].occupied || boardMain[i][j].locked) return;
	location = '#gameOver'; //CSS/HTML
}

function recalculateIds(){
	var visited = new grid(gridSize);
	for(var i=0;i<gridSize;++i)for(var j=0;j<gridSize;++j)
	if(!visited.getCell(i,j)){
		var c = boardMain.getCell(i,j);
		if(!c.occupied || c.locked)continue;
		recurse(visited,i,j,c);
		var id = newId();
		for(var x=0;x<gridSize;++x)for(var y=0;y<gridSize;++y){
			var chk = boardMain.getCell(x,y);
			if(!chk.occupied || chk.locked)continue;
			if(chk.id === c.id && !visited.getCell(x,y))
				chk.id = id;
		}
	}
}

function recalculateOrder(){
	if(!orderDecay)return;
	for(var i=0;i<gridSize;++i)for(var j=0;j<gridSize;++j){
		var c = boardMain.getCell(i,j);
		if(!c.occupied || c.locked)continue;

		// determine real order of cell
		var count = 0;
		recurse(new grid(gridSize),i,j,c,function(e){++count;});

		// if counted order doesnt match assigned order,reassign
		if(count === c.order)continue;
		recurse(new grid(gridSize),i,j,c,function(e){
			orderChangeEvt(e,e.order,count,keyframe(0),keyframe(1));
			unlockEvt(e,keyframe(1));
		});
	}
}

// TODO: detect endgame
// dont do animations here, they should be delegated by squareToPoly, recalcIds and recalcOrder
// TODO: combo animation here (multiple squares on placement)
function detectSquares(){

	// initialize squares grid
	var squares = new grid(gridSize);
	for(var i=0;i<gridSize;++i)for(var j=0;j<gridSize;++j)
		squares.setCell(i,j,0);

	// scan 1, detect any squares on the board
	for(var x=0;x<gridSize;++x)
	outer:for(var y=0;y<gridSize;++y){
		var c = boardMain.getCell(x,y);
		if(!c.occupied || c.locked)continue;

		// determine largest possible square order
		var minOrder = c.order+1;
		var maxOrder = minOrder;
		for(;Math.min(x+maxOrder,y+maxOrder)<=gridSize;++maxOrder){
			var testC = boardMain.getCell(x,y);
			if(!testC.occupied || testC.locked || testC.order !== c.order)break;
		}if(!detectHighestOrder)maxOrder = Math.min(maxOrder,minOrder+1);

		// for each possible order (smallest to largest)
		inner:for(var order=minOrder;order!=maxOrder;++order){
			// scan for square
			for(var i=x;i<x+order;++i)for(var j=y;j<y+order;++j){
				var e = boardMain.getCell(i,j);
				if(!e || !e.occupied || e.locked || e.order !== c.order)continue inner;
			}

			// if square exists, write to squares grid
			for(var i=x;i<x+order;++i)for(var j=y;j<y+order;++j)
				if(squares.getCell(i,j)<order)squares.setCell(i,j,order);
		}
	}


	// scan 2, detect largest squares on squares grid
	for(var x=0;x<gridSize;++x)
	outer:for(var y=0;y<gridSize;++y){
		var c = squares.getCell(x,y);
		if(c<=0)continue;
		for(var i=x;i<x+c;++i)for(var j=y;j<y+c;++j)
			if(squares.getCell(i,j) != c)continue outer;
		for(var i=x;i<x+c;++i)for(var j=y;j<y+c;++j)
			squares.setCell(i,j,0);
		squareToPoly(x,y,c);
	}

	// placing these here rather than right after squareToPoly allows for comboing
	recalculateIds();
	recalculateOrder();
}
