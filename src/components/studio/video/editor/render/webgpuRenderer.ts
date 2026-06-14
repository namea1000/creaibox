import type { VideoEditorClip } from "../VideoEditorContext";
import { getRenderEffects, getRenderTransition } from "./videoRenderMath";

export type WebGPURendererSupport = {
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

type MinimalGPU = {
  requestAdapter: () => Promise<MinimalGPUAdapter | null>;
  getPreferredCanvasFormat: () => string;
};

type MinimalGPUAdapter = {
  requestDevice: () => Promise<MinimalGPUDevice>;
};

type MinimalGPUDevice = {
  queue: {
    copyExternalImageToTexture: (
      source: { source: CanvasImageSource },
      destination: { texture: MinimalGPUTexture },
      copySize: [number, number]
    ) => void;
    writeBuffer: (
      buffer: MinimalGPUBuffer,
      bufferOffset: number,
      data: ArrayBuffer
    ) => void;
    submit: (commandBuffers: MinimalGPUCommandBuffer[]) => void;
  };
  createBuffer: (descriptor: MinimalGPUBufferDescriptor) => MinimalGPUBuffer;
  createBindGroup: (descriptor: MinimalGPUBindGroupDescriptor) => MinimalGPUBindGroup;
  createCommandEncoder: () => MinimalGPUCommandEncoder;
  createRenderPipeline: (descriptor: MinimalGPURenderPipelineDescriptor) => MinimalGPURenderPipeline;
  createSampler: (descriptor: Record<string, string>) => MinimalGPUSampler;
  createShaderModule: (descriptor: { code: string }) => MinimalGPUShaderModule;
  createTexture: (descriptor: MinimalGPUTextureDescriptor) => MinimalGPUTexture;
};

type MinimalGPUCanvasContext = {
  configure: (descriptor: {
    device: MinimalGPUDevice;
    format: string;
    alphaMode: "opaque" | "premultiplied";
  }) => void;
  getCurrentTexture: () => MinimalGPUTexture;
};

type MinimalGPUBindGroup = unknown;
type MinimalGPUBuffer = {
  destroy?: () => void;
};
type MinimalGPUCommandBuffer = unknown;
type MinimalGPURenderPipeline = {
  getBindGroupLayout: (index: number) => unknown;
};
type MinimalGPUSampler = unknown;
type MinimalGPUShaderModule = unknown;

type MinimalGPUTexture = {
  createView: () => unknown;
  destroy?: () => void;
};

type MinimalGPUTextureDescriptor = {
  size: [number, number];
  format: string;
  usage: number;
};

type MinimalGPUBufferDescriptor = {
  size: number;
  usage: number;
};

type MinimalGPUBindGroupDescriptor = {
  layout: unknown;
  entries: Array<{
    binding: number;
    resource: unknown;
  }>;
};

type MinimalGPURenderPipelineDescriptor = {
  layout: "auto";
  vertex: {
    module: MinimalGPUShaderModule;
    entryPoint: string;
  };
  fragment: {
    module: MinimalGPUShaderModule;
    entryPoint: string;
    targets: Array<{ format: string }>;
  };
  primitive: {
    topology: "triangle-list";
  };
};

type MinimalGPUCommandEncoder = {
  beginRenderPass: (descriptor: MinimalGPURenderPassDescriptor) => MinimalGPURenderPassEncoder;
  finish: () => MinimalGPUCommandBuffer;
};

type MinimalGPURenderPassDescriptor = {
  colorAttachments: Array<{
    view: unknown;
    clearValue: { r: number; g: number; b: number; a: number };
    loadOp: "clear";
    storeOp: "store";
  }>;
};

type MinimalGPURenderPassEncoder = {
  setPipeline: (pipeline: MinimalGPURenderPipeline) => void;
  setBindGroup: (index: number, bindGroup: MinimalGPUBindGroup) => void;
  draw: (vertexCount: number) => void;
  end: () => void;
};

type WebGpuNavigator = Navigator & {
  gpu?: MinimalGPU;
};

const WEBGPU_SHADER = `
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@vertex
fn vsMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var positions = array<vec2f, 6>(
    vec2f(-1.0, -1.0),
    vec2f(1.0, -1.0),
    vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0),
    vec2f(1.0, -1.0),
    vec2f(1.0, 1.0)
  );
  var uvs = array<vec2f, 6>(
    vec2f(0.0, 1.0),
    vec2f(1.0, 1.0),
    vec2f(0.0, 0.0),
    vec2f(0.0, 0.0),
    vec2f(1.0, 1.0),
    vec2f(1.0, 0.0)
  );
  var output: VertexOutput;
  output.position = vec4f(positions[vertexIndex], 0.0, 1.0);
  output.uv = uvs[vertexIndex];
  return output;
}

@group(0) @binding(0) var imageSampler: sampler;
@group(0) @binding(1) var imageTexture: texture_2d<f32>;

struct Effects {
  brightness: f32,
  contrast: f32,
  saturation: f32,
  grayscale: f32,
  sepia: f32,
  blur: f32,
  pad0: f32,
  pad1: f32,
};

@group(0) @binding(2) var<uniform> effects: Effects;

fn applySepia(color: vec3f) -> vec3f {
  return vec3f(
    dot(color, vec3f(0.393, 0.769, 0.189)),
    dot(color, vec3f(0.349, 0.686, 0.168)),
    dot(color, vec3f(0.272, 0.534, 0.131))
  );
}

@fragment
fn fsMain(input: VertexOutput) -> @location(0) vec4f {
  let dims = vec2f(textureDimensions(imageTexture));
  let texel = 1.0 / max(dims, vec2f(1.0, 1.0));
  let radius = min(effects.blur, 24.0);
  var color: vec4f;

  if (radius > 0.01) {
    let offset = texel * radius;
    color =
      textureSample(imageTexture, imageSampler, input.uv + vec2f(-offset.x, -offset.y)) * 0.0625 +
      textureSample(imageTexture, imageSampler, input.uv + vec2f(0.0, -offset.y)) * 0.125 +
      textureSample(imageTexture, imageSampler, input.uv + vec2f(offset.x, -offset.y)) * 0.0625 +
      textureSample(imageTexture, imageSampler, input.uv + vec2f(-offset.x, 0.0)) * 0.125 +
      textureSample(imageTexture, imageSampler, input.uv) * 0.25 +
      textureSample(imageTexture, imageSampler, input.uv + vec2f(offset.x, 0.0)) * 0.125 +
      textureSample(imageTexture, imageSampler, input.uv + vec2f(-offset.x, offset.y)) * 0.0625 +
      textureSample(imageTexture, imageSampler, input.uv + vec2f(0.0, offset.y)) * 0.125 +
      textureSample(imageTexture, imageSampler, input.uv + vec2f(offset.x, offset.y)) * 0.0625;
  } else {
    color = textureSample(imageTexture, imageSampler, input.uv);
  }

  var rgb = color.rgb * effects.brightness;
  rgb = (rgb - vec3f(0.5)) * effects.contrast + vec3f(0.5);

  let luma = dot(rgb, vec3f(0.2126, 0.7152, 0.0722));
  rgb = mix(vec3f(luma), rgb, effects.saturation);
  rgb = mix(rgb, vec3f(luma), clamp(effects.grayscale, 0.0, 1.0));
  rgb = mix(rgb, applySepia(rgb), clamp(effects.sepia, 0.0, 1.0));

  return vec4f(clamp(rgb, vec3f(0.0), vec3f(1.0)), color.a);
}
`;

export function detectWebGPURendererSupport(): WebGPURendererSupport {
  if (typeof navigator === "undefined") {
    return { supported: false, reason: "브라우저 환경이 아닙니다." };
  }

  const gpu = (navigator as WebGpuNavigator).gpu;
  if (!gpu) {
    return { supported: false, reason: "navigator.gpu를 사용할 수 없습니다." };
  }

  if (typeof document === "undefined") {
    return { supported: false, reason: "document canvas를 사용할 수 없습니다." };
  }

  const canvas = document.createElement("canvas");
  const context = getWebGPUContext(canvas);
  if (!context) {
    return { supported: false, reason: "WebGPU canvas context를 생성하지 못했습니다." };
  }

  return { supported: true };
}

export class WebGPURenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly scratchCanvas: HTMLCanvasElement;
  private readonly scratchCtx: CanvasRenderingContext2D;
  private device: MinimalGPUDevice | null = null;
  private context: MinimalGPUCanvasContext | null = null;
  private format = "bgra8unorm";
  private pipeline: MinimalGPURenderPipeline | null = null;
  private sampler: MinimalGPUSampler | null = null;
  private effectsBuffer: MinimalGPUBuffer | null = null;
  private initPromise: Promise<boolean> | null = null;

  static create() {
    if (!detectWebGPURendererSupport().supported) return null;
    const canvas = createCanvas(2, 2);
    const scratchCanvas = createCanvas(2, 2);
    const scratchCtx = scratchCanvas.getContext("2d");

    if (!scratchCtx) return null;

    return new WebGPURenderer(canvas, scratchCanvas, scratchCtx);
  }

  private constructor(
    canvas: HTMLCanvasElement,
    scratchCanvas: HTMLCanvasElement,
    scratchCtx: CanvasRenderingContext2D
  ) {
    this.canvas = canvas;
    this.scratchCanvas = scratchCanvas;
    this.scratchCtx = scratchCtx;
  }

  async renderToCanvas(input: RenderInput): Promise<HTMLCanvasElement | null> {
    if (!hasRenderableWebGPUWork(input.clip, input.currentTime)) return null;
    if (!(await this.ensureReady())) return null;
    if (!this.device || !this.context || !this.pipeline || !this.sampler) return null;

    try {
      this.resize(input.targetWidth, input.targetHeight);
      drawCroppedContainSource(this.scratchCtx, input);

      const texture = this.device.createTexture({
        size: [this.canvas.width, this.canvas.height],
        format: "rgba8unorm",
        usage: textureUsage("TEXTURE_BINDING") | textureUsage("COPY_DST"),
      });

      this.device.queue.copyExternalImageToTexture(
        { source: this.scratchCanvas },
        { texture },
        [this.canvas.width, this.canvas.height]
      );
      this.writeEffects(input.clip, input.currentTime);

      const bindGroup = this.device.createBindGroup({
        layout: this.pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: this.sampler },
          { binding: 1, resource: texture.createView() },
          { binding: 2, resource: { buffer: this.effectsBuffer } },
        ],
      });

      const encoder = this.device.createCommandEncoder();
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: this.context.getCurrentTexture().createView(),
            clearValue: { r: 0, g: 0, b: 0, a: 0 },
            loadOp: "clear",
            storeOp: "store",
          },
        ],
      });

      pass.setPipeline(this.pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.draw(6);
      pass.end();
      this.device.queue.submit([encoder.finish()]);
      texture.destroy?.();

      return this.canvas;
    } catch {
      return null;
    }
  }

  private ensureReady() {
    if (!this.initPromise) {
      this.initPromise = this.initialize();
    }

    return this.initPromise;
  }

  private async initialize() {
    try {
      const gpu = (navigator as WebGpuNavigator).gpu;
      if (!gpu) return false;

      const adapter = await gpu.requestAdapter();
      if (!adapter) return false;

      this.device = await adapter.requestDevice();
      this.context = getWebGPUContext(this.canvas);
      if (!this.context) return false;

      this.format = gpu.getPreferredCanvasFormat();
      this.context.configure({
        device: this.device,
        format: this.format,
        alphaMode: "premultiplied",
      });

      const shaderModule = this.device.createShaderModule({ code: WEBGPU_SHADER });
      this.pipeline = this.device.createRenderPipeline({
        layout: "auto",
        vertex: {
          module: shaderModule,
          entryPoint: "vsMain",
        },
        fragment: {
          module: shaderModule,
          entryPoint: "fsMain",
          targets: [{ format: this.format }],
        },
        primitive: {
          topology: "triangle-list",
        },
      });
      this.sampler = this.device.createSampler({
        magFilter: "linear",
        minFilter: "linear",
      });
      this.effectsBuffer = this.device.createBuffer({
        size: 32,
        usage: bufferUsage("UNIFORM") | bufferUsage("COPY_DST"),
      });

      return true;
    } catch {
      return false;
    }
  }

  private resize(width: number, height: number) {
    const safeWidth = Math.max(1, Math.round(width));
    const safeHeight = Math.max(1, Math.round(height));

    if (this.canvas.width !== safeWidth || this.canvas.height !== safeHeight) {
      this.canvas.width = safeWidth;
      this.canvas.height = safeHeight;
      this.context?.configure({
        device: this.device as MinimalGPUDevice,
        format: this.format,
        alphaMode: "premultiplied",
      });
    }

    if (
      this.scratchCanvas.width !== safeWidth ||
      this.scratchCanvas.height !== safeHeight
    ) {
      this.scratchCanvas.width = safeWidth;
      this.scratchCanvas.height = safeHeight;
    }
  }

  private writeEffects(clip: VideoEditorClip, currentTime: number) {
    if (!this.device || !this.effectsBuffer) return;

    const effects = getRenderEffects(clip);
    const transition = getRenderTransition(clip, currentTime);
    const values = new Float32Array([
      effects.brightness * transition.brightness,
      effects.contrast,
      effects.saturation,
      effects.grayscale,
      effects.sepia,
      effects.blur + transition.blur,
      0,
      0,
    ]);

    this.device.queue.writeBuffer(this.effectsBuffer, 0, values.buffer);
  }
}

function getWebGPUContext(canvas: HTMLCanvasElement) {
  const getContext = canvas.getContext as unknown as (
    contextId: "webgpu"
  ) => MinimalGPUCanvasContext | null;
  return getContext.call(canvas, "webgpu");
}

function hasRenderableWebGPUWork(clip: VideoEditorClip, currentTime: number) {
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

function textureUsage(name: "COPY_DST" | "TEXTURE_BINDING") {
  const usage = (globalThis as { GPUTextureUsage?: Record<string, number> })
    .GPUTextureUsage;
  const fallback = name === "COPY_DST" ? 2 : 4;
  return usage?.[name] ?? fallback;
}

function bufferUsage(name: "COPY_DST" | "UNIFORM") {
  const usage = (globalThis as { GPUBufferUsage?: Record<string, number> })
    .GPUBufferUsage;
  const fallback = name === "COPY_DST" ? 8 : 64;
  return usage?.[name] ?? fallback;
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
