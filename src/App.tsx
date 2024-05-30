import { useEffect } from 'react';
import './App.css';
import { QuizForm } from './Components/QuizForm/QuizForm';
import { QuizList } from './Components/QuizList/QuizList';
import SearchBar from './Components/SearchBar/SearchBar';
import { useAppDispatch } from './app/hooks';
import * as quizActions from './Components/features/quizSlicer';
import * as userActions from './Components/features/usersSlicer';

function App() {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(quizActions.fetchQuizzes());
    dispatch(userActions.fetchUsers());
  }, [dispatch]);


  return (
    <div className="App">
      <QuizForm />
      <SearchBar />
      <QuizList />
    </div>
  );
}

export default App;
