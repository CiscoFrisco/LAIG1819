#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;
uniform float texscale;

void main(){
	// Apply texture according to texscale and timeFactor
	gl_FragColor = texture2D(uSampler, vTextureCoord*texscale + timeFactor);
}