class Terrain extends CGFobject {
    constructor(scene, texture, heightmap, parts, heightscale){
        super(scene);
        
        this.texture = texture;
        this.heightmap = heightmap;
        this.parts = parts;
        this.heightscale = heightscale;
    }
}