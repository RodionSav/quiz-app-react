import { createSlice } from '@reduxjs/toolkit';
import { Quiz } from '../../Types/Quiz';

const storedQuizzes = localStorage.getItem('quizzes');

type QuizState = {
  items: Quiz[],
}

const initialState: QuizState = {
  items: storedQuizzes ? JSON.parse(storedQuizzes) : [],
}

const saveToLocalStorage = (state: QuizState) => {
  localStorage.setItem('quizzes', JSON.stringify(state.items));
};

const quizzesState = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      state.items.push(action.payload);
      saveToLocalStorage(state);
    },
    deleteQuizzes: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
      saveToLocalStorage(state);
    },
    addQuestion: (state, action) => {
      const { quizId, newQuestion } = action.payload;

      const quiz = state.items.find(q => q.id === parseInt(quizId));

      if (quiz) {
        quiz.questions.push(newQuestion);
        saveToLocalStorage(state);
      } else {
        console.error(`Quiz not found for ID: ${quizId}`);
      }
    },
    deleteQuestion: (state, action) => {
      const { quizId, questionId } = action.payload;

      const quiz = state.items.find(q => q.id === parseInt(quizId));

      if (quiz) {
        quiz.questions = quiz.questions.filter(q => q.id !== questionId);
        saveToLocalStorage(state);
      } else {
        console.error(`Quiz not found for ID: ${quizId}`);
      }
    },
    addAnswer: (state, action) => {
      const { quizId, questionId, newAnswer } = action.payload;

      const quiz = state.items.find(q => q.id === parseInt(quizId));

      const question = quiz?.questions.find((question) => question.id === questionId);

      question?.answers.push(newAnswer);
      saveToLocalStorage(state);
    },
    deleteAnswer: (state, action) => {
      const { quizId, questionId, answerId } = action.payload;
      const quiz = state.items.find(q => q.id === parseInt(quizId));
      const question = quiz?.questions.find(question => question.id === questionId);
      if (question) {
        question.answers = question.answers.filter(answer => answer.id !== answerId);
        saveToLocalStorage(state);
      }
    },
    addCorrectAnswer: (state, action) => {
      const { quizId, questionId, answerId } = action.payload;
      const quiz = state.items.find(quiz => quiz.id === Number(quizId));
      const question = quiz?.questions.find(q => q.id === questionId);
      const answer = question?.answers.find(answer => answer.id === answerId);

      if (answer) {
        answer.isCorrect = !answer.isCorrect;
      }
    },
  }
});

export const {
  setQuizzes,
  deleteQuizzes,
  addQuestion,
  deleteQuestion,
  addAnswer,
  deleteAnswer,
  addCorrectAnswer
} = quizzesState.actions;

export default quizzesState.reducer;
