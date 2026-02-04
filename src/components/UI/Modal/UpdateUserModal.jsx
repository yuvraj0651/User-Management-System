import React from "react";
import { useDispatch, useSelector } from "react-redux"
import { updatingUser } from "../../API/UsersThunk";
import toast from "react-hot-toast";

const UpdateUserModal = React.memo(({
    onClose,
    nameInput,
    setNameInput,
    emailInput,
    setEmailInput,
    editingId,
    setEditingId,
    selectRole,
    setSelectRole,
}) => {

    const dispatch = useDispatch();
    console.log("selectRole:", selectRole);

    const { updateLoading } = useSelector((state) => state.users);
    console.log(updateLoading);

    const updateUserData = () => {
        const toastId = toast.loading("Updating user...");

        dispatch(
            updatingUser({
                id: editingId,
                newUserData: {
                    name: nameInput,
                    email: emailInput,
                    role: selectRole,
                },
            })
        ).unwrap().then(() => { 
            toast.success("User Data Updated Successfully");

            setNameInput("");
            setEmailInput("");
            setSelectRole("");
            setEditingId(null);
            onClose();

        }).catch((error) => {
            toast.error(error || "Update failed", { id: toastId });
        })
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Edit User
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl">
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form className="space-y-4">

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            User Name
                        </label>
                        <input
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            placeholder="Enter user name"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="Enter email address"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* User Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            User Role:
                        </label>
                        <select
                            value={selectRole}
                            onChange={(e) => setSelectRole(e.target.value)}
                            className="px-4 py-[0.4rem] rounded-[4px] cursor-pointer text-[0.9rem] bg-slate-50 border border-[#ccc]">
                            <option value="" disabled>Select Status</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Technical Role
                        </label>

                        <select
                            className="px-4 py-2 rounded-lg border border-[#ccc] bg-slate-50"
                        >
                            <option value="" hidden>Select Role</option>
                            <option value="frontend">Frontend Developer</option>
                            <option value="backend">Backend Developer</option>
                            <option value="fullstack">Full Stack Developer</option>
                            <option value="uiux">UI / UX Designer</option>
                            <option value="qa">QA Engineer</option>
                        </select>
                    </div>


                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-100">
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={updateLoading}
                            onClick={updateUserData}
                            className={`px-4 py-2 text-sm rounded-lg text-white 
                            ${updateLoading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
                        >
                            {updateLoading ? "Updating..." : "Update User"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
})

export default UpdateUserModal