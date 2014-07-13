function placeStartingPolys() {

  spawnPoly(1); spawnPoly(1);
  spawnPoly(2); spawnPoly(2); spawnPoly(2);
  spawnPoly(3);
  spawnPoly(4);
  spawnPoly(5);
  r = Math.random();
  if (r < 0.3) {
    spawnPoly(1);
    spawnPoly(5);
  }
  else if (r < 0.66) {
    spawnPoly(2);
    spawnPoly(4);
  }
  else{
    spawnPoly(3);
    spawnPoly(3);
  }

//  spawnPoly(1);
//  spawnPoly(2);
//  spawnPoly(3);
//  spawnPoly(4);
//  spawnPoly(5);
//  spawnPoly(6);
//  spawnPoly(7);
//  spawnPoly(8);

  currentlyAnimating = true;
}


function spawnPoly(order){

  var curGrid = matrix(gridSize, gridSize, false);
  copyBoardToMatrix(curGrid);

  var done = false;
  while (!done) {

    //Generate starting block
    var x = rInt(gridSize);
    var y = rInt(gridSize);
    //console.log("Trying  x="+x+", y="+y);

    if (curGrid[x][y]) continue;


    var spawnedCellCount = 1;
    var spawnGrid = matrix(gridSize, gridSize, false);
    var listx = new Array(order);
    var listy = new Array(order);

    listx[0] = x;
    listy[0] = y;
    var maxX = x;
    var minX = x;
    var maxY = y;
    var minY = y;

      spawnGrid[x][y] = true;
    var addedCell = false;

    while (spawnedCellCount < order) {

      var idx = 0;
      if (spawnedCellCount > 1) idx = rInt(spawnedCellCount);
      for (var n=0; n<spawnedCellCount; n++)
      {
        x = listx[idx];
        y = listy[idx];


        var dir = rInt(4);
        for (var i = 0; i < 4; i++) {
          var xx = x;
          var yy = y;
          switch (dir) {
            case 0:
              yy = y - 1;
              break;
            case 1:
              xx = x + 1;
              break;
            case 2:
              yy = y + 1;
              break;
            case 3:
              xx = x - 1;
              break;
          }
          if ((xx>=0) && (yy>=0) && (xx<gridSize) && (yy<gridSize)) {
            if (!curGrid[xx][yy] && !spawnGrid[xx][yy]) {

              //console.log("    Added cell xx=" + xx + ", yy=" + yy + ", spawnedCellCount=" + spawnedCellCount);
              listx[spawnedCellCount] = xx;
              listy[spawnedCellCount] = yy;
              spawnGrid[xx][yy] = true;
              spawnedCellCount++;
              addedCell = true;

              if (x > maxX) maxX = x;
              if (x < minX) minX = x;
              if (y > maxY) maxY = y;
              if (y < minY) minY = y;

              break;
            }
          }

          dir = (dir + 1) % 4;
        }
        if (addedCell) break;
        idx = (idx + 1) % spawnedCellCount;
      }

      if (!addedCell) break;
    }

    if (spawnedCellCount >= order) {
      done = true;
      if  (order >= 4) {
        //if bar in level 4 or 5, then retry
        if ((maxX == minX) || (maxY == minY)) done = false;
      }

    }
  }

  copyMatrixToBoard(spawnGrid, order);

  //console.log("done");
}



function spawnMonoOrDomino(){

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
		saveGameEvt(keyframe(3));
	}else{
		quickSetEvt(c,true,id,1,keyframe(1));
		fadeOutEvt(entry.x,entry.y,keyframe(1),keyframe(2));
		unlockEvt(c,keyframe(2));
		saveGameEvt(keyframe(3));
	}
}

