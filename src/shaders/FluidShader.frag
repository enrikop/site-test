precision mediump float;

uniform float uTime;
uniform vec2 uMouse;
uniform sampler2D uTexture;
uniform vec2 uMouseTrail;
uniform float uAspect; // <-- nuovo
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
    // "Aspect-correct" UV
    vec2 uv = vUv;
    uv.x = (uv.x - 0.5) * uAspect + 0.5;

    // Correggi anche il mouse trail
    vec2 center = uMouseTrail;
    center.x = (center.x - 0.5) * uAspect + 0.5;

    vec2 delta = uv - center;
    float dist = length(delta);
    float proximity = smoothstep(0.2, 0.0, dist);

    // Lieve movimento globale (wobble)
    uv.x += sin(uv.y * 5.0 + uTime * 0.3) * 0.005;
    uv.y += cos(uv.x * 5.0 + uTime * 0.3) * 0.005;

    // Effetto spirale "glitch" localizzato
    float angle = atan(delta.y, delta.x);
    float spiralFactor = proximity * 10.0;
    float radiusInfluence = proximity * 0.1;

    vec2 spiralOffset = vec2(
        cos(angle + dist * spiralFactor) * radiusInfluence,
        sin(angle + dist * spiralFactor) * radiusInfluence
    );

    uv += spiralOffset;

    // RGB split solo se vicino al mouse
    vec4 texR = texture2D(uTexture, uv + proximity * vec2(0.002 * uAspect, 0.0)); // correggi qui!
    vec4 texG = texture2D(uTexture, uv);
    vec4 texB = texture2D(uTexture, uv - proximity * vec2(0.002 * uAspect, 0.0)); // correggi qui!

    gl_FragColor = vec4(texR.r, texG.g, texB.b, 1.0);
}