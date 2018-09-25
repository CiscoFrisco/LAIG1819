/**
 * MyVehicle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyVehicle extends CGFobject {
	/**
	 * Builds a MyVehicle object with initial coordinates.
	 * 
	 * @param {CGFscene} scene 
	 * @param {Number} centerX 
	 * @param {Number} centerY 
	 * @param {Number} centerZ 
	 */
	constructor(scene, centerX = 0, centerY = 0, centerZ = 0) {
		super(scene);

		//car elements
		this.chassi = new MyChassi(scene);
		this.wheel = new MyWheel(scene, 20, 20, 20);
		this.lamp = new MyLamp(scene, 20, 20);
		this.leftmirror = new MyMirror(scene, 20, 20);
		this.rightmirror = new MyMirror(scene, 20, 20, true);
		this.rightwindooh = new MyTrapeze(scene, 1, 0.7, 1, 0.05);
		this.leftwindooh = new MyTrapeze(scene, 1, 0.7, 1, -0.05);
		this.breather = new MyBreather(scene);
		this.spoiler = new MySpoiler(scene);
		this.rectangle = new MyQuad(scene);
		this.barrel = new MyCylinder(scene, 20, 20);


		//car angle (changes according to the direction)
		this.angleCar = 0;

		//car center coordinate variables (always tracking the center of the car)
		this.centerX = centerX;
		this.centerY = centerY;
		this.centerZ = centerZ;

		//angle that helps simulate wheel rotation (in the Z axis)
		this.angle = 0;
		//direction of the wheel when turned (in the Y axis)
		this.direction = 0;

		//car velocity
		this.vel = 0;

		//car movement increment variables
		this.speed_inc = 0.01;
		this.reverting_speed_inc = 0.01;

		//behaviour booleans
		this.controlOn = true;
		this.attached = false;

		this.initTextures();

		this.wheel.initBuffers();
		this.chassi.initBuffers();
	};

	/**
	 * Initialize textures to be used by this class
	 */
	initTextures() {
		this.carTexture = new CGFappearance(this.scene);

		this.eyesTexture = new CGFappearance(this.scene);
		this.eyesTexture.loadTexture("../resources/images/cars_eyes.png");

		this.mouthTexture = new CGFappearance(this.scene);
		this.mouthTexture.loadTexture("../resources/images/cars_mouth.png");

		this.windoohTexture = new CGFappearance(this.scene);
		this.windoohTexture.loadTexture("../resources/images/windooh.png");

		this.lightTexture = new CGFappearance(this.scene);
		this.lightTexture.loadTexture("../resources/images/car_light.png");
	};

	/**
	 * Sets this car's texture.
	 * 
	 * @param {CGFappearance} texture 
	 */
	setTexture(texture) {
		this.carTexture = texture;
	}

	/**
	 * Diplays the car's elements
	 */
	display() {
		this.carTexture.apply();

		this.scene.pushMatrix();
		this.chassi.display();
		this.scene.popMatrix();

		//spoiler
		this.scene.pushMatrix();
		this.scene.translate(-6, 1.5, 0);
		this.spoiler.display();
		this.scene.popMatrix();

		//breather
		this.scene.pushMatrix();
		this.scene.translate(2.5, 1.1, 0);
		this.scene.scale(1.5, 0.3, 1.5);
		this.scene.rotate(Math.PI / 2, 0, 1, 0);
		this.breather.display();
		this.scene.popMatrix();

		//mirrors
		this.carTexture.apply();

		this.scene.pushMatrix();
		this.scene.translate(-1, 1.5, 2.6);
		this.scene.scale(0.3, 0.5, 0.3);
		this.rightmirror.display();
		this.scene.popMatrix();

		this.carTexture.apply();

		this.scene.pushMatrix();
		this.scene.translate(-1, 1.5, -2.6);
		this.scene.scale(0.3, 0.5, 0.3);
		this.leftmirror.display();
		this.scene.popMatrix();

		//draw wheels and update wheel direction according to the current direction value
		this.scene.pushMatrix();
		this.scene.translate(-5, -0.5, 2);
		this.scene.rotate(this.angle, 0, 0, 1);
		this.scene.scale(0.8, 0.8, 0.8);
		this.wheel.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(2, -0.5, 2);

		this.scene.rotate(this.direction, 0, 1, 0);
		this.scene.rotate(this.angle, 0, 0, 1);
		this.scene.scale(0.8, 0.8, 0.8);
		this.wheel.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(-5, -0.5, -2);
		this.scene.rotate(this.angle, 0, 0, 1);
		this.scene.scale(0.8, 0.8, 0.8);
		this.wheel.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(2, -0.5, -2);

		this.scene.rotate(this.direction, 0, 1, 0);
		this.scene.rotate(this.angle, 0, 0, 1);
		this.scene.scale(0.8, 0.8, 0.8);
		this.wheel.display();
		this.scene.popMatrix();

		//barrels
		this.scene.pushMatrix();
		this.scene.translate(2, -0.5, -2);
		this.scene.scale(0.1, 0.1, 4);
		this.barrel.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(-5, -0.5, -2);
		this.scene.scale(0.1, 0.1, 4);
		this.barrel.display();
		this.scene.popMatrix();

		//eyes
		this.eyesTexture.apply();

		this.scene.pushMatrix();
		this.scene.translate(-0.75, 1.5, 0);
		this.scene.rotate(Math.PI / 6, 0, 0, 1);
		this.scene.scale(1, 0.9, 4.2);
		this.scene.rotate(Math.PI / 2, 0, 1, 0);
		this.rectangle.display();
		this.scene.popMatrix();

		//mouth
		this.mouthTexture.apply();

		this.scene.pushMatrix();
		this.scene.translate(5.05, 0, 0);
		this.scene.scale(1, 0.9, 4.2);
		this.scene.rotate(Math.PI / 2, 0, 1, 0);
		this.rectangle.display();
		this.scene.popMatrix();

		this.lightTexture.apply();

		//front lights
		this.scene.pushMatrix();
		this.scene.translate(5, 0, 1.7);
		this.scene.scale(0.3, 0.5, 0.3);
		this.scene.rotate(Math.PI / 2, 0, 1, 0);
		this.lamp.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(5, 0, -1.7);
		this.scene.scale(0.3, 0.5, 0.3);
		this.scene.rotate(Math.PI / 2, 0, 1, 0);
		this.lamp.display();
		this.scene.popMatrix();

		//windows 
		this.windoohTexture.apply();
		this.scene.pushMatrix();
		this.scene.translate(-3, 1.4, 2.21);
		this.scene.scale(4.5, 0.8, 1);
		this.rightwindooh.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(-3, 1.4, -2.21);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.scene.scale(4.5, 0.8, 1);
		this.leftwindooh.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(-5.1, 1.5, 0);
		this.scene.rotate(-Math.PI / 4, 0, 0, 1);
		this.scene.scale(1, 1, 4);
		this.scene.rotate(-Math.PI / 2, 0, 1, 0);
		this.rectangle.display();
		this.scene.popMatrix();

		this.scene.materialDefault.apply();
	};

	/**
	 * Updates the car's attributes (center and angle).
	 * 
	 * @param {Number} deltaTime time since last update
	 */
	update(deltaTime) {
		this.centerX += deltaTime * this.vel * Math.cos(this.angleCar);
		this.centerZ -= deltaTime * this.vel * Math.sin(this.angleCar);
		this.angle -= deltaTime * this.vel;
	};

	/**
	 * 
	 * @param {Number} deltaTime 
	 * @param {Array} path possible terrain divisions
	 */
	move(deltaTime, path) {

		//convert time to seconds
		var time = deltaTime / 1000.0;

		//if car is moving or keys have been pressed, update car variables
		if (this.vel != 0 || this.scene.keysPressed != false) {
			if (this.scene.keyAPressed) {
				this.direction = 1;
				if (this.vel > 0)
					this.angleCar += 2 * time;
				else if (this.vel < 0)
					this.angleCar -= 2 * time;
			} else if (this.scene.keyDPressed) {
				this.direction = -1;
				if (this.vel > 0)
					this.angleCar -= 2 * time;
				else if (this.vel < 0)
					this.angleCar += 2 * time;

			} else if (this.direction != 0)
				this.balanceDirection(time);

			if (this.scene.keyWPressed) {
				if (this.vel < 0)
					this.vel += this.reverting_speed_inc * time;

				else if (this.vel < this.scene.maxSpeed * 0.01)
					this.vel += this.speed_inc * time;
			} else if (this.scene.keySPressed) {
				if (this.vel > 0)
					this.vel -= this.reverting_speed_inc * time;

				else if (this.vel > -this.scene.maxSpeed * 0.01)
					this.vel -= this.speed_inc * time;
			} else
				this.stopCar(time);

			//variables to be used in collision testing
			var nextX = this.centerX + deltaTime * this.vel * Math.cos(this.angleCar);
			var nextZ = this.centerZ - deltaTime * this.vel * Math.sin(this.angleCar);

			//check collision
			var i1, j1;
			var i2, j2;

			var carDirection = this.angleCar > 0 ? this.angleCar % (2 * Math.PI) : this.angleCar % (2 * Math.PI) + 2 * Math.PI;

			if (this.vel > 0) {
				//check car front corners
				i1 = Math.round((nextX + this.scene.terrain.width / 2.0 + Math.cos(carDirection) * 5.3 + Math.cos(carDirection - Math.PI / 2.0) * 2.2) * this.scene.terrain.ratio);
				j1 = Math.round((nextZ + this.scene.terrain.length / 2.0 - Math.sin(carDirection) * 5.3 - Math.sin(carDirection - Math.PI / 2.0) * 2.2) * this.scene.terrain.ratio);
				i2 = Math.round((nextX + this.scene.terrain.width / 2.0 + Math.cos(carDirection) * 5.3 + Math.cos(carDirection + Math.PI / 2.0) * 2.2) * this.scene.terrain.ratio);
				j2 = Math.round((nextZ + this.scene.terrain.length / 2.0  - Math.sin(carDirection) * 5.3 - Math.sin(carDirection + Math.PI / 2.0) * 2.2) * this.scene.terrain.ratio);

			} else {
				//check car back corners
				i1 = Math.round((nextX + this.scene.terrain.width / 2.0 + Math.cos(carDirection + Math.PI) * 7 + Math.cos(carDirection - Math.PI / 2.0) * 2.2) * this.scene.terrain.ratio);
				j1 = Math.round((nextZ + this.scene.terrain.length / 2.0 - Math.sin(carDirection + Math.PI) * 7 - Math.sin(carDirection - Math.PI / 2.0) * 2.2) * this.scene.terrain.ratio);
				i2 = Math.round((nextX + this.scene.terrain.width / 2.0 + Math.cos(carDirection + Math.PI) * 7 + Math.cos(carDirection + Math.PI / 2.0) * 2.2) * this.scene.terrain.ratio);
				j2 = Math.round((nextZ + this.scene.terrain.length / 2.0 - Math.sin(carDirection + Math.PI) * 7 - Math.sin(carDirection + Math.PI / 2.0) * 2.2) * this.scene.terrain.ratio);
			}
			
			//check if car is out of the terrain (and allow it)
			if ((i1 >= path.length || i1 < 0) || (i2 >= path.length || i2 < 0) || (j1 >= path.length || j1 < 0) || (j2 >= path.length || j2 < 0))
				this.update(deltaTime);

			//if one of this corners hits an area with an altimetry different from 0, set car velocity to 0 (stop car / car hit)
			else if (path[i1][j1] != 0 || path[i2][j2] != 0) {
				this.vel = 0;
				return;
			}
			//else update car according to the updated car variables
			else
				this.update(deltaTime);
		}
		//otherwise restore car variables
		else {
			if (this.direction != 0)
				this.balanceDirection(time);
		}
	};

	/**
	 * Turn the wheels back to their default orientation
	 * @param {Number} time 
	 */
	balanceDirection(time) {
		if (this.direction < 0.05 && this.direction > -0.05) {
			this.direction = 0;
		} else if (this.direction > 0.1) {
			this.direction += -3 * time;
			if (this.vel > 0)
				this.angleCar += 2 * time;
			else if (this.vel < 0)
				this.angleCar -= 2 * time;
		} else if (this.direction < -0.1) {
			this.direction += 3 * time;

			if (this.vel > 0)
				this.angleCar -= 2 * time;
			else if (this.vel < 0)
				this.angleCar += 2 * time;
		}
	};
	/**
	 * Decrease velocity when user stops pressing 'W' or 'S'
	 * @param {Number} time 
	 */
	stopCar(time) {
		if (this.vel < 0.0001 && this.vel > -0.0001)
			this.vel = 0;
		else if (this.vel > 0)
			this.vel -= this.speed_inc * time;
		else if (this.vel < 0)
			this.vel += this.speed_inc * time;
	};
};