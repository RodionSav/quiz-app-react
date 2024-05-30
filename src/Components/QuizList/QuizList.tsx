import { useAppSelector } from "../../app/hooks";
import { QuizItem } from "../QuizItem/QuizItem";
import { useSearchParams } from "react-router-dom";

export const QuizList = () => {
  const [searchParams] = useSearchParams();


  const quizzes = useAppSelector((state) => state.quizzes.items);

  const queryParam = searchParams.get("query") || "";

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(queryParam.toLowerCase().trim())
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl">Quiz list</h1>
      {queryParam
        ? filteredQuizzes.map((quiz) => <QuizItem key={quiz.id} quiz={quiz} />)
        : quizzes.map((quiz) => <QuizItem key={quiz.id} quiz={quiz} />)}
    </div>
  );
};
