/*global a2d, a2d */
/**
 * Label. For text.
 * @class
 * @param {string} text to display
 * @augments a2d.Node 
 */
a2d.Label = function(t) {
	'use strict';
	a2d.Node.apply(this);
	var self = this, 
		text = t,
		$draw = this.draw.bind(this);

	/**
	* set to font string
	* @example
	* var label = new a2d.Label("hello world");
	* label.font = "21px Courier New";
	* a2d.root.push(label);
	*/
	this.font = "21px Arial";	
	this.draw = function() {
		var p = self.position.clone();
		if(!self.scrollLock) {
			p.add(a2d.offset);
		}
		a2d.context.font = self.font;
		a2d.context.fillText(text, p.X, p.Y);
		$draw();
	}
};