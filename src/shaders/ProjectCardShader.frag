// ProjectCardShader.frag
uniform sampler2D uVideo;
varying vec2 vUv;
void main() {
  gl_FragColor = texture2D(uVideo, vUv);
}
