function newId(){
  return ++blockId;
}

var cell = function(){
	this.locked   = false;
	this.selected = false;
	this.occupied = false;
  this.cemented = false;
	this.id = 0;
	this.order = 0;

	this.quickSet = function(occupied,id,order){
		this.occupied = occupied;
		this.id = id;
		this.order = order;
	}
}

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
		if(x<0||y<0||x>=grid.size||y>=grid.size)return null;
		return grid[x][y];
	}

	return grid;
}

// ignores locks
function copyPiece(from,to,id,move){
	move = move || false;
	for(var i=0;i<from.size;++i)for(var j=0;j<from.size;++j){
		var c = from.getCell(i,j);
		if(!c.occupied)continue;
		if(c.id !== id)continue;
		to.getCell(i,j).quickSet(true,c.id,c.order);
		if(move)from.getCell(i,j).occupied = false;
	}
}

function deselectGrid(g){
	for(var i=0;i<g.size;++i)for(var j=0;j<g.size;++j){
		var c = g.getCell(i,j);
		if(c.selected)c.selected = c.locked = false;
	}
}
