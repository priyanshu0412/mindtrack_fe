"use client";

import React, { useState, useEffect } from "react";
import Icon from "../Icon";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import { logout } from "@/store/authSlice";

const TodoComponent = () => {

    const router = useRouter();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    const token = user?.token;

    const [heading, setHeading] = useState("");
    const [tasks, setTasks] = useState([
        { id: uuidv4(), title: "", status: "pending" }
    ]);

    const [todos, setTodos] = useState([]);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/api/todo`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();

            if (response.status === 200) {
                setTodos(data);
            } else if (response.status === 401) {
                dispatch(logout());
                Swal.fire({
                    icon: "warning",
                    title: "Session Expired",
                    text: "Your session has expired. Please log in again.",
                    confirmButtonText: "OK",
                }).then(() => {
                    router.push("/login");
                });
            }
        } catch (error) {
            console.error("Error fetching To-Dos:", error);
        }
    };


    const addTask = () => {
        setTasks([...tasks, { id: uuidv4(), title: "", status: "pending" }]);
    };

    const viewTodo = (todo) => {
        withReactContent(Swal).fire({
            title: `<strong>${todo.heading}</strong>`,
            html: `
                <ul style="text-align: left; padding: 0; list-style: none;">
                    ${todo.tasks.map(task => `
                        <li style="margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
                            <strong>Task:</strong> ${task.title} <br/>
                            <strong>Status:</strong> ${task.status} <br/>
                        </li>
                    `).join('')}
                </ul>
            `,
            showConfirmButton: false,
            showCloseButton: true,
        });
    };

    const removeTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const handleTaskChange = (id, field, value) => {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, [field]: value } : task)));
    };

    const saveTodo = async () => {
        const payload = {
            heading,
            tasks: tasks.map(({ id, ...rest }) => ({
                ...rest,
            })),
        };

        try {
            const url = editId ? `${process.env.NEXT_PUBLIC_BE_URL}/api/todo/${editId}` : `${process.env.NEXT_PUBLIC_BE_URL}/api/todo`;
            const method = editId ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 200) {
                Swal.fire("Success!", "Your task has been saved!", "success");
                fetchTodos();
                setEditId(null);
            } else if (response.status === 401) {
                dispatch(logout());
                Swal.fire("Session Expired", "Please login again", "warning").then(() => {
                    router.push("/login");
                });
            }
        } catch (error) {
            console.error("Error saving To-Do:", error);
        }

        setTasks([{ id: uuidv4(), title: "", status: "pending" }]);
        setHeading("");
    };

    const deleteTodo = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This task will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/api/todo/${id}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.status === 200) {
                        fetchTodos();
                        Swal.fire("Deleted!", "Your task has been deleted.", "success");
                    } else if (response.status === 401) {
                        dispatch(logout());
                        Swal.fire({
                            icon: "warning",
                            title: "Session Expired",
                            text: "Your session has expired. Please log in again.",
                            confirmButtonText: "OK",
                        }).then(() => {
                            router.push("/login");
                        });
                    }
                } catch (error) {
                    console.error("Error deleting To-Do:", error);
                }
            }
        });
    };


    const editTodo = (todo) => {
        setEditId(todo._id);
        setHeading(todo.heading);

        const updatedTasks = todo.tasks.map(task => {
            return {
                id: uuidv4(),
                title: task.title || "",
                status: task.status || "pending",
            };
        });
        setTasks(updatedTasks);
    };

    const handleCheckboxChange = (taskId) => {
        setTasks(tasks.map((task) =>
            task.id === taskId
                ? { ...task, status: task.status === "completed" ? "pending" : "completed" }
                : task
        ));
    };

    const getTaskStyle = (status) => {
        return status === "completed" ? "line-through text-gray-500" : "";
    };

    const handleDeleteAll = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to delete all tasks?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete all!"
        }).then((result) => {
            if (result.isConfirmed) {
                setTasks([]);
                Swal.fire("Deleted!", "All tasks have been deleted.", "success");
            }
        });
    };

    const handleCompleteAll = () => {
        setTasks(tasks.map(task => ({ ...task, status: "completed" })));
    };

    const handleCancel = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Your unsaved changes will be lost!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, discard!"
        }).then((result) => {
            if (result.isConfirmed) {
                setHeading("");
                setTasks([{ id: uuidv4(), title: "", status: "pending" }]);
            }
        });
    };

    const handleSave = async () => {
        await saveTodo();
        Swal.fire({
            title: "Success!",
            text: "Your task has been created successfully!",
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK"
        });
    };

    return (
        <div className="w-full flex justify-center items-center min-h-screen bg-primaryColor px-4 py-8">
            <div className="flex flex-col items-center max-w-4xl w-full bg-white p-8 rounded-2xl shadow-xl gap-y-10">
                <h1 className="text-4xl md:text-5xl font-bold text-thirdColor text-center">
                    Todo - Welcome To MindTrack!
                </h1>
                <div className="w-full flex flex-col gap-y-6">
                    <div className="p-6 w-full bg-gray-100 rounded-xl shadow-md">
                        <div className="w-full flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                value={heading || ""}
                                onChange={(e) => setHeading(e.target.value)}
                                placeholder="Title here"
                                className="w-full border text-black border-gray-300 rounded-md py-3 px-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>
                        <hr className="mt-6 border-gray-300" />
                        <div className="py-4 space-y-4">
                            {tasks.map((task) => (
                                <div key={task.id} className="flex flex-wrap items-center gap-4 p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <input
                                        type="checkbox"
                                        checked={task.status === "completed"}
                                        onChange={() => handleCheckboxChange(task.id)}
                                        className="w-5 h-5 accent-primaryColor"
                                    />
                                    <input
                                        type="text"
                                        value={task.title || ""}
                                        onChange={(e) => handleTaskChange(task.id, "title", e.target.value)}
                                        placeholder="Enter task..."
                                        className="w-full text-black border-b border-gray-400 focus:outline-none py-1 px-2"
                                    />
                                    <select
                                        value={task.status}
                                        onChange={(e) => handleTaskChange(task.id, "status", e.target.value)}
                                        className="border border-gray-300 px-3 py-2 rounded-md text-black"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <button className="text-red-500 hover:text-red-700" onClick={() => removeTask(task.id)}>
                                        <Icon width={24} height={24} icon="material-symbols:delete-outline" />
                                    </button>
                                </div>
                            ))}
                            <div className="pl-2 text-blue-500 cursor-pointer w-fit hover:underline" onClick={addTask}>+ Add More</div>
                        </div>
                        <div className="w-full flex flex-wrap justify-end items-center gap-4 pt-6">
                            {(heading.trim() || tasks.some(task => task.title.trim())) && (
                                <>
                                    <button className="text-white bg-red-500 hover:bg-red-600 py-2 px-4 rounded-lg" onClick={handleDeleteAll}>Delete All</button>
                                    <button className="text-white bg-green-500 hover:bg-green-600 py-2 px-4 rounded-lg" onClick={handleCompleteAll}>Complete All</button>
                                    <button className="text-white bg-gray-500 hover:bg-gray-600 py-2 px-4 rounded-lg" onClick={handleCancel}>Cancel</button>
                                </>
                            )}
                            <button onClick={handleSave} className="px-4 py-2 bg-primaryColor hover:bg-primaryColor-dark rounded-xl text-white">
                                {editId ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                    <div className="w-full space-y-4">
                        {todos.length > 0 ? (
                            todos.map((todo) => (
                                <div
                                    key={todo._id}
                                    className="p-4 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all flex flex-wrap justify-between items-center"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900">{todo.heading}</h3>
                                    <div className="flex items-center space-x-2">
                                        <button className="p-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600" onClick={() => viewTodo(todo)}>
                                            <Icon className="text-lg" icon="lets-icons:view" />
                                        </button>
                                        <button className="p-2 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600" onClick={() => editTodo(todo)}>
                                            <Icon className="text-lg" icon="tabler:edit" />
                                        </button>
                                        <button className="p-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600" onClick={() => deleteTodo(todo._id)}>
                                            <Icon className="text-lg" icon="ic:baseline-delete" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 p-6 bg-gray-100 rounded-lg shadow-md">
                                No Data Available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoComponent;