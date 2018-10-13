var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
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
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {

        this.cameras = [];

        var views = this.graph.views;
        var def = views.default;
        var i = 0;

        this.cameraList = {};

        for (var key in views.array) {
            var el = views.array[key];
            if (el.type == "ortho") {
                this.cameras.push(new CGFcameraOrtho(el.left, el.right, el.bottom, el.top, el.near, el.far, vec3.fromValues(el.from.x, el.from.y, el.from.z), vec3.fromValues(el.to.x, el.to.y, el.to.z), vec3.fromValues(0.0,1.0,0.0)));
            } else {
                this.cameras.push(new CGFcamera(el.angle * DEGREE_TO_RAD, el.near, el.far, vec3.fromValues(el.from.x, el.from.y, el.from.z), vec3.fromValues(el.to.x, el.to.y, el.to.z)));
            }

            if (key == def) {
                this.camera = this.cameras[this.cameras.length - 1];
                this.currCamera = i;
            }

            this.cameraList[key] = i++;

        }

        this.interface.setActiveCamera(this.camera);
        this.interface.addCameraDrop();
    }

    /**
     * Updates the current camera according to the interface's active value 
     */
    updateCamera() {
        this.camera = this.cameras[this.currCamera];
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break; // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

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

                    this.lights[i].setSpotDirection(target.x, target.y, target.z);
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


    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {

        this.initCameras();

        //TODO: Change reference length according to parsed graph
        this.axis = new CGFaxis(this, this.graph.sceneInfo.axis_length);

        // TODO: Change ambient and background details according to parsed graph

        this.gl.clearColor(this.graph.background.r, this.graph.background.g, this.graph.background.b, this.graph.background.a);
        this.setGlobalAmbientLight(this.graph.ambient.r, this.graph.ambient.g, this.graph.ambient.b, this.graph.ambient.a)

        this.initLights();

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

        this.sceneInited = true;

        this.materialNo = 0;
    }


    /**
     * Displays the scene.
     */
    display() {
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

            this.updateCamera();

            // Draw axis
            this.axis.display();

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
            this.graph.displayScene();
        } else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}