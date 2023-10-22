import { useState, useEffect } from "react";

const API_BASE = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    GetTodos();
  }, []);

  const GetTodos = async () => {
    try {
      const response = await fetch(`${API_BASE}/todos`);
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error("Error: ", err);
    }
  }

  const completeTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/todo/complete/${id}`);
      if (!response.ok) {
        throw new Error("Failed to complete todo");
      }
      const data = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === data._id ? { ...todo, complete: data.complete } : todo
        )
      );
    } catch (err) {
      console.error("Error: ", err);
    }
  }

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/todo/delete/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      const data = await response.json();
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== data._id));
    } catch (err) {
      console.error("Error: ", err);
    }
  }

  const addTodo = async () => {
    try {
      const response = await fetch(`${API_BASE}/todo/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newTodo,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add todo");
      }
      const data = await response.json();
      setTodos((prevTodos) => [...prevTodos, data]);
      setPopupActive(false);
      setNewTodo("");
    } catch (err) {
      console.error("Error: ", err);
    }
  }

  return (
    <div className="App">
      <h1>Welcome, Om</h1>
      <h4>Your Tasks</h4>

      <div className="todos">
        {todos.map((todo) => (
          <div
            className={"todo " + (todo.complete ? "is-complete" : "")}
            key={todo._id}
            onClick={() => completeTodo(todo._id)}
          >
            <div className="checkbox"></div>
            <div className="text">{todo.text}</div>
            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
              x
            </div>
          </div>
        ))}
      </div>
      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>
      {popupActive && (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            x
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


