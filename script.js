const searchInput = document.getElementById("searchInput");
const todoList = document.getElementById("todoList");
const todos = JSON.parse(localStorage.getItem("todos")) || [];

async function fetchAndRenderTodos() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const data = await response.json();

  todos.push(
    ...data
      .slice(0, 10)
      .map((todo) => ({ title: todo.title, completed: todo.completed }))
  );
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
}

function renderTodos() {
  const searchTerm = searchInput.value.toLowerCase();

  todoList.innerHTML = todos
    .filter((todo) => todo.title.toLowerCase().includes(searchTerm))
    .map(
      (todo, index) => `
      <li>
        <span class="${todo.completed ? "completed" : ""}">${todo.title}</span>
        <input type="checkbox" ${todo.completed ? "checked" : ""}>
        <button class="editButton Btn" data-index="${index}">Edit</button>
        <button class="deleteButton Btn Secbtn" data-index="${index}">Delete</button>
      </li>
    `
    )
    .join("");
}

searchInput.addEventListener("input", renderTodos);

if (todos.length === 0) {
  fetchAndRenderTodos();
} else {
  renderTodos();
}

todoList.addEventListener("change", (event) => {
  if (event.target.tagName === "INPUT") {
    const selectedTodo = event.target.previousElementSibling.textContent;
    const selectedTodoIndex = todos.findIndex(
      (todo) => todo.title === selectedTodo
    );
    todos[selectedTodoIndex].completed = event.target.checked;
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
  }
});

todoList.addEventListener("click", (event) => {
  const index = event.target.getAttribute("data-index");
  if (event.target.classList.contains("editButton")) {
    const newTitle = prompt("Enter the new title:");
    if (newTitle !== null) {
      todos[index].title = newTitle;
      localStorage.setItem("todos", JSON.stringify(todos));
      renderTodos();
    }
  } else if (event.target.classList.contains("deleteButton")) {
    todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
  }
});
