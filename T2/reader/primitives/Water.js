class Water extends CGFobject {
    constructor(scene, texture, wavemap, parts, heightscale, texscale) {
        super(scene);

        this.texture = texture;
        this.wavemap = wavemap;
        this.parts = parts;
        this.heightscale = heightscale;
        this.texscale = texscale;
    }
}