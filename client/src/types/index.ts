export * from '@fieldnote/shared';

export type AppView =
  | 'home'
  | 'setup'
  | 'reveal'
  | 'field'
  | 'return'
  | 'reflect'
  | 'archive';

export type FieldCategory = 'science' | 'community' | 'everyday';

export interface FieldCategoryMeta {
  id: FieldCategory;
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  accentColor: string;
  topics: string[];
}

export interface FieldSetupPreferences {
  durationMinutes: 10 | 20 | 30;
  intention: 'notice' | 'explore' | 'understand' | 'create' | 'surprise';
  category?: FieldCategory;
}

export interface FieldTimerState {
  secondsElapsed: number;
  targetSeconds: number;
  isRunning: boolean;
  phoneAwayComplied: boolean;
}
