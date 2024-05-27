import React from 'react';
import { Link, useParams } from 'react-router-dom';

type Params = {
  score?: string;
  totalQuestions?: string;
}

const QuizResult: React.FC = () => {
  const { score, totalQuestions } = useParams<Params>();

  const parsedScore = score ? parseInt(score) : 0;
  const parsedTotalQuestions = totalQuestions ? parseInt(totalQuestions) : 0;

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold text-center mb-4">You have answered {parsedScore} / {parsedTotalQuestions}</h1>
        <Link
          to='/'
          className="block m-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300 text-center"
        >
          Return to main
        </Link>
      </div>
    </div>
  );
}

export default QuizResult;
