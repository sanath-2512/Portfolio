/**
 * Calibration Field shaders.
 *
 * One instanced quad per board cell. Every per-frame change is a uniform;
 * the only per-instance data is the static `aCell` attribute:
 *   xy = grid position in -1..1, z = random (fiducial pick), w = random (depth jitter).
 *
 * uCal 0 → 1 takes the board from drifting and tilted to flat and orthogonal.
 * Section nudges (chunks / lanes / furrows / dim) reshape the calibrated layout.
 */

// Simplex noise, Ashima Arts / Stefan Gustavson (MIT).
const noise = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`

export const vertexShader = /* glsl */ `
precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute vec4 aCell;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 uPlane;       // local board space -> world (spread, yaw, tilt, recede)

uniform vec2 uGrid;        // cols, rows
uniform float uSpacing;    // world units between cell centres
uniform float uCellSize;   // quad side, world units
uniform float uTime;
uniform float uCal;        // 0 uncalibrated -> 1 calibrated
uniform float uBoost;      // scroll-velocity noise boost
uniform float uChunk;      // Fusion Cards: split into page-sized chunks
uniform float uLanes;      // WorthyApply: five provider lanes
uniform float uFurrow;     // AgriMind: rows into furrow stripes
uniform vec3 uLens;        // pointer on the board (xy, local units) + strength
uniform float uLensRadius;
uniform float uScan;       // NDC x of the scan beam
uniform float uScanOn;     // 1 while a scan is sweeping
uniform float uReveal;     // NDC x: cells right of this are not drawn yet

varying vec2 vUv;
varying float vAlpha;
varying float vLens;
varying float vScan;
varying float vFid;

${noise}

mat2 rot(float a) { float c = cos(a); float s = sin(a); return mat2(c, -s, s, c); }

void main() {
  vUv = uv;
  vec2 half_ = (uGrid - 1.0) * 0.5 * uSpacing;
  vec2 cell01 = aCell.xy * 0.5 + 0.5;
  vec2 base = aCell.xy * half_;

  /* ---- section nudges, applied to the calibrated layout ---- */

  // Chunks: 6 x 3 page-sized blocks separated by gutters.
  vec2 chunks = vec2(6.0, 3.0);
  vec2 chunkIdx = min(floor(cell01 * chunks), chunks - 1.0);
  base += (chunkIdx - (chunks - 1.0) * 0.5) * uSpacing * 2.6 * uChunk;

  // Lanes: rows gather into five horizontal bands.
  float lane = min(floor(cell01.y * 5.0), 4.0);
  float laneCentre = ((lane + 0.5) / 5.0 * 2.0 - 1.0) * half_.y;
  base.y = mix(base.y, laneCentre + (base.y - laneCentre) * 0.34, uLanes);

  // Furrows: every three rows tighten into one stripe.
  float row = floor(cell01.y * (uGrid.y - 1.0) + 0.5);
  float stripe = floor(row / 3.0);
  float inStripe = row - stripe * 3.0;
  float stripeY = ((stripe * 3.0 + 1.0) / (uGrid.y - 1.0) * 2.0 - 1.0) * half_.y;
  base.y = mix(base.y, stripeY + (inStripe - 1.0) * uSpacing * 0.22, uFurrow);

  /* ---- the measuring lens: cells near the pointer calibrate locally ---- */

  float d = distance(base, uLens.xy);
  float lens = (1.0 - smoothstep(0.0, uLensRadius, d)) * uLens.z;
  vLens = lens;

  /* ---- drift: noise that decays as the page calibrates ---- */

  float amp = pow(1.0 - uCal, 1.4) + uBoost;
  amp *= 1.0 - lens;

  vec3 offset = vec3(0.0);
  float spin = 0.0;
  if (amp > 0.002) {
    // Large, coherent warp: the whole sheet bends and drifts, so rows stay legible.
    vec3 w = vec3(base * 0.11, uTime * 0.05);
    vec3 warp = vec3(snoise(w), snoise(w + vec3(31.7, 7.3, 0.0)), snoise(w + vec3(-12.1, 23.4, 5.0)));
    // Fine misregistration: individual cells sit slightly off their pitch.
    vec3 f = vec3(base * 0.9, uTime * 0.09 + aCell.z * 4.0);
    float jx = snoise(f);
    float jy = snoise(f + vec3(9.1, 3.7, 0.0));
    offset = vec3(warp.xy * 2.6 + vec2(jx, jy) * 0.55, warp.z * 7.0 + (aCell.w - 0.5) * 2.2) * uSpacing * amp;
    spin = (warp.x * 0.6 + jx * 0.5) * amp;
  }
  offset.z += lens * uSpacing * 3.4;

  /* ---- the cell itself ---- */

  float fid = step(aCell.z, 0.006);
  vFid = fid;
  vec2 size = vec2(uCellSize);
  size *= mix(1.0, 2.8 - uCal * 1.1, fid);
  size *= 1.0 + lens * 0.45;
  size.x *= mix(1.0, 3.2, uFurrow * (1.0 - fid));

  vec2 corner = rot(spin) * (position.xy * size);
  vec3 local = vec3(base + offset.xy + corner, offset.z);
  vec4 world = uPlane * vec4(local, 1.0);
  vec4 view = viewMatrix * world;
  gl_Position = projectionMatrix * view;

  /* ---- visibility ---- */

  float ndcX = gl_Position.x / gl_Position.w;
  vScan = (1.0 - smoothstep(0.0, 0.05, abs(ndcX - uScan))) * uScanOn;

  float depth = -view.z;
  float fog = smoothstep(30.0, 9.0, depth);
  float revealed = step(ndcX, uReveal);
  vAlpha = fog * revealed;
}
`

export const fragmentShader = /* glsl */ `
precision highp float;

uniform vec3 uInk;
uniform vec3 uMeasure;
uniform float uAlpha;      // base cell alpha for the theme
uniform float uOpacity;    // whole-field fade (dim, visibility)

varying vec2 vUv;
varying float vAlpha;
varying float vLens;
varying float vScan;
varying float vFid;

void main() {
  float a = vAlpha;
  if (a < 0.002) discard;

  // Fiducial marker: a square ring with a solid core.
  if (vFid > 0.5) {
    vec2 p = abs(vUv - 0.5);
    float m = max(p.x, p.y);
    float ring = step(0.34, m);
    float core = step(m, 0.14);
    if (ring + core < 0.5) discard;
  }

  float hot = max(vLens, vScan);
  vec3 colour = mix(uInk, uMeasure, clamp(hot * 1.4, 0.0, 1.0));
  float alpha = mix(uAlpha, 0.95, hot);
  alpha = mix(alpha, max(alpha, 0.42), vFid);

  gl_FragColor = vec4(colour, a * alpha * uOpacity);
}
`
