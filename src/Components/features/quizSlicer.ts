import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Answer, Question, Quiz } from "../../Types/Quiz";

const fetchQuizzesFromLocalStorage = () => {
  return new Promise<Quiz[]>((resolve) => {
    setTimeout(() => {
      const storedQuizzes = localStorage.getItem("quizzes");
      resolve(storedQuizzes ? JSON.parse(storedQuizzes) : []);
    }, 1000);
  });
};

const saveQuizzesToLocalStorage = (quizzes: Quiz[]) => {
  return new Promise<Quiz[]>((resolve) => {
    setTimeout(() => {
      localStorage.setItem("quizzes", JSON.stringify(quizzes));
      resolve(quizzes);
    }, 500);
  });
};

export const fetchQuizzes = createAsyncThunk<Quiz[]>(
  "quizzes/fetchQuizzes",
  async () => {
    const quizzes = await fetchQuizzesFromLocalStorage();
    return quizzes;
  }
);

export const saveQuizzes = createAsyncThunk(
  "quizzes/saveQuizzes",
  async (newQuiz: Quiz, { getState }) => {
    const state = getState() as { quizzes: QuizState };
    const existingQuizzes = state.quizzes.items;
    const updatedQuizzes = [...existingQuizzes, newQuiz];
    const savedQuizzes = await saveQuizzesToLocalStorage(updatedQuizzes);
    return savedQuizzes;
  }
);

export const deleteQuiz = createAsyncThunk(
  "quizzes/deleteQuiz",
  async (quizId: number, { getState }) => {
    const state = getState() as { quizzes: QuizState };
    const existingQuizzes = state.quizzes.items;
    const updatedQuizzes = existingQuizzes.filter((quiz) => quiz.id !== quizId);
    const savedQuizzes = await saveQuizzesToLocalStorage(updatedQuizzes);
    return savedQuizzes;
  }
);

export const addQuestionInit = createAsyncThunk(
  "quizzes/addQuestion",
  async (
    { quizId, newQuestion }: { quizId: number; newQuestion: Question },
    { getState }
  ) => {
    const state = getState() as { quizzes: QuizState };
    const existingQuizzes = state.quizzes.items;
    const updatedQuizzes = existingQuizzes.map((quiz) => {
      if (quiz.id === quizId) {
        return {
          ...quiz,
          questions: [...quiz.questions, newQuestion],
        };
      }
      return quiz;
    });
    const savedQuizzes = await saveQuizzesToLocalStorage(updatedQuizzes);
    return savedQuizzes;
  }
);

export const deleteQuestionInit = createAsyncThunk(
  "quizzes/deleteQuestion",
  async (
    { quizId, questionId }: { quizId: number; questionId: number },
    { getState }
  ) => {
    const state = getState() as { quizzes: QuizState };
    const existingQuizzes = state.quizzes.items;
    const updatedQuizzes = existingQuizzes.map((quiz) => {
      if (quiz.id === quizId) {
        return {
          ...quiz,
          questions: quiz.questions.filter(
            (question) => question.id !== questionId
          ),
        };
      }
      return quiz;
    });
    const savedQuizzes = await saveQuizzesToLocalStorage(updatedQuizzes);
    return savedQuizzes;
  }
);

export const addAnswerInit = createAsyncThunk(
  "quizzes/addAnswer",
  async (
    {
      quizId,
      questionId,
      newAnswer,
    }: { quizId: number; questionId: number; newAnswer: Answer },
    { getState }
  ) => {
    const state = getState() as { quizzes: QuizState };
    const existingQuizzes = state.quizzes.items;
    const updatedQuizzes = existingQuizzes.map((quiz) => {
      if (quiz.id === quizId) {
        const updatedQuestions = quiz.questions.map((question) => {
          if (question.id === questionId) {
            return {
              ...question,
              answers: [...question.answers, newAnswer],
            };
          }
          return question;
        });
        return {
          ...quiz,
          questions: updatedQuestions,
        };
      }
      return quiz;
    });
    const savedQuizzes = await saveQuizzesToLocalStorage(updatedQuizzes);
    return savedQuizzes;
  }
);

export const deleteAnswerInit = createAsyncThunk(
  "quizzes/deleteAnswer",
  async (
    {
      quizId,
      questionId,
      answerId,
    }: { quizId: number; questionId: number; answerId: number },
    { getState }
  ) => {
    const state = getState() as { quizzes: QuizState };
    const existingQuizzes = state.quizzes.items;
    const updatedQuizzes = existingQuizzes.map((quiz) => {
      if (quiz.id === quizId) {
        const updatedQuestions = quiz.questions.map((question) => {
          if (question.id === questionId) {
            return {
              ...question,
              answers: question.answers.filter(
                (answer) => answer.id !== answerId
              ),
            };
          }
          return question;
        });
        return {
          ...quiz,
          questions: updatedQuestions,
        };
      }
      return quiz;
    });
    const savedQuizzes = await saveQuizzesToLocalStorage(updatedQuizzes);
    return savedQuizzes;
  }
);

export const addCorrectAnswerInit = createAsyncThunk(
  "quizzes/addCorrectAnswerInit",
  async (
    {
      quizId,
      questionId,
      answerId,
    }: { quizId: number; questionId: number; answerId: number },
    { getState }
  ) => {
    const state = getState() as { quizzes: QuizState };
    const existingQuizzes = state.quizzes.items;

    const updatedQuizzes = existingQuizzes.map((quiz) => {
      if (quiz.id === quizId) {
        const updatedQuestions = quiz.questions.map((question) => {
          if (question.id === questionId) {
            const updatedAnswers = question.answers.map((answer) => {
              if (answer.id === answerId) {
                return {
                  ...answer,
                  isCorrect: !answer.isCorrect,
                };
              }
              return answer;
            });
            return {
              ...question,
              answers: updatedAnswers,
            };
          }
          return question;
        });
        return {
          ...quiz,
          questions: updatedQuestions,
        };
      }
      return quiz;
    });

    await saveQuizzesToLocalStorage(updatedQuizzes);
    return updatedQuizzes;
  }
);

export const makeFinish = createAsyncThunk(
  "quizzes/addFinish",
  async (quizId: number, { getState }) => {
    const state = getState() as { quizzes: QuizState };
    const existingQuizzes = state.quizzes.items;
    const updatedQuizzes = existingQuizzes.map((quiz) => {
      if (quiz.id === quizId) {
        return {
          ...quiz,
          isFinished: true,
        };
      }
      return quiz;
    });
    const savedQuizzes = await saveQuizzesToLocalStorage(updatedQuizzes);
    return savedQuizzes;
  }
);

type QuizState = {
  items: Quiz[];
  loading: boolean;
};

const initialState: QuizState = {
  items: [],
  loading: false,
};

const quizzesState = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    deleteQuizzes: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveQuizzes.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveQuizzes.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addQuestionInit.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(deleteQuestionInit.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addAnswerInit.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(deleteAnswerInit.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addCorrectAnswerInit.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(makeFinish.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { deleteQuizzes } = quizzesState.actions;

export default quizzesState.reducer;
