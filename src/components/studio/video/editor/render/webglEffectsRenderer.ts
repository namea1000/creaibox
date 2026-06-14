import type { VideoEditorClip } from "../VideoEditorContext";
import { getRenderEffects, getRenderTransition } from "./videoRenderMath";

export type WebGLEffectsSupport = {
  supported: boolean;
  reason?: string;
};

type RenderInput = {
  source: CanvasImageSource;
  sourceWidth: number;
  sourceHeight: number;
  targetWidth: number;
  targetHeight: number;
  clip: VideoEditorClip;
  currentTime: number;
};

type ShaderProgram = {
  program: WebGLProgram;
  position: number;
  texCoord: number;
  uniforms: {
    image: WebGLUniformLocation | null;
    resolution: WebGLUniformLocation | null;
    brightness: WebGLUniformLocation | null;
    contrast: WebGLUniformLocation | null;
    saturation: WebGLUniformLocation | null;
    grayscale: WebGLUniformLocation | null;
    sepia: WebGLUniformLocation | null;
    blur: WebGLUniformLocation | null;
  };
};

const VERTEX_SHADER = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_grayscale;
uniform float u_sepia;
uniform float u_blur;

varying vec2 v_texCoord;

vec3 applySepia(vec3 color) {
  return vec3(
    dot(color, vec3(0.393, 0.769, 0.189)),
    dot(color, vec3(0.349, 0.686, 0.168)),
    dot(color, vec3(0.272, 0.534, 0.131))
  );
}

