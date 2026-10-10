export * from '@fieldnote/shared';

export type AppView =
  | 'home'
  | 'categories'
  | 'setup'
  | 'reveal'
  | 'field'
  | 'return'
  | 'reflect'
  | 'archive'
  | 'detail';

export type FieldCategory = 'science' | 'community' | 'everyday' | 'edge';

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
  optionalFocus?: string;
}

export interface FieldTimerState {
  secondsElapsed: number;
  targetSeconds: number;
  isRunning: boolean;
  phoneAwayComplied: boolean;
}
