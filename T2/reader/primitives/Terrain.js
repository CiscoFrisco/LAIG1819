class Terrain extends CGFobject {
    constructor(scene, texture, heightmap, parts, heightscale){
        super(scene);
        
        this.texture = texture;
        this.heightmap = heightmap;
        this.parts = parts;
        this.heightscale = heightscale;

        this.plane = new Plane(this.scene, this.parts, this.parts);
        this.shader = new CGFshader(this.scene.gl, "../shaders/terrain.vert", "../shaders/terrain.frag");
    }
}