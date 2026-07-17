export interface Exam {
  id: string;
  title: string;
  duration_minutes: number;
}

export interface Question {
  id: number;
  question_text: string;
  options: string[];
}
