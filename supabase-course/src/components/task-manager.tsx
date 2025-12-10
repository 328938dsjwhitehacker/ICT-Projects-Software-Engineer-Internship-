import { useEffect, useState, ChangeEvent } from "react";
import { supabase } from "../supabase-client";
import { Session } from "@supabase/supabase-js";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  image_url?: string;
  user_id: string;
  email?: string;
}

function TaskManager({ session }: { session: Session }) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editDescriptions, setEditDescriptions] = useState<Record<number, string>>({});
  const [taskImage, setTaskImage] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: "error" | "info"; text: string } | null>(null);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Fetch tasks for the logged-in user
  const fetchTasks = async () => {
    setLoadingTasks(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: true });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setTasks(data || []);
    }
    setLoadingTasks(false);
  };

  // Upload image to Supabase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `${session.user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("tasks-images").upload(filePath, file);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return null;
    }
    const { data } = supabase.storage.from("tasks-images").getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Add new task
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    let imageUrl: string | null = null;
    if (taskImage) {
      imageUrl = await uploadImage(taskImage);
      if (!imageUrl) return; // stop if upload failed
    }

    const { error } = await supabase.from("tasks").insert({
      ...newTask,
      user_id: session.user.id,
      email: session.user.email,
      image_url: imageUrl,
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setNewTask({ title: "", description: "", status: "pending" });
      setTaskImage(null);
      setMessage({ type: "info", text: "Task added successfully!" });
    }
  };

  // Update task description
  const updateTask = async (id: number) => {
    const newDesc = editDescriptions[id];
    if (!newDesc) return;

    const { error } = await supabase
      .from("tasks")
      .update({ description: newDesc })
      .eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setEditDescriptions((prev) => ({ ...prev, [id]: "" }));
      setMessage({ type: "info", text: "Task updated successfully!" });
    }
  };

  // Delete task
  const deleteTask = async (id: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "info", text: "Task deleted successfully!" });
    }
  };

  // Handle file input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTaskImage(e.target.files[0]);
    }
  };

  // Realtime subscription
  useEffect(() => {
    fetchTasks();

    const channel = supabase
      .channel("tasks-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${session.user.id}`, // only listen to this user's tasks
        },
        (payload) => {
          console.log("Realtime change:", payload);
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>Task Manager CRUD</h2>
      {message && (
        <p style={{ color: message.type === "error" ? "red" : "green" }}>{message.text}</p>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask((prev) => ({ ...prev, status: e.target.value }))}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        >
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Add Task
        </button>
      </form>

      {loadingTasks ? (
        <p>Loading tasks...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: <strong>{task.status}</strong></p>
              {task.image_url && (
                <img src={task.image_url} alt="Task" style={{ height: 70 }} />
              )}
              <div>
                <textarea
                  placeholder="Updated description..."
                  value={editDescriptions[task.id] || ""}
                  onChange={(e) =>
                    setEditDescriptions((prev) => ({ ...prev, [task.id]: e.target.value }))
                  }
                />
                <button
                  style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}
                  onClick={() => updateTask(task.id)}
                >
                  Edit
                </button>
                <button
                  style={{ padding: "0.5rem 1rem" }}
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskManager;
