import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    //@ts-expect-error error
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
            localStorage.setItem("user", JSON.stringify(value.payload));
        },
        removeUser(state) {
            state.user = null;
            localStorage.removeItem("user");
        },

    },
});

export const { setUser, removeUser } = profileSlice.actions;
export default profileSlice.reducer;