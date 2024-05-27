interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

export interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

interface Result {
  quizId: number;
  userId: string;
  score: number;
  answers: { questionId: number; answerId: number }[];
}
