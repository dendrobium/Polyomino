var grid = function(size){
	var grid = [];
	grid.size = size;
	for(var i=0;i<size;++i){
		grid[i] = [];
		for(var j=0;j<size;++j)grid[i][j] = null;
	}

	grid.setCell = function(x,y,c){
		x = Math.floor(x);
		y = Math.floor(y);
		if(x<0||y<0||x>=grid.size||y>=grid.size)return;
		grid[x][y] = c;
	}

	grid.getCell = function(x,y){
		x = Math.floor(x);
		y = Math.floor(y);
		if(x<0||y<0||x>=grid.size||y>=grid.size)return undefined;
		return grid[x][y];
	}

	return grid;
}

function movePiece(from,to,id,offsetX,offsetY){
	for(var i=0;i<from.size;++i)for(var j=0;j<from.size;++j){
		var c = from.getCell(i+offsetX,j+offsetY);
		if(!c)continue;
		if(c.id !== id)continue;
		to.setCell(i,j,c);
		from.setCell(i+offsetX,j+offsetY,null);
	}
}
