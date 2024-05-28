# Quiz App

[DEMO LINK](https://quiz-app-react-virid-six.vercel.app/).

## Project Description

This project is an application for creating and taking quizzes. It provides users with the ability to view a list of available quizzes, add new quizzes, edit and delete existing ones, as well as take quizzes and get results. The main features include:

- **Quiz List**: Users can view all available quizzes.
- **Add Quiz**: Users can create a new quiz by adding questions and answers. Dynamic number of answers for each question is supported, as well as marking the correct answer.
- **Edit Quiz**: Users can edit existing quizzes by changing questions and answers, as well as the number of questions.
- **Delete Quiz**: Users can delete quizzes from the list.
- **Take Quiz**: Users can take a quiz and get the result displayed upon completion.

### Additional Features

The project also includes the following features:

- **Search Quiz by Name**: Quick search for quizzes by their name.
- **Quiz Timer**: A timer that limits the time for taking the quiz.
- **Dynamic Number of Answers**: Users can add and remove answers for each question during quiz creation and editing.
- **Score Configuration**: Ability to configure the number of points for each question.
- **Different Answer Types**: Support for various types of answers, such as text and multiple choice.
- **View Answers**: After completing a quiz, users can review their answers.
- **Ranking**: Display of user rankings based on quiz results.

## Technologies Used

- **TypeScript**
- **React**
- **Tailwind CSS**
- **classNames**
- **Redux**
- **Redux Toolkit**

## How to Run Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/quiz-app.git
   cd quiz-app

### Install Dependencies
npm install
### Run the Application
npm start
### Open in Browser
The application will be available at http://localhost:3000.

## Project Structure
src/
├── components/   # React components
├── redux/        # Redux store, slices
├── styles/       # Tailwind CSS styles
└── utils/        # Helper functions and utilities
