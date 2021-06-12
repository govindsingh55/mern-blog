import { createSlice } from '@reduxjs/toolkit'

const getInitialState = function () {
  try {
    const serialState = localStorage.getItem('authState');
    if (serialState === null) {
      return {
        user: null,
        token: null
      };
    }
    return JSON.parse(serialState);
  } catch (err) {
    return {
      user: null,
      token: null
    };
  }
}();

const slice = createSlice({
  name: 'auth',
  initialState: getInitialState,
  reducers: {
    setAuthCredentials: (
      state,
      { payload: { user, token } }
    ) => {
      state.user = user
      state.token = token

      // setting local storage
      localStorage.setItem('authState', JSON.stringify({ user, token }))
    },
  },
})

export const { setAuthCredentials } = slice.actions

export default slice.reducer

export const selectCurrentUser = (state) => state.auth.user