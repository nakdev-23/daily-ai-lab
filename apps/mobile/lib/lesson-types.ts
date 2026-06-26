// Mirrors apps/web/lib/lesson-types.ts so bundled lesson JSON type-checks here.
export type BodyPart = { text: string; bold?: boolean };

export type LessonMascot =
  | 'mascot-read'
  | 'mascot-point'
  | 'mascot-think'
  | 'mascot-celebrate'
  | 'mascot-thumbsup'
  | 'mascot-wave'
  | 'mascot-laptop'
  | 'mascot-hello';

export type TheoryStep = {
  type: 'theory';
  tag: string;
  title: string;
  body: BodyPart[];
  example: string;
  mascot: LessonMascot;
};

export type QuizStep = {
  type: 'quiz';
  tag: string;
  question: string;
  options: { text: string; correct?: boolean }[];
  correctFeedback?: string;
  incorrectFeedback?: string;
};

export type PracticeCheck = {
  anyOf?: string[];
  minWords?: number;
  filledAfter?: string[];
  filledAfterAll?: string[];
  minChars?: number;
};

export type PracticeStep = {
  type: 'practice';
  tag: string;
  title: string;
  instruction: string;
  payoff?: string;
  starterPrompt: string;
  requirements: string[];
  checks?: PracticeCheck[];
  minLength?: number;
};

export type SetupStep = {
  type: 'setup';
  tag: string;
  title: string;
  instruction: string;
  steps: string[];
  command?: string;
  href?: string;
  hrefLabel?: string;
};

export type TryStep = {
  type: 'try';
  tag: string;
  title: string;
  instruction: string;
  example: string;
  checks: string[];
};

export type DoneStep = { type: 'done' };

export type LessonStep =
  | TheoryStep
  | QuizStep
  | PracticeStep
  | SetupStep
  | TryStep
  | DoneStep;
