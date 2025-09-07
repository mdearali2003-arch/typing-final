
export type TestStatus = 'waiting' | 'running' | 'finished';
export type Language = 'en' | 'bn';

export interface TestResult {
  id: string;
  wpm: number;
  accuracy: number;
  correctWords: number;
  wrongWords: number;
  keystrokes: number;
  correctChars: number;
  totalChars: number;
  duration: number;
  date: number;
  language: Language;
}
