/**
 * Soothing Web Audio API chime for prayer notifications.
 * Safe to call; handles browser autoplay policies gracefully.
 */

export function playSereneChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    
    // Create harmonious dual-tone chime (528 Hz - Solfeggio frequency + harmonics)
    const tones = [528, 660, 792];
    
    tones.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);

      gain.gain.setValueAtTime(0, now + idx * 0.15);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 1.3);
    });
  } catch (err) {
    console.warn('Audio chime playback was prevented or not supported', err);
  }
}