void main() {
  vec2 texel = 1.0 / u_resolution;
  float radius = min(u_blur, 24.0);
  vec4 color = vec4(0.0);

  if (radius > 0.01) {
    vec2 offset = texel * radius;
    color += texture2D(u_image, v_texCoord + vec2(-offset.x, -offset.y)) * 0.0625;
    color += texture2D(u_image, v_texCoord + vec2(0.0, -offset.y)) * 0.125;
    color += texture2D(u_image, v_texCoord + vec2(offset.x, -offset.y)) * 0.0625;
    color += texture2D(u_image, v_texCoord + vec2(-offset.x, 0.0)) * 0.125;
    color += texture2D(u_image, v_texCoord) * 0.25;
    color += texture2D(u_image, v_texCoord + vec2(offset.x, 0.0)) * 0.125;
    color += texture2D(u_image, v_texCoord + vec2(-offset.x, offset.y)) * 0.0625;
    color += texture2D(u_image, v_texCoord + vec2(0.0, offset.y)) * 0.125;
    color += texture2D(u_image, v_texCoord + vec2(offset.x, offset.y)) * 0.0625;
  } else {
    color = texture2D(u_image, v_texCoord);
  }

  vec3 rgb = color.rgb * u_brightness;
  rgb = (rgb - 0.5) * u_contrast + 0.5;

  float luma = dot(rgb, vec3(0.2126, 0.7152, 0.0722));
  rgb = mix(vec3(luma), rgb, u_saturation);
  rgb = mix(rgb, vec3(luma), clamp(u_grayscale, 0.0, 1.0));
  rgb = mix(rgb, applySepia(rgb), clamp(u_sepia, 0.0, 1.0));

  gl_FragColor = vec4(clamp(rgb, 0.0, 1.0), color.a);
}
`;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext): ShaderProgram | null {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return {
    program,
    position: gl.getAttribLocation(program, "a_position"),
    texCoord: gl.getAttribLocation(program, "a_texCoord"),
    uniforms: {
      image: gl.getUniformLocation(program, "u_image"),
      resolution: gl.getUniformLocation(program, "u_resolution"),
      brightness: gl.getUniformLocation(program, "u_brightness"),
      contrast: gl.getUniformLocation(program, "u_contrast"),
      saturation: gl.getUniformLocation(program, "u_saturation"),
      grayscale: gl.getUniformLocation(program, "u_grayscale"),
      sepia: gl.getUniformLocation(program, "u_sepia"),
      blur: gl.getUniformLocation(program, "u_blur"),
    },
  };
}

function hasActiveEffects(clip: VideoEditorClip, currentTime: number) {
  const effects = getRenderEffects(clip);
  const transition = getRenderTransition(clip, currentTime);

  return (
    Math.abs(effects.brightness - 1) > 0.001 ||
    Math.abs(effects.contrast - 1) > 0.001 ||
    Math.abs(effects.saturation - 1) > 0.001 ||
    effects.grayscale > 0.001 ||
    effects.sepia > 0.001 ||
    Math.abs(transition.brightness - 1) > 0.001 ||
    effects.blur + transition.blur > 0.001
  );
}

function drawCroppedContainSource(
  ctx: CanvasRenderingContext2D,
  input: RenderInput
) {
  const cropLeft = clamp(input.clip.cropLeft ?? 0, 0, 90);
  const cropRight = clamp(input.clip.cropRight ?? 0, 0, 90);
  const cropTop = clamp(input.clip.cropTop ?? 0, 0, 90);
  const cropBottom = clamp(input.clip.cropBottom ?? 0, 0, 90);
  const sourceX = input.sourceWidth * (cropLeft / 100);
  const sourceY = input.sourceHeight * (cropTop / 100);
  const croppedWidth = Math.max(
    1,
    input.sourceWidth - sourceX - input.sourceWidth * (cropRight / 100)
  );
  const croppedHeight = Math.max(
    1,
    input.sourceHeight - sourceY - input.sourceHeight * (cropBottom / 100)
  );
  const scale = Math.min(
    input.targetWidth / croppedWidth,
    input.targetHeight / croppedHeight
  );
  const width = croppedWidth * scale;
  const height = croppedHeight * scale;
  const x = (input.targetWidth - width) / 2;
  const y = (input.targetHeight - height) / 2;

  ctx.clearRect(0, 0, input.targetWidth, input.targetHeight);
  ctx.drawImage(
    input.source,
    sourceX,
    sourceY,
    croppedWidth,
    croppedHeight,
    x,
    y,
    width,
    height
  );
}

export function detectWebGLEffectsSupport(): WebGLEffectsSupport {
  if (typeof document === "undefined") {
    return { supported: false, reason: "브라우저 환경이 아닙니다." };
  }

  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

  if (!gl) {
    return { supported: false, reason: "WebGL context를 생성하지 못했습니다." };
  }

  return { supported: true };
}

export class WebGLEffectsRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly scratchCanvas: HTMLCanvasElement;
  private readonly scratchCtx: CanvasRenderingContext2D;
  private readonly gl: WebGLRenderingContext;
  private readonly shader: ShaderProgram;
  private readonly texture: WebGLTexture;
  private readonly vertexBuffer: WebGLBuffer;
  private readonly texCoordBuffer: WebGLBuffer;

  static create() {
    const canvas = createCanvas(2, 2);
    const scratchCanvas = createCanvas(2, 2);
    const scratchCtx = scratchCanvas.getContext("2d");
    const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

    if (!scratchCtx || !gl) return null;

    const shader = createProgram(gl);
    const texture = gl.createTexture();
    const vertexBuffer = gl.createBuffer();
    const texCoordBuffer = gl.createBuffer();

    if (!shader || !texture || !vertexBuffer || !texCoordBuffer) return null;

    return new WebGLEffectsRenderer(
      canvas,
      scratchCanvas,
      scratchCtx,
      gl,
      shader,
      texture,
      vertexBuffer,
      texCoordBuffer
    );
  }

  private constructor(
    canvas: HTMLCanvasElement,
    scratchCanvas: HTMLCanvasElement,
    scratchCtx: CanvasRenderingContext2D,
    gl: WebGLRenderingContext,
    shader: ShaderProgram,
    texture: WebGLTexture,
    vertexBuffer: WebGLBuffer,
    texCoordBuffer: WebGLBuffer
  ) {
    this.canvas = canvas;
    this.scratchCanvas = scratchCanvas;
    this.scratchCtx = scratchCtx;
    this.gl = gl;
    this.shader = shader;
    this.texture = texture;
    this.vertexBuffer = vertexBuffer;
    this.texCoordBuffer = texCoordBuffer;
  }

  renderToCanvas(input: RenderInput): HTMLCanvasElement | null {
    if (!hasActiveEffects(input.clip, input.currentTime)) return null;

    try {
      this.resize(input.targetWidth, input.targetHeight);
      drawCroppedContainSource(this.scratchCtx, input);
      this.renderEffects(input.clip, input.currentTime);
      return this.canvas;
    } catch {
      return null;
    }
  }

  private resize(width: number, height: number) {
    const safeWidth = Math.max(1, Math.round(width));
    const safeHeight = Math.max(1, Math.round(height));

    if (this.canvas.width !== safeWidth || this.canvas.height !== safeHeight) {
      this.canvas.width = safeWidth;
      this.canvas.height = safeHeight;
    }

    if (
      this.scratchCanvas.width !== safeWidth ||
      this.scratchCanvas.height !== safeHeight
    ) {
      this.scratchCanvas.width = safeWidth;
      this.scratchCanvas.height = safeHeight;
    }
  }

  private renderEffects(clip: VideoEditorClip, currentTime: number) {
    const gl = this.gl;
    const effects = getRenderEffects(clip);
    const transition = getRenderTransition(clip, currentTime);

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.shader.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(this.shader.position);
    gl.vertexAttribPointer(this.shader.position, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(this.shader.texCoord);
    gl.vertexAttribPointer(this.shader.texCoord, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.scratchCanvas
    );

    gl.uniform1i(this.shader.uniforms.image, 0);
    gl.uniform2f(
      this.shader.uniforms.resolution,
      this.canvas.width,
      this.canvas.height
    );
    gl.uniform1f(
      this.shader.uniforms.brightness,
      effects.brightness * transition.brightness
    );
    gl.uniform1f(this.shader.uniforms.contrast, effects.contrast);
    gl.uniform1f(this.shader.uniforms.saturation, effects.saturation);
    gl.uniform1f(this.shader.uniforms.grayscale, effects.grayscale);
    gl.uniform1f(this.shader.uniforms.sepia, effects.sepia);
    gl.uniform1f(this.shader.uniforms.blur, effects.blur + transition.blur);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
