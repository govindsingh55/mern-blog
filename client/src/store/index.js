import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import authReducer from './authSlice';
import { api } from '../api';
import logger from "redux-logger";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    middleware: [logger, api.middleware],
  }
})

export default store