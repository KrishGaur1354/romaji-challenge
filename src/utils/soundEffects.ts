// Simple sound effects using Web Audio API
class SoundEffects {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Check if user has enabled sounds (default: true)
    const savedPreference = localStorage.getItem('soundsEnabled');
    this.enabled = savedPreference !== 'false';
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('soundsEnabled', enabled.toString());
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  // Play a correct answer sound (happy chime)
  public playCorrect() {
    if (!this.enabled) return;
    
    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      
      // Play a pleasant melody: C5 -> E5 -> G5
      const notes = [523.25, 659.25, 783.99];
      const duration = 0.1;
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, ctx.currentTime + i * duration);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * duration + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (i + 1) * duration);
        
        osc.start(ctx.currentTime + i * duration);
        osc.stop(ctx.currentTime + (i + 1) * duration);
      });
    } catch (error) {
      console.error('Error playing correct sound:', error);
    }
  }

  // Play an incorrect answer sound (gentle buzz)
  public playIncorrect() {
    if (!this.enabled) return;
    
    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sawtooth';
      oscillator.frequency.value = 200;

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    } catch (error) {
      console.error('Error playing incorrect sound:', error);
    }
  }

  // Play an achievement sound (fanfare)
  public playAchievement() {
    if (!this.enabled) return;
    
    try {
      const ctx = this.getAudioContext();
      
      // Play a triumphant melody
      const notes = [523.25, 659.25, 783.99, 1046.50];
      const duration = 0.15;
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, ctx.currentTime + i * duration);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * duration + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (i + 1) * duration);
        
        osc.start(ctx.currentTime + i * duration);
        osc.stop(ctx.currentTime + (i + 1) * duration);
      });
    } catch (error) {
      console.error('Error playing achievement sound:', error);
    }
  }

  // Play a button click sound
  public playClick() {
    if (!this.enabled) return;
    
    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = 800;

      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (error) {
      console.error('Error playing click sound:', error);
    }
  }

  // Play a whoosh sound for transitions
  public playWhoosh() {
    if (!this.enabled) return;
    
    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);

      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.error('Error playing whoosh sound:', error);
    }
  }
}

export const soundEffects = new SoundEffects();

