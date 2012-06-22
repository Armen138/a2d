all:
	cat a2d.js types.js collection.js events.js audio.js node.js tile.js tilegrid.js isogrid.js particles.js label.js | uglifyjs -o lib/a2d.min.js -nc
