import { Provider } from "react-redux"
import { HashRouter, Route, Routes } from "react-router-dom"
import { store } from "./app/store"
import App from "./App"
import { QuizResult } from "./Components/QuizResult/QuizResult"
import { QuizPage } from "./Components/QuizPage/QuizPage"
import { QuizPlay } from "./Components/QuizPlay/QuizPlay"
import { QuizEdit } from "./Components/QuizEdit/QuizEdit"

export const Root = () => {
  return (
    <HashRouter>
      <Provider store={store} >
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/quiz/:quizId" element={<QuizPlay />} />
          <Route path="/quiz/:quizId/edit" element={<QuizEdit />} />
          <Route path="/quiz-result/:score/:totalQuestions" element={<QuizResult />} />
        </Routes>
      </Provider>
    </HashRouter>
  )
}