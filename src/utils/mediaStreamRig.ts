/**
 * Real-Time MediaStream Stream Interception & Oscilloscope Engine
 * Provides live audio stream acquisition, track disabling, and real-time canvas frequency visualization.
 */

export class MediaStreamInterceptionRig {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private currentStream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private isMuted: boolean = false;

  /**
   * Requests real microphone access via W3C Web API and attaches real-time analyser node
   */
  public async startMicrophoneProbe(canvas: HTMLCanvasElement, onVolumeUpdate?: (db: number) => void): Promise<boolean> {
    try {
      this.stop();

      // Request real browser audio track
      this.currentStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        },
        video: false
      });

      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      this.source = this.audioCtx.createMediaStreamSource(this.currentStream);
      this.source.connect(this.analyser);

      this.renderOscilloscope(canvas, onVolumeUpdate);
      return true;
    } catch (err) {
      console.warn('Microphone probe unavailable or permission denied:', err);
      return false;
    }
  }

  /**
   * Applies immediate hardware/stream level mute by disabling tracks and zeroing buffers
   */
  public setHardwareMute(muted: boolean) {
    this.isMuted = muted;
    if (this.currentStream) {
      this.currentStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }
  }

  /**
   * Renders the real-time oscilloscope onto the target canvas
   */
  private renderOscilloscope(canvas: HTMLCanvasElement, onVolumeUpdate?: (db: number) => void) {
    const ctx = canvas.getContext('2d');
    if (!ctx || !this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      this.animFrameId = requestAnimationFrame(draw);

      if (this.isMuted) {
        // Flatline visualization when muted
        dataArray.fill(128);
        if (onVolumeUpdate) onVolumeUpdate(-100);
      } else {
        this.analyser!.getByteTimeDomainData(dataArray);

        // Compute RMS dB
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const val = (dataArray[i] - 128) / 128;
          sum += val * val;
        }
        const rms = Math.sqrt(sum / bufferLength);
        const db = rms > 0 ? Math.max(-100, Math.min(0, 20 * Math.log10(rms))) : -100;
        if (onVolumeUpdate) onVolumeUpdate(Math.round(db));
      }

      ctx.fillStyle = '#060B14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = this.isMuted ? '#EF4444' : '#06B6D4';
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  }

  /**
   * Completely terminates all active media streams and closes AudioContext
   */
  public stop() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.currentStream) {
      this.currentStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.currentStream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }
}

export const mediaRig = new MediaStreamInterceptionRig();
