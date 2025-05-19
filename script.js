document.addEventListener("DOMContentLoaded", () => {
  const inputBox = document.getElementById("inputBx");
  const list = document.getElementById("list");

  // Clé unique par page (en fonction du chemin de l'URL)
  const storageKey = "tasks-" + window.location.pathname;

  loadTasks();

  inputBox.addEventListener("keyup", function (event) {
    if (event.key === "Enter" && inputBox.value.trim() !== "") {
      addTask(inputBox.value.trim());
      inputBox.value = "";
    }
  });

  function addTask(taskText, isDone = false, noteText = "") {
    const li = document.createElement("li");

    const textSpan = document.createElement("span");
    textSpan.textContent = taskText;
    li.appendChild(textSpan);

    if (isDone) li.classList.add("done");

    const removeBtn = document.createElement("i");
    removeBtn.classList.add("remove-btn");
    li.appendChild(removeBtn);

    const editBtn = document.createElement("button");
    editBtn.textContent = "📝";
    editBtn.classList.add("edit-btn");
    li.appendChild(editBtn);

    const noteArea = document.createElement("textarea");
    noteArea.placeholder = "Note de quête...";
    noteArea.classList.add("note");
    noteArea.value = noteText;
    noteArea.style.display = "none";
    li.appendChild(noteArea);

    li.addEventListener("click", (e) => {
      if (e.target !== removeBtn && e.target !== editBtn && e.target !== noteArea) {
        li.classList.toggle("done");
        saveTasks();
      }
    });

    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      li.remove();
      saveTasks();
    });

    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (noteArea.style.display === "none") {
        noteArea.style.display = "block";
        textSpan.style.display = "none";
      } else {
        noteArea.style.display = "none";
        textSpan.style.display = "inline";
      }
    });

    noteArea.addEventListener("input", () => {
      saveTasks();
    });

    list.appendChild(li);
    saveTasks();
  }

  function saveTasks() {
    const tasks = [];
    list.querySelectorAll("li").forEach(li => {
      tasks.push({
        text: li.querySelector("span").textContent,
        done: li.classList.contains("done"),
        note: li.querySelector("textarea")?.value || ""
      });
    });
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }

  function loadTasks() {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      JSON.parse(saved).forEach(task => {
        addTask(task.text, task.done, task.note);
      });
    }
  }
});
