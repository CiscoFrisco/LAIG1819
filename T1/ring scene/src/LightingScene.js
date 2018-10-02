class LightingScene extends CGFscene {
	constructor() {
		super();
	};

	/**
	 * Initializes car and terrain textures, preparing the necessary dictionaries
	 * to be used with dat.gui.
	 */
	initTextures() {
		this.enableTextures(true);
	}

	/**
	 * Initializes the scene elements: car, crane, terrain, deposit and recovery positions, 
	 * and solids.
	 */
	initElements() {
		this.ringCore = new MyUnitCubeQuad(this);
		this.ringPost = new MyCylinderCovered(this, 20, 20);
		this.ringRope = new MyCylinderCovered(this, 20, 20);
		this.stairs = new MyUnitCubeQuad(this);
		this.ramp = new MyRamp(this, 20,100,40);
		this.barrier = new MyBarrier(this,10,40,5);
		this.number_chairs = 1000;
		this.chairs = new MyChairs(this, 5,this.number_chairs);
		this.stage = new MyStage(this);
	}

	/**
	 * Initializes the scene, preparing the camera, lights, background color, axis,
	 * elements, textures, fps, crane requirements and keys.
	 * 
	 * @param {CGFapplication} application 
	 */
	init(application) {
		super.init(application);

		this.initCameras();
		this.initLights();

		this.gl.clearColor(126.0 / 255, 192.0 / 255, 238.0 / 255, 1.0);
		this.gl.clearDepth(100.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.depthFunc(this.gl.LEQUAL);

		this.axis = new CGFaxis(this);
		this.drawAxis = true;

		//Textures	
		this.initTextures();

		// Scene elements
		this.initElements();

		this.fps = 30;
		this.setUpdatePeriod(1000 / this.fps);
	};

	/**
	 * Initializes the scene's camera.
	 */
	initCameras() {
		this.camera = new CGFcamera(0.4, 0.1, 1000, vec3.fromValues(250, 250, 250), vec3.fromValues(0, 0, 0));
	};

	/**
	 * Initializes five lights.
	 */
	initLights() {
		this.setGlobalAmbientLight(0.3, 0.3, 0.3, 1)

		// Positions for five lights

		this.lights[0].setPosition(15, 10, 15, 1);
		this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);

		this.lights[1].setPosition(-15, 10, 15, 1.0);
		this.lights[1].setAmbient(0, 0, 0, 1);
		this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);

		this.lights[2].setPosition(15, 10, -15, 1);
		this.lights[2].setAmbient(0, 0, 0, 1);
		this.lights[2].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[2].setSpecular(0.0, 0.0, 1.0, 1.0);

		this.lights[3].setPosition(-15, 10, -15, 1);
		this.lights[3].setAmbient(1.0, 1.0, 1.0, 1.0);
		this.lights[3].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[3].setSpecular(0.0, 0.0, 1.0, 1.0);

		this.lights[4].setPosition(0, 10, 0, 1);
		this.lights[4].setAmbient(1.0, 1.0, 1.0, 1.0);
		this.lights[4].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[4].setSpecular(0.0, 0.0, 1.0, 1.0);

		//Attenuation
		this.lights[2].setConstantAttenuation(0);
		this.lights[2].setLinearAttenuation(0);
		this.lights[2].setQuadraticAttenuation(1);

		//Enable
		this.lights[0].enable();
		this.lights[1].enable();
		this.lights[2].enable();
		this.lights[3].enable();
		this.lights[4].enable();

		//Booleans for dat.gui
		this.light1 = true;
		this.light2 = true;
		this.light3 = true;
		this.light4 = true;
		this.light5 = true;
	};

	/**
	 * Updates the lights.
	 */
	updateLights() {

		this.checkLights();

		for (var i = 0; i < this.lights.length; i++)
			this.lights[i].update();
	}

	/**
	 * Checks if the user enabled a given light, in which case it enables it internally.
	 * 
	 * @param {Boolean} enabled 
	 * @param {CGFlight} light 
	 */
	checkLight(enabled, light) {
		if (enabled)
			light.enable();
		else
			light.disable();
	};

	/**
	 * Checks if the user activated any of the lights, enabling them internally.
	 */
	checkLights() {

		this.checkLight(this.light1, this.lights[0]);
		this.checkLight(this.light2, this.lights[1]);
		this.checkLight(this.light3, this.lights[2]);
		this.checkLight(this.light4, this.lights[3]);
		this.checkLight(this.light5, this.lights[4]);

	}

	/**
	 * Displays the scene's objects.
	 */
	display() {
		// ---- BEGIN Background, camera and axis setup

		// Clear image and depth buffer everytime we update the scene
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		// Initialize Model-View matrix as identity (no transformation)
		this.updateProjectionMatrix();
		this.loadIdentity();

		// Apply transformations corresponding to the camera position relative to the origin
		this.applyViewMatrix();

		// Update all lights used
		this.updateLights();

		//Ring core
		this.pushMatrix();
		this.scale(40,10,40);
		this.ringCore.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(20, -3.7, 20);
		this.rotate(Math.PI/4, 0, 1, 0);
		this.scale(10,2.5,30);
		this.stairs.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(17.5, -1.2, 17.5);
		this.rotate(Math.PI/4, 0, 1, 0);
		this.scale(10,2.5,30);
		this.stairs.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(15, 1.3, 15);
		this.rotate(Math.PI/4, 0, 1, 0);
		this.scale(10,2.5,30);
		this.stairs.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(12.5, 3.7, 12.5);
		this.rotate(Math.PI/4, 0, 1, 0);
		this.scale(10,2.5,30);
		this.stairs.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(20,-5,20);
		this.scale(1,22,1);
		this.rotate(-Math.PI/2,1,0,0);
		this.ringPost.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(-20,-5,-20);
		this.scale(1,22,1);
		this.rotate(-Math.PI/2,1,0,0);
		this.ringPost.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(20,-5,-20);
		this.scale(1,22,1);
		this.rotate(-Math.PI/2,1,0,0);
		this.ringPost.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(-20,-5,20);
		this.scale(1,22,1);
		this.rotate(-Math.PI/2,1,0,0);
		this.ringPost.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(-20,11.5,-20);
		this.scale(0.25,0.25,40);
		this.ringRope.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(-20,15,-20);
		this.scale(0.25,0.25,40);
		this.ringRope.display();
		this.popMatrix();
		
		this.pushMatrix();
		this.translate(-20,8,-20);
		this.scale(0.25,0.25,40);
		this.ringRope.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(20,11.5,-20);
		this.scale(0.25,0.25,40);
		this.ringRope.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(20,15,-20);
		this.scale(0.25,0.25,40);
		this.ringRope.display();
		this.popMatrix();
		
		this.pushMatrix();
		this.translate(20,8,-20);
		this.scale(0.25,0.25,40);
		this.ringRope.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(-20,11.5,-20);
		this.rotate(Math.PI/2, 0, 1, 0);
		this.scale(0.25,0.25,40);
		this.ringRope.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(-20,15,-20);
		this.rotate(Math.PI/2, 0, 1, 0);
		this.scale(0.25,0.25,40);
		this.ringRope.display();
		this.popMatrix();
		
		this.pushMatrix();
		this.translate(-20,8,-20);
		this.rotate(Math.PI/2, 0, 1, 0);
		this.scale(0.25,0.25,40);
		this.ringRope.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(-20,11.5,20);
		this.rotate(Math.PI/2, 0, 1, 0);
		this.scale(0.25,0.25,40);
		this.ringRope.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(-20,15,20);
		this.rotate(Math.PI/2, 0, 1, 0);
		this.scale(0.25,0.25,40);
		this.ringRope.display();
		this.popMatrix();
		
		this.pushMatrix();
		this.translate(-20,8,20);
		this.rotate(Math.PI/2, 0, 1, 0);
		this.scale(0.25,0.25,40);
		this.ringRope.display();
		this.popMatrix();

		//ramp

		this.pushMatrix();
		this.translate(-120,0,0)	
		this.ramp.display();
		this.popMatrix();

		//barrier

		this.pushMatrix();
		this.barrier.display();
		this.popMatrix();

		this.pushMatrix();
			this.translate(-30,0,-75);
			this.chairs.display();
		this.popMatrix();

		this.pushMatrix();
			this.translate(35,0,75);
			this.rotate(Math.PI,0,1,0);
			this.chairs.display();
		this.popMatrix();

		this.pushMatrix();
			this.translate(65,0,-35);
			this.rotate(-Math.PI/2,0,1,0);
			this.chairs.display();
		this.popMatrix();
		

		this.pushMatrix();
			this.translate(-195,0,0);
			this.scale(50,20,40);
			this.stage.display();
		this.popMatrix();




		// Draw axis
		if (this.drawAxis)
			this.axis.display();

		// ---- END Background, camera and axis setup

		// ---- BEGIN Scene drawing section

		// ---- END Scene drawing section	
	};
};