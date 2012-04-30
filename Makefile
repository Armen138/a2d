all:
	cat a2d.js types.js collection.js events.js audio.js scenenode.js animatedtilenode.js tilegridnode.js particles.js | uglifyjs -o lib/a2d.min.js -nc
