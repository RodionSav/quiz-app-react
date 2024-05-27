import { Link } from "react-router-dom";
import { Quiz } from "../../Types/Quiz";
import { useAppDispatch } from "../../app/hooks";
import { deleteQuizzes } from '../features/quizSlicer';

type Props = {
  quiz: Quiz
}

export const QuizItem: React.FC<Props> = ({ quiz }) => {
  const dispatch = useAppDispatch();

  const handleDelete = (quizId: number) => {
    dispatch(deleteQuizzes({ id: quizId }));
  };

  return (
    <div className="w-[300px] h-auto border border-green-500 p-2 mb-4 relative">
      <Link to={`/quiz/${quiz.id}`} className="block">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">{quiz.title}</h1>
        </div>
      </Link>
      <button
        onClick={() => handleDelete(quiz.id)}
        className="absolute top-3 right-2"
      >
        <img
          src='images/close.png'
          alt="Delete"
          className="w-[20px] h-[20px]"
        />
      </button>
    </div>
  );
};
