import { configureStore } from "@reduxjs/toolkit";
import authReducer from './Slices/authSlice';
import profileReducer from './Slices/profileSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
    }
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;