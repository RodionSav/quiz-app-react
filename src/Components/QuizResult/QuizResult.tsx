import React from "react";
import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

type Params = {
  score?: string;
  totalQuestions?: string;
};

export const QuizResult: React.FC = () => {
  const { score, totalQuestions } = useParams<Params>();

  const users = useAppSelector((state) => state.users.items);

  const parsedScore = score ? parseInt(score) : 0;
  const parsedTotalQuestions = totalQuestions ? parseInt(totalQuestions) : 0;

  const sortedUsers = [...users].sort(
    (a, b) => b.correctAnswersAmount - a.correctAnswersAmount
  );

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold text-center mb-4">
          You have answered {parsedScore} / {parsedTotalQuestions}
        </h1>
        <Link
          to="/"
          className="block m-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300 text-center mb-4"
        >
          Return to main
        </Link>
        <div>
          <h1>Top</h1>
          {sortedUsers.map((user) => (
            <div key={user.id} className="flex mb-2 justify-between">
              <h1 className="text-xl font-semibold">{user.name}</h1>
              <h2 className="text-lg">Score: {user.correctAnswersAmount}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
