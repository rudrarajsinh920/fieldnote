export * from '@fieldnote/shared';

export type AppView =
  | 'home'
  | 'setup'
  | 'reveal'
  | 'field'
  | 'return'
  | 'reflect'
  | 'archive';

export interface FieldSetupPreferences {
  durationMinutes: 10 | 20 | 30;
  intention: 'notice' | 'explore' | 'understand' | 'create' | 'surprise';
}

export interface FieldTimerState {
  secondsElapsed: number;
  targetSeconds: number;
  isRunning: boolean;
  phoneAwayComplied: boolean;
}
