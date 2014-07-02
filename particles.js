function Particle(point, velocity, acceleration) {
  this.position = point || new Vector(0, 0);
  this.velocity = velocity || new Vector(0, 0);
  this.acceleration = acceleration || new Vector(0, 0);


	this.submitToFields = function (fields) {
	  // our starting acceleration this frame
	  var totalAccelerationX = 0;
	  var totalAccelerationY = 0;

	  // for each passed field
	  for (var i = 0; i < fields.length; i++) {
	    var field = fields[i];

	    // find the distance between the particle and the field
	    var vectorX = field.position.x - this.position.x;
	    var vectorY = field.position.y - this.position.y;

	    // calculate the force via MAGIC and HIGH SCHOOL SCIENCE!
	    var force = field.mass / Math.pow(vectorX*vectorX+vectorY*vectorY,1.5);

	    // add to the total acceleration the force adjusted by distance
	    totalAccelerationX += vectorX * force;
	    totalAccelerationY += vectorY * force;
	  }

	  // update our particle's acceleration
	  this.acceleration = new Vector(totalAccelerationX, totalAccelerationY);
	};

	this.move = function () {
	  this.velocity.add(this.acceleration);
	  this.position.add(this.velocity);
	};
}

function Field(point, mass) {
  this.position = point;

	this.setMass = function(mass) {
	  this.mass = mass || 100;
	  this.drawColor = mass < 0 ? "#f00" : "#0f0";
	}

	this.setMass(mass);
}

function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;


	this.add = function(vector) {
	  this.x += vector.x;
	  this.y += vector.y;
	}

	this.getMagnitude = function () {
	  return Math.sqrt(this.x * this.x + this.y * this.y);
	};

	this.getAngle = function () {
	  return Math.atan2(this.y,this.x);
	};
}

Vector.fromAngle = function (angle, magnitude) {
  return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};

function Emitter(point, velocity, spread) {
  this.position = point; // Vector
  this.velocity = velocity; // Vector
  this.spread = spread || Math.PI / 32; // possible angles = velocity +/- spread
  this.drawColor = "#999"; // So we can tell them apart from Fields later

	this.emitParticle = function() {
	  // Use an angle randomized over the spread so we have more of a "spray"
	  var angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2);

	  // The magnitude of the emitter's velocity
	  var magnitude = this.velocity.getMagnitude();

	  // The emitter's position
	  var position = new Vector(this.position.x, this.position.y);

	  // New velocity based off of the calculated angle and magnitude
	  var velocity = Vector.fromAngle(angle, magnitude);

	  // return our new Particle!
	  return new Particle(position,velocity);
	};
}



function ParticleSystem(canvas){
	this.maxParticles = 20000,
	this.particleSize = 1;
	this.emissionRate = 20;
	this.objectSize = 3; // drawSize of emitter/field


	this.canvas = canvas;
	this.gfx = this.canvas.getContext('2d');

	this.particles = [];
	midX = this.canvas.width / 2;
	midY = this.canvas.height / 2;

	// Add one emitter located at `{ x : 100, y : 230}` from the origin (top left)
	// that emits at a velocity of `2` shooting out from the right (angle `0`)
	this.emitters = [new Emitter(new Vector(midX - 150, midY), Vector.fromAngle(0, 2))];

	// Add one field located at `{ x : 400, y : 230}` (to the right of our emitter)
	// that repels with a force of `140`
	this.fields = [new Field(new Vector(midX + 150, midY), -140)];

	this.tick = function(){
	  this.addNewParticles();
	  this.plotParticles(this.canvas.width, this.canvas.height);

		this.gfx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	  this.drawParticles();
	  this.fields.forEach(this.drawCircle);
	  this.emitters.forEach(this.drawCircle);
	}

	this.addNewParticles = function() {
	  if (this.particles.length > this.maxParticles) return;
	  for (var i = 0; i < this.emitters.length; i++) {
	    for (var j = 0; j < this.emissionRate; j++) {
	      this.particles.push(this.emitters[i].emitParticle());
	    }
	  }
	}

	this.plotParticles = function(boundsX, boundsY) {
	  // a new array to hold particles within our bounds
	  var currentParticles = [];

	  for (var i = 0; i < this.particles.length; i++) {
	    var particle = this.particles[i];
	    var pos = particle.position;

	    // Do bounds checking
	    if (pos.x < 0 || pos.x > boundsX || pos.y < 0 || pos.y > boundsY) continue;

	    // Update velocities and accelerations to account for the fields
	    particle.submitToFields(this.fields);

	    // Move our particles
	    particle.move();

	    // Add this particle to the list of current particles
	    currentParticles.push(particle);
	  }

	  // Update our particles
	  this.particles = currentParticles;
	}


	this.drawParticles = function() {
	  this.gfx.fillStyle = 'rgb(0,0,255)';
	  for (var i = 0; i < this.particles.length; i++) {
	    var position = this.particles[i].position;
	    this.gfx.fillRect(position.x, position.y, this.particleSize, this.particleSize);
	  }
	}


	this.drawCircle = function(object) {
	  this.gfx.fillStyle = object.drawColor;
	  this.gfx.beginPath();
	  this.gfx.arc(object.position.x, object.position.y, this.objectSize, 0, Math.PI * 2);
	  this.gfx.closePath();
	  this.gfx.fill();
	}
}
