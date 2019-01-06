var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface,numGraphs) {
        super();

        this.interface = myinterface;
        this.graphs = [];
        this.numGraphs = numGraphs;
        this.graphsLoaded = 0;
        this.scene = 0;
        this.lightValues = {};
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        //default camera
        this.camera = new CGFcamera(
            0.4, 0.1, 1000, vec3.fromValues(250, 250, 250),
            vec3.fromValues(0, 0, 0));

        //default axis
        this.axis = new CGFaxis(this);

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.fps = 60;
        this.setUpdatePeriod(1000 / this.fps);

        this.setPickEnabled(true);

        this.rotTime = 2000;
        this.cameraRotInc = Math.PI / this.rotTime;
        this.cameraRotAngle = 0;
        this.currRotTime = 0;

        this.game = new Game(this);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras(currCamera = null) {

        this.cameras = [];

        var views = this.graphs[this.scene].views;
        var def = views.default;
        var i = 0;

        this.cameraList = {};

        for (var key in views.array) {
            var el = views.array[key];
            if (el.type == "ortho") {
                this.cameras.push(new CGFcameraOrtho(el.left, el.right, el.bottom, el.top, el.near, el.far, vec3.fromValues(el.from.x, el.from.y, el.from.z), vec3.fromValues(el.to.x, el.to.y, el.to.z), vec3.fromValues(0.0, 1.0, 0.0)));
            } else {
                this.cameras.push(new CGFcamera(el.angle, el.near, el.far, vec3.fromValues(el.from.x, el.from.y, el.from.z), vec3.fromValues(el.to.x, el.to.y, el.to.z)));
            }

            if (key == def) {
                this.camera = this.cameras[this.cameras.length - 1];
                this.currCamera = i;
            }

            this.cameraList[key] = i++;

        }

        if(currCamera != null){
            this.currCamera = currCamera;
            this.camera = this.cameras[this.currCamera];
        }
        
        this.interface.setActiveCamera(this.camera);
        if(currCamera == null)
            this.interface.addCameraDrop();
    }

    initGraphs(){
        
        this.graphsList = {};
        this.graphsList["modern"] = 0;
        this.graphsList["classic"] = 1;
        
        this.interface.addScenesDrop();
    }

    startRotation() {
        this.rotateCamera = true;
    }

    /**
     * Updates the current camera according to the interface's active value 
     */
    updateCamera(camera = this.currCamera) {
        this.camera = this.cameras[camera];
        this.currCamera = camera,
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Updates the current camera according to the interface's active value 
     */
    updateGraph(graph = this.scene) {
        console.log(this.game.board);
        this.graph = this.graphs[graph];
        this.interface.setActiveCamera(this.graph);
        this.initCameras(this.currCamera);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graphs[this.scene].lights) {
            if (i >= 8)
                break; // Only eight lights allowed by WebGL.

            if (this.graphs[this.scene].lights.hasOwnProperty(key)) {
                var light = this.graphs[this.scene].lights[key];

                let pos = light.locationLight;
                let ambient = light.ambientIllumination;
                let diffuse = light.diffuseIllumination;
                let specular = light.specularIllumination;

                this.lights[i].setAmbient(ambient.r, ambient.g, ambient.b, ambient.a);
                this.lights[i].setDiffuse(diffuse.r, diffuse.g, diffuse.b, diffuse.a);
                this.lights[i].setSpecular(specular.r, specular.g, specular.b, specular.a);
                this.lights[i].setPosition(pos.x, pos.y, pos.z, pos.w);

                if (light.type == "spot") {
                    let angle = light.angle;
                    let exponent = light.exponent;
                    let target = light.targetLight;

                    this.lights[i].setSpotDirection(target.x - pos.x, target.y - pos.y, target.z - pos.z);
                    this.lights[i].setSpotExponent(exponent);
                    this.lights[i].setSpotCutOff(angle);
                }

                //lights are predefined in cgfscene

                this.lights[i].setVisible(true);
                if (light.enabled)
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                this[key] = light.enabled;

                i++;
            }
        }
    }

    addGraph(graph){
        this.graphs.push(graph);
    }

    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.initCameras();

        //TODO: Change reference length according to parsed graph
        this.axis = new CGFaxis(this, this.graphs[this.scene].sceneInfo.axis_length);

        // TODO: Change ambient and background details according to parsed graph

        this.gl.clearColor(this.graphs[this.scene].background.r, this.graphs[this.scene].background.g, this.graphs[this.scene].background.b, this.graphs[this.scene].background.a);
        this.setGlobalAmbientLight(this.graphs[this.scene].ambient.r, this.graphs[this.scene].ambient.g, this.graphs[this.scene].ambient.b, this.graphs[this.scene].ambient.a)

        this.initLights();
        this.initGraphs();

        // Adds lights group.
        this.interface.addLightsGroup(this.graphs[this.scene].lights);

        this.sceneInited = true;

        this.materialNo = 0;
    }

    logPicking() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        var customId = this.pickResults[i][1];
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }


    /**
     * Displays the scene.
     */
    display() {

        this.clearPickRegistration();

        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {

            // Draw axis
            this.axis.display();

            if (this.rotateCamera)
                this.camera.orbit(CGFcameraAxis.y, this.cameraRotAngle);

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    } else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            // Displays the scene (MySceneGraph function).
            this.graphs[this.scene].displayScene();
        } else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    /**
     * Update animations and Water.
     * 
     * @param {Number} currTime the current time in milliseconds
     */
    update(currTime) {
        this.lastTime = this.lastTime || 0;
        this.deltaTime = currTime - this.lastTime;
        this.lastTime = currTime;

        if(this.graphsLoaded == this.numGraphs){
        this.graphs[this.scene].updateAnimations(this.deltaTime);
        this.graphs[this.scene].update(this.deltaTime);

        if (this.rotateCamera)
            this.update_camera();

        this.game.update(this.deltaTime);
        }
    }

    update_camera() {
        if (this.currRotTime >= this.rotTime) {
            this.rotateCamera = false;
            this.currRotTime = 0;
            this.cameraRotAngle = 0;
        } else if (this.currRotTime + this.deltaTime >= this.rotTime) {
            let rest = this.rotTime - this.currRotTime;
            this.cameraRotAngle = rest * this.cameraRotInc;
            this.currRotTime += this.deltaTime;
        } else {
            this.cameraRotAngle = this.deltaTime * this.cameraRotInc;
            this.currRotTime += this.deltaTime;
        }
    }
}