all:
	cat a2d.js types.js collection.js events.js audio.js node.js tile.js tilegrid.js particles.js | uglifyjs -o lib/a2d.min.js -nc
