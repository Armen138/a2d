/**
 * A convenience wrapper for html5 audio
 */
a2d.Audio = function() {
	var self = this;
	this.file = new Audio();
	this.canPlay = {};
	this.canPlay.mp3 = this.file.canPlayType("audio/mpeg");
	this.canPlay.ogg = this.file.canPlayType("audio/ogg");
	this.canPlay.wav = this.file.canPlayType("audio/wav");
	this.channels = [];
	this.channels.length = 8;
	this.file.addEventListener("canplaythrough", function() { self.audioLoaded = true; if(self.onload) { self.onload(); } } );

	this.stop = function() {
		for(var i = 0; i < this.channels.length; i++){
			if(this.channels[i] && !this.channels[i].paused) {
				this.channels[i].pause();
				this.channels[i].currentTime = 0;			
			}
		}
	};
	this.play = function(loop) {
		var doloop = loop || false;
		if(!a2d.mute && this.audioLoaded) {
			var played = false;
			for(var i = 0; i < this.channels.length; i++){
				if(!this.channels[i]) {
					this.channels[i] = new Audio(this.file.src);	
					this.channels[i].paused = true;				
				}
				if(this.channels[i].currentTime == 0 || this.channels[i].ended) {
					this.channels[i].loop = doloop;
					this.channels[i].play();
					console.log("play: " + this.channels[i].src);
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
		var fileType = path.substr(path.lastIndexOf(".") + 1).toLowerCase();
		if(this.canPlay[fileType]) {
			this.file.src = path;
			this.file.pause();
		}
		else {
			this.audioLoaded = true;
			if(this.onload) {
				this.onload();
			}
		}
		/*for(var i = 0; i < this.channels.length; i++) {
			this.channels[i] = new Audio();
			this.channels[i].src = path;
			this.channels[i].addEventListener("canplaythrough", function() { self.audioLoaded = true; if(self.onload) { self.onload.call(); } } );
		}*/
	});
};