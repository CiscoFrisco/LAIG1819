attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform sampler2D uSampler2;
uniform float heightscale;
uniform float texscale;

uniform float timeFactor;
varying vec2 vTextureCoord;

void main(){
	vTextureCoord = aTextureCoord;

	// Get y offset according to texscale, timeFactor and heightscale
	float offset = texture2D(uSampler2, vTextureCoord*texscale + timeFactor)[1]*heightscale;
	
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x, aVertexPosition.y + offset,aVertexPosition.z, 1.0);
}