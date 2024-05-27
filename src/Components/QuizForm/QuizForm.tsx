import { SetStateAction, useState } from "react";
import { setQuizzes } from "../features/quizSlicer";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";

export const QuizForm = () => {
  const [title, setTitle] = useState('');
  const quizzes = useAppSelector(state => state.quizzes.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleCreate = () => {
    const maxId = Math.max(0, ...quizzes.map(quiz => quiz.id)) + 1;

    const newQuiz = {
      id: maxId,
      title: title,
      questions: []
    };

    if (title.trim()) {
      dispatch(setQuizzes(newQuiz));
      setTitle('');
      navigate(`/quiz/${maxId}`);
    }
  }

  const handleTitleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setTitle(event.target.value);
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold mb-4">Quiz creating</h1>
      <div className="flex flex-col items-center gap-4">
        <input
          type="text"
          className="border border-red-300 p-2 w-[300px] text-center"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter quiz name"
        />
        <button 
          onClick={handleCreate} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  )
}
