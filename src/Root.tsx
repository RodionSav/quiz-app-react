import { Provider } from "react-redux"
import { HashRouter, Route, Routes } from "react-router-dom"
import { store } from "./app/store"
import App from "./App"
import QuizPage from "./Components/QuizPage/QuizPage"
import { QuizResult } from "./Components/QuizResult/QuizResult"

export const Root = () => {
  return (
    <HashRouter>
      <Provider store={store} >
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/quiz-result/:score/:totalQuestions" element={<QuizResult />} />
        </Routes>
      </Provider>
    </HashRouter>
  )
}