import { ICooldown } from '../types/interfaces';

export class CooldownManager {
  private cooldowns: Map<string, ICooldown> = new Map();
  
  startCooldown(skillId: string, duration: number) {
    this.cooldowns.set(skillId, {
      skillId,
      remaining: duration,
      total: duration
    });
  }
  
  update(delta: number) {
    this.cooldowns.forEach((cd, id) => {
      cd.remaining -= delta;
      if (cd.remaining <= 0) {
        this.cooldowns.delete(id);
      }
    });
  }
  
  isReady(skillId: string): boolean {
    return !this.cooldowns.has(skillId);
  }
  
  getRemaining(skillId: string): number {
    return this.cooldowns.get(skillId)?.remaining ?? 0;
  }
  
  getProgress(skillId: string): number {
    const cd = this.cooldowns.get(skillId);
    if (!cd) return 1;
    return 1 - (cd.remaining / cd.total);
  }
}
