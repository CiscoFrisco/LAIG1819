class Water extends CGFobject {
    constructor(scene, texture, wavemap, parts, heightscale, texscale) {
        super(scene);

        this.texture = texture;
        this.wavemap = wavemap;
        this.parts = parts;
        this.heightscale = heightscale;
        this.texscale = texscale;

        this.plane = new Plane(this.scene, this.parts, this.parts);
        this.shader = new CGFshader(this.scene.gl, "shaders/water.vert", "shaders/water.frag");

        this.shader.setUniformsValues({heightscale: this.heightscale});
        this.shader.setUniformsValues({normScale: this.texscale});
    }
    
    display() {
        this.scene.setActiveShader(this.shader);
        this.texture.bind(0);
        this.texture.bind(1);
        this.plane.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}