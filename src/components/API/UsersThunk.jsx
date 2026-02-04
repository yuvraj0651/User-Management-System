import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initialState = {
    userData: [],
    isLoading: false,
    addLoading: false,
    deleteLoading: false,
    updateLoading: false,
    updateStatusLoading: false,
    error: null,
};

// Fetch All Users
export const fetchAllUsers = createAsyncThunk(
    "users/fetchUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost:5000/users");
            if (!response.ok) {
                throw new Error("something went wrong while fetching user data");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Adding User
export const addingUser = createAsyncThunk(
    "users/addingUser",
    async (newUser, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost:5000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });
            if (!response.ok) {
                throw new Error("something went wrong while adding new user data");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Deleting User
export const deletingUser = createAsyncThunk(
    "users/deletingUser",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("something went wrong while deleting user data");
            };
            return id;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Updating User
export const updatingUser = createAsyncThunk(
    "users/updatingUser",
    async ({ id, newUserData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUserData),
            });
            if (!response.ok) {
                throw new Error("something went wrong while updating user data");
            };
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Update User Status
export const updateStatus = createAsyncThunk(
    "users/updateStatus",
    async ({ userId, newStatus }, { rejectWithValue }) => {
        try {
            let response = await fetch(`http://localhost:5000/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) {
                throw new Error("something went wrong while updating user data");
            };
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
)

export const UsersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        clearUsers: (state) => {
            state.userData = [];
            state.isLoading = false;
            state.addLoading = false;
            state.deleteLoading = false;
            state.updateLoading = false;
            state.updateStatusLoading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userData = action.payload;
                state.error = null;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addingUser.pending, (state) => {
                state.addLoading = true;
                state.error = null;
            })
            .addCase(addingUser.fulfilled, (state, action) => {
                state.addLoading = false;
                state.userData.push(action.payload);
                state.error = null;
            })
            .addCase(addingUser.rejected, (state, action) => {
                state.addLoading = false;
                state.error = action.payload;
            })
            .addCase(deletingUser.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deletingUser.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.userData = state.userData.filter((item) => item.id !== action.payload);
                state.error = null;
            })
            .addCase(deletingUser.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
            })
            .addCase(updatingUser.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updatingUser.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.userData = state.userData.map((user) => user.id === action.payload.id ? action.payload : user);
                state.error = null;
            })
            .addCase(updatingUser.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })
            .addCase(updateStatus.pending, (state) => {
                state.updateStatusLoading = true;
                state.error = null;
            })
            .addCase(updateStatus.fulfilled, (state, action) => {
                state.updateStatusLoading = false;
                state.userData = state.userData.map((user) => user.id === action.payload.id ? action.payload : user);
                state.error = null;
            })
            .addCase(updateStatus.rejected, (state, action) => {
                state.updateStatusLoading = false;
                state.error = action.payload;
            })
    },
});

export default UsersSlice.reducer;

