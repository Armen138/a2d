/*global document, window */

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
            try {
          return fToBind.apply(this instanceof fNOP
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
            } catch(e) {
                //catching what javascriptcore considers an illegal use of instanceof
                return fToBind.apply(oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            }
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

/**
 * A happy namespace for all game engine stuffs.
 * @namespace
 * @augments a2d.Events
 * */
 var a2d = {
    /** a2d engine version */
    version: "0.4.0.2",
    /** @private */
    a2dCanvas: null,
    a2dRoot: null,
    a2dFullSCreen: false,
    //a2dOffset: null,
    forceClear: false,
    resources: [],
    loaded: false,
    logicInterval: 30,
    /* offset: {
        X: 0, 
        Y: 0
    },*/
    mute: false,
    /**
     * Load resources.
     * @param {object} loadData A key->value collection where key is the name of the resource, and value the path.
     */
    load: function (loadData) {
        var name;
        for (name in loadData) {
            if(loadData.hasOwnProperty(name)) {
                if (loadData[name].match(/png$|jpg$|jpeg$|gif$|bmp$/i)) {
                    this.resources[name] = new Image();
                } else {
                    this.resources[name] = new a2d.Audio();
                }
                this.resources[name].onload = this.progress;
                this.resources[name].onreadystatechange = function() { this.progress(); };
                this.resources[name].src = loadData[name];
            }
        }
        this.progress();
    },
    /** @private */
    progress: function () {
        var name,
            total = 0,
            c = 0;
        if(!a2d.loaded) {
            for (name in a2d.resources) {
                if(a2d.resources.hasOwnProperty(name)) {
                    if((a2d.resources[name].width && a2d.resources[name].width > 0) || a2d.resources[name].audioLoaded /*|| (a2d.resources[name].play)*/) {
                        c++;
                    }
                    total++;
                }
            }
            if(c == total) {
                a2d.loaded = true;
                a2d.fireEvent("load");
            } else {
                a2d.fireEvent("progress", { loaded : c, total: total });
            }
        }
    },
    /**
     * Get or set the canvas.
     * Assigning a string to this property will attempt to find the canvas with the given string as an ID.
     * If no canvas is set, an attempt is made to "auto-detect" a canvas in the DOM. If not found, one will be
     * created and added to the DOM.
     * @property {HTMLCanvasElement} canvas
     * @name a2d#canvas
     */
    get canvas() {
        if(!this.a2dCanvas){
            console.log("acquire canvas");
            if(document && document.getElementsByTagName) {
                this.a2dCanvas = document.getElementsByTagName("canvas")[0];
            }
            //this is only the initial setup of the canvas element and its events
            if(!this.a2dCanvas) {
                this.a2dCanvas = document.createElement("canvas");
                document.body.appendChild(this.a2dCanvas);
                var windowSize = new a2d.Dimension(window.innerWidth, window.innerHeight);
                //this.setSize(windowSize);
                //this.a2dCanvas.setAttribute("width", windowSize.Width);
                //this.a2dCanvas.setAttribute("height", windowSize.Height);                
                this.a2dCanvas.width = windowSize.Width;
                this.a2dCanvas.height = windowSize.Height;
            }
            a2d.mousePosition = new a2d.Position(0, 0);
            this.a2dCanvas.addEventListener("mousemove", function(e) {
                var x = e.clientX + a2d.canvas.offsetLeft;
                var y = e.clientY + a2d.canvas.offsetTop;
                a2d.mousePosition = new a2d.Position(x, y);
                //a2d.mousePosition.subtract(a2d.offset);
            });
            this.a2dCanvas.addEventListener("mousedown", function(e) {
                var clickedNode = a2d.root.findNodeAt(a2d.mousePosition);
                if(clickedNode) {
                    clickedNode.fireEvent.call(clickedNode, "mousedown");
                }
            });
            this.a2dCanvas.addEventListener("mouseup", function(e) {
                var clickedNode = a2d.root.findNodeAt(a2d.mousePosition);
                if(clickedNode) {
                    clickedNode.fireEvent.call(clickedNode, "mouseup");
                    clickedNode.fireEvent.call(clickedNode, "click");
                }
            });
            window.addEventListener("resize", this.onResize);
            this.context = this.a2dCanvas.getContext("2d");
            
        }
        return this.a2dCanvas;
    },
    onResize: function() {
        if(this.a2dCanvas) {
            this.a2dCanvas.style.position = "absolute";
            this.a2dCanvas.style.width = "100%";
            this.a2dCanvas.style.height = "100%";
            this.a2dCanvas.style.top = "0";
            this.a2dCanvas.style.left = "0";

            this.dimension = new a2d.Dimension( parseInt(getComputedStyle(canvas, null).getPropertyCSSValue("height").cssText, 10),
                                                parseInt(getComputedStyle(canvas, null).getPropertyCSSValue("width").cssText, 10));
        }
    },
    set canvas(canvasID){
        this.a2dCanvas = document.getElementById(canvasID);
    },
    /**
     * The canvas size. You can resize the canvas by setting this.
     * @property {a2d.Dimension} the canvas size.
     * @name a2d#dimension
     */
    get dimension() {
        return new a2d.Dimension(this.canvas.width, this.canvas.height);
    },
    set dimension(newsize) {
        this.canvas.setAttribute("width", newsize.Width);
        this.canvas.setAttribute("height", newsize.Height);
    },
    /**
     * The root sceneNode. Attach nodes you want displayed to this.
     * @property {a2d.SceneNode} the root scene node.
     * @name a2d#root
     */
    get root() {
        if(!this.a2dRoot){
            console.log("acquire root node");
            this.a2dRoot = new a2d.Node();
            this.frame();
            //this.update();
        }
        return this.a2dRoot;
    },
    set fullscreen(b) {
        this.a2dFullScreen = b;

        if(b) {
            if (this.canvas.requestFullScreen) {
                this.canvas.requestFullScreen();
            } else if (this.canvas.mozRequestFullScreen) {
                this.canvas.mozRequestFullScreen();
            } else if (this.canvas.webkitRequestFullScreen) {
                this.canvas.webkitRequestFullScreen();
            }            
        }        
        this.onResize();
    },
    get fullscreen() {
        return this.a2dFullScreen;
    },
    set root(node) {
        this.a2dRoot = node;
    },
    /** @private */
    update: function() {            
        //a2d.fireEvent("update");
        setTimeout(a2d.update, a2d.logicInterval);        
    },
    /** @private */
    frame : function () {     
        if(a2d.forceClear && a2d.context) {
            a2d.context.clearRect(0, 0, a2d.dimension.Width, a2d.dimension.Height);
            //a2d.canvas.width = a2d.canvas.width;
        }   
        a2d.requestFrame(a2d.frame);        
        //window.webkitRequestAnimationFrame(a2d.frame);
        a2d.root.draw();
        a2d.fireEvent("draw");
    },
    /** 
     * Request animation frame. 
     * Browser-specific animation frame, or 60fps timeout callback.
     * @param {Function} function to be executed when an animation frame is ready.
     */            
    requestFrame: (function(){    
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
    }()).bind(window),
    /**
     * named keys
     * @namespace
     */
    key: {
        /** @constant */
        BACKSPACE:8,
        /** @constant */
        TAB:9,
        /** @constant */
        ENTER:13,
        /** @constant */
        SHIFT:16,
        /** @constant */
        CTRL:17,
        /** @constant */
        ALT:18,
        /** @constant */
        PAUSE:19,
        /** @constant */
        CAPS_LOCK:20,
        /** @constant */
        ESC:27,
        /** @constant */
        SPACE:32,
        /** @constant */
        PAGEUP:33,
        /** @constant */
        PAGEDOWN:34,
        /** @constant */
        END:35,
        /** @constant */
        HOME:36,
        /** @constant */
        ARROW_LEFT:37,
        /** @constant */
        ARROW_UP:38,
        /** @constant */
        ARROW_RIGHT:39,
        /** @constant */
        ARROW_DOWN:40,
        /** @constant */
        INSERT:45,
        /** @constant */
        DELETE:46,
        /** @constant */
        F1:112,
        /** @constant */
        F2:113,
        /** @constant */
        F3:114,
        /** @constant */
        F4:115,
        /** @constant */
        F5:116,
        /** @constant */
        F6:117,
        /** @constant */
        F7:118,
        /** @constant */
        F8:119,
        /** @constant */
        F9:120,
        /** @constant */
        F10:121,
        /** @constant */
        F11:122,
        /** @constant */
        F12:123,
        /** @constant */
        NUM_LOCK:144,
        /** @constant */
        SCROLL_LOCK:145
    }
};
/**
 * fired when a frame is drawn.
 * @event
 * @name a2d#draw
 */

/**
 * fired when all resources have been loaded.
 * @event
 * @name a2d#load
 */

/**
 * fired when progress is made loading resources.
 * @event
 * @name a2d#progress
 * @param {object} eventObject
 * @param {number} eventObject.loaded the number of resources loaded
 * @param {number} eventObject.total the total number of resources
 */

