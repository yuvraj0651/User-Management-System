import { useDispatch, useSelector } from "react-redux";
import { updatingUser } from "../../API/UsersThunk";
import toast from "react-hot-toast";

const ProfilePage = () => {

    const { authData } = useSelector((state) => state.auth);
    console.log(authData);

    const dispatch = useDispatch();

    // const fileInputRef = useRef(null);

    // const handleEditPictureClick = () => {
    //     fileInputRef.current.click();
    // };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            console.log(reader);

            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        })
    };

    const handleUploadImage = async (e) => {
        const toastId = toast.loading("Updating Profile Picture");

        const file = e.target.files[0];
        if (!file) return;

        const base64Image = await convertToBase64(file);

        const updatedUser = {
            ...authData,
            profileImage: base64Image,
        };

        dispatch(updatingUser({
            id: authData.id,
            newUserData: { profileImage: base64Image }
        })).unwrap().then(() => {
            toast.success("Profile Picture Updated Successfully");
        }).catch((error) => {
            toast.error(error || "Update failed", { id: toastId })
        });

        localStorage.setItem(
            "auth",
            JSON.stringify({
                ...JSON.parse(localStorage.getItem("auth")),
                user: updatedUser,
            })
        );

        e.target.value = "";
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">

                {/* ===== Top Banner ===== */}
                <div className="h-40 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
                    <div className="absolute -bottom-14 left-6 overflow-hidden">
                        <img
                            src={authData?.profileImage || "https://i.pravatar.cc/150?img=3"}
                            alt="Profile"
                            className="w-28 h-28 rounded-full border-4 border-white object-cover"
                        />
                        <label
                            className="absolute top-[60%] left-1/2 -translate-x-1/2 shadow-sm shadow-[#ccc] w-[9rem] h-[2.5rem] flex items-center justify-center bg-black/40 text-slate-100 text-[0.8rem] tracking-wide rounded-full cursor-pointer hover:bg-black/60 transition">
                            Upload Image
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleUploadImage}
                            />
                        </label>
                    </div>
                </div>

                {/* ===== Profile Info ===== */}
                <div className="pt-20 px-6 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800">
                                {authData?.name}
                            </h1>
                            <p className="text-gray-500">
                                Frontend Developer (React.js)
                            </p>
                        </div>

                        <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* ===== Details Section ===== */}
                <div className="px-6 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Personal Info */}
                        <div className="border rounded-lg p-5">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                Personal Information
                            </h2>

                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Email</span>
                                    <span className="font-medium">
                                        {authData?.email}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Role</span>
                                    <span className="font-medium">{authData?.role ?? "user"}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Status</span>
                                    <span className="text-green-600 font-medium capitalize">
                                        {authData?.status}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Joined On</span>
                                    <span className="font-medium">
                                        {authData?.createdAt ? new Date(authData?.createdAt).toDateString() : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="border rounded-lg p-5">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                Skills
                            </h2>

                            <div className="flex flex-wrap gap-2">
                                {[
                                    "HTML",
                                    "CSS",
                                    "JavaScript",
                                    "React.js",
                                    "Tailwind CSS",
                                    "Redux Toolkit",
                                ].map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* About */}
                        <div className="md:col-span-2 border rounded-lg p-5">
                            <h2 className="text-lg font-semibold text-gray-700 mb-3">
                                About Me
                            </h2>

                            <p className="text-sm text-gray-600 leading-relaxed">
                                Passionate Frontend Developer with strong knowledge of
                                React.js, modern JavaScript, and responsive UI design.
                                Experienced in building scalable web applications and
                                clean user interfaces using Tailwind CSS and Redux.
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;
