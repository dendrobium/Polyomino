//Having multiple HTML pages introduces a lot of complexity
//Instead, use this flag to determine whether we're on the trophy pages

var modeTrophies = false;

var modeTrophiesHeight = 5000;
var trophiesAnimating = true;

var saveTime = function(time){
	var oldTime = parseInt(localStorage.getItem("bestTime"));
	if(oldTime > time || isNaN(oldTime)){
		localStorage.setItem("bestTime", time);
	}
}

//type has yet to be used... need functioning shape recognition
var savePolyominoStats = function(order, type){
	var highestOrder = parseInt(localStorage.getItem("highestOrder"));
	if(order > highestOrder || isNaN(highestOrder)){
		localStorage.setItem("highestOrder", order);
	}
	localStorage.setItem("#of"+order, parseInt(localStorage.getItem("#of"+order)) + 1);
	localStorage.setItem("totalMerges", parseInt(localStorage.getItem("totalMerges"))+1);
}

var _trophyData = [];
var getTrophyData = function(){
	_trophyData = [];
	var m = function(a, b, c){ return {name:a,value:b,color:c}};

	var time = localStorage.getItem("bestTime");
	if(!isNaN(parseInt(time)))
		time = pad((time/60000).toFixed(0), 2)+":"+pad(((time/1000)%60).toFixed(0), 2) + "";

	var order = localStorage.getItem("highestOrder");
	if(!isNaN(parseInt(order))){
		order = POLYOMINO_NAME[order];
	}
	_trophyData.push(m("Best Score:", highScore));
	_trophyData.push(m("Total Score:", localStorage.getItem("totalScore")));
	_trophyData.push(m("Fastest Hexomino:", time));
	_trophyData.push(m("Highest Order:", order))
	_trophyData.push(m("Biggest Combo:", maxCombo));
	_trophyData.push(m("Best Combo Score:", maxComboScore));
	_trophyData.push(m("Polyominos Produced:", localStorage.getItem("totalMerges")));

	for(var o=2; o<9; o++){
		var num = localStorage.getItem("#of"+o);
		_trophyData.push(m("    " + POLYOMINO_NAME[o]+"s:", num, o));
	}

}

function renderTrophies(){
	if(!trophiesAnimating)
		return;
	trophiesAnimating = false;

	gfx.fillStyle = '#424242';
	gfx.fillRect(gridOffsetX, 4, gridPixelSize, gridOffsetY-8);
	trophiesReturnToGameButton.render(); //render the back-to-game button instead
	gfx.fillStyle = '#f0f0f0';
	gfx.drawImage(img_polyomino, gridOffsetX+4, 6);


	getTrophyData();
	gfx.fillStyle = '#424242';
	gfx.fillRect(gridOffsetX, gridOffsetY, gridPixelSize, modeTrophiesHeight-gridMarginY-gridOffsetY*2);
	gfx.fillStyle = '#f0f0f0';
	drawText("Statistics", canvasWidth/2, 40+gridOffsetY, "40px Arial Bold", true, false)
	var w = gfx.measureText("Statistics").width;
	var ord = rInt(8)+1;
	rgb(polyColor[ord].secondary.r,polyColor[ord].secondary.g,polyColor[ord].secondary.b);
	gfx.fillRect(canvasWidth/2+w/2+12, gridOffsetY+10, 32, 32);
	gfx.fillRect(canvasWidth/2-w/2-42, gridOffsetY+10, 32, 32);

	rgb(polyColor[ord].primary.r,polyColor[ord].primary.g,polyColor[ord].primary.b);
	gfx.fillRect(canvasWidth/2+w/2+14, gridOffsetY+12, 28, 28);
	gfx.fillRect(canvasWidth/2-w/2-40, gridOffsetY+12, 28, 28);

	var rightBuffer = gridPixelSize/2;
	var y = 80+gridOffsetY;
	var lineHeight = 36;
	for(var i in _trophyData){
		var name = _trophyData[i].name;
		var value = _trophyData[i].value;
		var color = _trophyData[i].color;
		gfx.fillStyle = '#f0f0f0';
		drawText(name, canvasWidth/2-rightBuffer+30,y, "22px Arial", false, false);
		drawText(value, canvasWidth/2+rightBuffer/2,y, "22px Arial", false, false);
		gfx.fillRect(gridOffsetX+20, y+10, gridPixelSize-40, 2);

		if(color){
			rgb(polyColor[color].secondary.r,polyColor[color].secondary.g,polyColor[color].secondary.b);
			gfx.fillRect(canvasWidth/2-rightBuffer+30, y-13, 10, 10);
		}
		y += lineHeight;
	}
	var x = gridOffsetX + 10;
	y+= 100;
	var cs = 16;
	var baseXOffset = Math.floor((gridPixelSize-Math.floor(gridPixelSize/(cs*6+2)) * (cs*6+2)-2)/2);
	var xoffset = baseXOffset;
	for(var ord = 2; ord < 7; ord++){
		for(var id = 0; id < getPossibleOneSidedCount(ord); id++){
			var poly = getMatrixWithShape(ord, id);
			console.log(poly);

			var renderPoly = function(xoff, o, color){
				for(var i = 0; i < ord; i++){
					for(var j = 0; j < ord; j++){
						if(poly[i][j]){
							rgb(color);
							renderRect(xoff+x+i*cs+o, y+j*cs+o,xoff+x+(i+1)*cs-o, y+(j+1)*cs-o);
							if(i < ord-1 && poly[i+1][j]) renderRect(xoff+x+(i+1)*cs-o, y+j*cs+o,xoff+x+(i+1)*cs+o, y+(j+1)*cs-o);
							if(j < ord-1 && poly[i][j+1]) renderRect(xoff+x+i*cs+o, y+(j+1)*cs-o,xoff+x+(i+1)*cs-o, y+(j+1)*cs+o);
						}
					}
				}
			}
			if(gameShapeCount[ord][id] > 0){
				renderPoly(xoffset, 1, polyColor[ord].secondary);
				renderPoly(xoffset, 3, polyColor[ord].primary);
			}
			else{
				renderPoly(xoffset, 1, polyColor[1].secondary);
				renderPoly(xoffset, 3, polyColor[1].primary);
			}
			xoffset += cs * 6 + 2;
			if(xoffset >  (gridPixelSize - cs*6 - 10)){
				y += 6 * cs + 2;
				xoffset = baseXOffset;
			}
		}
	}
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
