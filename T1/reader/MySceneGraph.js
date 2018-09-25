var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        if (this.processNode("scene", nodeNames, nodes, SCENE_INDEX, this.parseScene, error))
            return error;

        if (this.processNode("views", nodeNames, nodes, VIEWS_INDEX, this.parseViews, error))
            return error;

        if (this.processNode("ambient", nodeNames, nodes, AMBIENT_INDEX, this.parseAmbient, error))
            return error;

        if (this.processNode("lights", nodeNames, nodes, LIGHTS_INDEX, this.parseLights, error))
            return error;

        if (this.processNode("textures", nodeNames, nodes, TEXTURES_INDEX, this.parseTextures, error))
            return error;

        if (this.processNode("materials", nodeNames, nodes, MATERIALS_INDEX, this.parseMaterials, error))
            return error;

        if (this.processNode("transformations", nodeNames, nodes, TRANSFORMATIONS_INDEX, this.parseTransformations, error))
            return error;

        if (this.processNode("primitives", nodeNames, nodes, PRIMITIVES_INDEX, this.parsePrimitives, error))
            return error;

        if (this.processNode("components", nodeNames, nodes, COMPONENTS_INDEX, this.parseComponents, error))
            return error;
    }

    processNode(type, nodeNames, nodes, typeIndex, parser, error) {
        var index;

        if ((index = nodeNames.indexOf(type)) == -1)
            error = "tag <" + type + "> missing";
        else {
            if (index != typeIndex)
                this.onXMLMinorError("tag <" + type + "> out of order");

            //Parse block
            error = parser.call(this, nodes[index]);
        }

        return error != null;
    }

    /**
     * Parses the <scene> block.
     */
    parseScene(sceneNode) {

        var rootId = this.reader.getString(sceneNode, 'id');

        if (rootId == null)
            return "no rootId defined";

        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');

        if (axis_length == null)
            return "no axis_length defined";


        this.sceneInfo = {
            rootId: rootId,
            axis_length: axis_length
        };

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {
        // TODO: Parse views node CHECK ERRORS

        var children = viewsNode.children;

        this.views = {};

        for (let i = 0; i < children.length; ++i) {

            if (children[i].nodeName == "ortho") {
                var id = this.reader.getString(children[i], 'id');
                var near = this.reader.getFloat(children[i], 'near');
                var far = this.reader.getFloat(children[i], 'far');
                var left = this.reader.getFloat(children[i], 'left');
                var right = this.reader.getFloat(children[i], 'right');
                var top = this.reader.getFloat(children[i], 'top');
                var bottom = this.reader.getFloat(children[i], 'bottom');

                this.views[id] = {
                    near: near,
                    far: far,
                    left: left,
                    right: right,
                    top: top,
                    bottom: bottom
                };

            } else if (children[i].nodeName == "perspective") {
                var id = this.reader.getString(children[i], 'id');
                var near = this.reader.getFloat(children[i], 'near');
                var far = this.reader.getFloat(children[i], 'far');
                var angle = this.reader.getFloat(children[i], 'left');

                var grandChildren = children[i].children;

                var fx = this.reader.getFloat(grandChildren[0], 'x');
                var fy = this.reader.getFloat(grandChildren[0], 'y');
                var fz = this.reader.getFloat(grandChildren[0], 'z');
                var tx = this.reader.getFloat(grandChildren[1], 'x');
                var ty = this.reader.getFloat(grandChildren[1], 'y');
                var tz = this.reader.getFloat(grandChildren[1], 'z');

                this.views[id] = {
                    near: near,
                    far: far,
                    angle: angle,
                    from: {
                        x: fx,
                        y: fy,
                        z: fz
                    },
                    to: {
                        x: tx,
                        y: ty,
                        z: tz
                    }
                };
            } else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
        }

        if (this.views.length == 0)
            return "no valid view defined"

        this.log("Parsed views");

        return null;
    }

    /**
     * Parses the <ambient> block.
     * @param {ambient block element} ambientNode
     */
    parseAmbient(ambientNode) {
        // TODO: Parse views node

        var children = ambientNode.children;

        for (let i = 0; i < children.length; ++i) {
            if (children[i].nodeName == "ambient" && this.ambient == null) {
                var r = this.reader.getFloat(children[i], 'r');
                var g = this.reader.getFloat(children[i], 'g');
                var b = this.reader.getFloat(children[i], 'b');
                var a = this.reader.getFloat(children[i], 'a');

                this.ambient = {
                    r: r,
                    g: g,
                    b: b,
                    a: a
                };
            } else if (children[i].nodeName == "background" && this.background == null) {
                var r = this.reader.getFloat(children[i], 'r');
                var g = this.reader.getFloat(children[i], 'g');
                var b = this.reader.getFloat(children[i], 'b');
                var a = this.reader.getFloat(children[i], 'a');

                this.background = {
                    r: r,
                    g: g,
                    b: b,
                    a: a
                };
            } else {
                this.onXMLMinorError("wrong or duplicate tag");
                continue;
            }
        }

        this.log("Parsed ambient");

        return null;
    }


    /**
     * Parses the <lights> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "LIGHT") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var enableIndex = nodeNames.indexOf("enable");
            var positionIndex = nodeNames.indexOf("position");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Light enable/disable
            var enableLight = true;
            if (enableIndex == -1) {
                this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
            } else {
                var aux = this.reader.getFloat(grandChildren[enableIndex], 'value');
                if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1)))
                    this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
                else
                    enableLight = aux == 0 ? false : true;
            }

            // Retrieves the light position.
            var positionLight = [];
            if (positionIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[positionIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[positionIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[positionIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[positionIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(w);
            } else
                return "light position undefined for ID = " + lightId;

            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            } else
                return "ambient component undefined for ID = " + lightId;

            // TODO: Retrieve the diffuse component

            // TODO: Retrieve the specular component

            // TODO: Store Light global information.
            //this.lights[lightId] = ...;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        // TODO: Parse block

        console.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        // TODO: Parse block
        this.log("Parsed materials");
        return null;

    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        // TODO: Parse block
        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        // TODO: Parse block
        this.log("Parsed primitives");
        return null;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        // TODO: Parse block
        this.log("Parsed components");
        return null;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}