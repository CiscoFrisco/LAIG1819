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

// TODO: verificar erros e tipos de erro (minor e assumir valor default, ou retornar logo)


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

        error = this.processNode("scene", nodeNames, nodes, SCENE_INDEX, this.parseScene);

        if (error != null)
            return error;

        error = this.processNode("views", nodeNames, nodes, VIEWS_INDEX, this.parseViews);
        if (error != null)
            return error;

        error = this.processNode("ambient", nodeNames, nodes, AMBIENT_INDEX, this.parseAmbient);
        if (error != null)
            return error;

        error = this.processNode("lights", nodeNames, nodes, LIGHTS_INDEX, this.parseLights);
        if (error != null)
            return error;

        error = this.processNode("textures", nodeNames, nodes, TEXTURES_INDEX, this.parseTextures);
        if (error != null)
            return error;

        error = this.processNode("materials", nodeNames, nodes, MATERIALS_INDEX, this.parseMaterials);
        if (error != null)
            return error;

        error = this.processNode("transformations", nodeNames, nodes, TRANSFORMATIONS_INDEX, this.parseTransformations);
        if (error != null)
            return error;

        error = this.processNode("primitives", nodeNames, nodes, PRIMITIVES_INDEX, this.parsePrimitives);
        if (error != null)
            return error;

        error = this.processNode("components", nodeNames, nodes, COMPONENTS_INDEX, this.parseComponents);
        if (error != null)
            return error;
    }

    /**
     * Process a main XML block
     * @param {string} type 
     * @param {array} nodeNames 
     * @param {array} nodes 
     * @param {Integer} typeIndex 
     * @param {function} parser 
     */
    processNode(type, nodeNames, nodes, typeIndex, parser) {
        var index;

        if ((index = nodeNames.indexOf(type)) == -1)
            return "tag <" + type + "> missing";
        else {
            if (index != typeIndex)
                this.onXMLMinorError("tag <" + type + "> out of order");

            //Parse block
            return parser.call(this, nodes[index]);
        }
    }

    /**
     * Parses the <scene> block.
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        var rootId = this.reader.getString(sceneNode, 'root', true);
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length', true);

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

        var def = this.reader.getString(viewsNode, 'default', true);
        var numViews = 0;
        var children = viewsNode.children;

        this.views = {};
        this.views.array = [];

        for (let i = 0; i < children.length; ++i) {
            var id = this.reader.getString(children[i], 'id', true);

            if (this.views[id] != null) {
                return "duplicate view";
            }

            var near = this.reader.getFloat(children[i], 'near', true);
            var far = this.reader.getFloat(children[i], 'far', true);

            if (children[i].nodeName == "ortho") {
                var left = this.reader.getFloat(children[i], 'left', true);
                var right = this.reader.getFloat(children[i], 'right', true);
                var top = this.reader.getFloat(children[i], 'top', true);
                var bottom = this.reader.getFloat(children[i], 'bottom', true);

                this.views.array[id] = {
                    type: "ortho",
                    near: near,
                    far: far,
                    left: left,
                    right: right,
                    top: top,
                    bottom: bottom
                };
                numViews++;

            } else if (children[i].nodeName == "perspective") {
                var angle = this.reader.getFloat(children[i], 'angle', true);

                var grandChildren = children[i].children;
                // Reads the names of the nodes to an auxiliary buffer.
                var nodeNames = [];

                for (var c = 0; c < grandChildren.length; c++) {
                    nodeNames.push(grandChildren[c].nodeName);
                }

                var fromIndex = nodeNames.indexOf('from');
                var toIndex = nodeNames.indexOf('to');

                var fx = this.reader.getFloat(grandChildren[fromIndex], 'x', true);
                var fy = this.reader.getFloat(grandChildren[fromIndex], 'y', true);
                var fz = this.reader.getFloat(grandChildren[fromIndex], 'z', true);
                var tx = this.reader.getFloat(grandChildren[toIndex], 'x', true);
                var ty = this.reader.getFloat(grandChildren[toIndex], 'y', true);
                var tz = this.reader.getFloat(grandChildren[toIndex], 'z', true);

                this.views.array[id] = {
                    type: "perspective",
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
                numViews++;

            } else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
        }

        if (numViews == 0)
            return "no valid view defined"

        if (this.views.array[def] == null)
            return "no default view defined";

        this.views.default = def;

        this.log("Parsed views");

        return null;
    }

    /**
     * Parses the <ambient> block.
     * @param {ambient block element} ambientNode
     */
    parseAmbient(ambientNode) {

        var children = ambientNode.children;
        var error;

        for (let i = 0; i < children.length; ++i) {
            if (children[i].nodeName == "ambient" && this.ambient == null) {
                this.ambient = this.extractRGBA(children[i], error);
                if (error != null)
                    return error;
            } else if (children[i].nodeName == "background" && this.background == null) {
                this.background = this.extractRGBA(children[i], error);
                if (error != null)
                    return error;
            } else {
                this.onXMLMinorError("wrong or duplicate tag");
                continue;
            }
        }

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Extract RGBA illumination component
     * @param {*} index 
     * @param {*} component 
     * @param {*} type 
     * @param {*} rgba 
     * @param {*} lightId 
     */
    extractIllumination(index, component, type, error, lightId) {

        if (index != -1)
            return this.extractRGBA(component[index], error);
        else
            error = type + " component undefined for ID = " + lightId;
    }

    extractRGBA(node, error) {

        var rgba = {};

        // R
        var r = this.reader.getFloat(node, 'r', true);
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1)) {
            error = "unable to parse R component of the " + node.nodeName + " block";
            return;
        }

        // G
        var g = this.reader.getFloat(node, 'g', true);
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1)) {
            error = "unable to parse G component of the " + node.nodeName + " block";
            return;
        }

        // B
        var b = this.reader.getFloat(node, 'b', true);
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1)) {
            error = "unable to parse B component of the " + node.nodeName + " block";
            return;
        }

        // A
        var a = this.reader.getFloat(node, 'a', true);
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1)) {
            error = "unable to parse A component of the " + node.nodeName + " block";
            return;
        }

        rgba = {
            r: r,
            g: g,
            b: b,
            a: a
        };

        return rgba;
    }

    /**
     * Extract light position values
     * @param {*} index 
     * @param {*} component 
     * @param {*} positionLight 
     * @param {*} lightId 
     * @param {*} all 
     */
    extractPosition(index, component, positionLight, lightId, all) {
        if (index != -1) {
            // x
            var x = this.reader.getFloat(component[index], 'x', true);
            if (!(x != null && !isNaN(x)))
                return "unable to parse x-coordinate of the light location for ID = " + lightId;
            else
                positionLight.x = x;

            // y
            var y = this.reader.getFloat(component[index], 'y', true);
            if (!(y != null && !isNaN(y)))
                return "unable to parse y-coordinate of the light location for ID = " + lightId;
            else
                positionLight.y = y;

            // z
            var z = this.reader.getFloat(component[index], 'z', true);
            if (!(z != null && !isNaN(z)))
                return "unable to parse z-coordinate of the light location for ID = " + lightId;
            else
                positionLight.z = z;

            if (all) {
                // w
                var w = this.reader.getFloat(component[index], 'w', true);
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light location for ID = " + lightId;
                else
                    positionLight.w = w;
            }
        } else
            return "light location undefined for ID = " + lightId;
    }


    /**
     * Parses the <lights> node. TODO: adaptar
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

            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id', true);

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            var lightEnabled = this.reader.getBoolean(children[i], 'enabled', true);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var locationIndex = nodeNames.indexOf("location");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Retrieves the ambient component.
            var error;

            var ambientIllumination = this.extractIllumination(ambientIndex, grandChildren, "ambient", error, lightId);

            if (error != null)
                return error;

            // Retrieves the diffuse component.
            var diffuseIllumination = this.extractIllumination(diffuseIndex, grandChildren, "diffuse", error, lightId);

            if (error != null)
                return error;

            // Retrieves the specular component.
            var specularIllumination = this.extractIllumination(specularIndex, grandChildren, "specular", error, lightId);

            if (error != null)
                return error;

            var locationLight = {};


            if (children[i].nodeName == "omni") {
                // Retrieves the light location.
                this.extractPosition(locationIndex, grandChildren, locationLight, lightId, true);

                this.lights[lightId] = {
                    type: "omni",
                    enabled: lightEnabled,
                    ambientIllumination: ambientIllumination,
                    diffuseIllumination: diffuseIllumination,
                    specularIllumination: specularIllumination,
                    locationLight: locationLight
                };
                numLights++;
            } else if (children[i].nodeName == "spot") {

                var angle = this.reader.getFloat(children[i], 'angle', true);
                var exponent = this.reader.getFloat(children[i], 'exponent', true);
                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light location.
                this.extractPosition(locationIndex, grandChildren, locationLight, lightId, true);

                // Retrieves the light location.
                var targetLight = {};
                this.extractPosition(targetIndex, grandChildren, targetLight, lightId, false);

                this.lights[lightId] = {
                    type: "spot",
                    enabled: lightEnabled,
                    ambientIllumination: ambientIllumination,
                    diffuseIllumination: diffuseIllumination,
                    specularIllumination: specularIllumination,
                    locationLight: locationLight,
                    targetLight: targetLight,
                    angle: angle,
                    exponent: exponent
                };
                numLights++;
            }

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

        var textures = texturesNode.children;
        this.textures = [];
        var numTextures = 0;

        for (let i = 0; i < textures.length; ++i) {

            if (textures[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + textures[i].nodeName + ">");
                continue;
            }

            var id = this.reader.getString(textures[i], 'id', true);

            if (this.textures[id] != null)
                return "duplicate texture id";

            var file = this.reader.getString(textures[i], 'file', true);

            if (file == null)
                return "no texture filepath defined";

            this.textures[id] = file;
            numTextures++;
        }

        if (numTextures == 0)
            return "no texture defined!";

        this.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {

        var materials = materialsNode.children;
        this.materials = [];
        var numMaterials = 0;

        for (let i = 0; i < materials.length; ++i) {

            if (materials[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + materials[i].nodeName + ">");
                continue;
            }

            var id = this.reader.getString(materials[i], 'id', true);

            if (this.materials[id] != null)
                return "duplicate material id";

            var shininess = this.reader.getFloat(materials[i], 'shininess', true);

            if (shininess == null)
                return "no material shininess defined!";

            var properties = materials[i].children;

            var material = {};

            for (let j = 0; j < properties.length; ++j) {
                if (properties[j].nodeName === "emission" || properties[j].nodeName === "ambient" ||
                    properties[j].nodeName === "diffuse" || properties[j].nodeName === "specular")
                    this.extractRGBA(properties[j], material[properties[j].nodeName]);
                else
                    return "invalid material property";
            }

            material.shininess = shininess;
            this.materials[id] = material;
            numMaterials++;
        }

        if (numMaterials == 0)
            return "no material defined";

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
        var transformations = transformationsNode.children;
        this.transformations = [];
        var numTransformations = 0;


        for (let i = 0; i < transformations.length; ++i) {
            if (transformations[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + transformations[i].nodeName + ">");
                continue;
            }

            var id = this.reader.getString(transformations[i], 'id', true);

            if (this.transformations[id] != null)
                return "duplicate transformation id";

            var children = transformations[i].children;
            var error;
            this.scene.loadIdentity();

            if (children.length == 0)
                return "no transformations defined!";

            for (let j = 0; j < children.length; ++j) {
                error = this.parseExplicitTransformation(children[j]);

                if (error != null)
                    return "no valid transformations defined!";
            }

            this.transformations[id] = this.scene.getMatrix();
            numTransformations++;
        }

        this.scene.loadIdentity();

        if (numTransformations == 0)
            return "no transformation defined";

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parse explicit transformation on component transformations block
     * @param {*} node transformation block
     * @param {*} transformationsArray array of transformations associated
     */
    parseExplicitTransformation(node) {

        if (node.nodeName == "translate") {
            var x = this.reader.getFloat(node, 'x', true);
            var y = this.reader.getFloat(node, 'y', true);
            var z = this.reader.getFloat(node, 'z', true);

            this.scene.translate(x, y, z);

        } else if (node.nodeName == "rotate") {

            var axis = this.reader.getString(node, 'axis', true);
            var angle = this.reader.getFloat(node, 'angle', true);

            if (!(axis == 'x' || axis == 'y' || axis == 'z'))
                return "invalid rotate axis";

            var x = axis == 'x' ? 1 : 0;
            var y = axis == 'y' ? 1 : 0;
            var z = axis == 'z' ? 1 : 0;

            this.scene.rotate(angle, x, y, z);

        } else if (node.nodeName == "scale") {
            var x = this.reader.getFloat(node, 'x', true);
            var y = this.reader.getFloat(node, 'y', true);
            var z = this.reader.getFloat(node, 'z', true);

            this.scene.scale(x, y, z);
        } else
            return "invalid transformation";
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        // TODO: Parse block

        this.primitives = [];
        var primitives = primitivesNode.children;
        var numPrimitives = 0;

        for (let i = 0; i < primitives.length; ++i) {
            if (primitives[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + primitives[i].nodeName + ">");
                continue;
            }

            var id = this.reader.getString(primitives[i], 'id', true);

            if (this.primitives[id] != null)
                return "duplicate primitive id";

            if (primitives[i].children.length != 1)
                return "there should be only one primitive associated";

            var primitive = primitives[i].children[0];

            if (primitive.nodeName == "rectangle") {
                var x1 = this.reader.getFloat(primitive, 'x1', true);
                var y1 = this.reader.getFloat(primitive, 'y1', true);
                var x2 = this.reader.getFloat(primitive, 'x2', true);
                var y2 = this.reader.getFloat(primitive, 'y2', true);

                this.primitives[id] = new MyQuad(this.scene, x1, y1, x2, y2);
                numPrimitives++;

            } else if (primitive.nodeName == "triangle") {
                var x1 = this.reader.getFloat(primitive, 'x1', true);
                var y1 = this.reader.getFloat(primitive, 'y1', true);
                var z1 = this.reader.getFloat(primitive, 'z1', true);
                var x2 = this.reader.getFloat(primitive, 'x2', true);
                var y2 = this.reader.getFloat(primitive, 'y2', true);
                var z2 = this.reader.getFloat(primitive, 'z2', true);
                var x3 = this.reader.getFloat(primitive, 'x3', true);
                var y3 = this.reader.getFloat(primitive, 'y3', true);
                var z3 = this.reader.getFloat(primitive, 'z3', true);

                this.primitives[id] = new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);
                numPrimitives++;

            } else if (primitive.nodeName == "cylinder") {
                var base = this.reader.getFloat(primitive, 'base', true);
                var top = this.reader.getFloat(primitive, 'top', true);
                var height = this.reader.getFloat(primitive, 'height', true);
                var slices = this.reader.getInteger(primitive, 'slices', true);
                var stacks = this.reader.getInteger(primitive, 'stacks', true);

                this.primitives[id] = new MyCylinder(this.scene, base, top, height, slices, stacks);
                numPrimitives++;

            } else if (primitive.nodeName == "sphere") {
                /*  var radius = this.reader.getFloat(primitive, 'radius', true);
                  var slices = this.reader.getInteger(primitive, 'slices', true);
                  var stacks = this.reader.getInteger(primitive, 'stacks', true);

                  this.primitives[id] = new MySphere(this.scene, radius, slices, stacks);
                  numPrimitives++;*/
            } else if (primitive.nodeName == "torus") {
                var inner = this.reader.getFloat(primitive, 'inner', true);
                var outer = this.reader.getFloat(primitive, 'outer', true);
                var slices = this.reader.getInteger(primitive, 'slices', true);
                var loops = this.reader.getInteger(primitive, 'loops', true);


                this.primitives[id] = new MyTorus(this.scene, inner, outer, slices, loops);
                numPrimitives++;
            }
        }

        if (numPrimitives == 0)
            return "no primitive defined!";

        this.log("Parsed primitives");
        return null;
    }


    findStringOnArray(string, array, attribute) {
        for (let i = 0; i < array.length; ++i) {
            if (array[i][attribute] == string)
                return true
        }
        return false;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        // TODO: Parse block

        this.components = [];
        var components = componentsNode.children;
        var numComponents = 0;

        for (let i = 0; i < components.length; ++i) {
            if (components[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + components[i].nodeName + ">");
                continue;
            }

            var id = this.reader.getString(components[i], 'id', true);

            if (this.components[id] != null)
                return "duplicate component";

            var children = components[i].children;
            var component = {};

            for (let j = 0; j < children.length; ++j) {

                if (children[j].nodeName == "transformation") {
                    var transformations = children[j].children;

                    if (transformations.length == 1 && transformations[0].nodeName == "transformationref") {

                        let transfId = this.reader.getString(transformations[0], 'id', true);

                        if (transfId == null)
                            return "no transformationref id defined!";

                        component.transformations = this.transformations[transfId];

                    } else if (!this.findStringOnArray(transformations, "transformationref", "nodeName")) {
                        this.scene.loadIdentity();
                        for (let c = 0; c < transformations.length; c++) {
                            this.parseExplicitTransformation(transformations[c]);
                        }

                        this.scene.loadIdentity();
                        component.transformations = this.scene.getMatrix();
                    } else
                        return "invalid transformation block";
                } else if (children[j].nodeName == "materials") {
                    var materials = children[j].children;
                    component.materials = [];
                    for (let c = 0; c < materials.length; ++c) {
                        let matId = this.reader.getString(materials[c], 'id', true);

                        component.materials.push(matId);
                    }

                    if (component.materials.length == 0)
                        return "no materials defined for this component";

                } else if (children[j].nodeName == "texture") {
                    let textId = this.reader.getString(children[j], 'id', true);
                    var length_s = this.reader.getFloat(children[j], 'length_s', false);
                    var length_t = this.reader.getFloat(children[j], 'length_t', false);

                    length_s = length_s == null ? 1.0 : length_s;
                    length_t = length_t == null ? 1.0 : length_t;

                    component.texture = {
                        id: textId,
                        length_s: length_s,
                        length_t: length_t
                    };
                } else if (children[j].nodeName != "children")
                    return "invalid component property name";
            }


            if (component.transformations == null || component.materials == null || component.texture == null)
                return "invalid component";

            this.components[id] = component;
            numComponents++;
        }

        if (this.components[this.sceneInfo.rootId] == null)
            return "missing root node, id = " + this.sceneInfo.rootId;

        if (numComponents == 0)
            return "no component defined";


        for (let i = 0; i < components.length; ++i) {
            var id = this.reader.getString(components[i], 'id', true);

            var children = components[i].children;

            for (let j = 0; j < children.length; ++j) {
                if (children[j].nodeName == "children") {
                    this.parseChildren(id, children[j].children);
                    break;
                }
            }
            if (this.components[id].children == null)
                return "no children defined";
        }

        this.log("Parsed components");
        return null;
    }

    parseChildren(id, refs) {
        this.components[id].children = {};
        for (let c = 0; c < refs.length; ++c) {
            let childId = this.reader.getString(refs[c], 'id', true);
            if (refs[c].nodeName == "componentref") {
                this.components[id].children[childId] = {
                    data: this.components[childId],
                    type: "component"
                };

            } else {
                this.components[id].children[childId] = {
                    data: this.primitives[childId],
                    type: "primitive"
                };
            }
        }
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

        this.displayComponent(this.components[this.sceneInfo.rootId]);
    }

    displayComponent(component) {
        for (var key in component.children) {
            if (component.children[key].type == "primitive")
                this.displayPrimitive(component.children[key].data);
            else if (component.children[key].type == "component")
                this.displayComponent(component.children[key].data);
        }
    }

    displayPrimitive(primitive) {
        primitive.display();
    }
}