#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main(){
	// Apply color texture
	gl_FragColor = texture2D(uSampler, vTextureCoord);
}