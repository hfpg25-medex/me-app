export const STEPS = {
  SUBMISSION: "submission",
  SUMMARY: "summary",
} as const;

export type StepType = (typeof STEPS)[keyof typeof STEPS];
