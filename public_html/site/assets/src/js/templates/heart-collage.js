app.init(function() {
	let node = document.querySelector('.jigsaw');
	app.heartCollage = new HeartCollage(node);
	app.heartCollage.on('piecesloaded', () => app.music.play(node.dataset.name));
});
