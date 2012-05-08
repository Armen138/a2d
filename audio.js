/**
 * A convenience wrapper for html5 audio
 */
a2d.Audio = function() {
	this.channels = [];
	this.channels.length = 8;
	this.play = function() {
		if(!a2d.mute) {
			var played = false;
			for(var i = 0; i < this.channels.length; i++){
				if(this.channels[i].currentTime == 0 || this.channels[i].ended) {
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
		}
	});
};