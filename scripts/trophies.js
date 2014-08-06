//Having multiple HTML pages introduces a lot of complexity
//Instead, use this flag to determine whether we're on the trophy pages

var modeTrophies = false;

var modeTrophiesHeight = 2000;
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
	var m = function(a, b){ return {name:a,value:b}};

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
	_trophyData.push(m("Polyominos Merged:", localStorage.getItem("totalMerges")));

	for(var o=2; o<9; o++){
		var num = localStorage.getItem("#of"+o);
		_trophyData.push(m("    " + POLYOMINO_NAME[o]+"s:", num));
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
	//drawText("Polyomino", gridOffsetX+4, 44, "italic small-caps bold 40px arial");
	gfx.drawImage(img_polyomino, gridOffsetX+4, 6);


	getTrophyData();
	gfx.fillStyle = '#424242';
	gfx.fillRect(gridOffsetX, gridOffsetY, gridPixelSize, modeTrophiesHeight-gridMarginY-gridOffsetY*2);
	gfx.fillStyle = '#f0f0f0';
	drawText("Statistics", canvasWidth/2, 40+gridOffsetY, "40px Arial Bold", true, false)

	var rightBuffer = gridPixelSize/2;
	var y = 80+gridOffsetY;
	var lineHeight = 36;
	for(var i in _trophyData){
		var name = _trophyData[i].name;
		var value = _trophyData[i].value;
		gfx.fillStyle = '#f0f0f0';
		drawText(name, canvasWidth/2-rightBuffer+30,y+i*lineHeight, "22px Arial", false, false);
		drawText(value, canvasWidth/2+rightBuffer/2,y+i*lineHeight, "22px Arial", false, false);
		gfx.fillRect(gridOffsetX+20, y+i*lineHeight+10, gridPixelSize-40, 2);

		var ord = i%8 + 1;
		rgb(polyColor[ord].secondary.r,polyColor[ord].secondary.g,polyColor[ord].secondary.b);
		gfx.fillRect(gridOffsetX+4, y+i*lineHeight-13, 10, 10);
		// gfx.fillRect(gridOffsetX+gridPixelSize - 14, y+i*lineHeight-13, 10, 10);
	}
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
