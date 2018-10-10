/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        return true;
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key].enabled;
                group.add(this.scene.lightValues, key);
            }
        }

        this.initKeys();
    }

    addCameraDrop() {
        this.gui.add(this.scene, 'currCamera', this.scene.cameraList);
    }


    /**
     * Initializes key event capturing
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
    }

    /**
     * Processes a key down event, updating active keys information
     * @param {*} event 
     */
    processKeyDown(event) {
        this.activeKeys[event.code] = true;

        if(event.code == "KeyM"){
            this.scene.materialNo++;
        }
    };

    /**
     * Processes a key up event, updating active keys information
     * @param {*} event 
     */
    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    /**
     * Checks if a given key is currently pressed
     * @param {*} keyCode 
     */
    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}