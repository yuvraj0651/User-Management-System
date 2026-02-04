import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const storedAuth = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth"))
    : null;

export const initialState = {
    authData: storedAuth?.user || null,
    token: storedAuth?.token || null,
    isAuthenticated: storedAuth?.isAuthenticated || false,
    isLoading: false,
    registerLoading: false,
    error: null,
};

// Login User 
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userResponse = await fetch("http://localhost:5000/users");
            if (!userResponse.ok) {
                throw new Error("something went wrong while logging in User");
            };
            const users = await userResponse.json();

            const existingUser = users.find((user) => user.email === email && user.password === password);

            if (!existingUser) {
                return rejectWithValue("Invalid Credentials");
            };

            return existingUser;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Register User
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (newUser, { rejectWithValue }) => {
        const usersWithActive = {
            ...newUser,
            status: "Inactive",
            createdAt: new Date().toISOString(),
            role: "user",
        };
        try {
            const userResponse = await fetch("http://localhost:5000/users");
            if (!userResponse.ok) {
                throw new Error("something went wrong while logging in User");
            };
            const users = await userResponse.json();

            const existing = users.find(u => u.email === newUser.email);
            if (existing) {
                return rejectWithValue("Email already exists");
            };

            let response = await fetch("http://localhost:5000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(usersWithActive),
            });
            if (!response.ok) {
                throw new Error("something went wrong while registering new user");
            };
            let data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
)

export const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.authData = null;
            state.isLoading = false;
            state.registerLoading = false;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;

            localStorage.removeItem("auth");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const fakeToken = Math.random().toString(36).substring(2);

                state.isLoading = false;
                state.authData = action.payload;
                state.token = fakeToken;
                state.isAuthenticated = true;
                state.error = null;

                localStorage.setItem("auth", JSON.stringify({
                    user: action.payload,
                    token: fakeToken,
                    isAuthenticated: true,
                }))
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Register User
            .addCase(registerUser.pending, (state) => {
                state.registerLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                const fakeToken = Math.random().toString(36).substring(2);

                state.registerLoading = false;
                state.authData = action.payload;
                state.token = fakeToken;
                state.error = null;

                localStorage.setItem("auth", JSON.stringify({
                    user: action.payload,
                    token: fakeToken,
                }))
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.registerLoading = false;
                state.error = action.payload;
            })
    },
});

export const { logout } = AuthSlice.actions;

export default AuthSlice.reducer;