import React, { useRef, useEffect } from 'react';
import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  Vector2,
  WebGLRenderTarget,
  LinearFilter,
  RGBAFormat,
  FloatType,
  NearestFilter
} from 'three';
import { useMouse } from '../hooks/useMouse';

const ShaderCanvas = () => {
  const canvasRef = useRef(null);
  const mouse = useMouse();

  useEffect(() => {
    // Initialize renderer with high precision
    const renderer = new WebGLRenderer({
      canvas: canvasRef.current,
      precision: 'highp',
      antialias: false,
      powerPreference: 'default',
    });
    const pixelRatio = Math.min(window.devicePixelRatio, 1);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Use linear output encoding for smooth transitions
    

    // Camera and quad setup
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new PlaneGeometry(2, 2);

    // Ping-pong render targets with float textures and linear filtering

    const rtParams = {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: FloatType,
      depthBuffer: false,
      stencilBuffer: false,
    };
    const rt1 = new WebGLRenderTarget(window.innerWidth, window.innerHeight, rtParams);
    const rt2 = new WebGLRenderTarget(window.innerWidth, window.innerHeight, rtParams);
    let readRT = rt1;
    let writeRT = rt2;

    // Feedback shader
    const feedbackUniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
      iMouse: { value: new Vector2() },
      iChannel0: { value: null },
    };
    const feedbackMaterial = new ShaderMaterial({
      uniforms: feedbackUniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float iTime;
        uniform vec2 iResolution;
        uniform vec2 iMouse;
        uniform sampler2D iChannel0;
        varying vec2 vUv;
        void main() {
          vec2 fragCoord = vUv * iResolution;
          vec2 dvec = (iMouse.x < 20.0)
              ? vec2(
                  iResolution.x * 0.5 + (0.2 + 0.6 * sin(iTime * 0.62)) * iResolution.y * 0.5 * sin(iTime * 0.2),
                  iResolution.y * 0.5 + (0.2 + 0.6 * sin(iTime * 0.62)) * iResolution.y * 0.5 * cos(iTime * 0.2)
                )
              : iMouse;
          vec2 tc = (fragCoord - dvec) / iResolution.x;
          float o = length(tc);
          float b = pow(max(1.0 - o * 5.0, 0.0), 16.0);
          vec3 nv = vec3(tc.x * b * 6.0, tc.y * b * 6.0, b);
          vec3 oldvec = texture2D(iChannel0, vUv).xyz;
          vec2 old2d = oldvec.xy;
          if (length(old2d) > 1.0) {
            old2d = normalize(old2d);
            oldvec = vec3(old2d, oldvec.z);
          }
          vec3 older = texture2D(iChannel0, vUv - oldvec.xy * 0.5).xyz;
          gl_FragColor = vec4(nv + vec3(oldvec.xy * 0.999, older.z * 0.9), 1.0);
        }
      `,
    });
    const feedbackScene = new Scene();
    feedbackScene.add(new Mesh(geometry, feedbackMaterial));

    // Display shader
    const displayUniforms = { tDiffuse: { value: null } };
    const displayMaterial = new ShaderMaterial({
      uniforms: displayUniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        void main() {
          vec4 ok = texture2D(tDiffuse, vUv);
          vec3 col = vec3(0.02, 0.1, 0.4) * (ok.b * 5.0) + vec3(ok.b);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const displayScene = new Scene();
    displayScene.add(new Mesh(geometry, displayMaterial));

    // Animation loop
    const startTime = performance.now();
    const animate = () => {
      const t = (performance.now() - startTime) * 0.001;
      feedbackUniforms.iTime.value = t;
      feedbackUniforms.iMouse.value.set(
        mouse.x * window.innerWidth,
        mouse.y * window.innerHeight
      );
      feedbackUniforms.iChannel0.value = readRT.texture;

      // Render feedback
      renderer.setRenderTarget(writeRT);
      renderer.render(feedbackScene, camera);

      // Render final
      displayUniforms.tDiffuse.value = writeRT.texture;
      renderer.setRenderTarget(null);
      renderer.render(displayScene, camera);

      // Swap
      [readRT, writeRT] = [writeRT, readRT];
      requestAnimationFrame(animate);
    };
    animate();

    // Resize
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      feedbackUniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
      rt1.setSize(window.innerWidth, window.innerHeight);
      rt2.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      feedbackMaterial.dispose();
      displayMaterial.dispose();
      geometry.dispose();
      rt1.dispose();
      rt2.dispose();
    };
  }, [mouse]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default ShaderCanvas;
