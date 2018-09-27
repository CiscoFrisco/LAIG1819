 class MyInterface extends CGFinterface {


 	/**
 	 * MyInterface
 	 * @constructor
 	 */
 	constructor() {
 		super();
 	}

 	/**
 	 * Create number buttons to enable/disable a light
 	 * @param {Number} number 
 	 */
 	createLights(number) {
 		var group = this.gui.addFolder("Luzes");
 		group.open();

 		for (let i = 1; i <= number; i++)
 			group.add(this.scene, 'light' + i);
 	};

 	/**
 	 * init
 	 * @param {CGFapplication} application
 	 */
 	init(application) {
 		// call CGFinterface init
 		super.init(application);

 		// init GUI. For more information on the methods, check:
 		//  http://workshop.chromeexperiments.com/examples/gui

 		this.gui = new dat.GUI();

 		//Buttons to enable/disable lights (enabled by default)
 		this.createLights(5);

 		return true;
 	};
 };