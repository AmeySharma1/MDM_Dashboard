import React, { useEffect, useRef } from 'react';
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  PlaneGeometry,
  Mesh,
  ShaderMaterial,
  Vector3,
  Vector2
} from 'three';

import './FloatingLines.css';

const vertexShader = `
precision highp float;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);

  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;

  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) {
    return baseColor;
  }

  vec3 gradientColor;
  
  if (lineGradientCount == 1) {
    gradientColor = lineGradient[0];
  } else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(lineGradientCount - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, lineGradientCount - 1);

    vec3 c1 = lineGradient[idx];
    vec3 c2 = lineGradient[idx2];
    
    gradientColor = mix(c1, c2, f);
  }
  
  return gradientColor * 0.5;
}

  float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;

  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius); // radial falloff around cursor
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }

  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  
  if (parallax) {
    baseUv += parallaxOffset;
  }

  vec3 col = vec3(0.0);

  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }
  
  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.2;
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi,
        baseUv,
        mouseUv,
        interactive
      );
    }
  }

  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      col += lineCol * wave(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.1;
    }
  }

  fragColor = vec4(col, 1.0);
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

const MAX_GRADIENT_STOPS = 8;

function hexToVec3(hex) {
  let value = hex.trim();

  if (value.startsWith('#')) {
    value = value.slice(1);
  }

  let r = 255;
  let g = 255;
  let b = 255;

  if (value.length === 3) {
    r = parseInt(value[0] + value[0], 16);
    g = parseInt(value[1] + value[1], 16);
    b = parseInt(value[2] + value[2], 16);
  } else if (value.length === 6) {
    r = parseInt(value.slice(0, 2), 16);
    g = parseInt(value.slice(2, 4), 16);
    b = parseInt(value.slice(4, 6), 16);
  }

  return new Vector3(r / 255, g / 255, b / 255);
}

export default function FloatingLines({
  linesGradient,
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = [6],
  lineDistance = [5],
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },
  animationSpeed = 1,
  interactive = true,
  bendRadius = 5.0,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  mixBlendMode = 'screen'
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);

  const targetMouseRef = useRef(new Vector2(-1000, -1000));
  const currentMouseRef = useRef(new Vector2(-1000, -1000));
  const targetInfluenceRef = useRef(0);
  const currentInfluenceRef = useRef(0);
  const targetParallaxRef = useRef(new Vector2(0, 0));
  const currentParallaxRef = useRef(new Vector2(0, 0));
  const requestRef = useRef();
  const startTimeRef = useRef(performance.now() * 0.001);

  // Memoize static counts and positions to prevent re-calc
  const counts = React.useMemo(() => {
    const getCount = wt => {
      if (typeof lineCount === 'number') return lineCount;
      const idx = enabledWaves.indexOf(wt);
      return idx !== -1 ? (lineCount[idx] ?? 6) : 0;
    };
    return {
      top: enabledWaves.includes('top') ? getCount('top') : 0,
      middle: enabledWaves.includes('middle') ? getCount('middle') : 0,
      bottom: enabledWaves.includes('bottom') ? getCount('bottom') : 0
    };
  }, [lineCount, enabledWaves]);

  const distances = React.useMemo(() => {
    const getDist = wt => {
      if (typeof lineDistance === 'number') return lineDistance * 0.01;
      const idx = enabledWaves.indexOf(wt);
      return idx !== -1 ? (lineDistance[idx] ?? 0.1) * 0.01 : 0.01;
    };
    return {
      top: getDist('top'),
      middle: getDist('middle'),
      bottom: getDist('bottom')
    };
  }, [lineDistance, enabledWaves]);

  // Handle Updates to Uniforms when props change
  useEffect(() => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;

    u.animationSpeed.value = animationSpeed;
    u.enableTop.value = enabledWaves.includes('top');
    u.enableMiddle.value = enabledWaves.includes('middle');
    u.enableBottom.value = enabledWaves.includes('bottom');
    u.topLineCount.value = counts.top;
    u.middleLineCount.value = counts.middle;
    u.bottomLineCount.value = counts.bottom;
    u.topLineDistance.value = distances.top;
    u.middleLineDistance.value = distances.middle;
    u.bottomLineDistance.value = distances.bottom;

    u.topWavePosition.value.set(topWavePosition?.x ?? 10.0, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4);
    u.middleWavePosition.value.set(middleWavePosition?.x ?? 5.0, middleWavePosition?.y ?? 0.0, middleWavePosition?.rotate ?? 0.2);
    u.bottomWavePosition.value.set(bottomWavePosition?.x ?? 2.0, bottomWavePosition?.y ?? -0.7, bottomWavePosition?.rotate ?? 0.4);

    u.interactive.value = interactive;
    u.bendRadius.value = bendRadius;
    u.bendStrength.value = bendStrength;
    u.parallax.value = parallax;
    u.parallaxStrength.value = parallaxStrength;

    if (linesGradient?.length > 0) {
      const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS);
      u.lineGradientCount.value = stops.length;
      stops.forEach((hex, i) => {
        const color = hexToVec3(hex);
        u.lineGradient.value[i].set(color.x, color.y, color.z);
      });
    }
  }, [
    animationSpeed, enabledWaves, counts, distances, topWavePosition,
    middleWavePosition, bottomWavePosition, interactive, bendRadius,
    bendStrength, parallax, parallaxStrength, linesGradient
  ]);

  // Initialization & Component Lifecycle
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene Setup
    const scene = new Scene();
    sceneRef.current = scene;

    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;
    cameraRef.current = camera;

    const renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(1);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Material & Mesh
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector3(1, 1, 1) },
      animationSpeed: { value: animationSpeed },
      enableTop: { value: enabledWaves.includes('top') },
      enableMiddle: { value: enabledWaves.includes('middle') },
      enableBottom: { value: enabledWaves.includes('bottom') },
      topLineCount: { value: counts.top },
      middleLineCount: { value: counts.middle },
      bottomLineCount: { value: counts.bottom },
      topLineDistance: { value: distances.top },
      middleLineDistance: { value: distances.middle },
      bottomLineDistance: { value: distances.bottom },
      topWavePosition: { value: new Vector3(topWavePosition?.x ?? 10.0, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4) },
      middleWavePosition: { value: new Vector3(middleWavePosition?.x ?? 5.0, middleWavePosition?.y ?? 0.0, middleWavePosition?.rotate ?? 0.2) },
      bottomWavePosition: { value: new Vector3(bottomWavePosition?.x ?? 2.0, bottomWavePosition?.y ?? -0.7, bottomWavePosition?.rotate ?? 0.4) },
      iMouse: { value: new Vector2(-1000, -1000) },
      interactive: { value: interactive },
      bendRadius: { value: bendRadius },
      bendStrength: { value: bendStrength },
      bendInfluence: { value: 0 },
      parallax: { value: parallax },
      parallaxStrength: { value: parallaxStrength },
      parallaxOffset: { value: new Vector2(0, 0) },
      lineGradient: { value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1)) },
      lineGradientCount: { value: 0 }
    };

    if (linesGradient?.length > 0) {
      const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS);
      uniforms.lineGradientCount.value = stops.length;
      stops.forEach((hex, i) => {
        const color = hexToVec3(hex);
        uniforms.lineGradient.value[i].set(color.x, color.y, color.z);
      });
    }

    const material = new ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    materialRef.current = material;

    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    // 3. Resize Handling (Throttled)
    let resizeTimer;
    const setSize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const width = containerRef.current.clientWidth || 2;
      const height = containerRef.current.clientHeight || 2;
      rendererRef.current.setSize(width, height, false);
      materialRef.current.uniforms.iResolution.value.set(width, height, 1);
    };

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setSize, 100);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(containerRef.current);
    setSize();

    // 4. Interaction Events
    const handlePointerMove = event => {
      if (!rendererRef.current) return;
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      targetMouseRef.current.set(x, (rect.height - y));
      targetInfluenceRef.current = 1.0;

      if (parallax) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const offsetX = (x - centerX) / rect.width;
        const offsetY = -(y - centerY) / rect.height;
        targetParallaxRef.current.set(offsetX * parallaxStrength, offsetY * parallaxStrength);
      }
    };

    const handlePointerLeave = () => {
      targetInfluenceRef.current = 0.0;
    };

    if (interactive) {
      renderer.domElement.addEventListener('pointermove', handlePointerMove, { passive: true });
      renderer.domElement.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    }

    // 5. Render Loop
    const render = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

      const time = (performance.now() * 0.001) - startTimeRef.current;
      materialRef.current.uniforms.iTime.value = time;

      if (interactive) {
        currentMouseRef.current.lerp(targetMouseRef.current, mouseDamping);
        materialRef.current.uniforms.iMouse.value.copy(currentMouseRef.current);
        currentInfluenceRef.current += (targetInfluenceRef.current - currentInfluenceRef.current) * mouseDamping;
        materialRef.current.uniforms.bendInfluence.value = currentInfluenceRef.current;
      }

      if (parallax) {
        currentParallaxRef.current.lerp(targetParallaxRef.current, mouseDamping);
        materialRef.current.uniforms.parallaxOffset.value.copy(currentParallaxRef.current);
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    // 6. Cleanup
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      ro.disconnect();
      clearTimeout(resizeTimer);

      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.removeEventListener('pointermove', handlePointerMove);
        renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      materialRef.current = null;
      rendererRef.current = null;
      sceneRef.current = null;
    };
  }, []); // Only run once

  return (
    <div
      ref={containerRef}
      className="floating-lines-container"
      style={{
        mixBlendMode: mixBlendMode
      }}
    />
  );
}