// TODO: consider animations
// Used to generate domino through polyomino.
// this function assumes no cell locks are set to true
function squareToPoly(left,top,order){

	// XXX: Luke, this isn't maybe the best way to do scores but I wanted to have something to work with
	// XXX: this doesn't need to be an event, as adding a number to score doesn't need to happen at a later time... [also, seed notes in addScoreEvt definition]
	addToScore(order);
	if(order > goalOrder && !gameWon){
		gameWon = true;
		gameWonEvt();
	}

	var filled = new grid(order);
	for(var i=0;i<filled.size;++i)for(var j=0;j<filled.size;++j)filled.setCell(i,j,false);

	// clear everything in bounding box
	for(var i=left;i<left+order;++i)for(var j=top;j<top+order;++j) {
		board.getCell(i, j).occupied = false;
	}

	// generate random polyomino
	if (order <= MAX_PREDEFINED_ORDER) spawnBiasedRandomPoly(filled, order, left, top);
	else {
		var i = left + rInt(order);
		var j = top + rInt(order);
		var c = board.getCell(i, j);
		c.quickSet(true, newId(), order);
		filled.setCell(i - left, j - top, true);
		for (var count = 1; count < order; ++count) {
			while (true) {
				i = left + rInt(order);
				j = top + rInt(order);
				var b = board.getCell(i, j);
				if (b.occupied)continue;

				var u = filled.getCell(i - left, j - top - 1);
				var d = filled.getCell(i - left, j - top + 1);
				var l = filled.getCell(i - left - 1, j - top);
				var r = filled.getCell(i - left + 1, j - top);
				if (!(u || d || l || r))continue;
				b.quickSet(true, c.id, order);
				filled.setCell(i - left, j - top, true);
				break;
			}
		}

		// assure poly has no holes, if not, recurse on squareToPoly
		var holes = new grid(order + 2);
		for (var i = 0; i < holes.size; ++i)for (var j = 0; j < holes.size; ++j)
			holes.setCell(i, j, false);
		for (var i = 0; i < order; ++i)for (var j = 0; j < order; ++j)
			holes.setCell(i + 1, j + 1, filled.getCell(i, j));

		var recurse = function (left, top) {
			var c = holes.getCell(left, top);
			if (!(c === false))return;
			holes.setCell(left, top, true);
			recurse(left, top - 1);
			recurse(left, top + 1);
			recurse(left - 1, top);
			recurse(left + 1, top);
		};
		recurse(0, 0);

		var recurseFlag = false;
		for (var i = 0; i < holes.size; ++i)for (var j = 0; j < holes.size; ++j)
			if (!holes.getCell(i, j)) {
				squareToPoly(left, top, order);
				recurseFlag = true;
			}
		if (recurseFlag)return;
	}

	for(var i=left;i<left+order;++i)for(var j=top;j<top+order;++j) {
		if (!board.getCell(i, j).occupied) {
			/* do stuff here (cells are at i*cellSize, j*cellSize) */
			var color = polyColor[board.getCell(i, j).order].primary;
			new particle(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, 0, 0, 750, color.r * 255, color.g * 255, color.b * 255, 1, cellSize, 255, 255, 255, 0, cellSize / 10, 1, 0);
		}
	}

	beginSurroundEvt(left, top,order,0,order*100);
	surroundEvt(left, top,order,order*100,order*100+1000);addToScore
	saveGame();
}

function spawnBiasedRandomPoly(filled, order, left, top) {
	var spawnGrid = matrix(order, order, false);

	var shapeIdx = 0;
	var r = Math.random();

  if (DEBUG_LOG_SHAPE_PROBABILITIES) {
    console.log("\ngeneration.spawnBiasedRandomPoly(order="+order+", left="+left+", top="+top+")");
    console.log("	==> random number[0->1)=" + r);
  }

	var sumSquare = 0;
	for(var i=0; i<SHAPE[order].length; i++) {
		//console.log("gamePolyominoTotal["+order+"]="+gamePolyominoTotal[order] +
		//"gameFreeShapeCount["+order+"]["+i+"]="+gameFreeShapeCount[order][i]);
		var diff = 1 + (gamePolyominoTotal[order] - gameFreeShapeCount[order][i]);
		sumSquare += diff*diff;
	}


	var cumulativeSum = 0;
	for(var i=0; i<SHAPE[order].length; i++) {
		var diff = 1 + (gamePolyominoTotal[order] - gameFreeShapeCount[order][i]);

		cumulativeSum += (diff * diff)/sumSquare;
    if (DEBUG_LOG_SHAPE_PROBABILITIES) {
      console.log("	==> sumSquare=" + sumSquare + ", diff=" + diff + ", cumulativeSum=" + cumulativeSum);
    }
		if (r < cumulativeSum) {
			shapeIdx = i;
			break;
		}
	}

	gameFreeShapeCount[order][shapeIdx]++;
	gamePolyominoTotal[order]++;

	setBaseShape(spawnGrid, order, SHAPE[order][shapeIdx]);
	spawnGrid = gridRotateRandom(spawnGrid, order);
	spawnGrid = gridFlipRandom(spawnGrid, order);
	spawnGrid = gridTranslateRandom(spawnGrid, order);



  copyMatrixToFilled(spawnGrid, filled, order, left, top);

}

