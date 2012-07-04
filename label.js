/*global a2d, a2d */
/**
 * Label. For text.
 * @class
 * @param {string} text to display
 * @augments a2d.Node 
 */
a2d.Label = function(t, opts) {
	'use strict';
	a2d.Node.apply(this);
	var self = this, 
		$draw = this.draw.bind(this),
		text = "",
		font = "21px Arial",
		size = new a2d.Dimension(0, 0),
		updateBB = function() {
            var x = self.position.X,
              y = self.position.Y;
            if(x < 0) { x += a2d.dimension.Width; }
            if(y < 0) { y += a2d.dimension.Height; }

            self.boundingBox.topLeft.X = x - size.Width / 2;
            self.boundingBox.topLeft.Y = y - size.Height / 2;
            self.boundingBox.bottomRight.X = x + size.Width / 2;
            self.boundingBox.bottomRight.Y = y + size.Height / 2;
            self.boundingBox.topRight.X = x + size.Width / 2;
            self.boundingBox.topRight.Y = y - size.Height / 2;
            self.boundingBox.bottomLeft.X = x - size.Width / 2;
            self.boundingBox.bottomLeft.Y = y + size.Height / 2;	            	
		};

	this.__defineSetter__("text", function(newtext) {
		text = newtext;
		a2d.context.font = self.font;
		size.Width = a2d.context.measureText(text).width;
		size.Height = a2d.context.measureText("m").width;
	})

	this.__defineGetter__("text", function() { return text; });

	this.__defineSetter__("font", function(newfont) {
		font = newfont;
		a2d.context.font = font;
		size.Width = a2d.context.measureText(text).width;
		size.Height = a2d.context.measureText("m").width;
	})

	this.__defineGetter__("font", function() { return font; });

	this.text = t;
	this.border = { width: 0, color: "black" };

	/**
	* set to font string
	* @example
	* var label = new a2d.Label("hello world");
	* label.font = "21px Courier New";
	* a2d.root.push(label);
	*/
	this.color = "#000";
	this.textAlign = "center";
	this.draw = function() {
		updateBB();
		var p = self.absolutePosition.clone();
		if(self.scrollLock && p.X < 0) {
			p.X += a2d.dimension.Width;              
		}
		if(self.scrollLock && p.Y < 0) {
			p.Y += a2d.dimension.Height;
		}		
		p.add(this.offset);
		if(this.relative) {
			p.add(this.parent.position);
		}	

  		//p.X -= a2d.context.measureText(text).width / 2;
  		//p.Y -= a2d.context.measureText("m").width / 2;
  		a2d.context.globalAlpha = this.opacity;
  		a2d.context.textAlign = this.textAlign;//"center";
  		a2d.context.textBaseline = "middle";
		a2d.context.font = self.font;
		a2d.context.fillStyle = self.color;
		if(this.border.width !== 0) {
			a2d.context.lineWidth = this.border.width;
			a2d.context.strokeStyle = this.border.color;
			a2d.context.strokeText(this.text, p.X, p.Y);
		}		
		a2d.context.fillText(this.text, p.X, p.Y);
		$draw();
	}

	if(opts) {
		this.set(opts);
	}	
};