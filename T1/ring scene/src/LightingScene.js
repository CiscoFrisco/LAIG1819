class LightingScene extends CGFscene {
  constructor() { super(); };

  /**
   * Initializes car and terrain textures, preparing the necessary dictionaries
   * to be used with dat.gui.
   */
  initTextures() {
    this.enableTextures(true);

    this.ringMat = new CGFappearance(this);
    this.ringMat.setAmbient(0.5, 0.6, 0.7, 1);
    this.ringMat.setDiffuse(1, 1, 1, 1);
    this.ringMat.setSpecular(1, 1, 1, 1);
    this.ringMat.setShininess(1);
    this.ringMat.setEmission(1, 1, 1, 1);

    this.ringRopeApp = new CGFappearance(this);
    this.ringRopeApp.setAmbient(1, 0, 0, 1);
    this.ringRopeApp.setDiffuse(1, 0, 0, 1);
    this.ringRopeApp.setSpecular(1, 0, 0, 1);
    this.ringRopeApp.setShininess(1);
    this.ringRopeApp.setEmission(1, 0, 0, 1);

    this.chairApp = new CGFappearance(this);
    this.chairApp.setAmbient(0, 0, 0, 1);
    this.chairApp.setDiffuse(0, 0, 0, 1);
    this.chairApp.setSpecular(0, 0, 0, 1);
    this.chairApp.setShininess(1);
    this.chairApp.setEmission(0, 0, 0, 1);


    this.barrierApp = new CGFappearance(this);
    this.barrierApp.setAmbient(0, 0, 0, 1);
    this.barrierApp.setDiffuse(0.5, 0.5, 0.5, 1);
    this.barrierApp.setSpecular(0, 0, 0, 1);
    this.barrierApp.setShininess(0.1);
    this.barrierApp.setEmission(0.2, 0.2, 0.2, 1);

    this.stairsApp = new CGFappearance(this);
    this.stairsApp.loadTexture("../res/images/stairs.jpeg");

    this.zephyr = new CGFappearance(this);
    this.zephyr.loadTexture("../res/images/mrzephyr.png");

    this.rick = new CGFappearance(this);
    this.rick.loadTexture("../res/images/682020.jpg");

    this.defaultMaterial = new CGFappearance(this);

    this.ringApron = new CGFappearance(this);
    this.ringApron.loadTexture("../res/images/ringApron.jpeg");
  }

  /**
   * Initializes the scene elements: car, crane, terrain, deposit and recovery
   * positions,
   * and solids.
   */
  initElements() {
    this.ringCore = new MyQuad(this, -0.5,-0.5,0.5,0.5);
    this.ringPost = new MyCylinderCovered(this, 20, 20);
    this.ringRope = new MyCylinderCovered(this, 20, 20);
    this.stairs = new MyStairs(this);
    this.ramp = new MyRamp(this, 20, 100, 40);
    this.barrier = new MyBarrier(this, 10, 40, 5);
    this.number_chairs = 20;
    this.chairs = new MyChairs(this, 5, this.number_chairs);
    this.stage = new MyStage(this);

    this.torus = new MyTorus(this,4,20,2.5,4);
    this.cupula = new MyLamp(this, 20,20);
    this.ray = new MyCylinder(this, 20, 20);
    this.circle = new MyPoligon(this,20);

    this.cylinder = new MyNewCylinder(this,0.1,1,5,20,20);

    this.floor = new MyQuad(this, -0.5,-0.5,0.5,0.5);
    this.inc = 0.1;
  }

  /**
   * Initializes the scene, preparing the camera, lights, background color,
   * axis,
   * elements, textures, fps, crane requirements and keys.
   *
   * @param {CGFapplication} application
   */
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    this.gl.clearColor(126.0 / 255,192.0 / 255, 238.0 / 255, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.axis = new CGFaxis(this);
    this.drawAxis = true;

    // Textures
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
    this.camera = new CGFcamera(
        0.4, 0.1, 1000, vec3.fromValues(30, 30, 30),
        vec3.fromValues(0, 0, 0));
  };

  /**
   * Initializes five lights.
   */
  initLights() {
    this.setGlobalAmbientLight(0.3, 0.3, 0.3, 1)

        // Positions for five lights

    this.lights[0].setPosition(-20, 80, -20, 1);
    this.lights[0].setAmbient(0.1, 0.1, 0.1, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].setSpecular(0.0, 0.0, 1.0, 1.0);
    this.lights[0].setVisible(true);


    this.lights[1].setPosition(-20, 80, 20, 1);
    this.lights[1].setAmbient(0.1, 0.1, 0.1, 1);
    this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[1].setSpecular(0.0, 0.0, 1.0, 1.0);
    this.lights[1].setVisible(true);

    this.lights[2].setPosition(20, 80, 20, 1);
    this.lights[2].setAmbient(0.1, 0.1, 0.1, 1.0);
    this.lights[2].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[2].setSpecular(0.0, 0.0, 1.0, 1.0);
    this.lights[2].setVisible(true);

    this.lights[3].setPosition(20, 80, -20, 1);
    this.lights[3].setAmbient(0.1, 0.1, 0.1, 1.0);
    this.lights[3].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[3].setSpecular(0.0, 0.0, 1.0, 1.0);
    this.lights[3].setVisible(true);

    //spot
    this.lights[4].setPosition(-190, 20, 30, 1);
    this.lights[4].setSpotDirection(-200,20,0);
    this.lights[4].setSpotCutOff(Math.PI/4);
    this.lights[4].setSpotExponent(1);
    this.lights[4].setAmbient(0.1, 0.1, 0.1, 1.0);
    this.lights[4].setDiffuse(1, 1.0, 1.0, 1.0);
    this.lights[4].setSpecular(0.0, 0.0, 1.0, 1.0);
    this.lights[4].setVisible(true);

    this.lights[5].setPosition(-190, 20, -30, 1);
    this.lights[5].setSpotDirection(-200,20,0);
    this.lights[5].setSpotCutOff(45);
    this.lights[5].setSpotExponent(1000);
    this.lights[5].setAmbient(0.1, 0.1, 0.1, 1.0);
    this.lights[5].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[5].setSpecular(1.0, 1.0, 1.0, 1.0);
    this.lights[5].setVisible(true);

    // Attenuation
    /*this.lights[2].setConstantAttenuation(0);
    this.lights[2].setLinearAttenuation(0);
    this.lights[2].setQuadraticAttenuation(1);*/

    // Enable
    /*this.lights[0].enable();
    this.lights[1].enable();
    this.lights[2].enable();
    this.lights[3].enable();*/
    this.lights[4].enable();
    this.lights[5].enable();

    // Booleans for dat.gui
    this.light1 = true;
    this.light2 = true;
    this.light3 = true;
    this.light4 = true;
  };

  /**
   * Updates the lights.
   */
  updateLights() {
    this.checkLights();

    for (var i = 0; i < this.lights.length; i++) this.lights[i].update();
  }

  /**
   * Checks if the user enabled a given light, in which case it enables it
   * internally.
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

    // Apply transformations corresponding to the camera position relative to
    // the origin
    this.applyViewMatrix();

    // Update all lights used
    this.updateLights();

    /*this.pushMatrix();
    this.translate(-100, -5, 0);
    this.scale(400, 1, 250);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.floor.display();
    this.popMatrix();

    // Ring core
    this.pushMatrix();
    this.translate(0, 5, 0);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.scale(40, 40, 1);
    this.ringMat.apply();
    this.ringCore.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(0, -5, 0);
    this.rotate(Math.PI / 2, 1, 0, 0);
    this.scale(40, 40, 1);
    this.ringCore.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(0, 0, 20);
    this.scale(40, 10, 1);
    this.ringApron.apply();
    this.ringCore.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(0, 0, -20);
    this.rotate(Math.PI, 0, 1, 0);
    this.scale(40, 10, 1);
    this.ringCore.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(20, 0, 0);
    this.rotate(Math.PI / 2, 0, 1, 0);
    this.scale(40, 10, 1);
    this.ringCore.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(-20, 0, 0);
    this.rotate(-Math.PI / 2, 0, 1, 0);
    this.scale(40, 10, 1);
    this.ringCore.display();
    this.popMatrix();

    this.defaultMaterial.apply();

    this.pushMatrix();
      this.translate(16.25,0,16.25);
      this.rotate(Math.PI/4,0,1,0);
      this.stairs.display();
    this.popMatrix();

    

    this.defaultMaterial.apply();

    this.pushMatrix();
    this.translate(20, -5, 20);
    this.scale(1, 22, 1);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.ringPost.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(-20, -5, -20);
    this.scale(1, 22, 1);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.ringPost.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(20, -5, -20);
    this.scale(1, 22, 1);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.ringPost.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(-20, -5, 20);
    this.scale(1, 22, 1);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.ringPost.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(-20, 11.5, -20);
    this.scale(0.25, 0.25, 40);
    this.ringRopeApp.apply();
    this.ringRope.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(-20, 15, -20);
    this.scale(0.25, 0.25, 40);
    this.ringRope.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(-20, 8, -20);
    this.scale(0.25, 0.25, 40);
    this.ringRope.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(20, 11.5, -20);
    this.scale(0.25, 0.25, 40);
    this.ringRope.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(20, 15, -20);
    this.scale(0.25, 0.25, 40);
    this.ringRope.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(20, 8, -20);
    this.scale(0.25, 0.25, 40);
    this.ringRope.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(-20, 11.5, -20);
    this.rotate(Math.PI / 2, 0, 1, 0);
    this.scale(0.25, 0.25, 40);
    this.ringRope.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(-20, 15, -20);
    this.rotate(Math.PI / 2, 0, 1, 0);
    this.scale(0.25, 0.25, 40);
    this.ringRope.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(-20, 8, -20);
    this.rotate(Math.PI / 2, 0, 1, 0);
    this.scale(0.25, 0.25, 40);
    this.ringRope.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(-20, 11.5, 20);
    this.rotate(Math.PI / 2, 0, 1, 0);
    this.scale(0.25, 0.25, 40);
    this.ringRope.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(-20, 15, 20);
    this.rotate(Math.PI / 2, 0, 1, 0);
    this.scale(0.25, 0.25, 40);
    this.ringRope.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(-20, 8, 20);
    this.rotate(Math.PI / 2, 0, 1, 0);
    this.scale(0.25, 0.25, 40);
    this.ringRope.display();
    this.popMatrix();

    this.defaultMaterial.apply();

    // ramp

    this.pushMatrix();
    this.translate(-120, 5, 0);
    this.ramp.display();
    this.popMatrix();

    // barrier

    this.pushMatrix();
    this.barrierApp.apply();
    this.barrier.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(-30, 0, -75);
    this.chairApp.apply();
    this.chairs.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(35, 0, 75);
    this.rotate(Math.PI, 0, 1, 0);
    this.chairs.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(65, 0, -35);
    this.rotate(-Math.PI / 2, 0, 1, 0);
    this.chairs.display();
    this.popMatrix();

    this.defaultMaterial.apply();


    this.pushMatrix();
    this.translate(-195, 5, 0);
    this.scale(50, 20, 40);
    this.stage.display();
    this.popMatrix();

    
    this.pushMatrix();
    this.translate(Math.sin(this.inc)*10,70,Math.cos(this.inc)*10);
    this.rotate(this.inc,0,1,0);
    this.scale(10,10,10);
      
      this.pushMatrix();
      this.rotate(-Math.PI/2,1,0,0);
      this.scale(2.5,2.5,2.5);
      this.zephyr.apply();
      this.cupula.display();
      this.popMatrix();

      this.defaultMaterial.apply();

      this.pushMatrix();
      this.scale(2.5,1,2.5);
      this.rotate(Math.PI/2,1,0,0);
      this.circle.display();
      this.popMatrix();

      this.pushMatrix();
      this.rotate(Math.PI/2,0,0,1);
      this.torus.display();
      this.popMatrix();

      var angle = 2*Math.PI/20;
      var x = Math.cos(angle)*2.7;
      var z = Math.sin(angle)*2.7;

      for(let i = 0; i < 21; i++)
      {
        x = Math.cos(angle*i)*2.7;
        z = Math.sin(angle*i)*2.7;

          this.pushMatrix();
          this.translate(x,0.3,z);
          this.rotate(- angle*i + Math.PI/2,0,1,0);
          this.rotate(-Math.PI/4,1,0,0);
          this.scale(0.25,0.25,0.25);
          this.cupula.display();
          this.popMatrix();    

      }

    this.popMatrix();

    this.pushMatrix();
    this.translate(Math.sin(this.inc)*10,70,Math.cos(this.inc)*10);
    this.rotate(this.inc,0,1,0);
    this.scale(7.5,70,7.5);  
    this.rotate(Math.PI/2,1,0,0);
    this.rick.apply();
    this.ray.display();
    this.popMatrix();

    this.defaultMaterial.apply();
      this.inc += 0.1;*/

      this.pushMatrix();
      this.floor.display();
      this.popMatrix();


    // Draw axis
    if (this.drawAxis) this.axis.display();

    // ---- END Background, camera and axis setup

    // ---- BEGIN Scene drawing section

    // ---- END Scene drawing section
  };
};