function copyMatrixToFilled(myMatrix, filled, order, left, top) {
  var id = newId();
  for (var x = 0; x < order; x++) {
    for (var y = 0; y < order; y++) {
      if (myMatrix[x][y]) {
        var i = x + left;
        var j = y + top;
        var cell = board.getCell(i, j);
        cell.quickSet(true, id, order);
        filled.setCell(i, j, true);
      }
    }
  }
}


function copyMatrixToBoard(myMatrix, order) {
  //console.log("copyMatrixToBoard("+order+") goof");
  var id = newId();
  for (var x = 0; x < gridSize; x++) {
    for (var y = 0; y < gridSize; y++) {

      if (myMatrix[x][y]) {

        //console.log("  x="+x+", y="+ y);
        var cell = board.getCell(x, y);
        cell.quickSet(true, id, order);
      }
    }
  }
}


function copyBoardToMatrix(myMatrix) {
  for (var x = 0; x < gridSize; x++) {
    for (var y = 0; y < gridSize; y++) {
      if (board.getCell(x, y).occupied) {
        myMatrix[x][y] = true;
      }
      else  myMatrix[x][y] = false;
    }
  }
}


function setBaseShape(spawnGrid, order, shape)
{
	for(var y=0; y<shape.length; y++)
	{
		var rowBits = shape[y];
		var mask = 1;
		for (var x=0; x<4; x++)
		{
			if ((rowBits & mask) > 0)
			{
				spawnGrid[x][y] = true;
			}
			mask = mask << 1;
		}
	}
}

function gridRotateRandom(spawnGrid, order)
{
	var r = rInt(4);
	for (var i=0; i<r; i++)
	{	spawnGrid = gridRotate90(spawnGrid, order);
	}
	return spawnGrid;
}

function gridRotate90(spawnGrid, order)
{
	//console.log("	==> gridRotate90");
	var rotatedGrid = matrix(order, order, false);
	for (var x=0; x<order; x++)
	{ for (var y=0; y<order; y++)
		{
			rotatedGrid[order-y-1][x] = spawnGrid[x][y];
		}
	}

	return rotatedGrid;
}


function gridFlipRandom(spawnGrid, order)
{
	if (Math.random() < 0.5) return spawnGrid;
	//console.log("	==> gridFlipRandom");
	var flippedGrid = matrix(order, order, false);
	for (var x=0; x<order; x++) {
		for (var y = 0; y < order; y++) {
			flippedGrid[y][x] = spawnGrid[x][y];
		}
	}
	return flippedGrid;
}


function gridTranslateRandom(spawnGrid, order)
{
	//console.log("	==> gridTranslateRandom");
	var maxX = 0;
	var maxY = 0;
	var minX = order;
	var minY = order;

	for (var x=0; x<order; x++) {
		for (var y = 0; y < order; y++) {
			if (spawnGrid[x][y]) {
				if (x < minX) minX = x;
				if (x > maxX) maxX = x;
				if (y < minY) minY = y;
				if (y > maxY) maxY = y;
			}
		}
	}

	//console.log("X=("+minX+", "+maxX+"),	 Y=("+minY+", "+maxY+")");

	var width = (maxX - minX) + 1;
	var height = (maxY - minY) + 1;

	var left = 0;
	var top = 0;
	if (width < order) {
		left = rInt((order-width)+1);
	}
	if (top < order) {
		top = rInt((order-height)+1);
	}

	//console.log("width="+width+", height="+height+", left="+left+", top="+top);

	var translatedGrid = matrix(order, order, false);
	for (var x=0; x<order; x++) {
		for (var y = 0; y < order; y++) {
			if (spawnGrid[x][y]) {
				//console.log(" ********> x=" + x + ", y=" + y + ", (x-minX)+left=" + ((x - minX) + left) + ", (y-minY)+top=" + ((y - minY) + top));
				translatedGrid[(x - minX) + left] [(y - minY) + top] = spawnGrid[x][y];
			}
		}
	}
	return translatedGrid;

}
