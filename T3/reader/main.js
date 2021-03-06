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

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[decodeURIComponent(key)] = decodeURIComponent(value);
        });
    return vars;
}
//Include additional files here
serialInclude(['../lib/CGF.js', 'XMLscene.js', 'MySceneGraph.js', 'MyInterface.js', 'primitives/MyCylinder.js', 'primitives/MyQuad.js', 'primitives/MyTorus.js', 'primitives/MyTriangle.js', 'primitives/MySphere.js', 'animations/Animation.js', 'animations/LinearAnimation.js', 'animations/CircularAnimation.js', 'primitives/Cylinder2.js', 'primitives/Patch.js', 'primitives/Plane.js', 'primitives/Terrain.js', 'primitives/Vehicle.js', 'primitives/Water.js', 'primitives/Board.js', 'primitives/Piece.js',  'primitives/Cube.js', 'primitives/Plant.js', 'primitives/Chair.js', 'animations/ArcAnimation.js', 'primitives/Column.js', 'primitives/Barrel.js', 'primitives/Door.js', 'primitives/WindowGrid.js', 'primitives/Menu.js', 'primitives/Timer.js', 'primitives/Score.js', 'primitives/ToolbarItem.js', 'primitives/Toolbar.js', 'Game.js', '../cgfobjreader/CGFOBJModel.js', '../cgfobjreader/CGFResourceReader.js',

    main = function () {
        // Standard application, scene and interface setup
        var app = new CGFapplication(document.body);
        var myInterface = new MyInterface();
        var myScene = new XMLscene(myInterface,2);

        app.init();

        app.setScene(myScene);
        app.setInterface(myInterface);

        myInterface.setActiveCamera(myScene.camera);

        // get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
        // or use "scene.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 

        var filename1 =  "neutreeko.xml";
        var filename2 =  "neutreeko2.xml";

        // create and load graph, and associate it to scene. 
        // Check console for loading errors
        var Graph1 = new MySceneGraph(filename1, myScene);
        var Graph2 = new MySceneGraph(filename2, myScene);
        // start
        app.run();
    }

]);