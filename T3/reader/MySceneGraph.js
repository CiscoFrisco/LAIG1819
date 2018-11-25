var DEGREE_TO_RAD = Math.PI / 180;
var DEFAULT_MAT = 'T1G2Def';
// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

// TODO: verificar erros e tipos de erro (minor e assumir valor default, ou
// retornar logo)


/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
  /**
   * Creates a MySceneGraph object.
   * @param {String} filename name of the scene xml
   * @param {CGFscene} scene main scene
   */
  constructor(filename, scene) {
    this.loadedOk = null;

    // Establish bidirectional references between scene and graph.
    this.scene = scene;
    scene.graph = this;

    this.nodes = [];

    this.idRoot = null;  // The id of the root element.

    this.axisCoords = [];
    this.axisCoords['x'] = [1, 0, 0];
    this.axisCoords['y'] = [0, 1, 0];
    this.axisCoords['z'] = [0, 0, 1];

    // File reading
    this.reader = new CGFXMLreader();

    /*
     * Read the contents of the xml file, and refer to this class for loading
     * and error handlers. After the file is read, the reader calls onXMLReady
     * on this object. If any error occurs, the reader calls onXMLError on this
     * object, with an error message
     */

    this.reader.open('scenes/' + filename, this);
  }


  /**
   * Callback to be executed on any message.
   * @param {string} message
   */
  log(message) {
    console.log('   ' + message);
  }


  /*
   * Callback to be executed after successful reading
   */
  onXMLReady() {
    this.log('XML Loading finished.');
    var rootElement = this.reader.xmlDoc.documentElement;

    // Here should go the calls for different functions to parse the various
    // blocks
    var error = this.parseXMLFile(rootElement);

    if (error != null) {
      this.onXMLError(error);
      return;
    }

    this.loadedOk = true;

    // As the graph loaded ok, signal the scene so that any additional
    // initialization depending on the graph can take place
    this.scene.onGraphLoaded();
  }

  /**
   * Parses the XML file, processing each block.
   * @param {XML root element} rootElement
   */
  parseXMLFile(rootElement) {
    if (rootElement.nodeName != 'yas') return 'root tag <yas> missing';

    var nodes = rootElement.children;

    // Reads the names of the nodes to an auxiliary buffer.
    var nodeNames = [];

    for (var i = 0; i < nodes.length; i++) {
      nodeNames.push(nodes[i].nodeName);
    }

    var error;

    // Processes each node, verifying errors.

    if ((error = this.processNode(
      'scene', nodeNames, nodes, SCENE_INDEX, this.parseScene)) != null)
      return error;


    if ((error = this.processNode(
      'views', nodeNames, nodes, VIEWS_INDEX, this.parseViews)) != null)
      return error;

    if ((error = this.processNode(
      'ambient', nodeNames, nodes, AMBIENT_INDEX, this.parseAmbient)) !=
      null)
      return error;

    if ((error = this.processNode(
      'lights', nodeNames, nodes, LIGHTS_INDEX, this.parseLights)) !=
      null)
      return error;

    if ((error = this.processNode(
      'textures', nodeNames, nodes, TEXTURES_INDEX,
      this.parseTextures)) != null)
      return error;

    if ((error = this.processNode(
      'materials', nodeNames, nodes, MATERIALS_INDEX,
      this.parseMaterials)) != null)
      return error;

    if ((error = this.processNode(
      'transformations', nodeNames, nodes, TRANSFORMATIONS_INDEX,
      this.parseTransformations)) != null)
      return error;

    if ((error = this.processNode(
      'animations', nodeNames, nodes, ANIMATIONS_INDEX,
      this.parseAnimations)) != null)
      return error;

    if ((error = this.processNode(
      'primitives', nodeNames, nodes, PRIMITIVES_INDEX,
      this.parsePrimitives)) != null)
      return error;

    if ((error = this.processNode(
      'components', nodeNames, nodes, COMPONENTS_INDEX,
      this.parseComponents)) != null)
      return error;
  }

  /**
   * Process a main XML block
   * @param {String} type name of the XML block
   * @param {Array} nodeNames array containing the names of all the XML blocks
   * @param {Array} nodes array contaning all of the XML blocks
   * @param {Number} typeIndex index of the corresponding block in the tree
   * @param {Function} parser function responsible for parsing the given block type
   */
  processNode(type, nodeNames, nodes, typeIndex, parser) {
    var index;

    if ((index = nodeNames.indexOf(type)) == -1)
      return 'tag <' + type + '> missing';
    else {
      if (index != typeIndex)
        this.onXMLMinorError('tag <' + type + '> out of order');

      // Parse block
      return parser.call(this, nodes[index]);
    }
  }

  /**
   * Checks if a number is valid
   * @param {scene block element} node parent node
   * @param {Number} number number to be analysed
   * @param {String} name name of the variable
   * @param {Boolean} limits true if variable should have limits, false otherwise
   * @param {Number} low lower limit
   * @param {Number} high higher limit
   */
  checkNumber(node, number, name, limits = true, low = 0, high = 1000) {
    if ((number == null || isNaN(number)) ||
      (limits && !(number >= low && number <= high)))
      return 'unable to parse ' + name + ' component of the ' + node.nodeName +
        ' block';

    return null;
  }

  /**
   * Parses the <scene> block.
   * @param {scene block element} sceneNode
   */
  parseScene(sceneNode) {
    var error;
    var rootId = this.reader.getString(sceneNode, 'root', true);

    if (rootId == '') return 'no rootId defined';

    var axis_length = this.reader.getFloat(sceneNode, 'axis_length', true);

    if ((error = this.checkNumber(
      sceneNode, axis_length, 'axis_length', true)) != null)
      return error;

    this.sceneInfo = { rootId: rootId, axis_length: axis_length };

    this.log('Parsed scene');

    return null;
  }

  /**
   * Parses the <views> block.
   * @param {views block element} viewsNode
   */
  parseViews(viewsNode) {
    var error;
    var def = this.reader.getString(viewsNode, 'default', true);
    var numViews = 0;
    var children = viewsNode.children;

    this.views = {};
    this.views.array = [];

    for (let i = 0; i < children.length; ++i) {
      var childNode = children[i];
      if (childNode.nodeName != 'ortho' &&
        childNode.nodeName != 'perspective') {
        this.onXMLMinorError('unknown tag <' + childNode.nodeName + '>');
        continue;
      }

      var id = this.reader.getString(childNode, 'id', true);

      if (id == '') return 'invalid view id';

      if (this.views[id] != null) {
        return 'duplicate view (id=' + id + ')';
      }

      var near = this.reader.getFloat(childNode, 'near', true);

      if ((error = this.checkNumber(childNode, near, 'near', false)) != null)
        return error;

      var far = this.reader.getFloat(childNode, 'far', true);

      if ((error = this.checkNumber(childNode, far, 'far', false)) != null)
        return error;

      // Reads the names of the nodes to an auxiliary buffer.
      var nodeNames = [];
      var grandChildren = childNode.children;

      for (var c = 0; c < grandChildren.length; c++) {
        nodeNames.push(grandChildren[c].nodeName);
      }

      var fromIndex = nodeNames.indexOf('from');
      var toIndex = nodeNames.indexOf('to');

      var from = grandChildren[fromIndex];
      var to = grandChildren[toIndex]

      var fx = this.reader.getFloat(from, 'x', true);

      if ((error = this.checkNumber(from, fx, 'fx', false)) != null)
        return error;

      var fy = this.reader.getFloat(from, 'y', true);

      if ((error = this.checkNumber(from, fy, 'fy', false)) != null)
        return error;

      var fz = this.reader.getFloat(from, 'z', true);

      if ((error = this.checkNumber(from, fz, 'fz', false)) != null)
        return error;

      var tx = this.reader.getFloat(to, 'x', true);

      if ((error = this.checkNumber(to, tx, 'tx', false)) != null) return error;

      var ty = this.reader.getFloat(to, 'y', true);

      if ((error = this.checkNumber(to, ty, 'ty', false)) != null) return error;

      var tz = this.reader.getFloat(to, 'z', true);

      if ((error = this.checkNumber(to, tz, 'tz', false)) != null) return error;

      if (childNode.nodeName == 'ortho') {
        var left = this.reader.getFloat(childNode, 'left', true);

        if ((error = this.checkNumber(to, left, 'left', false)) != null)
          return error;

        var right = this.reader.getFloat(childNode, 'right', true);

        if ((error = this.checkNumber(to, right, 'right', false)) != null)
          return error;

        var top = this.reader.getFloat(childNode, 'top', true);

        if ((error = this.checkNumber(to, top, 'top', false)) != null)
          return error;

        var bottom = this.reader.getFloat(childNode, 'bottom', true);

        if ((error = this.checkNumber(to, bottom, 'bottom', false)) != null)
          return error;

        this.views.array[id] = {
          type: 'ortho',
          near: near,
          far: far,
          left: left,
          right: right,
          top: top,
          bottom: bottom,
          from: { x: fx, y: fy, z: fz },
          to: { x: tx, y: ty, z: tz }
        };
        numViews++;

      } else if (childNode.nodeName == 'perspective') {
        var angle = this.reader.getFloat(childNode, 'angle', false);

        if ((error = this.checkNumber(childNode, angle, 'angle', true)) != null)
          return error;

        this.views.array[id] = {
          type: 'perspective',
          near: near,
          far: far,
          angle: angle * DEGREE_TO_RAD,
          from: { x: fx, y: fy, z: fz },
          to: { x: tx, y: ty, z: tz }
        };
        numViews++;
      }
    }

    if (numViews == 0) return 'no valid view defined'

    if (this.views.array[def] == null) return 'no default view defined';

    this.views.default = def;

    this.log('Parsed views');

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
      if (children[i].nodeName == 'ambient' && this.ambient == null) {
        this.ambient = this.extractRGBA(children[i], error);
        if (error != null) return error;
      } else if (
        children[i].nodeName == 'background' && this.background == null) {
        this.background = this.extractRGBA(children[i], error);
        if (error != null) return error;
      } else {
        this.onXMLMinorError(
          'wrong or duplicate tag on node ' + ambientNode.nodeName);
        continue;
      }
    }

    this.log('Parsed ambient');

    return null;
  }

  /**
   * Extract RGBA illumination component
   * @param {Number} index
   * @param {*} component
   * @param {*} type
   * @param {*} rgba
   * @param {*} lightId
   */
  extractIllumination(index, component, type, error, lightId) {
    if (index != -1)
      return this.extractRGBA(component[index], error);
    else
      error = type + ' component undefined for ID = ' + lightId;
  }

  /**
   * Extracts RGBA values from XML into an object
   * @param {block element} node node containg the RBGA values
   * @param {String} error to be altered in case of an error
   */
  extractRGBA(node, error) {
    var rgba = {};

    // R
    var r = this.reader.getFloat(node, 'r', true);
    if (!(r != null && !isNaN(r) && r >= 0 && r <= 1)) {
      error = 'unable to parse R component of the ' + node.nodeName + ' block';
      return;
    }

    // G
    var g = this.reader.getFloat(node, 'g', true);
    if (!(g != null && !isNaN(g) && g >= 0 && g <= 1)) {
      error = 'unable to parse G component of the ' + node.nodeName + ' block';
      return;
    }

    // B
    var b = this.reader.getFloat(node, 'b', true);
    if (!(b != null && !isNaN(b) && b >= 0 && b <= 1)) {
      error = 'unable to parse B component of the ' + node.nodeName + ' block';
      return;
    }

    // A
    var a = this.reader.getFloat(node, 'a', true);
    if (!(a != null && !isNaN(a) && a >= 0 && a <= 1)) {
      error = 'unable to parse A component of the ' + node.nodeName + ' block';
      return;
    }

    rgba = { r: r, g: g, b: b, a: a };

    return rgba;
  }

  /**
   * Extract light position values
   * @param {Number} index
   * @param {*} component
   * @param {*} positionLight
   * @param {*} lightId
   * @param {Boolean} all indicates whether w component should be extracted or not
   */
  extractPosition(index, component, positionLight, lightId, all) {
    if (index != -1) {
      // x
      var x = this.reader.getFloat(component[index], 'x', true);
      if (!(x != null && !isNaN(x)))
        return 'unable to parse x-coordinate of the light location for ID = ' +
          lightId;
      else
        positionLight.x = x;

      // y
      var y = this.reader.getFloat(component[index], 'y', true);
      if (!(y != null && !isNaN(y)))
        return 'unable to parse y-coordinate of the light location for ID = ' +
          lightId;
      else
        positionLight.y = y;

      // z
      var z = this.reader.getFloat(component[index], 'z', true);
      if (!(z != null && !isNaN(z)))
        return 'unable to parse z-coordinate of the light location for ID = ' +
          lightId;
      else
        positionLight.z = z;

      if (all) {
        // w
        var w = this.reader.getFloat(component[index], 'w', true);
        if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
          return 'unable to parse x-coordinate of the light location for ID = ' +
            lightId;
        else
          positionLight.w = w;
      }
    } else
      return 'light location undefined for ID = ' + lightId;
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
      var childNode = children[i];

      if (childNode.nodeName != 'omni' && childNode.nodeName != 'spot') {
        this.onXMLMinorError('unknown tag <' + childNode.nodeName + '>');
        continue;
      }

      // Get id of the current light.
      var lightId = this.reader.getString(childNode, 'id', true);

      if (lightId == '') return 'invalid light id';

      // Checks for repeated IDs.
      if (this.lights[lightId] != null)
        return 'ID must be unique for each light (conflict: ID = ' + lightId +
          ')';

      var lightEnabled = this.reader.getBoolean(childNode, 'enabled', true);

      grandChildren = childNode.children;
      // Specifications for the current light.

      nodeNames = [];
      for (var j = 0; j < grandChildren.length; j++) {
        nodeNames.push(grandChildren[j].nodeName);
      }

      // Gets indices of each element.
      var locationIndex = nodeNames.indexOf('location');
      var ambientIndex = nodeNames.indexOf('ambient');
      var diffuseIndex = nodeNames.indexOf('diffuse');
      var specularIndex = nodeNames.indexOf('specular');

      // Retrieves the ambient component.
      var error;

      var ambientIllumination = this.extractIllumination(
        ambientIndex, grandChildren, 'ambient', error, lightId);

      if (error != null) return error;

      // Retrieves the diffuse component.
      var diffuseIllumination = this.extractIllumination(
        diffuseIndex, grandChildren, 'diffuse', error, lightId);

      if (error != null) return error;

      // Retrieves the specular component.
      var specularIllumination = this.extractIllumination(
        specularIndex, grandChildren, 'specular', error, lightId);

      if (error != null) return error;

      var locationLight = {};


      if (childNode.nodeName == 'omni') {
        // Retrieves the light location.
        this.extractPosition(
          locationIndex, grandChildren, locationLight, lightId, true);

        this.lights[lightId] = {
          type: 'omni',
          enabled: lightEnabled,
          ambientIllumination: ambientIllumination,
          diffuseIllumination: diffuseIllumination,
          specularIllumination: specularIllumination,
          locationLight: locationLight
        };
        numLights++;
      } else if (childNode.nodeName == 'spot') {
        var angle = this.reader.getFloat(childNode, 'angle', true);

        if ((error = this.checkNumber(childNode, angle, 'angle', false)) !=
          null)
          return error;

        var exponent = this.reader.getFloat(childNode, 'exponent', true);

        if ((error = this.checkNumber(
          childNode, exponent, 'exponent', false)) != null)
          return error;

        var targetIndex = nodeNames.indexOf('target');

        // Retrieves the light location.
        this.extractPosition(
          locationIndex, grandChildren, locationLight, lightId, true);

        // Retrieves the light location.
        var targetLight = {};
        this.extractPosition(
          targetIndex, grandChildren, targetLight, lightId, false);

        this.lights[lightId] = {
          type: 'spot',
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
      return 'at least one light must be defined';
    else if (numLights > 8)
      this.onXMLMinorError(
        'too many lights defined; WebGL imposes a limit of 8 lights');

    this.log('Parsed lights');

    return null;
  }

  /**
   * Parses the <textures> block.
   * @param {textures block element} texturesNode
   */
  parseTextures(texturesNode) {
    var textures = texturesNode.children;
    this.textures = [];
    var numTextures = 0;

    for (let i = 0; i < textures.length; ++i) {
      if (textures[i].nodeName != 'texture') {
        this.onXMLMinorError('unknown tag <' + textures[i].nodeName + '>');
        continue;
      }

      var id = this.reader.getString(textures[i], 'id', true);

      if (id == '') return 'invalid texture id';

      if (this.textures[id] != null) return 'duplicate texture (id=' + id + ')';

      var file = this.reader.getString(textures[i], 'file', true);

      if (file == '') return 'invalid texture file path';

      this.textures[id] = new CGFtexture(this.scene, file);
      numTextures++;
    }

    if (numTextures == 0) return 'no texture defined!';

    this.log('Parsed textures');

    return null;
  }

  getDefaultMaterial() {
    var material = new CGFappearance(this.scene);
    material.setAmbient(0.2, 0.2, 0.2, 1.0);
    material.setDiffuse(0.5, 0.5, 0.5, 1.0);
    material.setSpecular(0.5, 0.5, 0.5, 1.0);
    material.setEmission(0.0, 0.0, 0.0, 1.0);
    material.setShininess(10.0);

    return material;
  }

  /**
   * Parses the <materials> node.
   * @param {materials block element} materialsNode
   */
  parseMaterials(materialsNode) {
    var materials = materialsNode.children;
    this.materials = {};
    var numMaterials = 0;

    this.materials[DEFAULT_MAT] = this.getDefaultMaterial();

    for (let i = 0; i < materials.length; ++i) {
      var childNode = materials[i];
      if (childNode.nodeName != 'material') {
        this.onXMLMinorError('unknown tag <' + childNode.nodeName + '>');
        continue;
      }

      var id = this.reader.getString(childNode, 'id', true);

      if (id == '') return 'invalid material id';

      if (this.materials[id] != null)
        return 'duplicate material (id=' + id + ')';

      var shininess = this.reader.getFloat(childNode, 'shininess', true);

      if ((error = this.checkNumber(
        childNode, shininess, 'shininess', false)) != null)
        return error;

      var properties = childNode.children;

      var material = new CGFappearance(this.scene);
      var ambient = {};
      var diffuse = {};
      var specular = {};
      var emission = {};
      var error;

      for (let j = 0; j < properties.length; ++j) {
        if (properties[j].nodeName === 'emission') {
          emission = this.extractRGBA(properties[j], error);

          if (error != null) return error;
        } else if (properties[j].nodeName === 'ambient') {
          ambient = this.extractRGBA(properties[j], error);

          if (error != null) return error;
        } else if (properties[j].nodeName === 'diffuse') {
          diffuse = this.extractRGBA(properties[j], error);

          if (error != null) return error;
        } else if (properties[j].nodeName === 'specular') {
          specular = this.extractRGBA(properties[j], error);

          if (error != null) return error;
        } else
          return 'invalid material property';
      }

      material.setAmbient(ambient.r, ambient.g, ambient.b, ambient.a);
      material.setDiffuse(diffuse.r, diffuse.g, diffuse.b, diffuse.a);
      material.setSpecular(specular.r, specular.g, specular.b, specular.a);
      material.setEmission(emission.r, emission.g, emission.b, emission.a);
      material.setShininess(shininess);

      this.materials[id] = material;
      numMaterials++;
    }

    if (numMaterials == 0) return 'no material defined';

    this.log('Parsed materials');
    return null;
  }

  /**
   * Parses the <transformations> block.
   * @param {transformations block element} transformationsNode
   */
  parseTransformations(transformationsNode) {
    var transformations = transformationsNode.children;
    this.transformations = [];
    var numTransformations = 0;


    for (let i = 0; i < transformations.length; ++i) {
      var childNode = transformations[i];
      if (childNode.nodeName != 'transformation') {
        this.onXMLMinorError('unknown tag <' + childNode.nodeName + '>');
        continue;
      }

      var id = this.reader.getString(childNode, 'id', true);

      if (id == '') return 'invalid transformation id';

      if (this.transformations[id] != null)
        return 'duplicate transformation (id=' + id + ')';

      var children = childNode.children;
      var error;
      this.scene.loadIdentity();

      if (children.length == 0) return 'no transformations defined!';

      for (let j = 0; j < children.length; ++j) {
        if ((error = this.parseExplicitTransformation(children[j])) != null)
          return error;
      }

      this.transformations[id] = this.scene.getMatrix();
      numTransformations++;
    }

    this.scene.loadIdentity();

    if (numTransformations == 0) return 'no transformation defined';

    this.log('Parsed transformations');
    return null;
  }

  /**
   * Parse explicit transformation on component transformations block
   * @param {*} node transformation block
   */
  parseExplicitTransformation(node) {
    var error;

    if (node.nodeName == 'translate') {
      var x = this.reader.getFloat(node, 'x', true);

      if ((error = this.checkNumber(node, x, 'x', false)) != null) return error;

      var y = this.reader.getFloat(node, 'y', true);

      if ((error = this.checkNumber(node, y, 'y', false)) != null) return error;

      var z = this.reader.getFloat(node, 'z', true);

      if ((error = this.checkNumber(node, z, 'z', false)) != null) return error;

      this.scene.translate(x, y, z);

    } else if (node.nodeName == 'rotate') {
      var axis = this.reader.getString(node, 'axis', true);
      var angle = this.reader.getFloat(node, 'angle', true);

      if ((error = this.checkNumber(node, angle, 'angle', false)) != null)
        return error;

      if (!(axis == 'x' || axis == 'y' || axis == 'z'))
        return 'invalid rotate axis';

      var x = axis == 'x' ? 1 : 0;
      var y = axis == 'y' ? 1 : 0;
      var z = axis == 'z' ? 1 : 0;

      this.scene.rotate(angle * DEGREE_TO_RAD, x, y, z);

    } else if (node.nodeName == 'scale') {
      var x = this.reader.getFloat(node, 'x', true);

      if ((error = this.checkNumber(node, x, 'x', false)) != null) return error;

      var y = this.reader.getFloat(node, 'y', true);

      if ((error = this.checkNumber(node, y, 'y', false)) != null) return error;

      var z = this.reader.getFloat(node, 'z', true);

      if ((error = this.checkNumber(node, z, 'z', false)) != null) return error;

      this.scene.scale(x, y, z);
    } else
      return 'invalid transformation';
  }

  parseControlPoint(controlPoint, controlPointsParsed, isAnim = false) {
    var error;

    var x = this.reader.getFloat(controlPoint, 'xx', true);

    if ((error = this.checkNumber(controlPoint, x, 'xx', false)) != null)
      return error;

    var y = this.reader.getFloat(controlPoint, 'yy', true);

    if ((error = this.checkNumber(controlPoint, y, 'yy', false)) != null)
      return error;

    var z = this.reader.getFloat(controlPoint, 'zz', true);

    if ((error = this.checkNumber(controlPoint, z, 'zz', false)) != null)
      return error;

    var point = isAnim ? [x, y, z] : [x, y, z, 1];

    controlPointsParsed.push(point);
  }

  /**
   * Parses the <animations> block
   * @param {animations block element} animationsNode
   */
  parseAnimations(animationsNode) {
    this.animations = [];
    var animations = animationsNode.children;
    var error;

    for (let i = 0; i < animations.length; ++i) {
      var animation = animations[i];
      if (animation.nodeName != 'linear' && animation.nodeName != 'circular') {
        this.onXMLMinorError('unknown tag <' + animation.nodeName + '>');
        continue;
      }

      var id = this.reader.getString(animation, 'id', true);

      if (id == '') return 'invalid animation id';

      if (this.animations[id] != null)
        return 'duplicate animation (id=' + id + ')';

      var span = this.reader.getFloat(animation, 'span', true);

      if ((error = this.checkNumber(animation, span, 'span')) != null)
        return error;

      if (animation.nodeName == 'linear') {
        var controlPoints = animation.children;
        var controlPointsParsed = [];
        var numControlPoints = 0;
        for (let j = 0; j < controlPoints.length; j++) {
          if ((error = this.parseControlPoint(
            controlPoints[j], controlPointsParsed, true)) != null)
            return error;

          numControlPoints++;
        }

        if (numControlPoints < 2)
          return 'animation (id=' + id + ') has less than two control points!';

        this.animations[id] = {
          type: 'linear',
          span: span,
          controlPoints: controlPointsParsed
        };
      } else {
        var center = this.reader.getVector3(animation, 'center', true);

        var radius = this.reader.getFloat(animation, 'radius', true);

        if ((error = this.checkNumber(animation, radius, 'radius')) != null)
          return error;

        var startang = this.reader.getFloat(animation, 'startang', true);

        if ((error = this.checkNumber(
          animation, startang, 'startang', false)) != null)
          return error;

        var rotang = this.reader.getFloat(animation, 'rotang', true);

        if ((error = this.checkNumber(animation, rotang, 'rotang', false)) !=
          null)
          return error;

        this.animations[id] = {
          type: 'circular',
          span: span,
          center: center,
          radius: radius,
          startang: startang * DEGREE_TO_RAD,
          rotang: rotang * DEGREE_TO_RAD
        };
      }
    }
  }

  parseCylinder(primitive, cylinderInf) {
    var error;

    var base = this.reader.getFloat(primitive, 'base', true);

    if ((error = this.checkNumber(primitive, base, 'base')) != null)
      return error;

    var top = this.reader.getFloat(primitive, 'top', true);

    if ((error = this.checkNumber(primitive, top, 'top')) != null) return error;

    var height = this.reader.getFloat(primitive, 'height', true);

    if ((error = this.checkNumber(primitive, height, 'height')) != null)
      return error;

    var slices = this.reader.getInteger(primitive, 'slices', true);

    if ((error = this.checkNumber(primitive, slices, 'slices')) != null)
      return error;

    var stacks = this.reader.getInteger(primitive, 'stacks', true);

    if ((error = this.checkNumber(primitive, stacks, 'stacks')) != null)
      return error;

    cylinderInf.base = base;
    cylinderInf.top = top;
    cylinderInf.height = height;
    cylinderInf.slices = slices;
    cylinderInf.stacks = stacks;
  }

  /**
   * Parses the <primitives> block.
   * @param {primitives block element} primitivesNode
   */
  parsePrimitives(primitivesNode) {
    this.primitives = [];
    var primitives = primitivesNode.children;
    var numPrimitives = 0;
    var error;

    for (let i = 0; i < primitives.length; ++i) {
      if (primitives[i].nodeName != 'primitive') {
        this.onXMLMinorError('unknown tag <' + primitives[i].nodeName + '>');
        continue;
      }

      var id = this.reader.getString(primitives[i], 'id', true);

      if (id == '') return 'invalid primitive id';

      if (this.primitives[id] != null)
        return 'duplicate primitive (id=' + id + ')';

      if (primitives[i].children.length != 1)
        return 'there should be only one primitive associated (id=' + id + ')';

      var primitive = primitives[i].children[0];

      if (primitive.nodeName == 'rectangle') {
        var x1 = this.reader.getFloat(primitive, 'x1', true);

        if ((error = this.checkNumber(primitive, x1, 'x1', false)) != null)
          return error;

        var y1 = this.reader.getFloat(primitive, 'y1', true);

        if ((error = this.checkNumber(primitive, y1, 'y1', false)) != null)
          return error;

        var x2 = this.reader.getFloat(primitive, 'x2', true);

        if ((error = this.checkNumber(primitive, x2, 'x2', false)) != null)
          return error;

        var y2 = this.reader.getFloat(primitive, 'y2', true);

        if ((error = this.checkNumber(primitive, y2, 'y2', false)) != null)
          return error;

        this.primitives[id] = new MyQuad(this.scene, x1, y1, x2, y2);
        numPrimitives++;

      } else if (primitive.nodeName == 'triangle') {
        var x1 = this.reader.getFloat(primitive, 'x1', true);

        if ((error = this.checkNumber(primitive, x1, 'x1', false)) != null)
          return error;

        var y1 = this.reader.getFloat(primitive, 'y1', true);

        if ((error = this.checkNumber(primitive, y1, 'y1', false)) != null)
          return error;

        var z1 = this.reader.getFloat(primitive, 'z1', true);

        if ((error = this.checkNumber(primitive, z1, 'z1', false)) != null)
          return error;

        var x2 = this.reader.getFloat(primitive, 'x2', true);

        if ((error = this.checkNumber(primitive, x2, 'x2', false)) != null)
          return error;

        var y2 = this.reader.getFloat(primitive, 'y2', true);

        if ((error = this.checkNumber(primitive, y2, 'y2', false)) != null)
          return error;

        var z2 = this.reader.getFloat(primitive, 'z2', true);

        if ((error = this.checkNumber(primitive, z2, 'z2', false)) != null)
          return error;

        var x3 = this.reader.getFloat(primitive, 'x3', true);

        if ((error = this.checkNumber(primitive, x3, 'x3', false)) != null)
          return error;

        var y3 = this.reader.getFloat(primitive, 'y3', true);

        if ((error = this.checkNumber(primitive, y3, 'y3', false)) != null)
          return error;

        var z3 = this.reader.getFloat(primitive, 'z3', true);

        if ((error = this.checkNumber(primitive, z3, 'z3', false)) != null)
          return error;

        this.primitives[id] =
          new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);
        numPrimitives++;

      } else if (primitive.nodeName == 'cylinder') {
        var inf = {};

        if ((error = this.parseCylinder(primitive, inf)) != null) return error;

        this.primitives[id] = new MyCylinder(
          this.scene, inf.base, inf.top, inf.height, inf.slices, inf.stacks);
        numPrimitives++;

      } else if (primitive.nodeName == 'sphere') {
        var radius = this.reader.getFloat(primitive, 'radius', true);

        if ((error = this.checkNumber(primitive, radius, 'radius')) != null)
          return error;

        var slices = this.reader.getInteger(primitive, 'slices', true);

        if ((error = this.checkNumber(primitive, slices, 'slices')) != null)
          return error;

        var stacks = this.reader.getInteger(primitive, 'stacks', true);

        if ((error = this.checkNumber(primitive, stacks, 'stacks')) != null)
          return error;


        this.primitives[id] = new MySphere(this.scene, radius, slices, stacks);
        numPrimitives++;
      } else if (primitive.nodeName == 'torus') {
        var inner = this.reader.getFloat(primitive, 'inner', true);

        if ((error = this.checkNumber(primitive, inner, 'inner')) != null)
          return error;

        var outer = this.reader.getFloat(primitive, 'outer', true);

        if ((error = this.checkNumber(primitive, outer, 'outer')) != null)
          return error;

        var slices = this.reader.getInteger(primitive, 'slices', true);

        if ((error = this.checkNumber(primitive, slices, 'slices')) != null)
          return error;

        var loops = this.reader.getInteger(primitive, 'loops', true);

        if ((error = this.checkNumber(primitive, loops, 'loops')) != null)
          return error;

        this.primitives[id] =
          new MyTorus(this.scene, inner, outer, slices, loops);
        numPrimitives++;
      } else if (primitive.nodeName == 'plane') {

        var npartsU = this.reader.getInteger(primitive, 'npartsU', true);

        if ((error = this.checkNumber(primitive, npartsU, 'npartsU')) != null)
          return error;

        var npartsV = this.reader.getInteger(primitive, 'npartsV', true);

        if ((error = this.checkNumber(primitive, npartsV, 'npartsV')) != null)
          return error;

        this.primitives[id] = new Plane(this.scene, npartsU, npartsV);
        numPrimitives++;

      } else if (primitive.nodeName == 'patch') {
        var npointsU = this.reader.getInteger(primitive, 'npointsU', true);

        if ((error = this.checkNumber(primitive, npointsU, 'npointsU')) !=
          null) return error;

        var npointsV = this.reader.getInteger(primitive, 'npointsV', true);

        if ((error = this.checkNumber(primitive, npointsV, 'npointsV')) !=
          null) return error;

        var npartsU = this.reader.getInteger(primitive, 'npartsU', true);

        if ((error = this.checkNumber(primitive, npartsU, 'npartsU')) != null)
          return error;

        var npartsV = this.reader.getInteger(primitive, 'npartsV', true);

        if ((error = this.checkNumber(primitive, npartsV, 'npartsV')) != null)
          return error;


        var controlPoints = primitive.children;

        var controlPointsParsed = [];
        var numControlPoints = 0;
        for (let j = 0; j < controlPoints.length; ++j) {
          if ((error = this.parseControlPoint(
            controlPoints[j], controlPointsParsed)) !=
            null)
            return error;

          numControlPoints++;
        }

        var allControlPoints = [];
        var counter = 0;
        for (let u = 0; u < npointsU; u++) {
          var controlPointsU = [];
          for (let v = 0; v < npointsV; v++)
            controlPointsU.push(controlPointsParsed[counter++]);

          allControlPoints.push(controlPointsU);
        }

        if (numControlPoints != npointsU * npointsV) {
          return 'invalid number of controlPoints on primitive ' + id;
        }

        this.primitives[id] = new Patch(
          this.scene, npointsU, npointsV, npartsU, npartsV,
          allControlPoints);
        numPrimitives++;

      } else if (primitive.nodeName == 'vehicle') {
        this.primitives[id] = new Vehicle(this.scene);
        numPrimitives++;

      } else if (primitive.nodeName == 'cylinder2') {
        var inf = {};

        if ((error = this.parseCylinder(primitive, inf)) != null) return
        error;

        this.primitives[id] = new Cylinder2(
          this.scene, inf.base, inf.top, inf.height, inf.slices,
          inf.stacks); numPrimitives++;
      }
      else if (primitive.nodeName == 'terrain') {
        var idTex = this.reader.getString(primitive, 'idtexture', true);

        if (idTex == '') {
          return 'invalid texture in on primitive' + id;
        } else if (this.textures[idTex] == null) {
          return 'nonexistent texture on primitive' + id;
        }

        var idheightmap = this.reader.getString(primitive, 'idheightmap',
          true);

        if (idheightmap == '') {
          return 'invalid heightmap in on primitive' + id;
        } else if (this.textures[idheightmap] == null) {
          return 'nonexistent heightmap on primitive' + id;
        }

        var parts = this.reader.getInteger(primitive, 'parts', true);
        if ((error = this.checkNumber(primitive, parts, 'parts')) != null)
          return error;

        var heightscale = this.reader.getFloat(primitive, 'heightscale',
          true);

        if ((error = this.checkNumber(primitive, heightscale, 'heightscale'))
          != null) return error;

        var tex = this.textures[idTex];
        var heightmap = this.textures[idheightmap];

        this.primitives[id] =
          new Terrain(this.scene, tex, heightmap, parts, heightscale);
        numPrimitives++;

      } else if (primitive.nodeName == 'water') {
        var idTex = this.reader.getString(primitive, 'idtexture', true);

        if (idTex == '') {
          return 'invalid texture in on primitive' + id;
        } else if (this.textures[idTex] == null) {
          return 'nonexistent texture on primitive' + id;
        }

        var idwavemap = this.reader.getString(primitive, 'idwavemap', true);

        if (idwavemap == '') {
          return 'invalid wavemap in on primitive' + id;
        } else if (this.textures[idwavemap] == null) {
          return 'nonexistent wavemap on primitive' + id;
        }

        var parts = this.reader.getInteger(primitive, 'parts', true);

        if ((error = this.checkNumber(primitive, parts, 'parts')) != null)
          return error;

        var heightscale = this.reader.getFloat(primitive, 'heightscale',
          true);

        if ((error = this.checkNumber(primitive, heightscale, 'heightscale'))
          != null) return error;

        var texscale = this.reader.getFloat(primitive, 'texscale', true);

        if ((error = this.checkNumber(primitive, texscale, 'texscale')) !=
          null) return error;

        var tex = this.textures[idTex];
        var wavemap = this.textures[idwavemap];

        this.primitives[id] =
          new Water(this.scene, tex, wavemap, parts, heightscale, texscale);
        numPrimitives++;

      }
      else {
        this.onXMLMinorError('unknown tag <' + primitive.nodeName + '>');
      }
    }

    if (numPrimitives == 0) return 'no primitive defined!';

    this.log('Parsed primitives');
    return null;
  }

  /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   * TODO: animations depois de transformations
   */
  parseComponents(componentsNode) {
    this.components = [];
    var components = componentsNode.children;
    var numComponents = 0;
    var error;

    for (let i = 0; i < components.length; ++i) {
      var childNode = components[i];

      if (childNode.nodeName != 'component') {
        this.onXMLMinorError('unknown tag <' + childNode.nodeName + '>');
        continue;
      }

      var id = this.reader.getString(childNode, 'id', true);

      if (id == '') return 'invalid component id';

      if (this.components[id] != null)
        return 'duplicate component (id=' + id + ')';

      var children = childNode.children;
      var component = {};

      for (let j = 0; j < children.length; ++j) {
        var grandChildNode = children[j];
        if (grandChildNode.nodeName == 'transformation') {
          var transformations = grandChildNode.children;

          if (transformations.length == 1 &&
            transformations[0].nodeName == 'transformationref') {
            let transfId =
              this.reader.getString(transformations[0], 'id', true);

            if ((component.transformations = this.transformations[transfId]) ==
              null)
              return 'no transformation with id = ' + transfId;

            component.transformations = this.transformations[transfId];

          } else if (!this.findStringOnArray(
            'transformationref', transformations, 'nodeName')) {
            this.scene.loadIdentity();
            for (let c = 0; c < transformations.length; c++) {
              this.parseExplicitTransformation(transformations[c]);
            }

            component.transformations = this.scene.getMatrix();
            this.scene.loadIdentity();
          } else
            return 'invalid transformation block on component with id=' + id;
        } else if (grandChildNode.nodeName == 'materials') {
          var materials = grandChildNode.children;
          component.materials = [];
          for (let c = 0; c < materials.length; ++c) {
            let matId = this.reader.getString(materials[c], 'id', true);

            if (this.materials[matId] == null && matId != 'inherit')
              return 'invalid material id';
            else if (matId == 'inherit' && id == this.sceneInfo.rootId)
              this.onXMLMinorError(
                'Detected inherit material on root node. Default is going to be applied!');

            component.materials.push(matId);
          }

          if (component.materials.length == 0)
            return 'no materials defined for this component (id=' + id + ')';

        } else if (grandChildNode.nodeName == 'texture') {
          let textId = this.reader.getString(grandChildNode, 'id', true);

          if (this.textures[textId] == null && textId != 'inherit' &&
            textId != 'none')
            return 'invalid texture id on component ' + id;

          var length_s =
            this.reader.getFloat(grandChildNode, 'length_s', false);
          var length_t =
            this.reader.getFloat(grandChildNode, 'length_t', false);

          if (length_s == null || length_t == null)
            this.onXMLMinorError(
              'Unspecified scale factor for texture with id=' + textId +
              ' on component ' + id);

          component
            .texture = { id: textId, length_s: length_s, length_t: length_t };

        } else if (grandChildNode.nodeName === 'animations') {
          let refs = grandChildNode.children;
          component.animations = [];
          for (let j = 0; j < refs.length; j++) {
            let animId = this.reader.getString(refs[j], 'id', true);
            let animation = this.animations[animId];
            if (animation == null)
              return 'invalid animId on component with id=' + id;

            if (animation.type == 'linear') {
              component.animations.push(new LinearAnimation(this.scene, animation.span, animation.controlPoints));
            }
            else {
              component.animations.push(new CircularAnimation(this.scene, animation.span, animation.center, animation.radius, animation.startang, animation.rotang));
            }

            component.animationsIndex = 0;
          }
        } else if (grandChildNode.nodeName != 'children')
          return 'invalid component property name';
      }

      if (component.transformations == null || component.materials == null ||
        component.texture == null)
        return 'invalid component (id=' + id + ')';

      this.components[id] = component;
      numComponents++;
    }

    if (this.components[this.sceneInfo.rootId] == null)
      return 'missing root node, id = ' + this.sceneInfo.rootId;

    if (numComponents == 0) return 'no component defined';


    for (let i = 0; i < components.length; ++i) {
      var id = this.reader.getString(components[i], 'id', true);

      var children = components[i].children;

      for (let j = 0; j < children.length; ++j) {
        if (children[j].nodeName == 'children') {
          if ((error = this.parseChildren(id, children[j].children)) != null)
            return error;
          break;
        }
      }
      if (this.components[id].children == null) return 'no children defined';
    }

    this.log('Parsed components');
    return null;
  }

  /**
   * Parses the children block on <component>
   * @param {String} id
   * @param {Array} refs
   */
  parseChildren(id, refs) {
    this.components[id].children = {};
    for (let c = 0; c < refs.length; ++c) {
      let childId = this.reader.getString(refs[c], 'id', true);


      if (refs[c].nodeName == 'componentref') {
        if (this.components[childId] == null)
          return 'invalid childId on component with id=' + id;

        this.components[id].children[childId] = {
          data: this.components[childId],
          type: 'component'
        };

      } else {
        if (this.primitives[childId] == null)
          return 'invalid childId on component with id=' + id;

        this.components[id].children[childId] = {
          data: this.primitives[childId],
          type: 'primitive'
        };
      }
    }
  }

  /*
   * Callback to be executed on any read error, showing an error on the console.
   * @param {string} message
   */
  onXMLError(message) {
    console.error('XML Loading Error: ' + message);
    this.loadedOk = false;
  }

  /**
   * Callback to be executed on any minor error, showing a warning on the
   * console.
   * @param {string} message
   */
  onXMLMinorError(message) {
    console.warn('Warning: ' + message);
  }

  /**
   * Displays the scene, processing each node, starting in the root node.
   */
  displayScene() {
    // entry point for graph rendering
    this.displayComponent(this.components[this.sceneInfo.rootId], null);
  }

  /**
   * Displays a given component onto the scene
   * @param {*} component
   * @param {*} parent
   */
  displayComponent(component, parent) {
    this.scene.pushMatrix();

    this.scene.multMatrix(component.transformations);
    this.applyAnimation(component);

    var matId = this.applyMaterial(component, parent);

    var texInfo = this.applyTexture(component, parent);


    for (var key in component.children) {
      if (component.children[key].type == 'primitive')
        this.displayPrimitive(
          component.children[key].data, component.texture.length_s,
          component.texture.length_t);
      else if (component.children[key].type == 'component')
        this.displayComponent(component.children[key].data, component);
    }

    component.texture.id = texInfo.texId;
    component.texture.length_s = texInfo.texLengthS;
    component.texture.length_t = texInfo.texLengthT;
    component.materials[this.scene.materialNo % component.materials.length] =
      matId;
    this.scene.popMatrix();
  }

  /**
   * Applies a component's texture according to its specification
   *
   * @param {*} component
   * @param {*} parent
   */
  applyTexture(component, parent) {
    var texId = component.texture.id;
    var texLengthS = component.texture.length_s;
    var texLengthT = component.texture.length_t;
    var texParentId;

    if (parent != null) texParentId = parent.texture.id;

    if (texId == 'inherit') {
      if (texParentId != 'none') this.textures[texParentId].bind();
      component.texture.id = texParentId;

      if (component.texture.length_s == null) {
        component.texture.length_s = parent.texture.length_s;
      }

      if (component.texture.length_t == null) {
        component.texture.length_t = parent.texture.length_t;
      }
    } else if (texId == 'none') {
      if (texParentId != null && texParentId != 'none') {
        this.textures[texParentId].unbind();
      }
    } else {
      this.textures[texId].bind();
    }

    return { texId: texId, texLengthS: texLengthS, texLengthT: texLengthT };
  }

  /**
   * Applies a component's material according to its specification
   * @param {*} component
   * @param {*} parent
   */
  applyMaterial(component, parent) {
    var matId =
      component.materials[this.scene.materialNo % component.materials.length];

    if (matId != 'inherit')
      this.materials[matId].apply();
    else if (parent != null) {
      let parentMatId =
        parent.materials[this.scene.materialNo % parent.materials.length];
      this.materials[parentMatId].apply();
      component.materials[this.scene.materialNo % component.materials.length] =
        parentMatId;
    } else {
      this.materials[DEFAULT_MAT].apply();
      component.materials[this.scene.materialNo % component.materials.length] =
        DEFAULT_MAT;
    }

    return matId;
  }

  updateAnimations(deltaTime) {
    for (var key in this.components) {
      var component = this.components[key];
      if (component.animations != null && component.animationsIndex != component.animations.length)
        component.animations[component.animationsIndex].update(deltaTime);
    }
  }

  applyAnimation(component) {
    var animations = component.animations;
    var currAnim = component.animationsIndex;
    if (animations == null || currAnim == animations.length) return;

    if (animations[currAnim].over) {
      animations[component.animationsIndex].apply();
      animations[currAnim].over = false;
      component.animationsIndex++;

    } else
      animations[currAnim].apply();
  }
  /**
   * Diplays the given primitive onto the scene
   * @param {CGFobject} primitive primitive to be displayed
   * @param {Number} length_s scale factor (length)
   * @param {Number} length_t scale factor (width)
   */
  displayPrimitive(primitive, length_s, length_t) {
    if (primitive.updateTexCoords != null)
      primitive.updateTexCoords(length_s, length_t);
    primitive.display();
  }

  /**
   * Helper function that finds an object on an array with a given attribute
   *
   * @param {String} string
   * @param {Array} array
   * @param {String} attribute
   */
  findStringOnArray(string, array, attribute) {
    for (let i = 0; i < array.length; ++i) {
      if (array[i][attribute] == string) return true;
    }
    return false;
  }

  updateWater(currTime){
    for(let key in this.primitives){
      if(this.primitives[key] instanceof Water){
        this.primitives[key].update(currTime);
      }
    }
  }
}