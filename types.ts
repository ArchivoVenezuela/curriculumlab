export interface Pillar {
  id: number;
  title: string;
  description: string;
}

export interface Variation {
  id: number;
  title: string;
  focus: string; // e.g., "Enfoque para principiantes", "Reto de 7 días"
}

export interface QuizOption {
  text: string;
  label: string; // a, b, c
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correctLabel: string; // 'a', 'b', or 'c'
}

export interface CourseModule {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  keyPoints: string[];
  visualPrompt: string; // Description for the image
  quiz: QuizQuestion[];
}

export interface Course {
  title: string;
  description: string;
  targetAudience: string;
  learningObjectives: string[];
  colorPalette: string;
  modules: CourseModule[];
}

export enum AppStep {
  TOPIC_INPUT = 1,
  PILLAR_SELECTION = 2,
  VARIATION_SELECTION = 3,
  COURSE_VIEW = 4
}

export type AppMode = "demo" | "explore" | "ai";