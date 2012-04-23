all:
	cat a2d.js types.js collection.js events.js audio.js scenenode.js animatedtilenode.js tilegridnode.js | uglifyjs -o lib/a2d.min.js -nc
