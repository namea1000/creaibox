export function createWebCodecsExportWorker() {
  const source = `
    var activeJobId = null;
    var cancelledJobs = new Set();
    var imageCache = new Map();

    function postProgress(jobId, progress, message) {
      self.postMessage({ type: "progress", jobId: jobId, progress: progress, message: message });
    }

    function postError(jobId, message) {
      self.postMessage({ type: "error", jobId: jobId, message: message });
    }

    function postCancel(jobId, message) {
      self.postMessage({ type: "cancel", jobId: jobId, message: message });
    }

    function postComplete(jobId, fallbackToMainThread, reason, workerRenderLoop, renderedFrames, totalFrames, outputBlob, outputFileName) {
      self.postMessage({
        type: "complete",
        jobId: jobId,
        fallbackToMainThread: fallbackToMainThread,
        workerRenderLoop: workerRenderLoop,
        renderedFrames: renderedFrames,
        totalFrames: totalFrames,
        outputBlob: outputBlob,
        outputFileName: outputFileName,
        reason: reason
      });
    }

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function getRenderMotion(clip) {
      return {
        x: clamp(clip.motionX == null ? 50 : clip.motionX, 0, 100),
        y: clamp(clip.motionY == null ? 50 : clip.motionY, 0, 100),
        width: clamp(clip.motionWidth == null ? 100 : clip.motionWidth, 5, 200),
        height: clamp(clip.motionHeight == null ? 100 : clip.motionHeight, 5, 200),
        scale: clamp(clip.scale == null ? 1 : clip.scale, 0.1, 5),
        rotation: clip.rotation == null ? 0 : clip.rotation,
        opacity: clamp(clip.opacity == null ? 1 : clip.opacity, 0, 1),
        flipX: Boolean(clip.flipX),
        flipY: Boolean(clip.flipY)
      };
    }

    function getRenderTransition(clip, currentTime) {
      var transitionDuration = Math.min(0.6, clip.duration / 3);
      var startElapsed = currentTime - clip.startTime;
      var endRemaining = clip.startTime + clip.duration - currentTime;
      var inProgress = clamp(startElapsed / transitionDuration, 0, 1);
      var outProgress = clamp(endRemaining / transitionDuration, 0, 1);
      var isIn = Boolean(clip.transitionIn && clip.transitionIn !== "none") && startElapsed < transitionDuration;
      var isOut = Boolean(clip.transitionOut && clip.transitionOut !== "none") && endRemaining < transitionDuration;
      var opacity = 1;
      var scale = 1;
      var blur = 0;
      var translateX = 0;
      var translateY = 0;
      var rotate = 0;
      var brightness = 1;

      function applyTransition(type, progress, direction) {
        var edge = 1 - progress;
        var sign = direction === "in" ? 1 : -1;
        if (type === "fade") opacity = Math.min(opacity, progress);
        if (type === "zoom") scale = Math.min(scale, 0.92 + progress * 0.08);
        if (type === "slide") translateX += edge * 8 * sign;
        if (type === "blur") blur = Math.max(blur, edge * 8);
        if (type === "push") translateX += edge * 18 * sign;
        if (type === "spin") {
          rotate += edge * 16 * sign;
          scale = Math.min(scale, 0.96 + progress * 0.04);
        }
        if (type === "flash") brightness = Math.max(brightness, 1 + edge * 1.25);
        if (type === "dip-to-black") {
          opacity = Math.min(opacity, progress);
          brightness = Math.min(brightness, 0.15 + progress * 0.85);
        }
        if (type === "cross-zoom") {
          scale = Math.max(scale, 1 + edge * 0.12);
          blur = Math.max(blur, edge * 5);
          opacity = Math.min(opacity, 0.82 + progress * 0.18);
        }
      }

      if (isIn) applyTransition(clip.transitionIn, inProgress, "in");
      if (isOut) applyTransition(clip.transitionOut, outProgress, "out");

      return {
        opacity: opacity,
        scale: scale,
        blur: blur,
        translateX: translateX,
        translateY: translateY,
        rotate: rotate,
        brightness: brightness
      };
    }

    function getCanvasFilter(clip, currentTime) {
      var transition = getRenderTransition(clip, currentTime);
      var brightness = (clip.brightness == null ? 1 : clip.brightness) * transition.brightness;
      var contrast = clip.contrast == null ? 1 : clip.contrast;
      var saturation = clip.saturation == null ? 1 : clip.saturation;
      var blur = (clip.blur == null ? 0 : clip.blur) + transition.blur;
      var grayscale = clip.grayscale == null ? 0 : clip.grayscale;
      var sepia = clip.sepia == null ? 0 : clip.sepia;
      return [
        "brightness(" + brightness + ")",
        "contrast(" + contrast + ")",
        "saturate(" + saturation + ")",
        "blur(" + blur + "px)",
        grayscale > 0 ? "grayscale(" + grayscale + ")" : "",
        sepia > 0 ? "sepia(" + sepia + ")" : ""
      ].filter(Boolean).join(" ");
    }

    function getMediaById(snapshot) {
      var map = new Map();
      (snapshot.mediaItemsSnapshot || []).forEach(function(item) {
        map.set(item.id, item);
      });
      return map;
    }

    function getTrackOrder(snapshot) {
      var map = new Map();
      (snapshot.tracksSnapshot || []).forEach(function(track, index) {
        map.set(track.id, index);
      });
      return map;
    }

    function buildFrameLayers(snapshot, time) {
      var mediaById = getMediaById(snapshot);
      var trackOrder = getTrackOrder(snapshot);
      return (snapshot.clipsSnapshot || [])
        .filter(function(clip) {
          return time >= clip.startTime && time <= clip.startTime + clip.duration;
        })
        .map(function(clip) {
          return {
            clip: clip,
            media: clip.mediaId ? mediaById.get(clip.mediaId) || null : null,
            trackIndex: trackOrder.has(clip.trackId) ? trackOrder.get(clip.trackId) : Number.MAX_SAFE_INTEGER
          };
        })
        .sort(function(a, b) {
          if (a.trackIndex !== b.trackIndex) return b.trackIndex - a.trackIndex;
          if (a.clip.startTime !== b.clip.startTime) return a.clip.startTime - b.clip.startTime;
          return String(a.clip.id).localeCompare(String(b.clip.id));
        });
    }

    async function loadImageBitmap(media) {
      if (!media || !media.url || typeof fetch === "undefined" || typeof createImageBitmap === "undefined") {
        return null;
      }

      if (imageCache.has(media.id)) return imageCache.get(media.id);

      try {
        var response = await fetch(media.url);
        var blob = await response.blob();
        var bitmap = await createImageBitmap(blob);
        imageCache.set(media.id, bitmap);
        return bitmap;
      } catch (error) {
        return null;
      }
    }

    function applyClipState(ctx, canvas, clip, time) {
      var motion = getRenderMotion(clip);
      var transition = getRenderTransition(clip, time);
      var boxWidth = canvas.width * (motion.width / 100);
      var boxHeight = canvas.height * (motion.height / 100);
      var centerX = canvas.width * (motion.x / 100) + canvas.width * (transition.translateX / 100);
      var centerY = canvas.height * (motion.y / 100) + canvas.height * (transition.translateY / 100);
      var totalScale = motion.scale * transition.scale;

      ctx.globalAlpha = motion.opacity * transition.opacity;
      ctx.filter = getCanvasFilter(clip, time);
      ctx.translate(centerX, centerY);
      ctx.rotate(((motion.rotation + transition.rotate) * Math.PI) / 180);
      ctx.scale(totalScale * (motion.flipX ? -1 : 1), totalScale * (motion.flipY ? -1 : 1));
      return { boxWidth: boxWidth, boxHeight: boxHeight };
    }

    function drawContain(ctx, image, sourceWidth, sourceHeight, boxWidth, boxHeight, clip) {
      var cropLeft = clamp(clip.cropLeft == null ? 0 : clip.cropLeft, 0, 90);
      var cropRight = clamp(clip.cropRight == null ? 0 : clip.cropRight, 0, 90);
      var cropTop = clamp(clip.cropTop == null ? 0 : clip.cropTop, 0, 90);
      var cropBottom = clamp(clip.cropBottom == null ? 0 : clip.cropBottom, 0, 90);
      var sourceX = sourceWidth * (cropLeft / 100);
      var sourceY = sourceHeight * (cropTop / 100);
      var croppedWidth = Math.max(1, sourceWidth - sourceX - sourceWidth * (cropRight / 100));
      var croppedHeight = Math.max(1, sourceHeight - sourceY - sourceHeight * (cropBottom / 100));
      var scale = Math.min(boxWidth / croppedWidth, boxHeight / croppedHeight);
      var width = croppedWidth * scale;
      var height = croppedHeight * scale;
      ctx.drawImage(image, sourceX, sourceY, croppedWidth, croppedHeight, -width / 2, -height / 2, width, height);
    }

    function drawText(ctx, canvas, clip, subtitle) {
      var style = clip.textStyle || {};
      var fontSize = subtitle ? Math.round(canvas.width * 0.024) : Math.round(canvas.width * 0.033);
      var text = clip.name || "";
      var x = canvas.width * ((style.x == null ? 50 : style.x) / 100);
      var y = canvas.height * ((style.y == null ? (subtitle ? 82 : 50) : style.y) / 100);
      ctx.save();
      ctx.font = "900 " + fontSize + "px sans-serif";
      ctx.textAlign = clip.textAlign || "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = style.backgroundColor || (subtitle ? "rgba(0,0,0,0.72)" : "rgba(0,0,0,0.45)");
      var metrics = ctx.measureText(text);
      var paddingX = fontSize * 0.65;
      var paddingY = fontSize * 0.42;
      ctx.fillRect(x - metrics.width / 2 - paddingX, y - fontSize / 2 - paddingY, metrics.width + paddingX * 2, fontSize + paddingY * 2);
      ctx.fillStyle = style.color || "#ffffff";
      ctx.fillText(text, x, y);
      ctx.restore();
    }

    function drawPlaceholder(ctx, canvas, clip, media, time) {
      var label = media && media.name ? media.name : clip.name || clip.type || "media";
      var gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#082f49");
      gradient.addColorStop(0.5, "#020617");
      gradient.addColorStop(1, "#312e81");
      ctx.fillStyle = gradient;
      ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      ctx.fillStyle = "#a5f3fc";
      ctx.font = "900 " + Math.max(20, Math.round(canvas.width * 0.028)) + "px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, 0, 0);
      ctx.font = "600 " + Math.max(12, Math.round(canvas.width * 0.014)) + "px sans-serif";
      ctx.fillText("Worker frame " + time.toFixed(2) + "s", 0, Math.max(24, canvas.height * 0.05));
    }

    function drawVisualizer(ctx, canvas, clip, time) {
      var elapsed = Math.max(0, time - clip.startTime);
      var count = 56;
      var width = canvas.width * 0.74;
      var gap = width / count;
      var x0 = -width / 2;
      ctx.fillStyle = clip.visualizerBackgroundColor || "#050507";
      ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      ctx.strokeStyle = clip.visualizerAccentColor || "#ff4fd8";
      ctx.lineWidth = Math.max(2, gap * 0.42);
      for (var i = 0; i < count; i += 1) {
        var pulse = Math.abs(Math.sin(elapsed * 4.4 + i * 0.28));
        var h = Math.max(4, canvas.height * (0.05 + pulse * 0.22));
        var x = x0 + i * gap;
        ctx.beginPath();
        ctx.moveTo(x, -h / 2);
        ctx.lineTo(x, h / 2);
        ctx.stroke();
      }
    }

    async function drawFrame(canvas, ctx, snapshot, time) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.filter = "none";
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      var layers = buildFrameLayers(snapshot, time);
      for (var i = 0; i < layers.length; i += 1) {
        var layer = layers[i];
        var clip = layer.clip;
        var media = layer.media;

        if (clip.type === "text" || clip.type === "subtitle") {
          drawText(ctx, canvas, clip, clip.type === "subtitle");
          continue;
        }

        ctx.save();
        var box = applyClipState(ctx, canvas, clip, time);

        if (clip.type === "visualizer") {
          drawVisualizer(ctx, { width: box.boxWidth, height: box.boxHeight }, clip, time);
          ctx.restore();
          continue;
        }

        if (media && media.type === "image") {
          var bitmap = await loadImageBitmap(media);
          if (bitmap) {
            drawContain(ctx, bitmap, bitmap.width, bitmap.height, box.boxWidth, box.boxHeight, clip);
            ctx.restore();
            continue;
          }
        }

        drawPlaceholder(ctx, { width: box.boxWidth, height: box.boxHeight }, clip, media, time);
        ctx.restore();
      }
    }

    async function canEncodeConfig(snapshot) {
      if (typeof VideoEncoder === "undefined") {
        return { supported: false, reason: "Worker에서 VideoEncoder를 지원하지 않습니다." };
      }

      if (typeof VideoFrame === "undefined") {
        return { supported: false, reason: "Worker에서 VideoFrame을 지원하지 않습니다." };
      }

      try {
        var support = await VideoEncoder.isConfigSupported({
          codec: "vp8",
          width: snapshot.width,
          height: snapshot.height,
          bitrate: snapshot.bitrate,
          framerate: snapshot.fps,
          bitrateMode: "variable"
        });

        if (!support.supported) {
          return { supported: false, reason: "Worker WebCodecs target config를 지원하지 않습니다." };
        }

        return { supported: true };
      } catch (error) {
        return { supported: false, reason: "Worker WebCodecs config 검사 중 오류가 발생했습니다." };
      }
    }

    function concatBytes(parts) {
      var total = parts.reduce(function(sum, item) { return sum + item.length; }, 0);
      var bytes = new Uint8Array(total);
      var offset = 0;
      for (var i = 0; i < parts.length; i += 1) {
        bytes.set(parts[i], offset);
        offset += parts[i].length;
      }
      return bytes;
    }

    function idBytes(hex) {
      var clean = hex.replace(/\\s+/g, "");
      var bytes = new Uint8Array(clean.length / 2);
      for (var index = 0; index < clean.length; index += 2) {
        bytes[index / 2] = parseInt(clean.slice(index, index + 2), 16);
      }
      return bytes;
    }

    function encodeSize(size) {
      for (var length = 1; length <= 8; length += 1) {
        var max = Math.pow(2, 7 * length) - 2;
        if (size <= max) {
          var bytes = new Uint8Array(length);
          var value = size;
          for (var index = length - 1; index >= 0; index -= 1) {
            bytes[index] = value & 0xff;
            value = Math.floor(value / 256);
          }
          bytes[0] |= 1 << (8 - length);
          return bytes;
        }
      }
      throw new Error("WebM element is too large.");
    }

    function unsignedInt(value) {
      if (value === 0) return new Uint8Array([0]);
      var bytes = [];
      var next = value;
      while (next > 0) {
        bytes.unshift(next & 0xff);
        next = Math.floor(next / 256);
      }
      return new Uint8Array(bytes);
    }

    function float64(value) {
      var buffer = new ArrayBuffer(8);
      new DataView(buffer).setFloat64(0, value, false);
      return new Uint8Array(buffer);
    }

    function textBytes(value) {
      return new TextEncoder().encode(value);
    }

    function element(id, data) {
      return concatBytes([idBytes(id), encodeSize(data.length), data]);
    }

    function uintElement(id, value) {
      return element(id, unsignedInt(value));
    }

    function stringElement(id, value) {
      return element(id, textBytes(value));
    }

    function floatElement(id, value) {
      return element(id, float64(value));
    }

    function simpleBlock(frame) {
      var relativeTime = Math.max(-32768, Math.min(32767, frame.timestampMs));
      var blockHeader = new Uint8Array(4);
      blockHeader[0] = 0x81;
      blockHeader[1] = (relativeTime >> 8) & 0xff;
      blockHeader[2] = relativeTime & 0xff;
      blockHeader[3] = frame.keyFrame ? 0x80 : 0x00;
      return element("A3", concatBytes([blockHeader, frame.data]));
    }

    function createCluster(timecode, frames) {
      var blocks = frames.map(function(frame) {
        return simpleBlock({
          data: frame.data,
          keyFrame: frame.keyFrame,
          timestampMs: frame.timestampMs - timecode
        });
      });
      return element("1F43B675", concatBytes([uintElement("E7", timecode)].concat(blocks)));
    }

    function createWebmBlob(frames, width, height, duration) {
      var ebmlHeader = element(
        "1A45DFA3",
        concatBytes([
          uintElement("4286", 1),
          uintElement("42F7", 1),
          uintElement("42F2", 4),
          uintElement("42F3", 8),
          stringElement("4282", "webm"),
          uintElement("4287", 4),
          uintElement("4285", 2)
        ])
      );
      var info = element(
        "1549A966",
        concatBytes([
          uintElement("2AD7B1", 1000000),
          stringElement("4D80", "CreAibox Video Studio Worker"),
          stringElement("5741", "CreAibox Worker WebCodecs Exporter"),
          floatElement("4489", duration)
        ])
      );
      var video = element("E0", concatBytes([uintElement("B0", width), uintElement("BA", height)]));
      var trackEntry = element(
        "AE",
        concatBytes([
          uintElement("D7", 1),
          uintElement("73C5", 1),
          uintElement("83", 1),
          stringElement("86", "V_VP8"),
          stringElement("536E", "Worker WebCodecs Video"),
          video
        ])
      );
      var tracks = element("1654AE6B", trackEntry);
      var groupedFrames = new Map();

      for (var i = 0; i < frames.length; i += 1) {
        var frame = frames[i];
        var clusterTimecode = Math.floor(frame.timestampMs / 30000) * 30000;
        var group = groupedFrames.get(clusterTimecode) || [];
        group.push(frame);
        groupedFrames.set(clusterTimecode, group);
      }

      var clusters = Array.from(groupedFrames.entries()).map(function(entry) {
        return createCluster(entry[0], entry[1]);
      });
      var segment = element("18538067", concatBytes([info, tracks].concat(clusters)));
      return new Blob([concatBytes([ebmlHeader, segment])], { type: "video/webm" });
    }

    function safeFileName(value) {
      return (value || "creaibox-video")
        .replace(/[\\\\/:*?"<>|]/g, "")
        .replace(/\\s+/g, "-")
        .slice(0, 80);
    }

    async function runWorkerEncode(jobId, snapshot) {
      var canvas = new OffscreenCanvas(snapshot.width, snapshot.height);
      var ctx = canvas.getContext("2d");
      if (!ctx) {
        return { fallback: true, reason: "Worker OffscreenCanvas 2D context를 생성하지 못했습니다." };
      }

      var fps = Math.max(1, snapshot.fps || 30);
      var totalFrames = snapshot.totalFrames || Math.ceil((snapshot.duration || 0) * fps);
      var frameDurationUs = Math.round(1000000 / fps);
      var frames = [];
      var encoderError = null;
      var encoder = new VideoEncoder({
        output: function(chunk) {
          var data = new Uint8Array(chunk.byteLength);
          chunk.copyTo(data);
          frames.push({
            data: data,
            timestampMs: Math.round(chunk.timestamp / 1000),
            keyFrame: chunk.type === "key"
          });
        },
        error: function(error) {
          encoderError = error;
        }
      });

      encoder.configure({
        codec: "vp8",
        width: snapshot.width,
        height: snapshot.height,
        bitrate: snapshot.bitrate,
        framerate: fps
      });

      try {
        for (var frame = 0; frame <= totalFrames; frame += 1) {
          if (cancelledJobs.has(jobId)) {
            postCancel(jobId, "Worker WebCodecs encode가 취소되었습니다.");
            return { cancelled: true, renderedFrames: frame, totalFrames: totalFrames };
          }

          var time = frame / fps;
          await drawFrame(canvas, ctx, snapshot, time);
          var videoFrame = new VideoFrame(canvas, {
            timestamp: Math.round(time * 1000000),
            duration: frameDurationUs
          });

          encoder.encode(videoFrame, {
            keyFrame: frame % Math.max(1, fps * 2) === 0
          });
          videoFrame.close();

          if (encoderError) throw encoderError;

          if (frame % 10 === 0 || frame === totalFrames) {
            var progress = Math.min(95, Math.round((frame / Math.max(totalFrames, 1)) * 95));
            postProgress(jobId, progress, "Worker WebCodecs 인코딩 중 " + progress + "%");
            await new Promise(function(resolve) { setTimeout(resolve, 0); });
          }
        }

        await encoder.flush();
        if (encoderError) throw encoderError;

        return {
          blob: createWebmBlob(frames, snapshot.width, snapshot.height, snapshot.duration || 0),
          fileName: safeFileName(snapshot.projectTitle) + "-worker-webcodecs.webm",
          renderedFrames: totalFrames + 1,
          totalFrames: totalFrames
        };
      } catch (error) {
        return {
          fallback: true,
          renderedFrames: frames.length,
          totalFrames: totalFrames,
          reason: error && error.message ? error.message : "Worker WebCodecs encode 중 오류가 발생했습니다."
        };
      } finally {
        if (encoder.state !== "closed") {
          encoder.close();
        }
      }
    }

    async function runOffscreenRenderLoop(jobId, snapshot, renderMode) {
      var canvas = new OffscreenCanvas(snapshot.width, snapshot.height);
      var ctx = canvas.getContext("2d");
      if (!ctx) {
        return { renderedFrames: 0, totalFrames: 0, reason: "Worker OffscreenCanvas 2D context를 생성하지 못했습니다." };
      }

      var fps = Math.max(1, snapshot.fps || 30);
      var totalFrames = snapshot.totalFrames || Math.ceil((snapshot.duration || 0) * fps);
      var frameLimit = renderMode === "full" ? totalFrames : Math.min(12, totalFrames);
      var frameDuration = 1 / fps;

      for (var frame = 0; frame <= frameLimit; frame += 1) {
        if (cancelledJobs.has(jobId)) {
          postCancel(jobId, "Worker render loop가 취소되었습니다.");
          return { renderedFrames: frame, totalFrames: totalFrames, cancelled: true };
        }

        await drawFrame(canvas, ctx, snapshot, frame * frameDuration);

        if (frame % 3 === 0 || frame === frameLimit) {
          var loopProgress = frameLimit <= 0 ? 1 : frame / frameLimit;
          postProgress(
            jobId,
            8 + Math.round(loopProgress * 12),
            "Worker OffscreenCanvas frame loop " + frame + "/" + frameLimit
          );
          await new Promise(function(resolve) { setTimeout(resolve, 0); });
        }
      }

      return { renderedFrames: frameLimit + 1, totalFrames: totalFrames };
    }

    async function handleStart(message) {
      var snapshot = message.snapshot;
      var renderMode = message.renderMode || "probe";
      activeJobId = message.jobId;
      cancelledJobs.delete(message.jobId);

      if (!snapshot) {
        postError(message.jobId, "RenderJobSnapshot이 없어 Worker export를 시작할 수 없습니다.");
        return;
      }

      postProgress(message.jobId, 1, "WebCodecs Worker가 snapshot을 수신했습니다.");

      if (cancelledJobs.has(message.jobId)) {
        postCancel(message.jobId, "Worker export가 취소되었습니다.");
        return;
      }

      if (typeof OffscreenCanvas === "undefined") {
        postComplete(message.jobId, true, "Worker에서 OffscreenCanvas를 지원하지 않아 main-thread WebCodecs로 fallback합니다.", false, 0, snapshot.totalFrames || 0);
        return;
      }

      postProgress(message.jobId, 3, "Worker OffscreenCanvas 환경을 확인했습니다.");

      var configSupport = await canEncodeConfig(snapshot);
      if (!configSupport.supported) {
        postComplete(message.jobId, true, configSupport.reason, false, 0, snapshot.totalFrames || 0);
        return;
      }

      if (cancelledJobs.has(message.jobId)) {
        postCancel(message.jobId, "Worker export가 취소되었습니다.");
        return;
      }

      postProgress(message.jobId, 5, "Worker WebCodecs target config를 확인했습니다.");

      if (renderMode === "full") {
        postProgress(message.jobId, 6, "Worker WebCodecs 인코딩을 시작합니다.");
        var encoded = await runWorkerEncode(message.jobId, snapshot);
        if (encoded.cancelled) return;
        if (encoded.blob) {
          postComplete(
            message.jobId,
            false,
            "Worker OffscreenCanvas render output을 WebCodecs로 인코딩했습니다.",
            true,
            encoded.renderedFrames,
            encoded.totalFrames,
            encoded.blob,
            encoded.fileName
          );
          return;
        }

        postComplete(
          message.jobId,
          true,
          encoded.reason || "Worker WebCodecs encode 실패로 main-thread fallback합니다.",
          true,
          encoded.renderedFrames || 0,
          encoded.totalFrames || snapshot.totalFrames || 0
        );
        return;
      }

      var renderLoop = await runOffscreenRenderLoop(message.jobId, snapshot, renderMode);
      if (renderLoop.cancelled) return;

      postComplete(
        message.jobId,
        true,
        renderMode === "full"
          ? "Worker frame loop는 완료됐지만 WebCodecs 인코딩 연결은 다음 단계에서 처리합니다."
          : "Worker frame loop probe를 완료했습니다. 현재 export 인코딩은 main-thread WebCodecs로 이어갑니다.",
        true,
        renderLoop.renderedFrames,
        renderLoop.totalFrames
      );
    }

    self.onmessage = function(event) {
      var message = event.data;
      if (!message || !message.type) return;

      if (message.type === "cancel") {
        cancelledJobs.add(message.jobId);
        if (activeJobId === message.jobId) {
          postCancel(message.jobId, "Worker cancel 요청을 수신했습니다.");
        }
        return;
      }

      if (message.type === "start") {
        handleStart(message).catch(function(error) {
          postError(message.jobId, error && error.message ? error.message : "Worker export 처리 중 오류가 발생했습니다.");
        });
      }
    };
  `;
  const blob = new Blob([source], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);

  try {
    return {
      worker: new Worker(url),
      url,
    };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}
