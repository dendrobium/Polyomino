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

var polyCell = function(id,order){
	this.id = id;
	this.order = order;
}

var animCell = function(begin,end,inOutFade,direction){
	this.begin = begin;
	this.end = end;
	this.inOutFade = inOutFade;
	this.direction = direction;
}

function newId(){return ++blockId;}

function getInactiveCell(x,y){
	if(active.getCell(x,y))return undefined;
	return board.getCell(x,y);
}

function setAnim(x,y,begin,end,IOF,direction){
	active.setCell(x,y,true);
	anim.getCell(x,y).push(new animCell(begin,end,IOF,direction));
}
