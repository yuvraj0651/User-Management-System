import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletingUser, fetchAllUsers, updateStatus } from "../../API/UsersThunk";
import UpdateUserModal from "../../UI/Modal/UpdateUserModal";
import useDebounce from "../../Hooks/useDebounce";
import toast from "react-hot-toast";

const UserManagement = () => {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [nameInput, setNameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [selectCategory, setSelectCategory] = useState("select-sort");
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);
    const [draggedOverItemIndex, setDraggedOverItemIndex] = useState(null);

    const [users, setUsers] = useState([]);
    const [selectRole, setSelectRole] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const dispatch = useDispatch();
    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const { userData, isLoading, error } = useSelector((state) => state.users);
    console.log("User Data", userData);

    useEffect(() => {
        setUsers(userData);
    }, [userData]);

    const deleteUserHandler = (id) => {
        let toastId = toast.loading("Deleting User");

        dispatch(deletingUser(id)).unwrap().then(() => {
            toast.success("User Deleted Successfully");
        }).catch((error) => {
            toast.error(error || "Deleting User Failed", { id: toastId });
        });
    };

    const toggleUpdateModal = () => {
        setIsUpdateModalOpen(!isUpdateModalOpen);
    };

    const saveEditingData = useCallback((user) => {
        setEditingId(user.id);
        setNameInput(user.name);
        setEmailInput(user.email);
        setSelectRole(user.role);
    }, []);

    const filteredUsersData = useMemo(() => {
        let list = [...users];

        if (debouncedSearch.trim()) {
            list = list.filter((item) =>
                item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                item.email.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
        }

        if (selectCategory === "asc-a-z") {
            list.sort((a, b) => a.name.localeCompare(b.name));
        } else if (selectCategory === "desc-z-a") {
            list.sort((a, b) => b.name.localeCompare(a.name));
        }

        return list;
    }, [users, debouncedSearch, selectCategory]);

    useEffect(() => {
        if (!debouncedSearch.trim()) {
            setSuggestions([]);
            return;
        };

        setSuggestions(filteredUsersData);
    }, [debouncedSearch, filteredUsersData]);

    const handleSelect = (user) => {
        setSearchTerm(user.name);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const draggedItemHandler = (id) => {
        setDraggedItemIndex(id);
        console.log("Dragged Item:", id);
    };

    const draggedOverItemHandler = (id) => {
        setDraggedOverItemIndex(id);
        console.log("Dragged Over Item:", id);
    };

    const draggedOverEnterHandler = () => {
        let draggedUserItems = [...users];

        let fromIndex = draggedUserItems.findIndex((user) => user.id === draggedItemIndex);
        let toIndex = draggedUserItems.findIndex((user) => user.id === draggedOverItemIndex);

        if (fromIndex === -1 || toIndex === -1) return;

        const [movedItem] = draggedUserItems.splice(fromIndex, 1);
        console.log("Moved Item:", movedItem);
        draggedUserItems.splice(toIndex, 0, movedItem);

        setUsers(draggedUserItems);
        setDraggedItemIndex(null);
        setDraggedOverItemIndex(null);
    };

    const handleStatusChange = (userId, newStatus) => {
        dispatch(updateStatus({ userId, newStatus }));
    };

    if (isLoading) {
        return (
            <p>Loading users...</p>
        )
    };

    if (error) {
        return (
            <p>something went wrong</p>
        )
    };

    return (
        <main className="w-full bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 space-y-6">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            User Management
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage users, roles, and account status from one place
                        </p>
                    </div>

                    <button className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">
                        + Add New User
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between bg-white p-4 rounded-xl border">

                    {/* Search */}
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowSuggestions(true);
                        }}
                        placeholder="Search users by name or email..."
                        className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <ul
                            className="absolute mt-[5.5rem] z-50 w-[35rem] bg-white border border-gray-200 
                        rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        >
                            {suggestions.map((user) => (
                                <li
                                    key={user.id}
                                    onClick={() => handleSelect(user)}
                                    className="px-4 py-2 cursor-pointer 
                            hover:bg-indigo-50 transition
                            flex flex-col sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <span className="font-medium text-gray-800">
                                        {user.name}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {user.email}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                    {searchTerm && suggestions.length === 0 && (
                        <div
                            className="absolute z-50 mt-[5.5rem] w-[35rem] bg-white border border-gray-200 
                        rounded-lg shadow-lg px-4 py-3 text-sm text-gray-500"
                        >
                            No results found
                        </div>
                    )}
                    {/* Filters */}
                    <div className="flex gap-3">
                        <select
                            value={selectCategory}
                            onChange={(e) => setSelectCategory(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm">
                            <option value="select-sort" hidden>Select Sort</option>
                            <option value="asc-a-z">Ascending A-Z</option>
                            <option value="desc-z-a">Descending Z-A</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="px-5 py-3 text-left font-semibold">
                                    User Name ▲▼
                                </th>
                                <th className="px-5 py-3 text-left font-semibold">
                                    Email ▲▼
                                </th>
                                <th className="px-5 py-3 text-left font-semibold">
                                    Role ▲▼
                                </th>
                                <th className="px-5 py-3 text-left font-semibold">
                                    Status
                                </th>
                                <th className="px-5 py-3 text-right font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {
                                filteredUsersData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-6 text-center">
                                            <p className="tracking-wide capitalize font-[500] text-[0.9rem]">no user data to show</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsersData.map((user) => (
                                        <tr key={user.id}
                                            draggable={selectCategory === "select-sort"}
                                            onDragStart={() => draggedItemHandler(user.id)}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                draggedOverItemHandler(user.id);
                                            }}
                                            onDrop={draggedOverEnterHandler}
                                            className="hover:bg-gray-50 cursor-pointer">
                                            <td className="px-5 py-4 font-medium text-gray-800">
                                                {user.name}
                                            </td>
                                            <td className="px-5 py-4 text-gray-500">
                                                {user.email}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span>
                                                    <select
                                                        value={user.status}
                                                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                                        className="px-4 py-[0.4rem] border border-[#ccc] bg-slate-50 text-[0.8rem] cursor-pointer rounded-[4px]">
                                                        <option value="select-status" hidden>Select Status</option>
                                                        <option value="active">Active</option>
                                                        <option value="Inactive">InActive</option>
                                                    </select>
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => {
                                                        saveEditingData(user);
                                                        toggleUpdateModal();
                                                    }}
                                                    className="px-3 py-1.5 text-xs border rounded-lg hover:bg-gray-100">
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteUserHandler(user.id)}
                                                    className="px-3 py-1.5 text-xs border border-red-300 text-red-500 rounded-lg hover:bg-red-50">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Info */}
                <div className="text-sm text-gray-500 text-center">
                    Showing static user data for UI preview purposes
                </div>
            </div>
            {
                isUpdateModalOpen && (
                    <div onClick={toggleUpdateModal}>
                        <div onClick={(e) => e.stopPropagation()}>
                            <UpdateUserModal
                                onClose={toggleUpdateModal}
                                nameInput={nameInput}
                                setNameInput={setNameInput}
                                emailInput={emailInput}
                                setEmailInput={setEmailInput}
                                editingId={editingId}
                                setEditingId={setEditingId}
                                selectRole={selectRole}
                                setSelectRole={setSelectRole}
                            />
                        </div>
                    </div>
                )
            }
        </main>
    );
};

export default UserManagement;
