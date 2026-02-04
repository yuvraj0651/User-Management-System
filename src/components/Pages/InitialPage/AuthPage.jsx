import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser, loginUser } from "../../API/AuthThunk";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState("login");

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [loginErrors, setLoginErrors] = useState({});
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [registerErrors, setRegisterErrors] = useState({});
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validateLogin = () => {
        let errors = {};

        if (!loginData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
            errors.email = "Invalid email format";
        }

        if (!loginData.password.trim()) {
            errors.password = "Password is required";
        } else if (loginData.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        setLoginErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateRegister = () => {
        let errors = {};

        if (!registerData.name.trim()) {
            errors.name = "Full name is required";
        }

        if (!registerData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
            errors.email = "Invalid email format";
        }

        if (!registerData.password.trim()) {
            errors.password = "Password is required";
        } else if (registerData.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        setRegisterErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLogin = () => {
        if (validateLogin()) {
            const toastId = toast.loading("Logging in...");

            dispatch(loginUser(loginData)).unwrap().then(() => {
                // alert("Logged In Successfully");
                toast.success("Logged in successfully 🎉", {
                    id: toastId,
                });

                setTimeout(() => {
                    navigate("/users");
                }, 700);

            }).catch((error) => {
                // alert(error);
                toast.error(error || "Login failed", {
                    id: toastId,
                });
            });

            setLoginData({
                email: "",
                password: "",
            });
            setLoginErrors({});
        }
    };

    const switchTab = (tab) => {
        setActiveTab(tab);
        setLoginErrors({});
        setRegisterErrors({});
    };

    const handleRegister = () => {
        if (validateRegister()) {
            const toastId = toast.loading("Creating account...");

            dispatch(registerUser(registerData)).unwrap().then(() => {
                // alert("Registered Successfully");
                toast.success("Account created successfully 🚀", {
                    id: toastId,
                });
                setActiveTab("login");
            }).catch((error) => {
                // alert(error);
                toast.error(error || "Registration failed", {
                    id: toastId,
                });
            });

            setRegisterData({
                name: "",
                email: "",
                password: "",
            });
            setRegisterErrors({});
        }
    };

    const toggleLoginPassword = () => {
        setShowLoginPassword(!showLoginPassword);
    };

    const toggleRegisterPassword = () => {
        setShowRegisterPassword(!showRegisterPassword);
    };

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">

                {/* Left Section */}
                <div className="hidden md:flex flex-col justify-center bg-indigo-600 text-white p-10">
                    <h2 className="text-3xl font-bold mb-4">User Management System</h2>
                    <p className="text-indigo-100">
                        Secure login & user registration panel
                    </p>
                </div>

                {/* Right Section */}
                <div className="p-8 sm:p-10 space-y-6">

                    {/* Tabs */}
                    <div className="flex gap-4 border-b">
                        {["login", "register"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => switchTab(tab)}
                                className={`pb-2 font-semibold capitalize ${activeTab === tab
                                    ? "text-indigo-600 border-b-2 border-indigo-600"
                                    : "text-gray-500"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* 🔐 Login */}
                    {activeTab === "login" && (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin();
                        }}>
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold">Welcome Back 👋</h3>

                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        value={loginData.email}
                                        onChange={(e) =>
                                            setLoginData({ ...loginData, email: e.target.value })
                                        }
                                        className="w-full px-4 py-3 rounded-lg border"
                                    />
                                    {loginErrors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {loginErrors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="relative">
                                    <input
                                        type={showLoginPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={loginData.password}
                                        onChange={(e) =>
                                            setLoginData({ ...loginData, password: e.target.value })
                                        }
                                        className="w-full px-4 py-3 rounded-lg border"
                                    />
                                    <span
                                        onClick={toggleLoginPassword}
                                        className="absolute top-3.5 right-3 capitalize tracking-wide font-500 text-[0.9rem] cursor-pointer">
                                        {showLoginPassword ? "Hide" : "Show"}
                                    </span>
                                    {loginErrors.password && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {loginErrors.password}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-indigo-600 text-white rounded-lg"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    )}

                    {/* 📝 Register */}
                    {activeTab === "register" && (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleRegister();
                        }}>
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold">Create Account 🚀</h3>

                                <div>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={registerData.name}
                                        onChange={(e) =>
                                            setRegisterData({ ...registerData, name: e.target.value })
                                        }
                                        className="w-full px-4 py-3 rounded-lg border"
                                    />
                                    {registerErrors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {registerErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        value={registerData.email}
                                        onChange={(e) =>
                                            setRegisterData({ ...registerData, email: e.target.value })
                                        }
                                        className="w-full px-4 py-3 rounded-lg border"
                                    />
                                    {registerErrors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {registerErrors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="relative">
                                    <input
                                        type={showRegisterPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={registerData.password}
                                        onChange={(e) =>
                                            setRegisterData({ ...registerData, password: e.target.value })
                                        }
                                        className="w-full px-4 py-3 rounded-lg border"
                                    />
                                    <span
                                        onClick={toggleRegisterPassword}
                                        className="absolute top-3.5 right-3 capitalize tracking-wide font-500 text-[0.9rem] cursor-pointer">
                                        {showRegisterPassword ? "Hide" : "Show"}
                                    </span>
                                    {registerErrors.password && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {registerErrors.password}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-indigo-600 text-white rounded-lg"
                                >
                                    Register
                                </button>
                            </div>
                        </form>
                    )}

                </div>
            </div>
        </main>
    );
};

export default AuthPage;
