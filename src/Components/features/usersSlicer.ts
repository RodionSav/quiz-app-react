import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../Types/Quiz';

const fetchUsersFromLocalStorage = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const storedUsers = localStorage.getItem('users');
      resolve(storedUsers ? JSON.parse(storedUsers) : []);
    }, 1000);
  });
};

const saveUsersToLocalStorage = (users: User[]) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem('users', JSON.stringify(users));
      resolve(users);
    }, 500);
  });
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const users = await fetchUsersFromLocalStorage();
  return users;
});

export const saveUsers = createAsyncThunk('users/saveUsers', async (newUser: User, { getState }) => {
  const state = getState() as { users: UsersState };
  const existingUsers = state.users.items;
  const updatedUsers = [...existingUsers, newUser];
  const savedUsers = await saveUsersToLocalStorage(updatedUsers);
  return savedUsers;
});

type UsersState = {
  items: User[],
  loading: boolean,
}

const initialState: UsersState = {
  items: [],
  loading: false,
}

const usersState = createSlice({
  name: 'users',
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
    },
  },
});

export const {
  setUsers
} = usersState.actions;

export default usersState.reducer;
