particles = [];
effects = [];

function tickParticles(){
	for(var e = 0; e < effects.length; e++){
		if(effects[e].makeParticle()){
			effects.splice(e, 1);
			e--;
		}
	}
	for(var p = 0; p < particles.length; p++){
		if(particles[p].tick()){ //kill the particle
			particles.splice(p, 1);
			p--;
		}
	}
}

function addEffect(effect){
	effects.push(effect);
	currentlyAnimating = true;
}

function testParticles(a, b){

	for(var i = 0; i < 3; i++){
		var x = a;
		var y = b;
		var vx = undefined;
		var vy = undefined;
		var lifetime = rInt(1000) + 500;
		var startr = 255;
		var startg = 255;
		var startb = 99;
		var starta = 1;
		var startscale = rInt(20);
		var endr = 255;
		var endg = 0;
		var endb = 0;
		var enda = 0;
		var endscale = rInt(20);
		var border = 1;
		var gravity = rFloat(0.0025)+0.0025
		new particle(x, y, vx, vy, lifetime, startr, startg, startb, starta, startscale, endr, endg, endb, enda, endscale, border, gravity)}
}

function squareEffect(order, x, y, size, time){
	this.x = x;
	this.y = y;
	this.size = size;
	this.segment = 1;
	this.stepsize = 5;
	this.iter = 0;

  //console.log("particle.squareEffect: order="+order +", polyColor[order]="+polyColor[order]);
	//var sparkColors = [{r:255,g:10,b:10},{r:255,g:255,b:60},{r:200,g:100,b:0}];
  var sparkColors = [{r:polyColor[order].primary.r*255,
                      g:polyColor[order].primary.g*255,
                      b:polyColor[order].primary.b*255},
                    {r:polyColor[order].secondary.r*255,
                      g:polyColor[order].secondary.g*255,
                      b:polyColor[order].secondary.b*255}];

	this.makeParticle = function(){
		var i = this.iter += this.stepsize;
		if(i/this.segment >= this.size){
			this.segment++;
		}
		if(this.segment > 4)
			return true;

		switch(this.segment){
			case 1:
				this.x += this.stepsize;
				break;
			case 2:
				this.y += this.stepsize;
				break;
			case 3:
				this.x -= this.stepsize;
				break;
			case 4:
				this.y -= this.stepsize;
				break;
		}
		var num = rInt(2)+2;
		for(var n = 0; n < num; n++){
			var c = sparkColors[rInt(sparkColors.length)];
			new particle(this.x, this.y, undefined, undefined, rInt(200)+100,
				c.r, c.g, c.b, 1, rInt(10),
				c.r, c.g, c.b, 1, rInt(10),
				1, rFloat(0.0025)+0.0025);
		}
		return false;
	}
}

function testParticleSquare(){
	for(var i = 100; i < 200; i+= 10){
		testParticles(100, i);
		testParticles(200, i);
		testParticles(i, 100);
		testParticles(i, 200);
	}

}

function particle(x, y, vx, vy, lifetime, startr, startg, startb, starta, startscale, endr, endg, endb, enda, endscale, border, gravity){
  //(by Joel) This call has too many arguments (17).
  // Even if we were using a strongly typed language, it would be very hard use this without making a bug.
  // In javascript, this is just asking for a bug.
  //Where you call this, you split color up into r, g and b. Better to pass it color and have 2 less
  // paremeters.

  // Also, replace some of the constants passed as parameters with constents set in this constructor.
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    var velamt = 0.01;
    if(vx === undefined && vy === undefined){
      this.vx = rFloat(velamt)-(velamt/2);
      this.vy = rFloat(velamt)-(velamt/2);
      var invmag = (rFloat(velamt)-(velamt/2))/(this.vx * this.vx + this.vy * this.vy);
      this.vx *= invmag;
      this.vy *= invmag;
    }
    this.lifetime = lifetime || 1000;
    this.endTick = tick+this.lifetime;
    this.startTick = tick;
    this.gravity = gravity || 0;
    this.startr = startr;
    this.startg = startg;
    this.startb = startb;
    this.starta = starta;
    this.endr = endr;
    this.endg = endg;
    this.endb = endb;
    this.enda = enda;
    this.r = this.startr;
    this.g = this.startg;
    this.b = this.startb;
    this.a = this.starta;

    this.startscale = startscale || 10;
    this.endscale = endscale || this.startscale;

    this.scale = this.startscale;
    this.border = border || 2;
    this.id = particles.length;
    particles[this.id] = this;
    currentlyAnimating = true;

    this.tick = function(){
      var interp = (tick - this.startTick)/this.lifetime;
      this.x += this.vx;
      this.y += this.vy;
      this.vy += gravity * elapsed;
      this.scale = this.startscale + (this.endscale-this.startscale)*interp;
      this.r = this.startr + (this.endr-this.startr)*interp;
      this.g = this.startg + (this.endg-this.startg)*interp;
      this.b = this.startb + (this.endb-this.startb)*interp;
      this.a = this.starta + (this.enda-this.starta)*interp;

      //gfx.fillStyle = 'rgba(255, 255, 255,' + this.a + ')';
      //gfx.fillRect(this.x-this.scale/2, this.y-this.scale/2, this.scale, this.scale);
      //gfx.fillStyle = 'rgba(' + Math.floor(this.r) + ',' + Math.floor(this.g) + ',' + Math.floor(this.b) + ',' + this.a + ')';
      //gfx.fillRect(this.x-this.scale/2+this.border, this.y-this.scale/2+this.border, this.scale-(this.border*2), this.scale-(this.border*2));

      //(by Joel): removing the white border around each partical - just to see if we like this.
      gfx.fillStyle = 'rgba(' + Math.floor(this.r) + ',' + Math.floor(this.g) + ',' + Math.floor(this.b) + ',' + this.a + ')';
      gfx.fillRect(this.x-this.scale/2, this.y-this.scale/2, this.scale, this.scale);



      currentlyAnimating = true;
      if(tick >= this.endTick){
        return true;
      }

      return false;
    }

  }
