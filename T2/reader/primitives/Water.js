/**
 * Water
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
class Water extends CGFobject {
    /**
     * Build a Water object.
     * 
     * @param {CGFscene} scene main scene
     * @param {CGFtexture} texture color texture
     * @param {CGFtexture} wavemap wavemap texture
     * @param {Number} parts number of s and t divisions
     * @param {Number} heightscale height scale factor
     * @param {Number} texscale texture coordinates scale factor
     */
    constructor(scene, texture, wavemap, parts, heightscale, texscale) {
        super(scene);

        this.texture = texture;
        this.wavemap = wavemap;
        this.parts = parts;
        this.heightscale = heightscale;
        this.texscale = texscale;
        this.factor = 0;
        this.time = 0;

        this.plane = new Plane(this.scene, this.parts, this.parts);
        this.shader = new CGFshader(this.scene.gl, "shaders/water.vert", "shaders/water.frag");

        this.shader.setUniformsValues({ heightscale: this.heightscale });
        this.shader.setUniformsValues({ texscale: this.texscale });
        this.shader.setUniformsValues({ timeFactor: this.factor });
        this.shader.setUniformsValues({ uSampler2: 1 });

    }

    /**
     * Display this object, setting the respective shader and binding color texture
     * and wavemap.
     */
    display() {
        this.scene.setActiveShader(this.shader);
        this.texture.bind(0);
        this.wavemap.bind(1);
        this.plane.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }

    /**
     * Update time factor.
     * 
     * @param {Number} time milliseconds since last update
     */
    update(time) {
        this.time += time;

        if(this.time > 20){
            this.time = 0;
            this.factor += (1/this.parts)*0.02;
            this.shader.setUniformsValues({ timeFactor: this.factor });
        }   
    }
}