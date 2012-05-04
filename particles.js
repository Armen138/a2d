/**
 * Particle System
 * @class
 * @augments a2d.Node
 * @param {object} particleSettings
 * @param {number} particleSettings.frequency frequency in Hz(particles per second)
 * @param {a2d.Vector} particleSettings.startScale scale of the particle at the beginning of its life
 * @param {a2d.Vector} particleSettings.endScale scale of the particle at the end of its life
 * @param {number} particleSettings.speed speed particle move at in px/sec
 * @param {Image} particleSettings.image the image to use for particles
 * @param {number} particleSettings.life the life time of a particle
 */
a2d.Particles = function(particleSettings) {
	a2d.Node.apply(this);
	var self = this,
		particleLife = particleSettings.lifeTime || 1000,
		particleSpeed = particleSettings.speed || 200,
		frequency = particleSettings.frequency || 300,
		rotateSpeed = particleSettings.rotateSpeed || 0.01,
		startScale = particleSettings.startScale || 1.0,
		endScale = particleSettings.endScale || 0.0,
		particleImage = particleSettings.image,
		lastParticle = 0,
		lastParticleUpdate = 0,
		$draw = this.draw.bind(this);
	self.position = particleSettings.position || new a2d.Position(0, 0);

	this.draw = function() {
		var now = (new Date()).getTime();
		if(lastParticle === 0) {
			lastParticle = now;
		}
		if(lastParticleUpdate === 0) {
			lastParticleUpdate = now;
		}
		var passed = now - lastParticle;
		var newParticles = Math.floor(passed / (1000 / frequency));
		if(newParticles > 0);
		for(var i = 0; i < newParticles; i++) {
		//if(now > lastParticle + 1000 / frequency) {
			var p = new a2d.AnimatedTileNode(particleImage),
				d = Math.random() * 6.28; //2*PI
			p.birth = (new Date()).getTime();
			//p.relative = true;
			p.position = new a2d.Position(self.position.X, self.position.Y);
			if(self.relative) {
				p.position.add(this.parent.position);
			}
			p.dir = new a2d.Vector(Math.cos(d), Math.sin(d));
			lastParticle = p.birth;
			self.push(p);
		}
		for(var i = self.length - 1; i >= 0; --i) {
			var life = now - self[i].birth,
				scaleDiff = startScale - endScale;
			//console.log(self[i].opacity);
			self[i].opacity = 1.0 - life / particleLife;
			self[i].angle = (life / particleLife) * (360 * rotateSpeed);
			self[i].scale.X = startScale - ((life / particleLife) * scaleDiff);
			self[i].scale.Y = startScale - ((life / particleLife) * scaleDiff);
			self[i].position.X += self[i].dir.X * particleSpeed * ((now - lastParticleUpdate) / 1000);
			self[i].position.Y += self[i].dir.Y * particleSpeed * ((now - lastParticleUpdate) / 1000);
			if(life > particleLife) {
				self.remove(i);
			}
		}
		lastParticleUpdate = now;
		$draw();
	}
};