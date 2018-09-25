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

		var vidalTexture = new CGFappearance(this);
		vidalTexture.loadTexture("../resources/images/vifal.png");

		var maregaTexture = new CGFappearance(this);
		maregaTexture.loadTexture("../resources/images/marega.png");

		var desert = new CGFappearance(this);
		desert.loadTexture("../resources/images/desert.png")

		var grass = new CGFappearance(this);
		grass.loadTexture("../resources/images/grass.png");

		var wall = new CGFappearance(this);
		wall.loadTexture("../resources/images/great_wall.png");

		var def = new CGFappearance(this);
		def.setAmbient(1.0, 0.0, 0.0, 1.0);
		def.setDiffuse(1.0, 0.0, 0.0, 1.0);

		this.platTex = new CGFappearance(this);
		this.platTex.loadTexture("../resources/images/plat.png");

		this.materialDefault = new CGFappearance(this);
		this.materialDefault.setAmbient(0.2, 0.2, 0.2, 1.0);
		this.materialDefault.setDiffuse(0.2, 0.2, 0.2, 1.0);

		this.vehicleAppearances = [def, maregaTexture, vidalTexture];
		this.vehicleAppearanceList = {};
		this.vehicleAppearanceList["vidal"] = 2;
		this.vehicleAppearanceList["marega"] = 1;
		this.vehicleAppearanceList["def"] = 0;
		this.currVehicleAppearance = 0;

		this.terrainAppearances = [grass, desert, wall];
		this.terrainAppearanceList = {};
		this.terrainAppearanceList["wall"] = 2;
		this.terrainAppearanceList["desert"] = 1;
		this.terrainAppearanceList["grass"] = 0;
		this.currTerrainAppearance = 0;
	}

	/**
	 * Initializes the scene elements: car, crane, terrain, deposit and recovery positions, 
	 * and solids.
	 */
	initElements() {

		var myAltimetry1 = [
			[2.0, 1.0, 4.0, 3.0, 5.0, 3.0, 4.0, 1.0, 2.0],
			[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
			[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
			[-2.0, 0.0, -2.0, -1.0, -2.0, -1.0, -2.0, 0.0, -2.0]
		];

		var xx = 0.0;
		var yy = 0.0;

		var myAltimetry = [
			[yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy],
			[yy, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, 14.0, 14.0, 12.0, 12.0, 14.0, 14.0, 12.0, 12.0, 14.0, 14.0, xx, xx, xx, xx, xx, xx, xx, 14.0, 14.0, 12.0, 12.0, 14.0, 14.0, 12.0, 12.0, 14.0, 14.0, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, yy],
			[yy, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, 14.0, 14.0, 12.0, 12.0, 14.0, 14.0, 12.0, 12.0, 14.0, 14.0, xx, xx, xx, xx, xx, xx, xx, 14.0, 14.0, 12.0, 12.0, 14.0, 14.0, 12.0, 12.0, 14.0, 14.0, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, yy],
			[yy, 22.0, 22.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 22.0, 22.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 22.0, 22.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 22.0, 22.0, yy],
			[yy, 22.0, 22.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 22.0, 22.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 22.0, 22.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 22.0, 22.0, yy],
			[yy, 24.0, 24.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 24.0, 22.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 24.0, 24.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 24.0, 24.0, yy],
			[yy, 24.0, 24.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 24.0, 22.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 24.0, 24.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 24.0, 24.0, yy],
			[yy, 22.0, 22.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 22.0, 22.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 22.0, 22.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 22.0, 22.0, yy],
			[yy, 22.0, 22.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 22.0, 22.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 22.0, 22.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 22.0, 22.0, yy],
			[yy, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, yy],
			[yy, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, yy],
			[yy, 14.0, 14.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 14.0, 14.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 12.0, 12.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 12.0, 12.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 14.0, 14.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 14.0, 14.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 12.0, 12.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 12.0, 12.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 14.0, 14.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 4.0, 4.0, 2.0, 2.0, xx, xx, xx, 2.0, 2.0, 4.0, 4.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 14.0, 14.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 4.0, 4.0, 2.0, 2.0, xx, xx, xx, 2.0, 2.0, 4.0, 4.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 14.0, 14.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 4.0, 4.0, 2.0, 2.0, xx, xx, xx, 2.0, 2.0, 4.0, 4.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 14.0, 14.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 4.0, 4.0, 2.0, 2.0, xx, xx, xx, 2.0, 2.0, 4.0, 4.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 12.0, 12.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 12.0, 12.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 14.0, 14.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 14.0, 14.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 12.0, 12.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 12.0, 12.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 14.0, 14.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 14.0, 14.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 22.0, 22.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 22.0, 22.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 22.0, 22.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 22.0, 22.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 24.0, 24.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 24.0, 22.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 24.0, 24.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 24.0, 22.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 22.0, 22.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 22.0, 22.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 22.0, 22.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 22.0, 22.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, 22.0, 22.0, 24.0, 24.0, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, yy],
			[yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy, yy]
		];



		this.car = new MyVehicle(this, 10, 1.3, 12);
		this.crane = new MyCrane(this, 'UP', 'D');
		this.terrain = new MyTerrain(this, 48, 50.0, 50.0, 0, 5, 0, 5, myAltimetry, this.terrainAppearances[this.currTerrainAppearance]);

		this.platform = new MyQuad(this);
		this.planeZ = 17;
		this.planeX = 0.75;

		this.lamp = new MyLamp(this, 20, 20);
		this.cylinder = new MyCylinder(this, 20, 20);
		this.trapeze = new My3DTrapeze(this);
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

		//Car maximum speed
		this.maxSpeed = 3;

		//Textures	
		this.initTextures();

		// Scene elements
		this.initElements();

		//For dat.gui integration
		this.showSolids = false;
		this.drawAxis = true;

		this.fps = 30;
		this.setUpdatePeriod(1000 / this.fps);

		this.keyWPressed = false;
		this.keySPressed = false;
		this.keyAPressed = false;
		this.keyDPressed = false;

		//Car requirements to be grabed by the crane
		this.grabSpeed = 0.0001;
		this.grabLimit = 5;
	};

	/**
	 * Initializes the scene's camera.
	 */
	initCameras() {
		this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(100, 100, 100), vec3.fromValues(0, 0, 0));
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
		this.lights[2].setSpecular(1.0, 1.0, 0.0, 1.0);

		this.lights[3].setPosition(-15, 10, -15, 1);
		this.lights[3].setAmbient(1.0, 1.0, 1.0, 1.0);
		this.lights[3].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[3].setSpecular(1.0, 1.0, 1.0, 1.0);

		this.lights[4].setPosition(0, 10, 0, 1);
		this.lights[4].setAmbient(1.0, 1.0, 1.0, 1.0);
		this.lights[4].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[4].setSpecular(1.0, 1.0, 1.0, 1.0);

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

		// Draw axis
		if (this.drawAxis)
			this.axis.display();

		// ---- END Background, camera and axis setup

		// ---- BEGIN Scene drawing section

		this.materialDefault.apply();

		if (!this.car.attached)
			this.displayCar();

		this.terrain.setTexture(this.terrainAppearances[this.currTerrainAppearance]);
		this.terrain.display();

		this.displayCrane();

		this.displayPlatforms();

		if (this.showSolids)
			this.displaySolids();

		// ---- END Scene drawing section	
	};

	/**
	 * Displays the crane at the middle of the scene.
	 */
	displayCrane() {
		this.materialDefault.apply();
		this.pushMatrix()
		this.translate(0, 2, 0);
		this.crane.display();
		this.popMatrix();
	}

	/**
	 * Displays the crane's deposit and recovery positions.
	 */
	displayPlatforms() {

		this.platTex.apply();

		//Deposit
		this.pushMatrix();
		this.translate(this.planeX, 0.1, -this.planeZ);
		this.rotate(-Math.PI / 2, 1, 0, 0);
		this.scale(17, 10, 1);
		this.platform.display();
		this.popMatrix();

		//Recovery
		this.pushMatrix();
		this.translate(this.planeX, 0.1, this.planeZ);
		this.rotate(-Math.PI / 2, 1, 0, 0);
		this.scale(17, 10, 1);
		this.platform.display();
		this.popMatrix();

		this.materialDefault.apply();
	}

	/**
	 * Displays the car.
	 */
	displayCar() {
		this.pushMatrix();
		this.translate(this.car.centerX, this.car.centerY, this.car.centerZ);
		this.rotate(this.car.angleCar, 0, 1, 0);
		this.car.setTexture(this.vehicleAppearances[this.currVehicleAppearance]);
		this.car.display();
		this.popMatrix();
	}

	/**
	 * Displays a semi-sphere, a cylinder and a trapeze for texture evaluation.
	 * To change the texture, use 'currVehicleAppearance' on dat.gui.
	 */
	displaySolids() {

		this.vehicleAppearances[this.currVehicleAppearance].apply();

		this.pushMatrix();
		this.translate(-19.5, 24, -19.5);
		this.rotate(-Math.PI / 2, 1, 0, 0);
		this.scale(4, 4, 4);
		this.lamp.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(-19, 39, 19);
		this.rotate(Math.PI / 2, 1, 0, 0);
		this.scale(4, 4, 15);
		this.cylinder.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(19, 29, -19);
		this.scale(6, 10, 6);
		this.trapeze.display();
		this.popMatrix();

		this.materialDefault.apply();
	}

	/**
	 * Checks if a given key is currently pressed.
	 * 
	 * @param {*} keyID 
	 */
	checkKey(keyID) {
		if (this.gui.isKeyPressed(keyID)) {
			this.keysPressed = true;
			return true;
		}

		return false;
	};

	/**
	 * Checks if any movement key (WASD) is currently pressed.
	 */
	checkKeys() {
		this.keysPressed = false;

		this.keyWPressed = this.checkKey("KeyW");
		this.keySPressed = this.checkKey("KeyS");
		this.keyAPressed = this.checkKey("KeyA");
		this.keyDPressed = this.checkKey("KeyD");
	};

	/**
	 * Checks if two points on the xz plane are close to each other, up to a given limit.
	 * Useful to check if the car is on the recovery position.
	 * 
	 * @param {Number} x1 
	 * @param {Number} x2 
	 * @param {Number} z1 
	 * @param {Number} z2 
	 * @param {Number} limit 
	 */
	cmpCoords(x1, x2, z1, z2, limit) {
		return Math.abs(x2 - x1) <= limit && Math.abs(z2 - z1) <= limit;
	};

	/**
	 * Updates the scene's elements, according to the user input and crane state.
	 * 
	 * @param {Number} currTime Time since the last update
	 */
	update(currTime) {

		this.checkKeys();

		this.lastTime = this.lastTime || 0;
		this.deltaTime = currTime - this.lastTime;
		this.lastTime = currTime;

		if (this.cmpCoords(this.car.centerX, this.planeX, this.car.centerZ, this.planeZ, this.grabLimit) &&
			this.crane.state == 'DEF' &&
			Math.abs(this.car.vel) <= this.grabSpeed) {
			this.car.controlOn = false;
			this.crane.state = 'GRAB';
		}

		if (this.car.controlOn)
			this.car.move(this.deltaTime, this.terrain.possPath);

		this.crane.update(this.deltaTime);
	}
};