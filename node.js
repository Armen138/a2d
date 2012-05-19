/*global a2d, window */
/**
 * Base node. Anything that is displayed inherits from this.
 * @augments a2d.Events
 * @augments a2d.Collection
 * @class
 */
//warning: SceneNode pretends to be an array, do not use numerical indices unless you know what you are doing...
a2d.Node = function () {
    'use strict';
    a2d.Collection.apply(this);
    a2d.Events.apply(this);    
    var self = this;
    this.scrollLock = false;      
    this.opacity = 1.0;
    /**
     * bounding box of this node, if applicable. Nodes that display things and want to handle mouse events should take care of setting this.
     * @type a2d.Rectangle
     */
    this.boundingBox = new a2d.Rectangle(new a2d.Position(0, 0), new a2d.Position(0, 0));    
    /**
     * True if mouse is currently over this node(and mouse tracking is enabled for this node)
     * @type boolean
     */
    this.hover = false;
    /**
     * Scale.
     * @default (1, 1)
     * @type a2d.Vector
     */
    this.scale = new a2d.Vector(1, 1);
    /**
     * Node will not be displayed when this is set to false.
     * @default true
     * @type boolean
     */    
    this.visible = true;
    /**
     * The name of this node. 
     * @default "SceneNode"
     * @type string
     */        
    this.name = "Node";
    /**
     * Find node at given position
     * @param {a2d.Position} position to look for
     * @returns node if found, null if not
     */
    this.findNodeAt = function(pos) {
        var searchPos = new a2d.Position(pos.X, pos.Y);
        if(this.scrollLock) {
            searchPos.add(a2d.offset);
        }
        //look up in reverse drawing order so only the top node is returned
        for(var i = self.length - 1; i >= 0; i--) {
            var found = self[i].findNodeAt(searchPos);
            if(found){
                return found;
            }
        }
        if(searchPos.isInside(self.boundingBox) && (self.hasEvent("click") || self.hasEvent("mousedown"))) {
            return self;
        }
        return null; 
    }    
    /**
     * Draws this node and its children
     */     
    this.draw = function () {
        var i,
            mouse = a2d.mousePosition ? new a2d.Position(a2d.mousePosition.X, a2d.mousePosition.Y) : new a2d.Position(0, 0);
        if(this.scrollLock) {
            mouse.add(a2d.offset);
        }        
        if(mouse && mouse.isInside(this.boundingBox)) {            
            if(!this.hover) {
                this.fireEvent("mouseover")
                this.hover = true
            }
        } else {
            if(this.hover) {
                this.fireEvent("mouseout");
                this.hover = false;
            }
        }
        if(this.visible) {
            for (i = 0; i < this.length; i++) {
                this[i].draw();
            }            
        }
        //this.fireEvent("draw");
    };
};

/*
a2d.Node2 = {
    scrollLock: false,
    opacity: 1.0,
    hover: false,
    scale: {1.0, 1.0},
    visible: true,
    name: "Node",
    findNodeAt: function(pos) {
        var searchPos = new a2d.Position(pos.X, pos.Y);
        if(this.scrollLock) {
            searchPos.add(a2d.offset);
        }
        //look up in reverse drawing order so only the top node is returned
        for(var i = self.length - 1; i >= 0; i--) {
            var found = self[i].findNodeAt(searchPos);
            if(found){
                return found;
            }
        }
        if(searchPos.isInside(self.boundingBox) && (self.hasEvent("click") || self.hasEvent("mousedown"))) {
            return self;
        }
        return null; 
    },
    draw: function () {
        var i,
            mouse = a2d.mousePosition ? new a2d.Position(a2d.mousePosition.X, a2d.mousePosition.Y) : new a2d.Position(0, 0);
        if(this.scrollLock) {
            mouse.add(a2d.offset);
        }        
        if(mouse && mouse.isInside(this.boundingBox)) {            
            if(!this.hover) {
                this.fireEvent("mouseover")
                this.hover = true
            }
        } else {
            if(this.hover) {
                this.fireEvent("mouseout");
                this.hover = false;
            }
        }
        if(this.visible) {
            for (i = 0; i < this.length; i++) {
                this[i].draw();
            }            
        }
        //this.fireEvent("draw");
    },
    create: function() {
        return Object.create(a2d.Node2);
    },
    eat: function(obj) {
        for(var p in obj) {
            this[p] = obj[p];
        }
    }
};
//a2d.Node2.eat(a2d.Collection);
//a2d.Node2.eat(a2d.Events);
a2d.Collection.apply(a2d.Node2);
a2d.Events.apply(a2d.Node2); 
*/