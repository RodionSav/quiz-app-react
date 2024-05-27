import { createSlice } from '@reduxjs/toolkit';
import { Quiz } from '../../Types/Quiz';

const storedUsers = localStorage.getItem('users');

type Users = {
  id: number,
  name: string,
  correctAnswersAmount: number
}

type UsersState = {
  items: Users[],
}

const initialState: UsersState = {
  items: storedUsers ? JSON.parse(storedUsers) : [],
}

const saveToLocalStorage = (state: UsersState) => {
  localStorage.setItem('users', JSON.stringify(state.items));
};

const usersState = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      const newUser = action.payload;
      const existingUser = state.items.find(user => user.name === newUser.name);

      if (existingUser) {
        existingUser.correctAnswersAmount += newUser.correctAnswersAmount;
      } else {
        state.items.push(newUser);
      }

      saveToLocalStorage(state);
    }
  }
});

export const {
  setUsers
} = usersState.actions;

export default usersState.reducer;
