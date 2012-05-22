/*global a2d, a2d */
/**
 * Animated Tile Node
 * @class
 * @param {Image} image Image element
 * @augments a2d.Node 
 */
a2d.Tile = function (image, opts) {
    'use strict';  
    a2d.Node.apply(this);    
    var frameTime = 0,
        tilePosition = new a2d.Position(0, 0),
        up = false,
        self = this,
        isRelative = false,
        parentPosition = null,
        $draw = this.draw.bind(this),
        guessTileSize = function() {
      			if(image.width < image.height) {
        				self.tileSize = new a2d.Dimension(image.width, image.width);
      			} else {
        				self.tileSize = new a2d.Dimension(image.height, image.height);
      			}
    		},
        updateBB = function() {
            var x = self.position.X,
              y = self.position.Y;
            if(x < 0) { x += a2d.dimension.Width; }
            if(y < 0) { y += a2d.dimension.Height; }

            self.boundingBox.topLeft.X = x - self.tileSize.Width / 2;
            self.boundingBox.topLeft.Y = y - self.tileSize.Height / 2;
            self.boundingBox.bottomRight.X = x + self.tileSize.Width / 2;
            self.boundingBox.bottomRight.Y = y + self.tileSize.Height / 2;
            self.boundingBox.topRight.X = x + self.tileSize.Width / 2;
            self.boundingBox.topRight.Y = y - self.tileSize.Height / 2;
            self.boundingBox.bottomLeft.X = x - self.tileSize.Width / 2;
            self.boundingBox.bottomLeft.Y = y + self.tileSize.Height / 2;
        };
    /** @type Image */
    this.image = image;
    /** @type number */
    this.tile = 0;
    /** @type boolean */
    this.loop = false;
    /** @type a2d.Vector */
    this.range = new a2d.Vector(0, 0);
    /** 
     * frames per second (does nothing if no frameloop is active)
     * @type number
     */
    this.fps = 8;
    /** 
     * angle
     * @type float
     */
    this.angle = 0.0;
    /** @type a2d.Dimension */
    this.tileSize = new a2d.Dimension(0, 0);
    /** @type a2d.Position */
    this.position = new a2d.Position(0, 0);
    /** 
      * 1.0 is opaque, 0.0 is transparent
      * @type float 
      */
    this.opacity = 1.0;
    /**
      * Set this to true to make it ignore the scrolling offset.
      * Mostly useful for UI
      * @type boolean 
      */
    this.scrollLock = false;

    /**
     * set which tile to display
     * @param {number} t The index of the tile to display for this node.
     */
    this.setTile = function (t) {
        this.tile = t;
        if(t !== -1) {
            tilePosition.Y = parseInt(t / (this.image.width / this.tileSize.Height), 10) * this.tileSize.Height;
            tilePosition.X = parseInt(t % (this.image.width / this.tileSize.Height), 10) * this.tileSize.Width;
        }
    };
    /**
     * Initiate a frameloop
     * @param {a2d.Vector} range Beginning and ending to loop over
     * @param {boolean} updown If set to true, reverses loop instead of repeating it
     */
    this.frameLoop = function(range, updown) {
        this.range = range;
        this.loop = updown;
        up = true;
        frameTime = new Date().getTime();        
    };
    /**
     * draws this node and its children
     * @param {HTMLCanvasElement} [canvas] canvas to draw to
     */
    this.draw = function (canvas, forceScale) {   
        var drawingCanvas = canvas || a2d.canvas;
        var drawingContext = drawingCanvas.getContext("2d");
        updateBB();
        if(frameTime !== 0){
            var currentTime = new Date().getTime() - frameTime;
            var totalFrames = this.range.Y - this.range.X;
            var totalMS = (totalFrames / this.fps) * 1000.0;              
            if(currentTime > totalMS){
                if(this.loop){                      
                      frameTime = new Date().getTime();
                      up = !up;
                } else {
                    frameTime = 0;
                    /**
                     * register this event to handle things when the animation ends.
                     * @name a2d.Tile#animationend
                     * @event
                     * @example
                     * animatedNode.on("animationend", function() {
                     *   alert("animation ended.");
                     * });
                     */
                    this.fireEvent("animationend");
                }            
            } else {
                var ftime = 1000.0 / this.fps;
                if (up) {
                    this.setTile(Math.floor(currentTime / ftime) + this.range.X);
                } else {                    
                    this.setTile(this.range.Y - Math.floor(currentTime / ftime));
                }        
            }
        }
            
        if(this.visible){
            var p = new a2d.Position(this.position.X, this.position.Y);
            if(self.scrollLock && p.X < 0) {
              p.X += a2d.dimension.Width;              
            }
            if(self.scrollLock && p.Y < 0) {
              p.Y += a2d.dimension.Height;
            }
            if(this.relative) {
                p.add(this.parent.position);
            }
            if(!this.scrollLock){ p.add(a2d.offset); }
            if(forceScale) { p.scale(forceScale); }
            drawingContext.save();
            drawingContext.translate(p.X, p.Y);
            drawingContext.rotate(this.angle);
            if(forceScale) {
              drawingContext.scale(forceScale.X, forceScale.Y);
            } else {
              drawingContext.scale(this.scale.X, this.scale.Y);
            }
            drawingContext.globalAlpha = this.opacity;
            drawingContext.drawImage(this.image, tilePosition.X, tilePosition.Y, this.tileSize.Width, this.tileSize.Height, -(this.tileSize.Width / 2), -(this.tileSize.Height / 2), this.tileSize.Width, this.tileSize.Height);
            drawingContext.restore();
        }
        $draw();
    };
    guessTileSize();
    if(opts) {
      this.set(opts);
    }
    this.setTile(this.tile);
};