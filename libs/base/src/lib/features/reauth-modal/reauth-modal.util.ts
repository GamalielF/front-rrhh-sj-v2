export function formatCountdownTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export class CountdownTimer {
  private timerId: ReturnType<typeof setInterval> | null = null;

  start(
    initialSeconds: number,
    onTick: (currentSeconds: number) => void,
    onTimeout: () => void
  ): void {
    this.stop();
    if (initialSeconds <= 0) return;

    let remaining = initialSeconds;
    this.timerId = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        onTick(remaining);
      } else {
        this.stop();
        onTimeout();
      }
    }, 1000);
  }

  stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
