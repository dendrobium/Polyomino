function newId(){return ++blockId;}

var cell = function(){
	this.locked   = false;
	this.selected = false;
	this.occupied = false;
	this.id = -1;
	this.order = -1;

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
function floatPiece(id){

  //console.log("grid.floatPiece(): ID="+id);
  floatingBlockID = id;

  // set lock and selected flags for selected cells
  for(var i=0; i<gridSize; ++i)for(var j=0; j<gridSize; ++j){
    var boardCell = boardMain.getCell(i,j);
    var floatingCell = boardFloating.getCell(i,j);

    floatingCell.occupied = false;
    floatingCell.selected = false;
    floatingCell.locked = false;

    if(!boardCell.occupied) continue;
    if(boardCell.id !== id) continue;

    //console.log("grid.floatPiece(): i="+i+", j="+j);

    boardCell.locked = true;
    boardCell.selected = true;
    boardCell.occupied = false;

    floatingCell.quickSet(true, id, boardCell.order);
  }
}


function unfloatPiece(placeFloatingPieceOnBoard){

  //console.log("grid.unfloatPiece(): floatingBlockID="+floatingBlockID);

  for(var i=0; i<gridSize; i++) for(var j=0; j<gridSize; j++){

    var floatingCell = boardFloating.getCell(i,j);
    floatingCell.locked = false;

    if (!floatingCell.occupied) continue;

    floatingCell.occupied = false;

    if (placeFloatingPieceOnBoard) {

      var gridX = i - placeX;
      var gridY = j - placeY;

      //console.log("  ===>place Piece: ("+gridX +", "+gridY+")");
      var boardCell = boardMain.getCell(gridX, gridY);
      boardCell.quickSet(true, floatingBlockID, floatingCell.order);
      boardCell.locked = false;
    }
  }

  for(var i=0; i<gridSize; i++) for(var j=0; j<gridSize; j++)
  {
    var boardCell = boardMain.getCell(i, j);
    if (boardCell.selected)
    {
      boardCell.selected = false;
      boardCell.locked = false;
      if (!placeFloatingPieceOnBoard) {
      boardCell.occupied = true;
      }
    }

  }

  dragging = false;
  snapping = false;
  floatingBlockID = -1;
}


function isMoveValid() {

  //console.log("isMoveValid(): floatingBlockID="+floatingBlockID);
  var targetLocationIsSameAsStart = true;
  // make sure pieces in floating arent dropped on existing pieces or locked (and unselected) cells
  for (var i = 0; i < gridSize; ++i)  for (var j = 0; j < gridSize; ++j) {

    var floatingCell = boardFloating.getCell(i, j);

    if (!floatingCell) continue;
    if (!floatingCell.occupied) continue;

    var gridX = i - placeX;
    var gridY = j - placeY;

    //console.log("  ==>gridX="+gridX + ", gridY="+gridY);
    if (gridX < 0 || gridY < 0 || gridX >= gridSize || gridY >= gridSize) return false;

    var boardCell = boardMain.getCell(gridX, gridY);

    //console.log("  ==>boardCell.id="+boardCell.id + ", boardCell.occupied="+boardCell.occupied
    //    + ", boardCell.locked="+boardCell.locked);

    if (boardCell.id !== floatingBlockID) targetLocationIsSameAsStart = false;

    if (boardCell.occupied) return false;
    if (boardCell.locked && !boardCell.selected) return false;
  }


  if (targetLocationIsSameAsStart) return false;
  return true;
}

