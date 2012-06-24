/**
 * A convenience wrapper for html5 audio
 */
a2d.Audio = function() {
	var self = this;
	this.channels = [];
	this.channels.length = 8;
	this.stop = function() {
		for(var i = 0; i < this.channels.length; i++){
			if(!this.channels[i].paused) {
				this.channels[i].pause();
				this.channels[i].currentTime = 0;			
			}
		}
	};
	this.play = function(loop) {
		var doloop = loop || false;
		if(!a2d.mute) {
			var played = false;
			for(var i = 0; i < this.channels.length; i++){
				if(this.channels[i].currentTime == 0 || this.channels[i].ended) {
					this.channels[i].loop = doloop;
					this.channels[i].play();
					played = true;
					break;
				}
			}
			if(!played) {
				this.channels[0].pause();
				this.channels[0].currentTime = 0;
				this.channels[0].play();
			}
		}
	};
	this.__defineSetter__("src", function(path) {
		for(var i = 0; i < this.channels.length; i++) {
			this.channels[i] = new Audio();
			this.channels[i].src = path;
			this.channels[i].addEventListener("canplaythrough", function() { self.audioLoaded = true; if(self.onload) { self.onload.call(); } } );
		}
	});
	this.onload = function() { alert("load!"); };
};