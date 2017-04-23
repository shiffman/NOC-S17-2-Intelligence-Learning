//Sprite object
function Sprite(texture_, width, height) {
	this.src = texture_; //Loaded image in preload function
	this.w = width;
	this.h = height;
	var cols = Math.floor(this.src.width / this.w);
	var rows = Math.floor(this.src.height / this.h);
	this.size = rows * cols; //this determines the number of images in the images array
	this.images = [];
}

Sprite.prototype.load = function () {
	var x = 0;
	var y = 0;
	for (var i = 0; i < this.size; i++) {
		if (x % this.src.width == 0 && x != 0) {
			x = 0;
			y += this.h;
		}
		this.images.push(this.src.get(x, y, this.w, this.h));
		x += this.w;
	}
}

function AnimatedSprite(sprite, framestep, loop = true) {
	this.sprite = sprite;
	this.w = sprite.w;
	this.h = sprite.h;
	this.frame = -1;
	this.timer = framestep;
	this.counter = 0;
	this.ret;
	this.loop = loop;
	this.finished = false;
	this.nextFrame();
}

AnimatedSprite.prototype.getCurrentFrame = function () {
	if (this.ret == undefined)
		return this.sprite.images[0];
	return this.ret;
}

AnimatedSprite.prototype.nextFrame = function () {
	//Check if the animation finish or not
	if (!this.loop && this.frame != 0) {
		this.finished = this.frame % (this.sprite.images.length - 1) == 0;
	}
	if (this.finished)
		return;
	this.frame = this.frame % (this.sprite.images.length - 1);
	this.ret = this.sprite.images[this.frame++];
}

AnimatedSprite.prototype.update = function () {
	this.counter += 1 / frameRate();
	if (this.counter > this.timer) {
		this.nextFrame();
		this.counter = 0;
	}
}
