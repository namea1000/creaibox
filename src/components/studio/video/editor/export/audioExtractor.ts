import { BlobSource, Input, AudioBufferSink, ALL_FORMATS } from "mediabunny";

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function createWavHeader(numChannels: number, sampleRate: number, totalSamples: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
  const byteLength = totalSamples * numChannels * 2; // 16-bit PCM (2 bytes)

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + byteLength, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM = 1
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true); // 16-bit
  writeString(view, 36, "data");
  view.setUint32(40, byteLength, true);

  return buffer;
}

/**
 * Extracts the primary audio track from a video File or Blob using Mediabunny.
 * Processes frame-by-frame using WebCodecs (AudioDecoder) to keep memory usage flat and low.
 * Returns a standard 16-bit PCM WAV Blob.
 */
export async function extractAudioWithMediabunny(fileOrBlob: File | Blob): Promise<Blob | null> {
  console.log("[AudioExtractor] Starting mediabunny audio extraction for file size:", fileOrBlob.size);
  const source = new BlobSource(fileOrBlob);
  const input = new Input({ source, formats: ALL_FORMATS });
  
  try {
    const audioTrack = await input.getPrimaryAudioTrack();
    if (!audioTrack) {
      console.log("[AudioExtractor] No audio track found in this video file:", fileOrBlob.size);
      return null;
    }

    const numChannels = await audioTrack.getNumberOfChannels();
    const sampleRate = await audioTrack.getSampleRate();
    console.log(`[AudioExtractor] Audio track detected: channels=${numChannels}, sampleRate=${sampleRate}`);

    const sink = new AudioBufferSink(audioTrack);
    const chunks: Uint8Array[] = [];
    let totalSamples = 0;

    for await (const wrapped of sink.buffers()) {
      const buffer = wrapped.buffer;
      const length = buffer.length;
      const channels: Float32Array[] = [];
      for (let c = 0; c < numChannels; c++) {
        channels.push(buffer.getChannelData(c));
      }

      // Convert to Interleaved 16-bit PCM
      const pcmData = new Int16Array(length * numChannels);
      let index = 0;
      for (let s = 0; s < length; s++) {
        for (let c = 0; c < numChannels; c++) {
          let sample = channels[c][s];
          if (sample > 1) sample = 1;
          else if (sample < -1) sample = -1;
          pcmData[index++] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        }
      }

      chunks.push(new Uint8Array(pcmData.buffer, pcmData.byteOffset, pcmData.byteLength));
      totalSamples += length;
    }

    console.log(`[AudioExtractor] Extracted total samples: ${totalSamples}`);
    const wavHeader = createWavHeader(numChannels, sampleRate, totalSamples);
    return new Blob([wavHeader, ...chunks as any[]], { type: "audio/wav" });
  } finally {
    input.dispose();
  }
}
