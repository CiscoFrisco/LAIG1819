#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;
uniform float texscale;

void main(){
	gl_FragColor = texture2D(uSampler, vTextureCoord*texscale + timeFactor);
}