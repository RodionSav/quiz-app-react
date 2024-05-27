import './App.css';
import { QuizForm } from './Components/QuizForm/QuizForm';
import { QuizList } from './Components/QuizList/QuizList';
import SearchBar from './Components/SearchBar/SearchBar';

function App() {
  return (
    <div className="App">
      <QuizForm />
      <SearchBar />
      <QuizList />
    </div>
  );
}

export default App;
