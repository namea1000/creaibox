import type { VideoEditorClip } from "../VideoEditorContext";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getRenderMotion(clip: VideoEditorClip) {
  return getRenderMotionAtTime(clip, clip.startTime);
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function getBaseMotion(clip: VideoEditorClip) {
  return {
    x: clamp(clip.motionX ?? 50, 0, 100),
    y: clamp(clip.motionY ?? 50, 0, 100),
    width: clamp(clip.motionWidth ?? 100, 5, 200),
    height: clamp(clip.motionHeight ?? 100, 5, 200),
    scale: clamp(clip.scale ?? 1, 0.1, 5),
    rotation: clip.rotation ?? 0,
    opacity: clamp(clip.opacity ?? 1, 0, 1),
    flipX: Boolean(clip.flipX),
    flipY: Boolean(clip.flipY),
  };
}

export function getRenderMotionAtTime(clip: VideoEditorClip, currentTime: number) {
  const base = getBaseMotion(clip);
  const keyframes = (clip.keyframes ?? [])
    .filter((keyframe) => Number.isFinite(keyframe.time))
    .sort((a, b) => a.time - b.time);

  if (keyframes.length === 0) return base;

  const localTime = clamp(currentTime - clip.startTime, 0, clip.duration);
  const previous = [...keyframes].reverse().find((keyframe) => keyframe.time <= localTime);
  const next = keyframes.find((keyframe) => keyframe.time >= localTime);

  if (!previous && !next) return base;

  const first = previous ?? next;
  const second = next ?? previous;
  if (!first || !second) return base;

  const span = Math.max(0.0001, second.time - first.time);
  const progress = first.id === second.id ? 0 : clamp((localTime - first.time) / span, 0, 1);

  const value = (field: keyof Pick<
    VideoEditorClip,
    "motionX" | "motionY" | "motionWidth" | "motionHeight" | "scale" | "rotation" | "opacity"
  >, fallback: number) => {
    const start = first[field] ?? fallback;
    const end = second[field] ?? start;
    return lerp(start, end, progress);
  };

  return {
    ...base,
    x: clamp(value("motionX", base.x), 0, 100),
    y: clamp(value("motionY", base.y), 0, 100),
    width: clamp(value("motionWidth", base.width), 5, 200),
    height: clamp(value("motionHeight", base.height), 5, 200),
    scale: clamp(value("scale", base.scale), 0.1, 5),
    rotation: value("rotation", base.rotation),
    opacity: clamp(value("opacity", base.opacity), 0, 1),
  };
}

export function getRenderEffects(clip: VideoEditorClip) {
  return {
    brightness: clip.brightness ?? 1,
    contrast: clip.contrast ?? 1,
    saturation: clip.saturation ?? 1,
    blur: clip.blur ?? 0,
    grayscale: clip.grayscale ?? 0,
    sepia: clip.sepia ?? 0,
    blendMode: clip.blendMode ?? "normal",
  };
}

export function getRenderTransition(clip: VideoEditorClip, currentTime: number) {
  const transitionDuration = Math.min(0.6, clip.duration / 3);
  const startElapsed = currentTime - clip.startTime;
  const endRemaining = clip.startTime + clip.duration - currentTime;
  const inProgress = clamp(startElapsed / transitionDuration, 0, 1);
  const outProgress = clamp(endRemaining / transitionDuration, 0, 1);
  const isIn =
    Boolean(clip.transitionIn && clip.transitionIn !== "none") &&
    startElapsed < transitionDuration;
  const isOut =
    Boolean(clip.transitionOut && clip.transitionOut !== "none") &&
    endRemaining < transitionDuration;

  let opacity = 1;
  let scale = 1;
  let blur = 0;
  let translateX = 0;
  let translateY = 0;
  let rotate = 0;
  let brightness = 1;
  let clipInsetLeft = 0;
  let clipInsetRight = 0;
  const jitterSeed = clip.id
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  const applyTransition = (
    transitionType: VideoEditorClip["transitionIn"],
    progress: number,
    direction: "in" | "out"
  ) => {
    const edge = direction === "in" ? 1 - progress : 1 - progress;
    const sign = direction === "in" ? 1 : -1;

    if (transitionType === "fade") opacity = Math.min(opacity, progress);
    if (transitionType === "zoom") scale = Math.min(scale, 0.92 + progress * 0.08);
    if (transitionType === "slide") translateX += edge * 8 * sign;
    if (transitionType === "blur") blur = Math.max(blur, edge * 8);
    if (transitionType === "wipe") {
      if (direction === "in") clipInsetRight = Math.max(clipInsetRight, edge);
      if (direction === "out") clipInsetLeft = Math.max(clipInsetLeft, edge);
    }
    if (transitionType === "push") translateX += edge * 18 * sign;
    if (transitionType === "spin") {
      rotate += edge * 16 * sign;
      scale = Math.min(scale, 0.96 + progress * 0.04);
    }
    if (transitionType === "glitch") {
      const jitter = Math.sin(currentTime * 90 + jitterSeed) > 0 ? 1 : -1;
      translateX += jitter * edge * 4;
      translateY += Math.cos(currentTime * 70 + jitterSeed) * edge * 1.4;
      brightness = Math.max(brightness, 1 + edge * 0.35);
    }
    if (transitionType === "flash") {
      opacity = Math.min(opacity, 0.75 + progress * 0.25);
      brightness = Math.max(brightness, 1 + edge * 1.25);
    }
    if (transitionType === "dip-to-black") {
      opacity = Math.min(opacity, progress);
      brightness = Math.min(brightness, 0.15 + progress * 0.85);
    }
    if (transitionType === "cross-zoom") {
      scale = Math.max(scale, 1 + edge * 0.12);
      blur = Math.max(blur, edge * 5);
      opacity = Math.min(opacity, 0.82 + progress * 0.18);
    }
  };

  if (isIn) {
    applyTransition(clip.transitionIn, inProgress, "in");
  }

  if (isOut) {
    applyTransition(clip.transitionOut, outProgress, "out");
  }

  return {
    opacity,
    scale,
    blur,
    translateX,
    translateY,
    rotate,
    brightness,
    clipInsetLeft,
    clipInsetRight,
    clipInsetTop: 0,
    clipInsetBottom: 0,
  };
}

export function getCanvasFilter(clip: VideoEditorClip, currentTime: number) {
  const effects = getRenderEffects(clip);
  const transition = getRenderTransition(clip, currentTime);

  return [
    `brightness(${effects.brightness})`,
    `brightness(${transition.brightness})`,
    `contrast(${effects.contrast})`,
    `saturate(${effects.saturation})`,
    `blur(${effects.blur + transition.blur}px)`,
    effects.grayscale > 0 ? `grayscale(${effects.grayscale})` : "",
    effects.sepia > 0 ? `sepia(${effects.sepia})` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function mapBlendModeToCanvas(mode: string): GlobalCompositeOperation {
  if (mode === "normal") return "source-over";
  if (mode === "screen") return "screen";
  if (mode === "overlay") return "overlay";
  if (mode === "multiply") return "multiply";
  if (mode === "lighten") return "lighten";
  if (mode === "darken") return "darken";
  if (mode === "soft-light") return "soft-light";
  if (mode === "hard-light") return "hard-light";
  if (mode === "difference") return "difference";
  if (mode === "exclusion") return "exclusion";
  if (mode === "hue") return "hue";
  if (mode === "saturation") return "saturation";
  if (mode === "color") return "color";
  if (mode === "luminosity") return "luminosity";
  return "source-over";
}

export function applyClipCanvasState(
  ctx: CanvasRenderingContext2D,
  clip: VideoEditorClip,
  currentTime: number,
  canvasWidth: number,
  canvasHeight: number,
  options?: { applyFilter?: boolean }
) {
  const motion = getRenderMotionAtTime(clip, currentTime);
  const transition = getRenderTransition(clip, currentTime);
  const effects = getRenderEffects(clip);
  const boxWidth = canvasWidth * (motion.width / 100);
  const boxHeight = canvasHeight * (motion.height / 100);
  const centerX =
    canvasWidth * (motion.x / 100) + canvasWidth * (transition.translateX / 100);
  const centerY =
    canvasHeight * (motion.y / 100) + canvasHeight * (transition.translateY / 100);
  const totalScale = motion.scale * transition.scale;

  ctx.globalAlpha = motion.opacity * transition.opacity;
  ctx.filter =
    options?.applyFilter === false ? "none" : getCanvasFilter(clip, currentTime);
  ctx.globalCompositeOperation = mapBlendModeToCanvas(String(effects.blendMode));
  ctx.translate(centerX, centerY);
  ctx.rotate(((motion.rotation + transition.rotate) * Math.PI) / 180);
  ctx.scale(
    totalScale * (motion.flipX ? -1 : 1),
    totalScale * (motion.flipY ? -1 : 1)
  );

  if (
    transition.clipInsetLeft > 0 ||
    transition.clipInsetRight > 0 ||
    transition.clipInsetTop > 0 ||
    transition.clipInsetBottom > 0
  ) {
    const x = -boxWidth / 2 + boxWidth * transition.clipInsetLeft;
    const y = -boxHeight / 2 + boxHeight * transition.clipInsetTop;
    const width = boxWidth * (1 - transition.clipInsetLeft - transition.clipInsetRight);
    const height = boxHeight * (1 - transition.clipInsetTop - transition.clipInsetBottom);

    ctx.beginPath();
    ctx.rect(x, y, Math.max(0, width), Math.max(0, height));
    ctx.clip();
  }

  return {
    boxWidth,
    boxHeight,
  };
}

export function getAudioMixValue(clip: VideoEditorClip, currentTime: number) {
  const baseVolume = clamp((clip.volume ?? 1) * (clip.audioGain ?? 1), 0, 3);
  const fadeIn = clip.fadeIn ?? 0;
  const fadeOut = clip.fadeOut ?? 0;
  const clipElapsed = currentTime - clip.startTime;
  const clipRemaining = clip.startTime + clip.duration - currentTime;
  let fadeMultiplier = 1;

  if (fadeIn > 0 && clipElapsed < fadeIn) {
    fadeMultiplier = Math.min(fadeMultiplier, clamp(clipElapsed / fadeIn, 0, 1));
  }

  if (fadeOut > 0 && clipRemaining < fadeOut) {
    fadeMultiplier = Math.min(
      fadeMultiplier,
      clamp(clipRemaining / fadeOut, 0, 1)
    );
  }

  return {
    volume: clamp(baseVolume * fadeMultiplier, 0, 3),
    pan: clamp(clip.audioPan ?? 0, -1, 1),
  };
}

export function colorWithOpacity(value: string, opacity: number) {
  const safeOpacity = clamp(opacity, 0, 1);
  const color = value.trim();

  if (color === "transparent") return color;

  if (/^#[0-9a-f]{6}$/i.test(color)) {
    const red = parseInt(color.slice(1, 3), 16);
    const green = parseInt(color.slice(3, 5), 16);
    const blue = parseInt(color.slice(5, 7), 16);
    return `rgba(${red}, ${green}, ${blue}, ${safeOpacity})`;
  }

  if (/^#[0-9a-f]{3}$/i.test(color)) {
    const red = parseInt(color[1] + color[1], 16);
    const green = parseInt(color[2] + color[2], 16);
    const blue = parseInt(color[3] + color[3], 16);
    return `rgba(${red}, ${green}, ${blue}, ${safeOpacity})`;
  }

  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${safeOpacity})`);
  }

  if (color.startsWith("rgba(")) {
    const parts = color
      .slice(5, -1)
      .split(",")
      .map((part) => part.trim());
    return `rgba(${parts.slice(0, 3).join(", ")}, ${safeOpacity})`;
  }

  return color;
}
