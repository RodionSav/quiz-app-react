import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import * as actions from '../features/quizSlicer';
import cn from 'classnames';

const QuizPage = () => {
  const { quizId } = useParams();
  const quizzes = useAppSelector(state => state.quizzes.items);
  const quiz = quizzes.find(q => q.id === Number(quizId));
  const [question, setQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [timeExpired, setTimeExpired] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!quizMode) return;

    setTimeLeft(120);
    setTimeExpired(false);

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setTimeExpired(true);
          setCurrentQuestionIndex(prevState => prevState + 1);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, quizMode]);

  if (!quiz) {
    return <div className="text-center text-red-500 text-lg font-semibold">Вікторину не знайдено</div>;
  }

  const handleQuestionChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setQuestion(e.target.value);
  };

  const handleAddQuestion = () => {
    const maxQuestionId = Math.max(0, ...quiz.questions.map(question => question.id)) + 1;
    const newQuestion = {
      id: maxQuestionId,
      text: question.trim(),
      answers: []
    };

    if (question.trim()) {
      dispatch(actions.addQuestion({ quizId, newQuestion }));
      setQuestion('');
      setCurrentQuestionIndex(quiz.questions.length);
    }
  };

  const handleDeleteQuestion = (questionId: number) => {
    dispatch(actions.deleteQuestion({ quizId, questionId }));
    if (currentQuestionIndex > quiz.questions.length - 1) {
      setCurrentQuestionIndex(quiz.questions.length - 1);
    }
  };

  const handleKeyDown = (event: { key: string; preventDefault: () => void; }) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddQuestion();
    }
  };

  const handleNewAnswerChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setNewAnswer(e.target.value);
  };

  const handleAddAnswer = () => {
    if (!selectedQuestionId) return;
    const maxAnswerId = Math.max(0, ...quiz.questions.find(q => q.id === selectedQuestionId)?.answers.map(answer => answer.id) ?? []) + 1;
    const newAnswerObj = {
      id: maxAnswerId,
      text: newAnswer.trim(),
    };

    if (newAnswer.trim()) {
      dispatch(actions.addAnswer({ quizId, questionId: selectedQuestionId, newAnswer: newAnswerObj }));
      setNewAnswer('');
    }
  };

  const handleAnswerKeyDown = (event: { key: string; preventDefault: () => void; }) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddAnswer();
    }
  };

  const handleDeleteAnswer = (questionId: number, answerId: number) => {
    dispatch(actions.deleteAnswer({ quizId, questionId, answerId }));
  };

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

  const handleMarkCorrectAnswer = (questionId: number, answerId: number) => {
    dispatch(actions.addCorrectAnswer({ quizId, questionId, answerId }));
    console.log(quiz);
  };

  const handleAnswerChange = (questionId: number, answerText: string) => {
    setAnswers(prevAnswers => ({ ...prevAnswers, [questionId]: answerText }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    const correctAnswers: number[] = [];

    quiz.questions.forEach(question => {
      const correctAnswer = question.answers.find(answer => answer.isCorrect);
      if (correctAnswer && correctAnswer.text === answers[question.id]) {
        score += 1;
        correctAnswers.push(question.id);
      }
    });

    navigate(`/quiz-result/${score}/${quiz.questions.length}`, { state: { correctAnswers } });
  };

  const handleStartQuizMode = () => {
    setQuizMode(!quizMode);
    setCurrentQuestionIndex(0);
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-center mb-4 text-3xl font-bold text-blue-600">{quiz.title}</h1>
      <button onClick={handleStartQuizMode} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
        {quizMode ? 'Switch to Edit Mode' : 'Start Quiz'}
      </button>
      {!quizMode && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">{quiz.title}</h1>
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
            <div key={currentQuestion.id} className="mb-6 p-4 bg-white shadow-md rounded-md">
              <h2 className="text-xl font-semibold mb-2">{currentQuestion.text}</h2>
              <button onClick={() => handleDeleteQuestion(currentQuestion.id)} className="text-red-500">Delete</button>
              {currentQuestion.answers.map((answer) => (
                <div key={
                  answer.id} className="flex items-center mb-2">
                  <label
                    className={cn('w-[50%]', {'text-green-500': answer.isCorrect })}
                  >
                  <input
                    type="checkbox"
                    name={`question-${currentQuestion.id}`}
                    value={answer.text}
                    className='mr-4'
                    disabled
                    checked={answers[currentQuestion.id] === answer.text}
                  />
                    {answer.text}
                  </label>
                  <button
                    onClick={() => handleMarkCorrectAnswer(currentQuestion.id, answer.id)}
                    className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Mark Correct
                  </button>
                  <button
                    onClick={() => handleDeleteAnswer(currentQuestion.id, answer.id)}
                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
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
                  onClick={handleAddAnswer}
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
        </>
      )}
      {quizMode && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">{quiz.title}</h1>
            <h1 className="text-xl font-bold text-red-500">{formatTime(timeLeft)}</h1>
          </div>
          {quiz.questions.length > 0 && currentQuestionIndex < quiz.questions.length && (
            <div key={currentQuestion.id} className="mb-6 p-4 bg-white shadow-md rounded-md">
              <h2 className="text-xl font-semibold mb-2">{currentQuestion.text}</h2>
              {currentQuestion.answers.map((answer) => (
                <label key={answer.id} className="block mb-2">
                  <input
                    type="checkbox"
                    name={`question-${currentQuestion.id}`}
                    value={answer.text}
                    onChange={() => handleAnswerChange(currentQuestion.id, answer.text)}
                    disabled={timeExpired}
                    className="mr-2"
                  />
                  {answer.text}
                </label>
              ))}
            </div>
          )}
          {quiz.questions.length > 0 && (
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
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
                <button
                  onClick={handleSubmitQuiz}
                  className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                >
                  Get the result
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizPage;
