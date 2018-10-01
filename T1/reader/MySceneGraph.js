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

        var rootId = this.reader.getString(sceneNode, 'id', true);
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
                this.ambient = this.extractRGBA(children[i]);
            } else if (children[i].nodeName == "background" && this.background == null) {
                this.background = this.extractRGBA(children[i]);
            } else {
                this.onXMLMinorError("wrong or duplicate tag");
                continue;
            }
        }

        this.log("Parsed ambient");

        return null;
    }

    extractIllumination(index, component, type, illumination, lightId) {
        // Retrieves the ambient component.
        if (index != -1) {
            // R
            var r = this.reader.getFloat(component[index], 'r');
            if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                return "unable to parse R component of the " + type + " illumination for ID = " + lightId;
            else
                illumination.push(r);

            // G
            var g = this.reader.getFloat(component[index], 'g');
            if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                return "unable to parse G component of the " + type + " illumination for ID = " + lightId;
            else
                illumination.push(g);

            // B
            var b = this.reader.getFloat(component[index], 'b');
            if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                return "unable to parse B component of the " + type + " illumination for ID = " + lightId;
            else
                illumination.push(b);

            // A
            var a = this.reader.getFloat(component[index], 'a');
            if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                return "unable to parse A component of the " + type + " illumination for ID = " + lightId;
            else
                illumination.push(a);
        } else
            return type + " component undefined for ID = " + lightId;
    }

    extractPosition(index, component, positionLight, lightId, all) {
        if (index != -1) {
            // x
            var x = this.reader.getFloat(component[index], 'x');
            if (!(x != null && !isNaN(x)))
                return "unable to parse x-coordinate of the light location for ID = " + lightId;
            else
                positionLight.push(x);

            // y
            var y = this.reader.getFloat(component[index], 'y');
            if (!(y != null && !isNaN(y)))
                return "unable to parse y-coordinate of the light location for ID = " + lightId;
            else
                positionLight.push(y);

            // z
            var z = this.reader.getFloat(component[index], 'z');
            if (!(z != null && !isNaN(z)))
                return "unable to parse z-coordinate of the light location for ID = " + lightId;
            else
                positionLight.push(z);

            if (all) {
                // w
                var w = this.reader.getFloat(component[index], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light location for ID = " + lightId;
                else
                    positionLight.push(w);
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

            var lightEnabled = this.reader.getBoolean(children[i], 'enabled');

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
            var ambientIllumination = [];
            extractIllumination(ambientIndex, grandChildren, "ambient", ambientIllumination, lightId);

            // Retrieves the diffuse component.
            var diffuseIllumination = [];
            extractIllumination(diffuseIndex, grandChildren, "diffuse", diffuseIllumination, lightId);

            // Retrieves the specular component.
            var specularIllumination = [];
            extractIllumination(specularIndex, grandChildren, "specular", specularIllumination, lightId);


            if (children[i].nodeName == "omni") {
                // Retrieves the light location.
                var locationLight = [];
                this.extractPosition(locationIndex, grandChildren, locationLight, lightId, true);

                this.lights[lightId] = {
                    enabled: lightEnabled,
                    ambientIllumination: ambientIllumination,
                    diffuseIllumination: diffuseIllumination,
                    specularIllumination: specularIllumination,
                    locationLight: locationLight
                };
                numLights++;
            }
            else if (children[i].nodeName == "spot") {

                var angle = this.reader.getFloat(children[i], 'angle');
                var exponent = this.reader.getFloat(children[i], 'exponent');
                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light location.
                var locationLight = [];
                this.extractPosition(locationIndex, grandChildren, locationLight, lightId, false);

                // Retrieves the light location.
                var targetLight = [];
                this.extractPosition(targetIndex, grandChildren, targetLight, lightId, false);

                this.lights[lightId] = {
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

        for (let i = 0; i < textures.length; ++i) {

            if (textures[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + textures[i].nodeName + ">");
                continue;
            }

            var id = this.reader.getString(texturesNode, 'id');

            if (id == null)
                return "no texture id defined";

            if (i > 0 && this.findStringOnArray(id, this.textures))
                return "duplicate texture id";

            var file = this.reader.getString(texturesNode, 'file');

            if (file == null)
                return "no texture filepath defined";

            this.textures.push({
                id: id,
                file: file
            });
        }

        if (this.textures.length == 0)
            return "no texture defined!";

        console.log("Parsed textures");

        return null;
    }


    findStringOnArray(string, array) {

        for (let i = 0; i < array.length; ++i) {
            let object = array[i];
            if (object[string] === id)
                return true;
        }

        return false;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {

        var materials = materialsNode.children;
        this.materials = [];

        for (let i = 0; i < materials.length; ++i) {

            if (materials[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + materials[i].nodeName + ">");
                continue;
            }

            var id = this.reader.getString(materialsNode, 'id');

            if (id == null)
                return "no material id defined!";

            if (i > 0 && this.findStringOnArray(id, this.materials))
                return "duplicate material id";

            var shininess = this.reader.getFloat(materialsNode, 'shininess');

            if (shininess == null)
                return "no material shininess defined!";

            var properties = materials[i].children;

            var material = {};

            for (let j = 0; j < properties.length; ++j) {

                if (properties[j].nodeName === "emission" || properties[j].nodeName === "ambient"
                    || properties[j].nodeName === "diffuse" || properties[j].nodeName === "specular")
                    material[properties[j].nodeName] = this.extractRGBA(material);
                else
                    return "invalid material property";
            }

            this.materials.push(material);
        }

        // TODO: Parse block
        this.log("Parsed materials");
        return null;

    }

    extractRGBA(node) {
        var r = this.reader.getFloat(node, 'r');
        var g = this.reader.getFloat(node, 'g');
        var b = this.reader.getFloat(node, 'b');
        var a = this.reader.getFloat(node, 'a');

        var rgba = {
            r: r,
            g: g,
            b: b,
            a: a
        };

        return rgba;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        // TODO: Parse block
        var transformations = transformationsNode.children;
        this.transformations = [];

        for (let i = 0; i < transformations.length; ++i) {
            if (transformations[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + transformations[i].nodeName + ">");
                continue;
            }

            var id = this.reader.getString(transformationsNode, 'id');

            if (id == null)
                return "no transformation id defined!";

            if (i > 0 && this.findStringOnArray(id, this.transformations))
                return "duplicate transformation id";


            var children = transformations[i].children;
            var types = [];
            for (let j = 0; j < children.length; ++j) {
                this.parseExplicitTransformations(children[j], types);
            }

            if (types.length == 0)
                return "no transformations defined!";

            transformations.push({
                id: id,
                types: types
            });
        }

        this.log("Parsed transformations");
        return null;
    }

    parseExplicitTransformations(node, transformationsArray) {
        if (node.nodeName == "translate") {
            var x = this.reader.getFloat(node, 'x');
            var y = this.reader.getFloat(node, 'y');
            var z = this.reader.getFloat(node, 'z');

            transformationsArray.push({
                type: "translate",
                x: x,
                y: y,
                z: z
            });

        } else if (node.nodeName == "rotate") {

            var axis = this.reader.getString(node, 'axis');
            var angle = this.reader.getFloat(node, 'angle');

            transformationsArray.push({
                type: "rotate",
                axis: axis,
                angle: angle
            });

        }
        else if (node.nodeName == "scale") {
            var x = this.reader.getFloat(node, 'x');
            var y = this.reader.getFloat(node, 'y');
            var z = this.reader.getFloat(node, 'z');

            transformationsArray.push({
                type: "scale",
                x: x,
                y: y,
                z: z
            });

        }
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        // TODO: Parse block

        this.primitives = [];
        var primitives = primitivesNode.children;

        for (let i = 0; i < primitives.length; ++i) {
            if (primitives[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + primitives[i].nodeName + ">");
                continue;
            }

            var id = this.reader.getString(primitives[i], 'id');

            if (id == null)
                return "no primitive id defined!";

            if (i > 0 && this.findStringOnArray(id, this.primitives))
                return "duplicate primitive id";

            if (primitives[i].chidren.length != 1)
                return "there should be only one primitive associated";

            var primitive = primitives[i].children[0];

            if (primitive.nodeName == "rectangle") {
                var x1 = this.reader.getFloat(primitive, 'x1');
                var y1 = this.reader.getFloat(primitive, 'y1');
                var x2 = this.reader.getFloat(primitive, 'x2');
                var y2 = this.reader.getFloat(primitive, 'y2');

                this.primitives.push({
                    id: id,
                    type: "rectangle",
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2
                });

            } else if (primitive.nodeName == "triangle") {
                var x1 = this.reader.getFloat(primitive, 'x1');
                var y1 = this.reader.getFloat(primitive, 'y1');
                var z1 = this.reader.getFloat(primitive, 'z1');
                var x2 = this.reader.getFloat(primitive, 'x2');
                var y2 = this.reader.getFloat(primitive, 'y2');
                var z2 = this.reader.getFloat(primitive, 'z2');
                var x3 = this.reader.getFloat(primitive, 'x3');
                var y3 = this.reader.getFloat(primitive, 'y3');
                var z3 = this.reader.getFloat(primitive, 'z3');

                this.primitives.push({
                    id: id,
                    type: "triangle",
                    x1: x1,
                    y1: y1,
                    z1: z1,
                    x2: x2,
                    y2: y2,
                    z2: z2,
                    x3: x3,
                    y3: y3,
                    z3: z3
                });

            }
            else if (primitive.nodeName == "cylinder") {
                var base = this.reader.getFloat(primitive, 'base');
                var top = this.reader.getFloat(primitive, 'top');
                var height = this.reader.getFloat(primitive, 'height');
                var slices = this.reader.getInteger(primitive, 'slices');
                var stacks = this.reader.getInteger(primitive, 'stacks');

                this.primitives.push({
                    id: id,
                    type: "sphere",
                    base: base,
                    top: top,
                    height: height,
                    slices: slices,
                    stacks: stacks
                });

            }
            else if (primitive.nodeName == "sphere") {
                var radius = this.reader.getFloat(primitive, 'radius');
                var slices = this.reader.getInteger(primitive, 'slices');
                var stacks = this.reader.getInteger(primitive, 'stacks');

                this.primitives.push({
                    id: id,
                    type: "sphere",
                    radius: radius,
                    slices: slices,
                    stacks: stacks
                });
            } else if (primitive.nodeName == "torus") {
                var inner = this.reader.getFloat(primitive, 'inner');
                var outer = this.reader.getFloat(primitive, 'outer');
                var slices = this.reader.getInteger(primitive, 'slices');
                var loops = this.reader.getInteger(primitive, 'loops');


                this.primitives.push({
                    id: id,
                    type: "torus",
                    inner: inner,
                    outer: outer,
                    slices: slices,
                    loops: loops
                });
            }
        }

        if (this.primitives.length == 0)
            return "no primitive defined!";

        this.log("Parsed primitives");
        return null;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        // TODO: Parse block

        this.components = [];
        var components = componentsNode.children;

        for (let i = 0; i < components.length; ++i) {
            if (components[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + components[i].nodeName + ">");
                continue;
            }

            var id = this.reader.getString(components[i], 'id');

            if (id == null)
                return "no component id defined!";

            if (i > 0 && this.findStringOnArray(id, this.components))
                return "duplicate component id";

            var children = components[i].children;
            var component = {};

            for (let j = 0; j < children.length; ++j) {

                if (children[i].nodeName == "transformation") {

                    var transformations = children[i].children;

                    if (transformations.length == 1 && transformation[0].nodeName == "transformationref") {

                        var id = this.reader.getString(transformation[0], 'id');

                        if (id == null)
                            return "no transformationref id defined!";

                        component.transformation.id = id;

                    }
                    else if (transformations.length > 0) {
                        var types = [];
                        for (let c = 0; c < transformations.length; c++) {
                            parseExplicitTransformations(transformations[c], types);
                        }

                        component.transformation = types;
                    }
                    else
                        return "invalid transformation block";
                }
                else if (children[i].nodeName == "materials") {

                    var materials = children[i].children;

                    for (let c = 0; c < materials.length; ++c) {
                        var id = this.reader.getString(materials[c], 'id');

                        component.materials.push(id);
                    }

                    if (materials.length == 0)
                        return "no materials defined for this component";

                }
                else if (children[i].nodeName == "texture") {
                    var id = this.reader.getString(materials[j], 'id');
                    var length_s = this.reader.getFloat(materials[j], 'length_s');
                    var length_t = this.reader.getFloat(materials[j], 'length_t');

                    component.texture = {
                        id: id,
                        length_s: length_s,
                        length_t: length_t
                    };
                }
                else if (children[i].nodeName == "children") {

                    var refs = children[i].children;

                    for (let c = 0; c < refs.length; ++c) {
                        if (refs[c].nodeName == "primitiveref") {
                            var id = this.reader.getString(refs[c], 'id');
                            component.primitives.push(id);
                        } else if (refs[c].nodeName == "componentref") {
                            var id = this.reader.getString(refs[c], 'id');
                            component.children.push(id);
                        }
                    }
                }
            }

            if (component.transformation == null || component.materials == null || component.texture == null ||
                component.children == null)
                return "invalid component";
        }

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