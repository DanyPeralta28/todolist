import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editTask, setEditTask] = useState<string | null>(null);
  const [editedTaskText, setEditedTaskText] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3001/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() !== "") {
      try {
        const response = await fetch("http://localhost:3001/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newTask }),
        });
        const data = await response.json();
        setTasks([...tasks, data]);
        setNewTask("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const editTaskItem = (taskId: string) => {
    const task = tasks.find((t) => t._id === taskId);
    if (task && !task.completed) {
      setEditTask(taskId);
      setEditedTaskText(task.title);
    }
  };

  const saveEditedTask = async () => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${editTask}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editedTaskText }),
      });
      const data = await response.json();
      const updatedTasks = tasks.map((task) =>
        task._id === editTask ? data : task
      );
      setTasks(updatedTasks);
      setEditTask(null);
    } catch (error) {
      console.error("Error saving edited task:", error);
    }
  };
  

  const markAsCompleted = async (taskId: string) => {
    const task = tasks.find((t) => t._id === taskId);
    if (task && !task.completed) {
      try {
        const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ completed: true }),
        });
        const data = await response.json();
        const updatedTasks = tasks.map((t) => (t._id === taskId ? data : t));
        setTasks(updatedTasks);
      } catch (error) {
        console.error("Error marking task as completed:", error);
      }
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      router.push("/login");
    }

    fetchTasks();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    router.push('/login');
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Cerrar sesión
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-4">Lista de tareas</h1>

      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Nueva tarea"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border border-gray-400 rounded-lg p-2 w-full md:w-1/2"
        />
        <button
          onClick={addTask}
          className="bg-green-500 text-white px-4 py-2 ml-2 rounded-lg"
        >
          Agregar tarea
        </button>
      </div>

      {tasks.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2 text-left">Tareas</th>
                <th className="border p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-50`}
                >
                  <td className="border p-2 max-w-md md:max-w-xl whitespace-no-wrap overflow-x-auto">
                    {editTask === task._id ? (
                      <input
                        type="text"
                        value={editedTaskText}
                        onChange={(e) => setEditedTaskText(e.target.value)}
                        className="border border-gray-400 rounded-lg p-2 w-full"
                      />
                    ) : (
                      <span>
                        {task.completed ? `✅ ${task.title}` : task.title}
                      </span>
                    )}
                  </td>
                  <td className="border p-2 space-x-2">
                    {editTask === task._id ? (
                      <button
                        onClick={saveEditedTask}
                        className="bg-gray-500 text-white px-2 rounded-lg"
                      >
                        Guardar
                      </button>
                    ) : (
                      <>
                        {!task.completed && (
                          <button
                            onClick={() => editTaskItem(task._id)}
                            className="bg-blue-500 text-white px-2 rounded-lg"
                          >
                            Editar tarea
                          </button>
                        )}
                        <button
                          onClick={() => markAsCompleted(task._id)}
                          className={`${
                            task.completed
                              ? "bg-green-500 cursor-not-allowed"
                              : "bg-yellow-500"
                          } text-white px-2 rounded-lg`}
                          disabled={task.completed}
                        >
                          {task.completed ? "Completada" : "Completar tarea"}
                        </button>
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="bg-red-500 text-white px-2 rounded-lg"
                        >
                          Eliminar tarea
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
