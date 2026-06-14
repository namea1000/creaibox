import type { VideoEditorClip } from "../VideoEditorContext";
import {
  applyClipCanvasState,
  getRenderMotionAtTime,
} from "./videoRenderMath";
import { WebGLEffectsRenderer } from "./webglEffectsRenderer";
import { WebGPURenderer } from "./webgpuRenderer";

export type RenderFallbackBackend = "canvas2d" | "webgl-effects" | "webgpu";

export type RenderFallbackDrawResult = {
  backend: RenderFallbackBackend;
  fellBack: boolean;
  reason?: string;
};

export type DrawMediaLayerInput = {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  source: CanvasImageSource;
  sourceWidth: number;
  sourceHeight: number;
  clip: VideoEditorClip;
  currentTime: number;
};

export class RenderFallbackRenderer {
  private readonly webgpuRenderer: WebGPURenderer | null;
  private readonly webglEffectsRenderer: WebGLEffectsRenderer | null;
  private hasReportedWebGPUFailure = false;
  private hasReportedWebGLFailure = false;

  static create() {
    return new RenderFallbackRenderer(
      WebGPURenderer.create(),
      WebGLEffectsRenderer.create()
    );
  }

  private constructor(
    webgpuRenderer: WebGPURenderer | null,
    webglEffectsRenderer: WebGLEffectsRenderer | null
  ) {
    this.webgpuRenderer = webgpuRenderer;
    this.webglEffectsRenderer = webglEffectsRenderer;
  }

  async drawMediaLayer(input: DrawMediaLayerInput): Promise<RenderFallbackDrawResult> {
    const motion = getRenderMotionAtTime(input.clip, input.currentTime);
    const targetBoxWidth = input.canvasWidth * (motion.width / 100);
    const targetBoxHeight = input.canvasHeight * (motion.height / 100);
    let effectsCanvas: HTMLCanvasElement | null = null;
    let fallbackReason: string | undefined;
    let backend: RenderFallbackBackend = "canvas2d";

    if (this.webgpuRenderer) {
      effectsCanvas = await this.webgpuRenderer.renderToCanvas({
        source: input.source,
        sourceWidth: input.sourceWidth,
        sourceHeight: input.sourceHeight,
        targetWidth: targetBoxWidth,
        targetHeight: targetBoxHeight,
        clip: input.clip,
        currentTime: input.currentTime,
      });

      if (effectsCanvas) {
        backend = "webgpu";
      } else if (!this.hasReportedWebGPUFailure) {
        fallbackReason = "WebGPU renderer가 결과를 만들지 못해 WebGL/Canvas2D로 처리했습니다.";
        this.hasReportedWebGPUFailure = true;
      }
    } else if (!this.hasReportedWebGPUFailure) {
      fallbackReason = "WebGPU renderer를 생성하지 못해 WebGL/Canvas2D로 처리했습니다.";
      this.hasReportedWebGPUFailure = true;
    }

    if (!effectsCanvas) {
      if (this.webglEffectsRenderer) {
        effectsCanvas = this.webglEffectsRenderer.renderToCanvas({
          source: input.source,
          sourceWidth: input.sourceWidth,
          sourceHeight: input.sourceHeight,
          targetWidth: targetBoxWidth,
          targetHeight: targetBoxHeight,
          clip: input.clip,
          currentTime: input.currentTime,
        });

        if (!effectsCanvas) {
          fallbackReason ??= "WebGL 효과 렌더 결과가 없어 Canvas2D로 처리했습니다.";
        } else {
          backend = "webgl-effects";
        }
      } else if (!this.hasReportedWebGLFailure) {
        fallbackReason ??= "WebGL 효과 renderer를 생성하지 못해 Canvas2D로 처리했습니다.";
        this.hasReportedWebGLFailure = true;
      }
    }

    input.ctx.save();
    const { boxWidth, boxHeight } = applyClipCanvasState(
      input.ctx,
      input.clip,
      input.currentTime,
      input.canvasWidth,
      input.canvasHeight,
      { applyFilter: !effectsCanvas }
    );

    if (effectsCanvas) {
      input.ctx.drawImage(
        effectsCanvas,
        -boxWidth / 2,
        -boxHeight / 2,
        boxWidth,
        boxHeight
      );
      input.ctx.restore();
      return {
        backend,
        fellBack: backend !== "webgpu" && Boolean(fallbackReason),
        reason: fallbackReason,
      };
    }

    drawContainImageInBox(
      input.ctx,
      input.source,
      input.sourceWidth,
      input.sourceHeight,
      boxWidth,
      boxHeight,
      input.clip
    );
    input.ctx.restore();

    return {
      backend: "canvas2d",
      fellBack: Boolean(fallbackReason),
      reason: fallbackReason,
    };
  }
}

function drawContainImageInBox(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  clip: VideoEditorClip
) {
  const cropLeft = Math.max(0, Math.min(90, clip.cropLeft ?? 0));
  const cropRight = Math.max(0, Math.min(90, clip.cropRight ?? 0));
  const cropTop = Math.max(0, Math.min(90, clip.cropTop ?? 0));
  const cropBottom = Math.max(0, Math.min(90, clip.cropBottom ?? 0));
  const sourceX = sourceWidth * (cropLeft / 100);
  const sourceY = sourceHeight * (cropTop / 100);
  const croppedWidth = Math.max(
    1,
    sourceWidth - sourceX - sourceWidth * (cropRight / 100)
  );
  const croppedHeight = Math.max(
    1,
    sourceHeight - sourceY - sourceHeight * (cropBottom / 100)
  );
  const scale = Math.min(targetWidth / croppedWidth, targetHeight / croppedHeight);
  const width = croppedWidth * scale;
  const height = croppedHeight * scale;
  const x = -width / 2;
  const y = -height / 2;

  ctx.drawImage(
    image,
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
