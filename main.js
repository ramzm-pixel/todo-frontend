const logout_button = document.getElementById("logout");
const task_title = document.getElementById("task-title");
const task_notes = document.getElementById("task-notes");
const task_due_date = document.getElementById("task-due-date");
const task_submit_button = document.getElementById("task-submit-button");
const create_task_button = document.querySelector('[data-target="task-dialog"]');
const task_dialog = document.getElementById("task-dialog");
const task_table_body = document.querySelector("table tbody");

const page_error_box = document.getElementById("page-error-box");
const page_error_message = document.getElementById("page-error-message");
const dialog_error_box = document.getElementById("dialog-error-box");
const dialog_error_message = document.getElementById("dialog-error-message");

function showPageError(message) {
    page_error_message.textContent = message;
    page_error_box.style.display = "block";
}

function clearPageError() {
    page_error_box.style.display = "none";
    page_error_message.textContent = "";
}

function showDialogError(message) {
    dialog_error_message.textContent = message;
    dialog_error_box.style.display = "block";
}

function clearDialogError() {
    dialog_error_box.style.display = "none";
    dialog_error_message.textContent = "";
}

function logout() {
    localStorage.removeItem("access_token");
    window.location.href = "index.html";
}

function renderTasks(tasks) {
    task_table_body.innerHTML = "";

    tasks.forEach((task, index) => {
        const row = document.createElement("tr");
        row.style.verticalAlign = "middle";
        row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${task.title}</td>
            <td>${task.notes ?? ""}</td>
            <td>${task.due_date}</td>
            <td style="text-align: center;">
                <input type="checkbox" ${task.is_done ? "checked" : ""} data-id="${task.id}" class="task-status-checkbox" style="margin: 0;">
            </td>
            <td style="text-align: center;">
                <button type="button" class="outline secondary task-delete-button" style="margin: 0; padding: 0.25rem 0.75rem; width: auto;" data-id="${task.id}">
                    Delete
                </button>
            </td>
        `;
        task_table_body.appendChild(row);
    });
}

async function fetch_tasks() {
    clearPageError();

    try {
        const result = await apiFetch(`${API_BASE_URL}/tasks`);
        const body = await result.json();

        if (!result.ok) {
            showPageError(body.detail ?? "Couldn't load your tasks.");
            return;
        }

        renderTasks(body);

    } catch{
        showPageError("Couldn't reach the server. Check your connection and try again.");
    }
}

async function post_task() {
    task_title.ariaInvalid = null;
    task_due_date.ariaInvalid = null;
    clearDialogError();

    const title = task_title.value;
    const notes = task_notes.value;
    const due_date = task_due_date.value;

    if (title == "") {
        task_title.ariaInvalid = "true";
        task_title.focus();
        showDialogError("Please enter a task title.");
        return;
    }
    if (due_date == "") {
        task_due_date.ariaInvalid = "true";
        task_due_date.focus();
        showDialogError("Please choose a due date.");
        return;
    }

    const options = {
        method: "POST",
        body: JSON.stringify({
            title: title,
            notes: notes,
            due_date: due_date
        })
    };

    try {
        const result = await apiFetch(`${API_BASE_URL}/tasks`, options);
        const body = await result.json();

        if (!result.ok) {
            showDialogError(body.detail ?? "Couldn't create the task. Please check your input.");
            return;
        }

        task_title.value = "";
        task_notes.value = "";
        task_due_date.value = "";
        clearDialogError();
        closeModal(task_dialog);
        fetch_tasks();

    } catch{
        showDialogError("Couldn't reach the server. Check your connection and try again.");
    }
}

async function delete_task(id) {
    clearPageError();

    const options = {
        method: "DELETE",
    };

    try {
        const result = await apiFetch(`${API_BASE_URL}/tasks/${id}`, options);

        if (!result.ok) {
            const body = await result.json();
            showPageError(body.detail ?? "Couldn't delete the task.");
            return;
        }

        fetch_tasks();

    } catch{
        showPageError("Couldn't reach the server. Check your connection and try again.");
    }
}

async function update_task_status(id, status) {
    clearPageError();

    const options = {
        method: "PATCH",
    };

    try {
        const result = await apiFetch(`${API_BASE_URL}/tasks/${id}?new_status=${status}`, options);

        if (!result.ok) {
            const body = await result.json();
            showPageError(body.detail ?? "Couldn't update the task status.");
            return;
        }

    } catch{
        showPageError("Couldn't reach the server. Check your connection and try again.");
    }
}

logout_button.addEventListener("click", async () => {
    logout();
});

task_submit_button.addEventListener("click", async (event) => {
    event.preventDefault();
    post_task();
});

create_task_button.addEventListener("click", () => {
    clearDialogError();
});

task_table_body.addEventListener("click", (event) => {
    const button = event.target.closest(".task-delete-button");
    if (!button) return;

    const task_id = button.dataset.id;
    delete_task(task_id);
});

task_table_body.addEventListener("change", (event) => {
    const checkbox = event.target.closest(".task-status-checkbox");
    if (!checkbox) return;

    const task_id = checkbox.dataset.id;
    const new_status = checkbox.checked;
    update_task_status(task_id, new_status)
});

fetch_tasks();