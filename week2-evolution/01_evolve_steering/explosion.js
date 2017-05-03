function Explosion(vehicle) {
	//Explosion xo,yo
	this.x = vehicle.position.x;
	this.y = vehicle.position.y;
	this.alive = true;
	//explosion is a global variable that contains a sprite object
	this.animation = new AnimatedSprite(explosion, 1 / 25, false);
	this.r = 1.5;
	
	this.display = function () {
		image(this.animation.getCurrentFrame(), this.x - vehicle.w / 2, this.y - vehicle.h / 2, vehicle.w * this.r, vehicle.w * this.r);
	}

	this.update = function () {
		this.animation.update();
		if (this.animation.finished)
			this.alive = false;
	}

}
