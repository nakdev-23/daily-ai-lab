export type BodyPart = { text: string; bold?: boolean }

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
    }
  | { type: "done" }
