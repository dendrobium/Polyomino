particles = [];

function tickParticles(){
	for(var p = 0; p < particles.length; p++){
		if(particles[p].tick()){ //kill the particle
			particles.splice(p, 1);
			p--;
		}
	}
}

function testParticles(){
	

	for(var i = 0; i < 20; i++){
		var x = 100;
		var y = 100;
		var vx = undefined;
		var vy = undefined;
		var lifetime = rInt(1000) + 500;
		var startr = 255
		var startg = 130;
		var startb = 60;
		var starta = 1;
		var startscale = rInt(30);
		var endr = 0;
		var endg = 60;
		var endb = 255;
		var enda = 0;
		var endscale = rInt(30);
		var border = 1;
		new particle(x, y, vx, vy, lifetime, startr, startg, startb, starta, startscale, endr, endg, endb, enda, endscale, border)}
}


function particle(x, y, vx, vy, lifetime, startr, startg, startb, starta, startscale, endr, endg, endb, enda, endscale, border){
	this.x = x;
	this.y = y;
	this.vx = vx || rFloat(6)-3;
	this.vy = vy || rFloat(6)-3;
	if(!(vx && vy)){
		var invmag = (rFloat(6)-3)/(this.vx * this.vx + this.vy * this.vy);
		this.vx *= invmag;
		this.vy *= invmag;
	}
	this.lifetime = lifetime || 1000;
	this.endTick = tick+this.lifetime;
	this.startTick = tick;

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
		this.scale = this.startscale + (this.endscale-this.startscale)*interp;
		this.r = this.startr + (this.endr-this.startr)*interp;
		this.g = this.startg + (this.endg-this.startg)*interp;
		this.b = this.startb + (this.endb-this.startb)*interp;
		this.a = this.starta + (this.enda-this.starta)*interp;

		gfx.fillStyle = 'rgba(255, 255, 255,' + this.a + ')';
		gfx.fillRect(this.x-this.scale/2, this.y-this.scale/2, this.scale, this.scale);
		gfx.fillStyle = 'rgba(' + Math.floor(this.r) + ',' + Math.floor(this.g) + ',' + Math.floor(this.b) + ',' + this.a + ')';
		gfx.fillRect(this.x-this.scale/2+this.border, this.y-this.scale/2+this.border, this.scale-(this.border*2), this.scale-(this.border*2));
	
		currentlyAnimating = true;
		if(tick >= this.endTick){
			return true;
		}
		
		return false;
	}

}
