import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as quizActions from "../features/quizSlicer";
import cn from "classnames";

export const QuizEdit = () => {
  const { quizId } = useParams();
  const numberQuizId = Number(quizId);
  const dispatch = useAppDispatch();
  const quizzes = useAppSelector((state) => state.quizzes.items);
  const quiz = quizzes.find((q) => q.id === numberQuizId);
  const [question, setQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number[] }>({});

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  if (!quiz) {
    return (
      <div className="text-center text-red-500 text-lg font-semibold">
        Quiz is loading
      </div>
    );
  }

  const handleAddQuestion = () => {
    const maxQuestionId =
      Math.max(0, ...quiz.questions.map((question) => question.id)) + 1;
    const newQuestion = {
      id: maxQuestionId,
      text: question.trim(),
      answers: [],
    };

    if (question.trim()) {
      dispatch(
        quizActions.addQuestionInit({ quizId: numberQuizId, newQuestion })
      );
      setQuestion("");
      setCurrentQuestionIndex(quiz.questions.length);
    }
  };

  const handleDeleteQuestion = (questionId: number) => {
    dispatch(
      quizActions.deleteQuestionInit({ quizId: numberQuizId, questionId })
    );
    if (currentQuestionIndex > quiz.questions.length - 1) {
      setCurrentQuestionIndex(quiz.questions.length - 1);
    }
  };

  const handleNewAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAnswer(e.target.value);
  };

  const handleAddAnswer = (questionId: number) => {
    if (!selectedQuestionId) return;
    const question = quiz.questions.find((q) => q.id === questionId);
    const maxAnswerId =
      Math.max(0, ...(question?.answers.map((answer) => answer.id) ?? [])) + 1;
    const newAnswerObj = {
      id: maxAnswerId,
      text: newAnswer.trim(),
      isCorrect: false,
    };

    if (newAnswer.trim()) {
      dispatch(
        quizActions.addAnswerInit({
          quizId: numberQuizId,
          questionId: selectedQuestionId,
          newAnswer: newAnswerObj,
        })
      );
      setNewAnswer("");
    }
  };

  const handleDeleteAnswer = (questionId: number, answerId: number) => {
    dispatch(
      quizActions.deleteAnswerInit({
        quizId: numberQuizId,
        questionId,
        answerId,
      })
    );
  };

  const handleAnswerKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddAnswer(selectedQuestionId ?? 0);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddQuestion();
    }
  };

  const handleMarkCorrectAnswer = (questionId: number, answerId: number) => {
    dispatch(
      quizActions.addCorrectAnswerInit({
        quizId: numberQuizId,
        questionId,
        answerId,
      })
    );
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="m-5">
      <Link
        to="/"
        className="absolute top-4 mb-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Return to Main
      </Link>
      <Link
        to={`/quiz/${quizId}`}
        className="relative top-16 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Start Quiz
      </Link>
      <Link
        to="/"
        className="absolute right-10 top-4 mb-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Finish editing
      </Link>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold mt-20">{quiz.title}</h1>
      </div>
      {currentQuestionIndex === quiz.questions.length ? (
        <div className="mb-6 p-4 bg-white shadow-md rounded-md">
          <input
            type="text"
            className="w-full h-[40px] border border-gray-300 mb-2 px-2"
            placeholder="Enter new question"
            value={question}
            onChange={handleQuestionChange}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleAddQuestion}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add question
          </button>
        </div>
      ) : (
        <div
          key={currentQuestion.id}
          className="mb-6 p-4 bg-white shadow-md rounded-md"
        >
          <h2 className="text-xl font-semibold mb-2">{currentQuestion.text}</h2>
          <button
            onClick={() => handleDeleteQuestion(currentQuestion.id)}
            className="text-red-500"
          >
            Delete
          </button>
          {currentQuestion.answers.map((answer) => (
            <div key={answer.id} className="flex items-center mb-2">
              <label
                className={cn("w-[50%]", {
                  "text-green-500": answer.isCorrect,
                })}
              >
                <input
                  type="checkbox"
                  name={`question-${currentQuestion.id}`}
                  value={answer.id}
                  className="mr-4"
                  disabled
                  checked={
                    answers[currentQuestion.id]?.includes(answer.id) || false
                  }
                />
                {answer.text}
              </label>
              <button
                onClick={() =>
                  handleMarkCorrectAnswer(currentQuestion.id, answer.id)
                }
                className={cn("bg-blue-500 text-white px-2 py-1 rounded mr-2", {
                  "bg-green-500": answer.isCorrect,
                })}
              >
                Mark Correct
              </button>
              <button
                onClick={() =>
                  handleDeleteAnswer(currentQuestion.id, answer.id)
                }
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
          <div className="mt-4">
            <input
              type="text"
              placeholder="New answer"
              value={newAnswer}
              onChange={handleNewAnswerChange}
              onKeyDown={handleAnswerKeyDown}
              onFocus={() => setSelectedQuestionId(currentQuestion.id)}
              className="w-full h-[40px] border border-gray-300 mb-2 px-2"
            />
            <button
              onClick={() => handleAddAnswer(currentQuestion.id)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add answer
            </button>
          </div>
        </div>
      )}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Previous question
        </button>
        <button
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === quiz.questions.length}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Next question
        </button>
      </div>
    </div>
  );
};
