/**
 * Terrain
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
class Terrain extends CGFobject {
    /**
     * Build a Terrain object using shaders.
     * 
     * @param {CGFscene} scene main scene
     * @param {CGFtexture} texture color texture
     * @param {CGFtexture} heightmap heightmap texture
     * @param {Number} parts number of s and t divisions
     * @param {Number} heightscale height scale factor
     */
    constructor(scene, texture, heightmap, parts, heightscale) {
        super(scene);

        this.texture = texture;
        this.heightmap = heightmap;
        this.parts = parts;
        this.heightscale = heightscale;

        this.plane = new Plane(this.scene, this.parts, this.parts);
        this.shader = new CGFshader(this.scene.gl, "shaders/terrain.vert", "shaders/terrain.frag");
        this.shader.setUniformsValues({
            heightscale: this.heightscale
        });
        this.shader.setUniformsValues({
            uSampler2: 1
        });
    }

    /**
     * Display this object, setting the respective shader and binding color texture
     * and heightmap.
     */
    display() {
        this.scene.setActiveShader(this.shader);
        this.texture.bind(0);
        this.heightmap.bind(1);
        this.plane.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}