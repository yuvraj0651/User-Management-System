import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../API/AuthThunk";
import toast from "react-hot-toast";

const Header = () => {

    const { authData } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        let toastId = toast.loading("Logging You Out");

        dispatch(logout()).unwrap().then(() => {
            toast.success("You are logged out successfully", { id: toastId });

            setTimeout(() => {
                navigate("/");
            }, 300);
        }).catch((error) => {
            toast.error(error || "Something went wrong while logging out", { id: toastId });
        });
    };

    return (
        <header className="w-full bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div className="flex items-center justify-between lg:justify-start gap-4">
                        <Link to="/users">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                                    UM
                                </div>
                                <h1 className="text-xl font-semibold text-gray-800">
                                    User Management
                                </h1>
                            </div>
                        </Link>
                    </div>

                    <nav className="flex gap-2 sm:gap-4 flex-wrap justify-center">
                        {["Users", "Roles", "Permissions", "Reports"].map((item) => (
                            <button
                                key={item}
                                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            >
                                {item}
                            </button>
                        ))}
                    </nav>

                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">

                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <span className="absolute left-3 top-2.5 text-gray-400">
                                🔍
                            </span>
                        </div>

                        <div className="flex items-center gap-4 justify-end">
                            {authData && (
                                <div className="logout-button-block">
                                    <button
                                        className="border border-[#ccc] shadow-sm shadow-[#ccc] py-1 px-4 tracking-wide uppercase rounded-[5px] text-[0.8rem] cursor-pointer bg-indigo-600 text-white"
                                        onClick={logoutHandler}
                                    >
                                        logout
                                    </button>
                                </div>
                            )}

                            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
                                🔔
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="flex items-center gap-3 cursor-pointer">
                                <Link to="/profile">
                                    <img
                                        src={authData?.profileImage || "https://i.pravatar.cc/40"}
                                        alt="User"
                                        className="w-9 h-9 rounded-full object-cover"
                                    />
                                </Link>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-gray-700">
                                        {authData?.name.split(" ")[0] ?? "Aman"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {authData?.name ?? "Aman Gupta"}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </header>
    );
};

export default Header;
