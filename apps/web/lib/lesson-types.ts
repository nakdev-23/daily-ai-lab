export type BodyPart = { text: string; bold?: boolean }

/** Good-vs-bad prompt reference for a practice step (see `practice.examples`). */
export type PromptExample = {
  /** A weak version of THIS task's prompt. */
  bad: string
  /** A strong version of THIS task's prompt. */
  good: string
  /** Why the weak one falls short. */
  badNote?: string
  /** Why the strong one works. */
  goodNote?: string
}

export type LessonMascot =
  | "mascot-read"
  | "mascot-point"
  | "mascot-think"
  | "mascot-celebrate"
  | "mascot-thumbsup"
  | "mascot-wave"
  | "mascot-laptop"
  | "mascot-hello"

export type LessonStep =
  | {
      type: "theory"
      tag: string
      title: string
      body: BodyPart[]
      example: string
      mascot: LessonMascot
    }
  | {
      type: "quiz"
      tag: string
      question: string
      options: { text: string; correct?: boolean }[]
      correctFeedback?: string
      incorrectFeedback?: string
    }
  | {
      type: "practice"
      tag: string
      title: string
      instruction: string
      /** Optional one-liner: what the learner walks away with after doing this. */
      payoff?: string
      /**
       * Optional good-vs-bad reference shown above the editor so learners see what
       * a weak prompt and a strong prompt look like for THIS task. If omitted, the
       * player shows a universal prompt-writing example.
       */
      examples?: PromptExample
      starterPrompt: string
      requirements: string[]
      /**
       * Optional per-requirement heuristic so the instant checklist reflects real
       * progress (not just "typed something"). Parallel to `requirements`:
       * a requirement is "met" when the draft differs from the starter and — if
       * `filledAfter` is given — has meaningful text after at least one of those
       * labels; `filledAfterAll` requires every listed label to be filled.
       * `anyOf` remains for legacy lessons only. AI review (Pro) does the deep check.
       */
      checks?: {
        anyOf?: string[]
        minWords?: number
        filledAfter?: string[]
        filledAfterAll?: string[]
        minChars?: number
      }[]
      minLength?: number
    }
  | {
      type: "setup"
      tag: string
      title: string
      instruction: string
      steps: string[]
      command?: string
      href?: string
      hrefLabel?: string
    }
  | {
      type: "try"
      tag: string
      title: string
      instruction: string
      example: string
      checks: string[]
    }
  | { type: "done" }
