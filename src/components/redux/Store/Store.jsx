import { configureStore } from "@reduxjs/toolkit";
import AuthThunk from "../../API/AuthThunk";
import UsersThunk from "../../API/UsersThunk";

const Store = configureStore({
    reducer: {
        auth: AuthThunk,
        users: UsersThunk
    }
});

export default Store;