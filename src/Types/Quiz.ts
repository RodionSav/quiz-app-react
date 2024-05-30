export interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

export interface Quiz {
  id: number;
  title: string;
  questions: Question[];
  isFinished: boolean;
}

export interface User {
  id: number;
  name: string;
  correctAnswersAmount: number;
}
