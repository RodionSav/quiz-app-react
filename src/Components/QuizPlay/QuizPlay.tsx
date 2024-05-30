import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as quizActions from "../features/quizSlicer";
import * as usersActions from "../features/usersSlicer";
import cn from "classnames";

export const QuizPlay = () => {
  const { quizId } = useParams();
  const quizzes = useAppSelector((state) => state.quizzes.items);
  const quiz = quizzes.find((q) => q.id === Number(quizId));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [timeExpired, setTimeExpired] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: number[] }>({});
  const [correctAnswers, setCorrectAnswers] = useState<{
    [key: number]: boolean[];
  }>({});
  const [playerName, setPlayerName] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const users = useAppSelector((state) => state.users.items);

  useEffect(() => {
    dispatch(quizActions.fetchQuizzes());
  }, [quizId, dispatch]);

  useEffect(() => {
    if (!quiz) return;

    setTimeLeft(120);
    setTimeExpired(false);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setTimeExpired(true);
          setCurrentQuestionIndex((prevState) => prevState + 1);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, quiz]);

  if (!quiz) {
    return (
      <div className="text-center text-red-500 text-lg font-semibold">
        Quiz is loading
      </div>
    );
  }

  const handleAnswerChange = (questionId: number, answerId: number) => {
    setAnswers((prevAnswers) => {
      const currentAnswers = prevAnswers[questionId] || [];
      const newAnswers = currentAnswers.includes(answerId)
        ? currentAnswers.filter((id) => id !== answerId)
        : [...currentAnswers, answerId];
      return { ...prevAnswers, [questionId]: newAnswers };
    });
  };

  const handleSubmitQuiz = () => {
    if (!playerName.trim()) {
      setError("Please, enter your name");
      return;
    }

    let score = 0;
    const updatedCorrectAnswers: { [key: number]: boolean[] } = {};

    quiz.questions.forEach((question) => {
      const correctAnswerIds = question.answers
        .filter((answer) => answer.isCorrect)
        .map((answer) => answer.id);
      const userAnswerIds = answers[question.id] || [];
      const allCorrect = correctAnswerIds.every((correctId) =>
        userAnswerIds.includes(correctId)
      );
      const noIncorrect = userAnswerIds.every((userId) =>
        correctAnswerIds.includes(userId)
      );

      if (allCorrect && noIncorrect) {
        score += 1;
      }

      updatedCorrectAnswers[question.id] = question.answers.map((answer) => {
        const isUserAnswerCorrect =
          answer.isCorrect && userAnswerIds.includes(answer.id);
        const isUserAnswerIncorrect =
          !answer.isCorrect && userAnswerIds.includes(answer.id);
        return isUserAnswerCorrect || isUserAnswerIncorrect;
      });
    });

    setCorrectAnswers(updatedCorrectAnswers);
    setTimeExpired(true);

    const maxUserId = Math.max(0, ...users.map((user) => user.id)) + 1;

    const newUser = {
      id: maxUserId,
      name: playerName,
      correctAnswersAmount: score,
    };

    if (playerName.trim()) {
      dispatch(usersActions.setUsers(newUser));
      dispatch(usersActions.saveUsers(newUser));
    }

    navigate(`/quiz-result/${score}/${quiz.questions.length}`, {
      state: {
        answers,
        correctAnswers: updatedCorrectAnswers,
        playerName,
      },
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-center mb-4 text-3xl font-bold text-blue-600 mb-5">
        {quiz.title}
      </h1>
      <Link
        to="/"
        className="absolute top-4 mb-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Return to Main
      </Link>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{quiz.title}</h1>
        <h1 className="text-xl font-bold text-red-500">
          {formatTime(timeLeft)}
        </h1>
      </div>
      {quiz.questions.length > 0 &&
        currentQuestionIndex < quiz.questions.length && (
          <div
            key={currentQuestion.id}
            className="mb-6 p-4 bg-white shadow-md rounded-md"
          >
            <h2 className="text-xl font-semibold mb-2">
              {currentQuestion.text}
            </h2>
            {currentQuestion.answers.map((answer, index) => (
              <label
                key={answer.id}
                className={cn("block mb-2", {
                  "text-blue-500": correctAnswers[currentQuestion.id]?.[index],
                  "text-orange-500":
                    !correctAnswers[currentQuestion.id]?.[index] &&
                    answers[currentQuestion.id]?.includes(answer.id),
                })}
              >
                <input
                  type="checkbox"
                  name={`question-${currentQuestion.id}`}
                  value={answer.id}
                  onChange={() =>
                    handleAnswerChange(currentQuestion.id, answer.id)
                  }
                  disabled={timeExpired}
                  checked={
                    answers[currentQuestion.id]?.includes(answer.id) || false
                  }
                  className="mr-2"
                />
                {answer.text}
              </label>
            ))}
          </div>
        )}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="h-[50px] bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Previous question
        </button>
        {currentQuestionIndex !== quiz.questions.length - 1 && (
          <button
            onClick={handleNextQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Next question
          </button>
        )}
        {currentQuestionIndex === quiz.questions.length - 1 && (
          <>
            <div></div>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
              }}
              className="w-[200px] h-[40px] border border-gray-300 m-auto mb-2 px-2 "
              required
            />
            <div className="relative">
              <button
                onClick={handleSubmitQuiz}
                className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                Get the result
              </button>
              {error && (
                <h1 className="text-red-500 text-lg text-start absolute right-15">
                  {error}
                </h1>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
