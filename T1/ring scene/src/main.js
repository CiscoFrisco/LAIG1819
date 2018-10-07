//From https://github.com/EvanHahn/ScriptInclude
include = function () {
	function f() {
		var a = this.readyState;
		(!a || /ded|te/.test(a)) && (c--, !c && e && d())
	}
	var a = arguments,
		b = document,
		c = a.length,
		d = a[c - 1],
		e = d.call;
	e && c--;
	for (var g, h = 0; c > h; h++) g = b.createElement("script"), g.src = arguments[h], g.async = !0, g.onload = g.onerror = g.onreadystatechange = f, (b.head || b.getElementsByTagName("head")[0]).appendChild(g)
};
serialInclude = function (a) {
	var b = console,
		c = serialInclude.l;
	if (a.length > 0) c.splice(0, 0, a);
	else b.log("Done!");
	if (c.length > 0) {
		if (c[0].length > 1) {
			var d = c[0].splice(0, 1);
			b.log("Loading " + d + "...");
			include(d, function () {
				serialInclude([]);
			});
		} else {
			var e = c[0][0];
			c.splice(0, 1);
			e.call();
		};
	} else b.log("Finished.");
};
serialInclude.l = new Array();

serialInclude([
	'../lib/CGF.js',
	'LightingScene.js',
	'MyQuad.js',
	'MyUnitCubeQuad.js',
	'Plane.js',
	'MyPrism.js',
	'MyCylinder.js',
	'MyLamp.js',
	'MyPoligon.js',
	'MyInterface.js',
	'MyTrapeze.js',
	'My3DTrapeze.js',
	'MyCylinderRound.js',
	'MyWheel.js',
	'MyHalfWheel.js',
	'MyChassi.js',
	'MyBumper.js',
	'MyWheelBumper.js',
	'MyVehicle.js',
	'MyBreather.js',
	'MySpoiler.js',
	'MyCrane.js',
	'MyTerrain.js',
	'MyMirror.js',
	'MyCylinderCovered.js',
	'MyTriangle.js',
	'MyRamp.js',
	'MyBarrier.js',
	'MyChair.js',
	'MyChairs.js',
	'MyStage.js',
	'MyStairs.js',
	'MyTorus.js',
	main = function () {
		var app = new CGFapplication(document.body);
		var myScene = new LightingScene();
		var myInterface = new MyInterface();

		app.init();

		app.setScene(myScene);
		app.setInterface(myInterface);

		myInterface.setActiveCamera(myScene.camera);

		app.run();
	}
]);